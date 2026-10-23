import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Show the path from the top level to the current location as an ordered list. Long trails wrap instead of collapsing, so reading order holds.',
  avoid:
    "Don't let screen readers announce path separators. Use the decorative Separator instead. Mark the current location with aria-current=page. Keep router logic in the product.",
  keyboard:
    "Tab to an ancestor link and press Enter to open it. The current location isn't a Tab stop.",
  anatomy: 'Root(nav) → List(ol) → Item(Link / decorative Separator / Current)',
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
}
