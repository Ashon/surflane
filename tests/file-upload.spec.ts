import { waitForCatalogReady } from './catalog-ready'
import { test, expect, type Page, type Locator } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
test.use({ reducedMotion: 'reduce' })
const primary = (page: Page) => page.locator('.surf-file-upload').first()
const picker = (page: Page) =>
  page.getByLabel('Build artifacts', { exact: true })
const file = (
  name = 'evidence.json',
  body = '{"case":"region"}',
  mimeType = 'application/json',
) => ({ name, mimeType, buffer: Buffer.from(body) })
async function names(page: Page, field = 'artifacts') {
  return page.locator('#file-upload-preview-form').evaluate(
    (form, field) =>
      new FormData(form as HTMLFormElement)
        .getAll(field)
        .filter((v): v is File => v instanceof File && !!v.name)
        .map((v) => v.name),
    field,
  )
}
async function drop(
  page: Page,
  files: { name: string; type?: string; size?: number; content?: string }[],
  target?: Locator,
) {
  const transfer = await page.evaluateHandle((files) => {
    const data = new DataTransfer()
    for (const file of files)
      data.items.add(
        new File([file.content ?? new Uint8Array(file.size ?? 2)], file.name, {
          type: file.type ?? 'application/json',
          lastModified: 100,
        }),
      )
    return data
  }, files)
  await (target ?? primary(page).locator('.surf-file-dropzone')).dispatchEvent(
    'drop',
    { dataTransfer: transfer },
  )
  await transfer.dispose()
}
test('Native keyboard picker remains visible through its focus ring and submits real File data', async ({
  page,
}) => {
  await page.goto('/components/file-upload')
  await waitForCatalogReady(page)
  await picker(page).focus()
  await expect(primary(page).locator('.surf-file-trigger')).toHaveCSS(
    'outline-width',
    '2px',
  )
  const pending = page.waitForEvent('filechooser')
  await picker(page).press('Space')
  const chooser = await pending
  await chooser.setFiles(file())
  await expect(
    primary(page).getByText('evidence.json', { exact: true }),
  ).toBeVisible()
  await expect.poll(() => names(page)).toEqual(['evidence.json'])
  expect(
    await page
      .locator('#file-upload-preview-form')
      .evaluate(async (form) =>
        (new FormData(form as HTMLFormElement).get('artifacts') as File).text(),
      ),
  ).toBe('{"case":"region"}')
  await page
    .getByRole('button', { name: 'Inspect submitted files', exact: true })
    .click()
  await expect(page.locator('.file-demo-result')).toContainText('evidence.json')
})
test('Selection validates type, byte limit and count without retaining rejected files in FormData', async ({
  page,
}) => {
  await page.goto('/components/file-upload')
  await waitForCatalogReady(page)
  await picker(page).setInputFiles([
    file('bad.exe', 'x', 'application/octet-stream'),
    file('large.txt', 'x'.repeat(1025), 'text/plain'),
    file('valid.TXT', 'ok', 'application/octet-stream'),
  ])
  await expect.poll(() => names(page)).toEqual(['valid.TXT'])
  await expect(primary(page).getByRole('alert')).toContainText(
    'file type is not accepted',
  )
  await expect(primary(page).getByRole('alert')).toContainText(
    'file is too large',
  )
  await drop(page, [
    { name: 'two.json' },
    { name: 'three.json' },
    { name: 'four.json' },
  ])
  await expect
    .poll(() => names(page))
    .toEqual(['valid.TXT', 'two.json', 'three.json'])
  await expect(primary(page).getByRole('alert')).toContainText(
    'file limit reached',
  )
})
test('Drop uses the same validation and suppresses duplicates by metadata', async ({
  page,
}) => {
  await page.goto('/components/file-upload')
  await waitForCatalogReady(page)
  await drop(page, [{ name: 'drop.json', content: '{}' }])
  await expect.poll(() => names(page)).toEqual(['drop.json'])
  await drop(page, [
    { name: 'drop.json', content: '{}' },
    { name: 'blocked.exe', type: 'application/octet-stream' },
  ])
  await expect.poll(() => names(page)).toEqual(['drop.json'])
  await expect(primary(page).getByRole('alert')).toContainText(
    'file is already selected',
  )
  await expect(primary(page).getByRole('alert')).toContainText(
    'file type is not accepted',
  )
})
test('Controlled external selection and cancellation preserve the accepted native payload', async ({
  page,
}) => {
  await page.goto('/components/file-upload')
  await waitForCatalogReady(page)
  const attachment = page.getByLabel('Controlled attachment', { exact: true })
  await attachment.setInputFiles(file('data.csv', 'a,b', 'text/csv'))
  await expect.poll(() => names(page, 'attachment')).toEqual(['data.csv'])
  await attachment.setInputFiles(file('bad.txt', 'x', 'text/plain'))
  await expect.poll(() => names(page, 'attachment')).toEqual(['data.csv'])
  await page.getByRole('checkbox', { name: 'Cancel selection changes' }).check()
  await attachment.setInputFiles(file('other.csv', 'c,d', 'text/csv'))
  await expect.poll(() => names(page, 'attachment')).toEqual(['data.csv'])
  await picker(page).setInputFiles(file())
  await expect.poll(() => names(page)).toEqual([])
  await page
    .getByRole('button', { name: 'Remove data.csv', exact: true })
    .click()
  await expect.poll(() => names(page, 'attachment')).toEqual(['data.csv'])
})
test('Shared Form validates required files, links server errors and clears errors on drop', async ({
  page,
}) => {
  await page.goto('/components/file-upload')
  await waitForCatalogReady(page)
  await page
    .getByRole('button', { name: 'Inspect submitted files', exact: true })
    .click()
  await expect(picker(page)).toBeFocused()
  await expect(picker(page)).toHaveAttribute('aria-invalid', 'true')
  await expect(primary(page).locator('.surf-field-error')).toBeVisible()
  await drop(page, [{ name: 'valid.json' }])
  await page
    .getByRole('button', { name: 'Show field error', exact: true })
    .click()
  const error = primary(page).locator('.surf-field-error')
  await expect(error).toContainText('These files were rejected')
  await expect(picker(page)).toHaveAttribute(
    'aria-describedby',
    new RegExp((await error.getAttribute('id'))!),
  )
  await drop(page, [{ name: 'new.json' }])
  await expect(error).toHaveCount(0)
})
test('Upload/Cancel/Retry keep a stable focused action, and completion focuses Remove', async ({
  page,
}) => {
  await page.goto('/components/file-upload')
  await waitForCatalogReady(page)
  await picker(page).setInputFiles(file())
  await page
    .getByRole('button', { name: 'Upload evidence.json', exact: true })
    .click()
  await expect(
    page.getByRole('button', { name: 'Cancel evidence.json', exact: true }),
  ).toBeFocused()
  await expect(
    page.getByRole('progressbar', { name: 'evidence.json upload progress' }),
  ).toBeVisible()
  await expect(
    primary(page).getByText('Uploaded', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Remove evidence.json', exact: true }),
  ).toBeFocused()
})
test('Finishing a transfer does not steal focus from another control', async ({
  page,
}) => {
  await page.goto('/components/file-upload')
  await waitForCatalogReady(page)
  await picker(page).setInputFiles(file())
  await page
    .getByRole('button', { name: 'Upload evidence.json', exact: true })
    .click()
  const outside = page.getByRole('checkbox', { name: 'Fail upload preview' })
  await outside.focus()
  await expect(
    primary(page).getByText('Uploaded', { exact: true }),
  ).toBeVisible()
  await expect(outside).toBeFocused()
})
test('Late progress and completion after cancellation cannot replace a newer failed/retried request', async ({
  page,
}) => {
  await page.goto('/components/file-upload')
  await waitForCatalogReady(page)
  await page.getByRole('checkbox', { name: 'Late result after cancel' }).check()
  await picker(page).setInputFiles(file())
  await page
    .getByRole('button', { name: 'Upload evidence.json', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Cancel evidence.json', exact: true })
    .click()
  await expect(
    primary(page).getByText('Canceled', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Retry evidence.json', exact: true }),
  ).toBeFocused()
  await page.getByRole('checkbox', { name: 'Fail upload preview' }).check()
  await page
    .getByRole('button', { name: 'Retry evidence.json', exact: true })
    .click()
  await expect(primary(page).getByText('Failed', { exact: true })).toBeVisible()
  await expect(primary(page)).toContainText('Upload failed. Try again.')
  await expect(
    page.getByRole('button', { name: 'Retry evidence.json', exact: true }),
  ).toHaveAccessibleDescription('Upload failed. Try again.')
  await page.getByRole('checkbox', { name: 'Fail upload preview' }).uncheck()
  await page
    .getByRole('button', { name: 'Retry evidence.json', exact: true })
    .click()
  await expect(
    primary(page).getByText('Uploaded', { exact: true }),
  ).toBeVisible()
})
test('Removing an in-flight file clears native data, ignores late results and restores picker focus', async ({
  page,
}) => {
  await page.goto('/components/file-upload')
  await waitForCatalogReady(page)
  await page.getByRole('checkbox', { name: 'Late result after cancel' }).check()
  await picker(page).setInputFiles(file())
  await page
    .getByRole('button', { name: 'Upload evidence.json', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Remove evidence.json', exact: true })
    .click()
  await expect(picker(page)).toBeFocused()
  await expect.poll(() => names(page)).toEqual([])
  await page.waitForTimeout(1200)
  await expect(primary(page).locator('.surf-file-item')).toHaveCount(0)
})
test('Native reset honors cancellation, aborts transfers and retains controlled external files', async ({
  page,
}) => {
  await page.goto('/components/file-upload')
  await waitForCatalogReady(page)
  await picker(page).setInputFiles(file())
  await page
    .getByLabel('Controlled attachment', { exact: true })
    .setInputFiles(file('data.csv', 'a,b', 'text/csv'))
  await page.getByRole('checkbox', { name: 'Cancel reset' }).check()
  await page
    .getByRole('button', { name: 'Reset file form', exact: true })
    .click()
  await expect.poll(() => names(page)).toEqual(['evidence.json'])
  await page.getByRole('checkbox', { name: 'Cancel reset' }).uncheck()
  await page
    .getByRole('button', { name: 'Upload evidence.json', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Reset file form', exact: true })
    .click()
  await expect.poll(() => names(page)).toEqual([])
  await expect.poll(() => names(page, 'attachment')).toEqual(['data.csv'])
  await expect(primary(page).locator('.surf-file-item')).toHaveCount(0)
})
test('Disabled widget cancels pending work, excludes its payload and rejects drops', async ({
  page,
}) => {
  await page.goto('/components/file-upload')
  await waitForCatalogReady(page)
  await picker(page).setInputFiles(file())
  await page
    .getByRole('button', { name: 'Upload evidence.json', exact: true })
    .click()
  await page.getByRole('checkbox', { name: 'Disable file controls' }).check()
  await expect(picker(page)).toBeDisabled()
  await expect(
    primary(page).getByText('Canceled', { exact: true }),
  ).toBeVisible()
  await expect.poll(() => names(page)).toEqual([])
  await drop(page, [{ name: 'ignored.json' }])
  await expect(primary(page)).not.toContainText('ignored.json')
  await expect(
    page.getByRole('button', { name: 'Remove evidence.json', exact: true }),
  ).toBeDisabled()
  await page.getByRole('checkbox', { name: 'Disable file controls' }).uncheck()
  await expect.poll(() => names(page)).toEqual(['evidence.json'])
})
test('Nested drag highlights persist until the outer boundary leaves', async ({
  page,
}) => {
  await page.goto('/components/file-upload')
  await waitForCatalogReady(page)
  const data = await page.evaluateHandle(() => {
    const data = new DataTransfer()
    data.items.add(new File(['{}'], 'drag.json', { type: 'application/json' }))
    return data
  })
  const zone = primary(page).locator('.surf-file-dropzone'),
    label = primary(page).locator('.surf-file-trigger')
  await zone.dispatchEvent('dragenter', { dataTransfer: data })
  await label.dispatchEvent('dragenter', { dataTransfer: data })
  await label.dispatchEvent('dragleave', { dataTransfer: data })
  await expect(primary(page)).toHaveAttribute('data-dragging', 'true')
  await zone.dispatchEvent('dragleave', { dataTransfer: data })
  await expect(primary(page)).not.toHaveAttribute('data-dragging')
  await data.dispose()
})
for (const theme of ['light', 'dark'])
  test(`File selection, errors and long names stay accessible and fit in ${theme}`, async ({
    page,
  }) => {
    await page.goto('/components/file-upload')
    await waitForCatalogReady(page)
    await page.evaluate(
      (theme) => (document.documentElement.dataset.theme = theme),
      theme,
    )
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    await picker(page).setInputFiles([
      file(`${'region-접근-'.repeat(15)}.json`),
      file('bad.exe', 'x', 'application/octet-stream'),
    ])
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    await page.setViewportSize({ width: 320, height: 800 })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    await expect(primary(page).locator('.surf-file-trigger')).toHaveCSS(
      'min-height',
      '44px',
    )
  })
