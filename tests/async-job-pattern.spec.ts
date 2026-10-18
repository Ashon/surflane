import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
const details = (page: Page) =>
  page.getByRole('region', { name: 'Run details', exact: true })
const status = (page: Page) =>
  page.getByRole('status', { name: 'Run status', exact: true })
const deliver = (page: Page) =>
  page.getByRole('button', {
    name: 'Deliver next preview update',
    exact: true,
  })
async function open(page: Page) {
  await page.goto('/patterns/async-job')
  await waitForCatalogReady(page)
}
async function scenario(page: Page, value: string) {
  await page.getByRole('combobox', { name: 'Next run result' }).click()
  await page.getByRole('option', { name: value, exact: true }).click()
}
async function updates(page: Page, count: number) {
  for (let i = 0; i < count; i++) await deliver(page).click()
}

test('successful run snapshots inputs, guards duplicate starts, exposes progress and safe evidence', async ({
  page,
}) => {
  await open(page)
  await page
    .getByRole('textbox', { name: 'Next run environment' })
    .fill('My sample environment')
  await page
    .getByRole('button', { name: 'Start preview run', exact: true })
    .evaluate((button: HTMLButtonElement) => {
      button.click()
      button.click()
    })
  await expect(details(page)).toContainText(
    'preview-run-1 / My sample environment',
  )
  await expect(status(page)).toHaveText('Queued')
  await expect(
    page.getByRole('button', { name: 'Request cancellation' }),
  ).toBeFocused()
  await expect(
    page.getByRole('textbox', { name: 'Next run environment' }),
  ).toBeDisabled()
  await updates(page, 1)
  await expect(status(page)).toHaveText('Running')
  await expect(page.getByRole('progressbar')).toHaveAttribute(
    'aria-valuenow',
    '0',
  )
  await updates(page, 1)
  await expect(page.getByRole('progressbar')).toHaveAttribute(
    'aria-valuetext',
    '1 of 3 checks finished',
  )
  await page
    .getByRole('button', { name: 'Inspect Resolve build', exact: true })
    .click()
  await expect(details(page)).toContainText(
    '"environment": "My sample environment"',
  )
  await expect(details(page)).toContainText('"localPreview": true')
  await updates(page, 2)
  await expect(status(page)).toHaveText('Completed')
  await expect(
    page.getByRole('heading', { name: 'Run summary', exact: true }),
  ).toBeFocused()
  await expect(page.getByRole('progressbar')).toHaveAttribute(
    'aria-valuenow',
    '3',
  )
  await expect(
    page.getByRole('button', { name: 'Retry unfinished steps' }),
  ).toHaveCount(0)
})

test('partial failure retries only unfinished checks with a new identity and preserved evidence provenance', async ({
  page,
}) => {
  await open(page)
  await scenario(page, 'Partial failure')
  await page.getByRole('button', { name: 'Start preview run' }).click()
  await updates(page, 4)
  await expect(status(page)).toHaveText('Partially completed')
  await expect(
    page.getByRole('list', { name: 'Run steps' }).getByRole('listitem').nth(1),
  ).toContainText('failed')
  await page.getByRole('button', { name: 'Inspect Check health' }).click()
  await expect(details(page)).toContainText('Sample service unhealthy')
  await scenario(page, 'Success')
  await page
    .getByRole('textbox', { name: 'Next run environment' })
    .fill('Different next environment')
  await page.getByRole('button', { name: 'Retry unfinished steps' }).click()
  await expect(details(page)).toContainText(
    'preview-run-2 / Sample environment',
  )
  await expect(details(page)).toContainText('2 successful checks reused')
  await expect(page.getByRole('progressbar')).toHaveAttribute(
    'aria-valuenow',
    '2',
  )
  await updates(page, 2)
  await expect(status(page)).toHaveText('Completed')
  const rows = page
    .getByRole('list', { name: 'Run steps' })
    .getByRole('listitem')
  await expect(rows.nth(0)).toContainText('Logs from preview-run-1')
  await expect(rows.nth(1)).toContainText('Logs from preview-run-2')
  await expect(rows.nth(2)).toContainText('Logs from preview-run-1')
})

test('blocking failure skips dependent work and retry resumes with a new run', async ({
  page,
}) => {
  await open(page)
  await scenario(page, 'Blocking failure')
  await page.getByRole('button', { name: 'Start preview run' }).click()
  await updates(page, 3)
  await expect(status(page)).toHaveText('Failed')
  await expect(
    page.getByRole('list', { name: 'Run steps' }).getByRole('listitem').nth(2),
  ).toContainText('skipped')
  await expect(
    page.getByRole('button', { name: 'Inspect Collect logs' }),
  ).toBeDisabled()
  await expect(page.getByRole('progressbar')).toHaveAttribute(
    'aria-valuenow',
    '2',
  )
  await scenario(page, 'Success')
  await page.getByRole('button', { name: 'Retry unfinished steps' }).click()
  await expect(details(page)).toContainText('1 successful check reused')
  await updates(page, 3)
  await expect(status(page)).toHaveText('Completed')
})

test('cancellation invalidates already queued updates and requires acknowledgement before retry', async ({
  page,
}) => {
  await open(page)
  await page.getByRole('button', { name: 'Start preview run' }).click()
  await updates(page, 2)
  await page.locator('.async-job-example').evaluate((root) => {
    const buttons = Array.from(root.querySelectorAll('button'))
    buttons
      .find(
        (button) =>
          button.textContent?.trim() === 'Deliver next preview update',
      )!
      .click()
    buttons
      .find((button) => button.textContent?.trim() === 'Request cancellation')!
      .click()
  })
  await expect(status(page)).toHaveText('Cancellation requested')
  await expect(
    page.getByRole('button', { name: 'Start preview run' }),
  ).toBeDisabled()
  await expect(
    page.getByRole('button', { name: 'Acknowledge cancellation' }),
  ).toBeFocused()
  await expect(page.getByRole('progressbar')).toHaveAttribute(
    'aria-valuenow',
    '1',
  )
  await page.getByRole('button', { name: 'Acknowledge cancellation' }).click()
  await expect(status(page)).toHaveText('Canceled')
  await expect(details(page)).toContainText('nothing is rolled back')
  await expect(
    page.getByRole('heading', { name: 'Run summary', exact: true }),
  ).toBeFocused()
  await page.getByRole('button', { name: 'Retry unfinished steps' }).click()
  await expect(details(page)).toContainText('preview-run-2')
  await updates(page, 3)
  await expect(status(page)).toHaveText('Completed')
})

test('320px layout and status semantics remain usable in both themes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await open(page)
  for (const dark of [false, true]) {
    if (dark)
      await page.getByRole('button', { name: 'Toggle theme: Light' }).click()
    await scenario(page, 'Partial failure')
    await page.getByRole('button', { name: 'Start preview run' }).click()
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    await updates(page, 4)
    await page.getByRole('button', { name: 'Inspect Check health' }).click()
    await expect
      .poll(() =>
        page
          .locator('.catalog-document-scroll')
          .evaluate((e) => e.scrollWidth <= e.clientWidth),
      )
      .toBe(true)
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  }
})

test('duplicate deliveries advance once and evidence copying is an explicit action', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          ;(window as any).__jobCopied = text
        },
      },
    })
  })
  await open(page)
  await page
    .getByRole('textbox', { name: 'Next run environment' })
    .fill('LongTarget'.repeat(30))
  await page.getByRole('button', { name: 'Start preview run' }).click()
  await deliver(page).evaluate((button: HTMLButtonElement) => {
    button.click()
    button.click()
  })
  await expect(status(page)).toHaveText('Running')
  await expect(page.getByRole('progressbar')).toHaveAttribute(
    'aria-valuenow',
    '0',
  )
  await updates(page, 1)
  await page
    .getByRole('button', { name: 'Inspect Resolve build', exact: true })
    .click()
  expect(await page.evaluate(() => (window as any).__jobCopied)).toBeUndefined()
  await details(page)
    .getByRole('button', { name: 'Copy code', exact: true })
    .click()
  await expect
    .poll(() => page.evaluate(() => (window as any).__jobCopied))
    .toContain('"run": "preview-run-1"')
  await page.setViewportSize({ width: 320, height: 740 })
  await expect
    .poll(() =>
      page
        .locator('.catalog-document-scroll')
        .evaluate((e) => e.scrollWidth <= e.clientWidth),
    )
    .toBe(true)
})
