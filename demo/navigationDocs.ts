import type { ComponentDoc } from './componentDocs'
export const navigationDocs: Record<string, ComponentDoc> = {
  tabs: {
    usage:
      'Switch between related panels in the same context. The selected tab shows as a full rounded surface. Set Panel.keepMounted to preserve input.',
    avoid:
      "Don't fake navigation between separate pages with tab state. Use links instead. Don't load slow content on arrow-key focus. Keep the default manual activation instead.",
    keyboard:
      "Tab moves focus to the active tab. Arrow keys, Home, and End move focus between tabs. In the default manual mode, Enter or Space activates the focused tab. With List.activateOnFocus=true, a tab activates when it receives focus. Disabled tabs receive focus but don't activate.",
    anatomy: 'Tabs.Root → List(Tab + Indicator) + value-matched Panels',
    tokens: [
      '--surface',
      '--canvas',
      '--control-height',
      '--control-radius',
      '--interaction-focus',
    ],
    code: `import { Tabs } from '@surflane/ui'

<Tabs.Root defaultValue='overview'>
  <Tabs.List aria-label='Deployment sections'>
    <Tabs.Tab value='overview'>Overview</Tabs.Tab>
    <Tabs.Tab value='logs'>Logs</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value='overview' keepMounted>
    Overview details
  </Tabs.Panel>
  <Tabs.Panel value='logs' keepMounted>
    Build logs
  </Tabs.Panel>
</Tabs.Root>`,
    props: [
      [
        'Root.value / defaultValue / onValueChange',
        'selected tab value and change callback',
        '— / 0 / —',
      ],
      ['Root.orientation', 'horizontal | vertical', 'horizontal'],
      ['List.activateOnFocus', 'activate tabs on arrow-key focus', 'false'],
      ['Panel.keepMounted', 'keep inactive panels in the DOM', 'false'],
    ],
  },
  accordion: {
    usage:
      "Expand related details under their headings. In single-item mode, the closing and opening panels swap with a height and fade transition. The closing panel turns inert, so its inputs can't be used mid-transition. With reduced motion, panels switch instantly.",
    avoid:
      "Don't hide all essential information in collapsed panels. Keep key facts visible outside them. Don't nest buttons or links inside a Trigger. Place them in the Panel instead.",
    keyboard:
      'Tab and Shift+Tab move through each Trigger and the inputs in open panels. Enter or Space expands a panel. Base UI 1.9 dropped arrow-key roving focus for Accordion.',
    anatomy: 'Root → Item → Header(Trigger + SVG) + Panel(content body)',
    tokens: [
      '--surface',
      '--space-4',
      '--control-height',
      '--motion-reveal',
      '--interaction-focus',
    ],
    code: `import { Accordion } from '@surflane/ui'

<Accordion.Root defaultValue={['identity']}>
  <Accordion.Item value='identity'>
    <Accordion.Header>
      <Accordion.Trigger>Identity controls</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>Deployment details</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>`,
    props: [
      ['Root.value / defaultValue', 'array of expanded item values', '—'],
      [
        'Root.multiple / keepMounted',
        'allow several expanded items / keep closed content mounted',
        'false',
      ],
      [
        'Trigger.indicator',
        'custom ReactNode; false hides default SVG',
        'SVG chevron',
      ],
    ],
  },
  collapsible: {
    usage:
      'Expand one group of supplementary information in place. The Trigger and Panel share the same horizontal padding.',
    avoid:
      "Use Accordion for several related sections. Don't expect Escape to close it as it closes a modal. Close it with the Trigger instead.",
    keyboard:
      'Tab to the Trigger. Enter or Space opens and closes the Panel. With keepMounted, the closed Panel keeps its input state.',
    anatomy: 'Collapsible.Root → Trigger + Panel(content body)',
    tokens: [
      '--surface',
      '--space-4',
      '--motion-reveal',
      '--interaction-focus',
    ],
    code: `import { Collapsible } from '@surflane/ui'

<Collapsible.Root>
  <Collapsible.Trigger>Technical details</Collapsible.Trigger>
  <Collapsible.Panel keepMounted>Redacted build logs</Collapsible.Panel>
</Collapsible.Root>`,
    props: [
      [
        'Root.open / defaultOpen / onOpenChange',
        'controlled / uncontrolled state',
        '— / false',
      ],
      ['Root.disabled', 'disable the Trigger', 'false'],
      [
        'Panel.keepMounted / hiddenUntilFound',
        'keep state while closed / reveal on browser find',
        'false',
      ],
    ],
  },
  avatar: {
    usage:
      "Show a user image, with initials or an SVG as the fallback when the image is missing or fails. Set the alt text or Root name so a nearby name isn't announced twice. Status is a decorative badge, separate from the image. Expose the actual status through Root's aria-description or adjacent text.",
    avoid:
      "Don't make the Avatar span itself an account menu. Wrap it in a named button or Popover.Trigger instead.",
    keyboard:
      "A static Avatar isn't in the Tab order. Inside a button, the button provides focus and behavior.",
    anatomy:
      'Avatar.Root → Image + Fallback(initials or default SVG) + optional Status',
    tokens: [
      '--avatar-size-sm',
      '--avatar-size-md',
      '--avatar-size-lg',
      '--radius-full',
      '--line',
      '--surface',
    ],
    code: `import { Avatar } from '@surflane/ui'

<Avatar.Root role='img' aria-label='Preview user' size='md'>
  <Avatar.Image src='/profile.png' alt='' />
  <Avatar.Fallback aria-hidden='true'>CG</Avatar.Fallback>
</Avatar.Root>`,
    props: [
      [
        'Root.size',
        'small (24px) | default (36px) | large (48px); sm / md / lg aliases',
        'md',
      ],
      [
        'Image.onLoadingStatusChange',
        'idle | loading | loaded | error callback',
        '—',
      ],
      ['Fallback.delay', 'milliseconds before fallback', '0'],
      [
        'Status',
        'decorative corner marker; set aria-hidden on it and describe availability on Root or in adjacent text',
        'optional',
      ],
    ],
  },
  badge: {
    usage:
      'Show a short status with StatusBadge, which adds a semantic SVG for each tone. Use Badge for general labels or counts, on a neutral surface. Badges are borderless: status badges pair text and icon with a light tone surface from badge background tokens, separate from InlineMessage. Small status labels use 12px at medium (500) weight to stay legible.',
    avoid:
      "Don't convey status with color or an icon alone. Always include a text label. Use Button for actions instead of styling badges like buttons. Announce changes from one role=status sentence, not a live role on every badge.",
    keyboard:
      "Badges are static spans and aren't in the Tab order. To announce a status change, put role=status on one sentence.",
    anatomy:
      'Badge(text + optional icon) / StatusBadge(default semantic SVG + text)',
    tokens: [
      '--badge-neutral-bg',
      '--badge-success-bg',
      '--badge-danger-bg',
      '--badge-caution-bg',
      '--badge-progress-bg',
      '--status-neutral-bg',
      '--status-success-fg',
      '--status-danger-fg',
      '--status-caution-fg',
      '--status-progress-bg',
      '--status-badge-gap',
    ],
    code: `import { Badge, StatusBadge } from '@surflane/ui'

<Badge>3 environments</Badge>
<StatusBadge tone='success'>Passed</StatusBadge>
<div role='status'>
  <StatusBadge tone='progress'>Running</StatusBadge>
  <span>Deployment is in progress.</span>
</div>`,
    props: [
      ['tone', 'neutral | success | danger | caution | progress', 'neutral'],
      [
        'icon',
        'custom ReactNode; false hides icon',
        'Badge: none / StatusBadge: semantic SVG',
      ],
      ['children', 'visible status label or count', '—'],
    ],
  },
  separator: {
    usage:
      'Mark a meaningful boundary in content, horizontally or vertically. The parent Stack or Inline sets the outer spacing.',
    avoid:
      "Don't repeat a line between every row. Use spacing instead. For purely decorative lines, use CSS or aria-hidden.",
    keyboard:
      "Separators are non-interactive and aren't in the Tab order. aria-orientation conveys the orientation.",
    anatomy: 'Separator(orientation, optional horizontal inset)',
    tokens: ['--line', '--space-4'],
    code: `import { Separator } from '@surflane/ui'

<Separator />
<Separator inset />
<Separator orientation='vertical' />`,
    props: [
      ['orientation', 'horizontal | vertical', 'horizontal'],
      ['inset', 'horizontal inset by space-4', 'false'],
    ],
  },
  link: {
    usage:
      'Navigate to a destination with a real href. The underline and focus ring show that it navigates.',
    avoid:
      "Don't use a link without an href for an action. Use Button instead. When a link opens a new tab, say so in the text and set rel.",
    keyboard:
      'Tab to the link and press Enter to open it. Modifier-key clicks, new tabs, downloads, and hash navigation keep browser defaults.',
    anatomy: 'native anchor + shared link class',
    tokens: ['--ink', '--brand-ink', '--interaction-focus'],
    code: `import { Link } from '@surflane/ui'

<Link href='/components'>Browse components</Link>
<Link href='https://base-ui.com' target='_blank' rel='noreferrer'>
  Reference (opens in a new tab)
</Link>`,
    props: [
      [
        'href / target / rel / download',
        'native anchor props',
        'native defaults',
      ],
      ['ref', 'HTMLAnchorElement', '—'],
    ],
  },
  breadcrumbs: {
    usage:
      'Show the path from the top level to the current location as an ordered list. Long trails wrap instead of collapsing, so reading order holds.',
    avoid:
      "Don't let screen readers announce path separators. Use the decorative Separator instead. Mark the current location with aria-current=page. Keep router logic in the product.",
    keyboard:
      "Tab to an ancestor link and press Enter to open it. The current location isn't a Tab stop.",
    anatomy:
      'Root(nav) → List(ol) → Item(Link / decorative Separator / Current)',
    tokens: [
      '--type-caption-size',
      '--space-2',
      '--ink-muted',
      '--interaction-focus',
    ],
    code: `import { Breadcrumbs } from '@surflane/ui'

<Breadcrumbs.Root aria-label='Project breadcrumb'>
  <Breadcrumbs.List>
    <Breadcrumbs.Item>
      <Breadcrumbs.Link href='/'>Platform</Breadcrumbs.Link>
    </Breadcrumbs.Item>
    <Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current>Deployments</Breadcrumbs.Current>
    </Breadcrumbs.Item>
  </Breadcrumbs.List>
</Breadcrumbs.Root>`,
    props: [
      ['Root.aria-label', 'accessible navigation name', 'Breadcrumb'],
      ['Link', 'shared native Link', '—'],
      ['Current', 'span with aria-current=page', '—'],
    ],
  },
}
