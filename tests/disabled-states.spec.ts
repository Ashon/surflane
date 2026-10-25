import { test, expect, type Locator, type Page } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'

// A disabled control fades to --surf-control-disabled-opacity; its label stays at
// full strength so the reader can still learn what it is. Hover adds nothing and
// no input changes it. Each host uses the real disabled prop.
test.use({ reducedMotion: 'reduce' })

type Host = {
  route: string
  control: (page: Page) => Locator
  label?: (page: Page) => Locator
  setup?: (page: Page) => Promise<void>
  value: (control: Locator) => Promise<string | null>
}
const checked = (control: Locator) => control.getAttribute('aria-checked')
const text = (control: Locator) => control.inputValue()
const hosts: Host[] = [
  {
    route: '/components/checkbox',
    control: (p) => p.getByRole('checkbox', { name: 'Unavailable option' }),
    label: (p) => p.getByText('Unavailable option', { exact: true }),
    value: checked,
  },
  {
    route: '/components/switch',
    control: (p) => p.getByRole('switch', { name: 'Unavailable setting' }),
    label: (p) => p.getByText('Unavailable setting', { exact: true }),
    value: checked,
  },
  {
    route: '/components/radio-group',
    control: (p) => p.getByRole('radio', { name: 'Unavailable source' }),
    label: (p) => p.getByText('Unavailable source', { exact: true }),
    value: checked,
  },
  {
    route: '/components/textarea',
    control: (p) => p.getByRole('textbox', { name: 'Disabled notes' }),
    label: (p) => p.getByText('Disabled notes', { exact: true }),
    value: text,
  },
  {
    route: '/components/input',
    control: (p) => p.getByRole('textbox', { name: 'Disabled', exact: true }),
    value: text,
  },
  {
    route: '/components/button',
    control: (p) => p.getByRole('button', { name: 'Unavailable', exact: true }),
    value: (control) => control.getAttribute('aria-pressed'),
  },
  {
    route: '/components/fieldset',
    setup: (p) => p.getByRole('button', { name: 'Disable group' }).click(),
    control: (p) =>
      p
        .getByRole('group', { name: 'Deployment target' })
        .getByRole('textbox')
        .first(),
    label: (p) =>
      p
        .getByRole('group', { name: 'Deployment target' })
        .locator('label')
        .first(),
    value: text,
  },
]

for (const host of hosts)
  test(`${host.route}: a disabled control fades alone and ignores input`, async ({
    page,
  }) => {
    await page.goto(host.route)
    await waitForCatalogReady(page)
    await host.setup?.(page)
    const control = host.control(page)
    await control.scrollIntoViewIfNeeded()
    await expect(control).toBeDisabled()
    const disabledOpacity = await page.evaluate(() =>
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--surf-control-disabled-opacity',
        ),
      ),
    )
    expect(await opacity(control)).toBeCloseTo(disabledOpacity, 2)
    if (host.label) expect(await opacity(host.label(page))).toBe(1)
    // Hover leaves the control, and the label row around it, as they rest.
    await page.mouse.move(0, 0)
    const rest = await paint(control)
    await control.hover({ force: true })
    expect(await paint(control)).toEqual(rest)
    // Neither a press nor keys change its value.
    const before = await host.value(control)
    await control.click({ force: true })
    await page.keyboard.type('x ')
    expect(await host.value(control)).toBe(before)
  })

// What the control and the two boxes around it paint.
function paint(locator: Locator) {
  return locator.evaluate((el) =>
    [el, el.parentElement!, el.parentElement!.parentElement!].map((node) => {
      const s = getComputedStyle(node)
      return [
        s.backgroundColor,
        s.backgroundImage,
        s.borderTopColor,
        s.color,
        s.opacity,
        s.boxShadow,
        s.outlineStyle,
      ].join(' ')
    }),
  )
}

// The opacity the reader sees: the product of the element's and its ancestors'.
function opacity(locator: Locator) {
  return locator.evaluate((el) => {
    let value = 1
    for (let node: Element | null = el; node; node = node.parentElement)
      value *= parseFloat(getComputedStyle(node).opacity)
    return value
  })
}
