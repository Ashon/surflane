import type { ComponentDoc } from './componentDocs'
export const navigationDocs: Record<string, ComponentDoc> = {
  tabs: {
    usage:
      'Switches between related panels in the same context. The selected tab is shown as a full rounded surface. Use Panel.keepMounted to preserve input.',
    avoid:
      "Don't hide navigation between separate pages behind ad hoc tab state. Don't load slow content unnecessarily just because arrow-key focus moved.",
    keyboard:
      "Tab moves into the active tab. Arrow keys and Home/End move focus, and in the default manual mode Enter/Space activates the focused tab. With List.activateOnFocus=true, tabs activate as they receive focus. Disabled tabs can still receive focus but don't activate.",
    anatomy: 'Tabs.Root → List(Tab + Indicator) + value-matched Panels',
    tokens: [
      '--surface',
      '--canvas',
      '--control-height',
      '--control-radius',
      '--interaction-focus',
    ],
    code: 'import { Tabs } from "@surflane/ui";\n\n<Tabs.Root defaultValue="overview">\n  <Tabs.List aria-label="Deployment sections">\n    <Tabs.Tab value="overview">Overview</Tabs.Tab>\n    <Tabs.Tab value="logs">Logs</Tabs.Tab>\n  </Tabs.List>\n  <Tabs.Panel value="overview" keepMounted>Overview details</Tabs.Panel>\n  <Tabs.Panel value="logs" keepMounted>Build logs</Tabs.Panel>\n</Tabs.Root>',
    props: [
      [
        'Root.value / defaultValue / onValueChange',
        'Base UI tab values and callback',
        '— / 0 / —',
      ],
      ['Root.orientation', 'horizontal | vertical', 'horizontal'],
      [
        'List.activateOnFocus',
        'automatic activation with arrow focus',
        'false',
      ],
      ['Panel.keepMounted', 'preserve inactive panel DOM', 'false'],
    ],
  },
  accordion: {
    usage:
      "Expands related details under their headings. When switching in single-item mode, the previous and next panels swap with a height and fade transition, and the closing panel is made inert so its inputs can't be operated mid-transition. With reduced motion, panels switch instantly.",
    avoid:
      "Don't hide all essential information inside collapsed panels. Don't nest buttons or links inside a Trigger.",
    keyboard:
      'Tab/Shift+Tab moves through each Trigger and the inputs in open panels. Enter/Space expands a panel. Base UI 1.9 no longer uses arrow-key roving focus for Accordion.',
    anatomy: 'Root → Item → Header(Trigger + SVG) + Panel(content body)',
    tokens: [
      '--surface',
      '--space-4',
      '--control-height',
      '--motion-reveal',
      '--interaction-focus',
    ],
    code: 'import { Accordion } from "@surflane/ui";\n\n<Accordion.Root defaultValue={["identity"]}>\n  <Accordion.Item value="identity">\n    <Accordion.Header>\n      <Accordion.Trigger>Identity controls</Accordion.Trigger>\n    </Accordion.Header>\n    <Accordion.Panel>Deployment details</Accordion.Panel>\n  </Accordion.Item>\n</Accordion.Root>',
    props: [
      ['Root.value / defaultValue', 'array of expanded item values', '—'],
      [
        'Root.multiple / keepMounted',
        'multiple expanded items / preserve content',
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
      'Expands a single group of supplementary information in place. The title and content share the same horizontal padding.',
    avoid:
      "For several related sections, consider Accordion. Don't assume Escape closes it the way it closes a modal.",
    keyboard:
      'Tab to the Trigger and press Enter/Space to open and close it. With keepMounted, input state is preserved while the panel is closed.',
    anatomy: 'Collapsible.Root → Trigger + Panel(content body)',
    tokens: [
      '--surface',
      '--space-4',
      '--motion-reveal',
      '--interaction-focus',
    ],
    code: 'import { Collapsible } from "@surflane/ui";\n\n<Collapsible.Root>\n  <Collapsible.Trigger>Technical details</Collapsible.Trigger>\n  <Collapsible.Panel keepMounted>Redacted build logs</Collapsible.Panel>\n</Collapsible.Root>',
    props: [
      [
        'Root.open / defaultOpen / onOpenChange',
        'controlled / uncontrolled state',
        '— / false',
      ],
      ['Root.disabled', 'disable disclosure trigger', 'false'],
      [
        'Panel.keepMounted / hiddenUntilFound',
        'preserve state / browser-find reveal',
        'false',
      ],
    ],
  },
  avatar: {
    usage:
      "Shows a user image and falls back to initials or an SVG when the image fails or is missing. Choose the alt text or Root name so it isn't announced twice alongside a nearby name. Status is a decorative badge separate from the photo; also expose the actual status through Root's aria-description or adjacent text.",
    avoid:
      "Don't build an account menu out of the Avatar span itself. Wrap actions in a named button or Popover.Trigger.",
    keyboard:
      "A static Avatar isn't in the Tab order. When it sits inside a button, that button provides focus and behavior.",
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
    code: 'import { Avatar } from "@surflane/ui";\n\n<Avatar.Root role="img" aria-label="Preview user" size="md">\n  <Avatar.Image src="/profile.png" alt="" />\n  <Avatar.Fallback aria-hidden="true">CG</Avatar.Fallback>\n</Avatar.Root>',
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
        'Decorative corner marker; describe availability on Root or adjacent text and set aria-hidden on the marker',
        'optional',
      ],
    ],
  },
  badge: {
    usage:
      'Shows a short status or count. StatusBadge provides a semantic SVG for each tone; use Badge for general labels or counts. Badges have no border and are distinguished by a light status-color surface plus text and icon; general metadata badges use a neutral surface. Small status labels use a 12px size and medium (500) weight to stay legible. Status surfaces use badge background tokens that are separate from InlineMessage.',
    avoid:
      "Don't convey status with color or an icon alone. Don't style static badges like buttons or give every badge a live role.",
    keyboard:
      "Badges are static spans and aren't in the Tab order. To announce a status change, apply role=status to a single sentence.",
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
    code: 'import { Badge, StatusBadge } from "@surflane/ui";\n\n<Badge>3 environments</Badge>\n<StatusBadge tone="success">Passed</StatusBadge>\n<div role="status">\n  <StatusBadge tone="progress">Running</StatusBadge>\n  <span>Deployment is in progress.</span>\n</div>',
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
      'Marks a meaningful boundary in content, horizontally or vertically. The parent Stack/Inline manages the outer spacing.',
    avoid:
      "Don't repeat a line between every row. Handle purely decorative lines with CSS or aria-hidden.",
    keyboard:
      "Non-interactive separators aren't in the Tab order. Orientation is conveyed with aria-orientation.",
    anatomy: 'Separator(orientation, optional horizontal inset)',
    tokens: ['--line', '--space-4'],
    code: 'import { Separator } from "@surflane/ui";\n\n<Separator />\n<Separator inset />\n<Separator orientation="vertical" />',
    props: [
      ['orientation', 'horizontal | vertical', 'horizontal'],
      ['inset', 'horizontal inset by space-4', 'false'],
    ],
  },
  link: {
    usage:
      'Navigates to a destination with a real href. The underline and focus ring keep the navigation affordance visible.',
    avoid:
      "Don't implement actions as links without an href. When a link opens in a new tab, say so in the text and set rel.",
    keyboard:
      "Tab to the link and press Enter to open it. Modifier-key clicks, new tabs, downloads, and hash navigation follow the browser's default behavior.",
    anatomy: 'native anchor + shared link class',
    tokens: ['--ink', '--brand-ink', '--interaction-focus'],
    code: 'import { Link } from "@surflane/ui";\n\n<Link href="/components">Browse components</Link>\n<Link href="https://base-ui.com" target="_blank" rel="noreferrer">\n  Reference (opens in a new tab)\n</Link>',
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
      'Shows the path from the top level to the current location as an ordered list. Long trails wrap instead of collapsing, which preserves reading order.',
    avoid:
      "Don't let screen readers announce path separators; mark the current location with aria-current=page. Keep router logic in the product.",
    keyboard:
      "Tab to the ancestor links and press Enter to open them. The current-location text doesn't add an unnecessary Tab stop.",
    anatomy:
      'Root(nav) → List(ol) → Item(Link / decorative Separator / Current)',
    tokens: [
      '--type-caption-size',
      '--space-2',
      '--ink-muted',
      '--interaction-focus',
    ],
    code: 'import { Breadcrumbs } from "@surflane/ui";\n\n<Breadcrumbs.Root aria-label="Project breadcrumb">\n  <Breadcrumbs.List>\n    <Breadcrumbs.Item><Breadcrumbs.Link href="/">Platform</Breadcrumbs.Link></Breadcrumbs.Item>\n    <Breadcrumbs.Item>\n      <Breadcrumbs.Separator />\n      <Breadcrumbs.Current>Deployments</Breadcrumbs.Current>\n    </Breadcrumbs.Item>\n  </Breadcrumbs.List>\n</Breadcrumbs.Root>',
    props: [
      ['Root.aria-label', 'accessible navigation name', 'Breadcrumb'],
      ['Link', 'shared native Link', '—'],
      ['Current', 'span with aria-current=page', '—'],
    ],
  },
}
