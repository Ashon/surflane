import { waitForCatalogReady } from './catalog-ready'
import { test, expect, type Page } from '@playwright/test'
test.use({ reducedMotion: 'reduce' })

const open = async (page: Page, width = 1440) => {
  await page.setViewportSize({ width, height: 1000 })
  await page.goto('/components/timeline')
  await waitForCatalogReady(page)
  return page.getByRole('list', { name: 'Deploy history', exact: true })
}

test('a timeline is a named ordered list of events, each with its time, its state in words and its tone', async ({
  page,
}) => {
  const list = await open(page)
  await expect(list).toHaveJSProperty('tagName', 'OL')
  const items = list.locator(':scope > li')
  await expect(items).toHaveCount(4)
  await expect(list.locator('time[datetime]')).toHaveCount(4)
  await expect(
    list.locator('.surf-timeline-mark[aria-hidden="true"]'),
  ).toHaveCount(4)
  await expect(list.locator('.surf-timeline-status')).toHaveText([
    'Running',
    'Succeeded',
    'Failed',
    'Created',
  ])
  // The state's ink is its tone's, on the mark and the status alike.
  const inks = await items.evaluateAll((elements) =>
    elements.map((item) => {
      const probe = document.createElement('span')
      item.append(probe)
      probe.style.color = `var(--surf-status-${item.getAttribute('data-tone')}-fg)`
      const tone = getComputedStyle(probe).color
      probe.remove()
      const status = getComputedStyle(
        item.querySelector('.surf-timeline-status')!,
      )
      const mark = getComputedStyle(item.querySelector('.surf-timeline-mark')!)
      return status.color === tone && mark.color === tone
    }),
  )
  expect(inks).toEqual([true, true, true, true])
  // The current step: announced, and on the recessed plane; the others on none.
  await expect(items.first()).toHaveAttribute('aria-current', 'step')
  await expect(list.locator('[aria-current]')).toHaveCount(1)
  const planes = await items.evaluateAll((elements) =>
    elements.map((item) => {
      const probe = document.createElement('span')
      probe.style.background = 'var(--surf-recessed)'
      item.parentElement!.append(probe)
      const recessed = getComputedStyle(probe).backgroundColor
      probe.remove()
      const fill = getComputedStyle(item).backgroundColor
      return fill === recessed
        ? 'recessed'
        : fill === 'rgba(0, 0, 0, 0)'
          ? 'none'
          : fill
    }),
  )
  expect(planes).toEqual(['recessed', 'none', 'none', 'none'])
  // The time ends the title's line; the mark sits on it too.
  const lines = await items.evaluateAll((elements) =>
    elements.map((item) => {
      const middle = (selector: string) => {
        const box = item.querySelector(selector)!.getBoundingClientRect()
        return box.top + box.height / 2
      }
      const title = item
        .querySelector('.surf-timeline-title')!
        .getBoundingClientRect()
      const time = item
        .querySelector('.surf-timeline-time')!
        .getBoundingClientRect()
      return (
        Math.abs(
          middle('.surf-timeline-time') - middle('.surf-timeline-title'),
        ) < 2 &&
        Math.abs(
          middle('.surf-timeline-mark') - middle('.surf-timeline-title'),
        ) < 2 &&
        time.left > title.left
      )
    }),
  )
  expect(lines).toEqual([true, true, true, true])
  // Every title starts at the same place, whatever its mark.
  const starts = await list
    .locator('.surf-timeline-title')
    .evaluateAll((titles) =>
      titles.map((title) => Math.round(title.getBoundingClientRect().left)),
    )
  expect(new Set(starts).size).toBe(1)
})

test('a detail opens on the recessed plane with its label in line with the title', async ({
  page,
}) => {
  const list = await open(page)
  const item = list.locator(':scope > li').nth(1)
  const trigger = item.getByRole('button', { name: '3 changes', exact: true })
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect(item.getByText('Health checks moved to /healthz')).toBeVisible()
  const aligned = await item.evaluate((element) => {
    const title = element
      .querySelector('.surf-timeline-title')!
      .getBoundingClientRect()
    const label = element
      .querySelector('.surf-disclosure-label')!
      .getBoundingClientRect()
    const detail = element.querySelector('.surf-timeline-detail')!
    const probe = document.createElement('span')
    probe.style.background = 'var(--surf-recessed)'
    element.append(probe)
    const recessed = getComputedStyle(probe).backgroundColor
    probe.remove()
    return {
      label: Math.round(label.left - title.left),
      plane: getComputedStyle(detail).backgroundColor === recessed,
    }
  })
  expect(aligned).toEqual({ label: 0, plane: true })
  await page.keyboard.press('Space')
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
})

test('right to left the time is on the left; a phone keeps it all inside; compact is 4px; forced colours mark the current step', async ({
  page,
}) => {
  let list = await open(page)
  await list.evaluate((element) => element.setAttribute('dir', 'rtl'))
  const sides = await list
    .locator(':scope > li')
    .first()
    .evaluate((item) => {
      const box = (selector: string) =>
        item.querySelector(selector)!.getBoundingClientRect()
      return (
        box('.surf-timeline-time').right < box('.surf-timeline-title').left &&
        box('.surf-timeline-mark').left > box('.surf-timeline-title').right
      )
    })
  expect(sides).toBe(true)
  list = await open(page, 320)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
  list = await open(page)
  await page
    .getByRole('button', { name: 'Preview density: Compact', exact: true })
    .click()
  await expect
    .poll(() =>
      list
        .locator(':scope > li')
        .first()
        .evaluate((item) => getComputedStyle(item).paddingTop),
    )
    .toBe('4px')
  await page.emulateMedia({ forcedColors: 'active' })
  expect(
    await list
      .locator(':scope > li')
      .first()
      .evaluate((item) => {
        const style = getComputedStyle(item)
        return [style.outlineStyle, style.outlineWidth]
      }),
  ).toEqual(['solid', '1px'])
})
