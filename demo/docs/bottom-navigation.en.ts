import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage: [
    "Put a phone app's three to five main destinations along the bottom edge, within thumb reach. Each Item is a link with an icon above a short label, and current marks the page you're on.",
    'By default it shows at 760px and narrower, where AppShell hides its sidebar, so the same destinations live in the sidebar on wider screens. Set visible="always" for a phone-only app.',
    'It stays fixed to the bottom of the viewport and pads the safe area under the home indicator. Pad your scrolling content by var(--size-bottom-navigation) plus env(safe-area-inset-bottom) so the last line stays visible. Set position="static" to place it in a frame of your own.',
    'A badge shows a count, capped at 99+, or a dot when you pass true. badgeLabel says what it means to screen readers, such as "3 unread"; a dot needs one.',
  ],
  avoid: [
    "Don't put more than five destinations in it, or fewer than three. Use the sidebar or a Sheet menu for the rest.",
    "Don't put actions in it, such as Create or Share. It holds destinations; put actions in the page or a Toolbar.",
    "Don't drop the labels and leave icons alone. Keep each label to one short word, since it truncates on narrow screens.",
    "Don't switch panels on one screen with it. Use Tabs for that.",
  ],
  keyboard: [
    'Each destination is a native link: Tab moves between them and Enter follows one.',
    'The nav landmark takes its name from aria-label, and the current destination reads as the current page.',
    'A badge reads after the label, as its badgeLabel or its count; the icon and the visual badge stay out of the accessibility tree.',
  ],
  anatomy:
    'Root(nav, aria-label) → ul → Item: li → a(aria-current) → icon pill(+ badge) + label + spoken badge',
  tokens: [
    '--size-bottom-navigation',
    '--layer-chrome',
    '--chrome',
    '--line',
    '--selected',
    '--ink-muted',
    '--status-danger-fg',
    '--interaction-focus',
  ],
  code: `import { BottomNavigation, Icon } from '@surflane/ui'
import { Link } from 'react-router'

// Pad the scrolling content so the bar never covers its last line.
<>
  <main
    style={{
      paddingBlockEnd:
        'calc(var(--size-bottom-navigation) + env(safe-area-inset-bottom))',
    }}
  >
    Page content
  </main>
  <BottomNavigation.Root aria-label='Primary'>
    <BottomNavigation.Item
      render={<Link to='/runs' />}
      icon={<Icon name='play' />}
      label='Runs'
      current
    />
    <BottomNavigation.Item
      render={<Link to='/activity' />}
      icon={<Icon name='clock' />}
      label='Activity'
      badge={3}
      badgeLabel='3 unread'
    />
    <BottomNavigation.Item
      render={<Link to='/account' />}
      icon={<Icon name='user' />}
      label='Account'
    />
  </BottomNavigation.Root>
</>`,
  props: [
    ['Root.aria-label', 'names the navigation landmark', 'required'],
    [
      'Root.visible',
      'mobile: at 760px and narrower, where AppShell hides its sidebar | always',
      'mobile',
    ],
    [
      'Root.position',
      'fixed: pinned to the viewport bottom above every page, below overlays | static: in the flow',
      'fixed',
    ],
    ['Item.icon / label', 'icon above a one-word label', 'required'],
    [
      'Item.current',
      'marks the current destination with aria-current="page"',
      'false',
    ],
    [
      'Item.badge / badgeLabel',
      'a count, capped at 99+, or true for a dot / what the badge means, read after the label',
      '—',
    ],
    [
      'Item.render / href / native a props',
      "a router's link element for client navigation, as with Link",
      'a',
    ],
  ],
}
