import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Open a page with its path, title, description, and related actions. Set size to workspace for operational screens, page for dense lists, or document for reading screens. The catalog's own page headers use the same primitive. In the preview, the shared border wraps only the header example, not the product profiles or preview options.",
  avoid:
    'Show titles in full, and set visual size with size, not the heading level. The product decides which actions appear and their execution state, based on loading, errors, and permissions. When you hide an unavailable action, explain why. Place the header directly on the page, without nested cards or a separate background.',
  keyboard:
    "Don't add keyboard behavior to the static header. Its links run on Enter, and its buttons on Enter or Space. After SPA navigation, move focus to the title with headingProps' id and tabIndex=-1. Give the breadcrumb a named navigation landmark, and mark the current page with aria-current=page.",
  anatomy:
    'PageHeader → optional breadcrumb → copy (semantic Heading + optional description) + optional wrapping action group',
  tokens: [
    '--surf-page-header-breadcrumb-gap',
    '--surf-page-header-gap',
    '--surf-layout-description-measure',
    '--surf-space-4',
    '--surf-space-2',
    '--surf-type-title-size',
    '--surf-type-display-size',
    '--surf-type-display-tracking',
  ],
  code: `import { PageHeader, Button } from '@surflane/ui'

<PageHeader
  as='header'
  title='Registered resources'
  level={1}
  variant='page'
  headingProps={{ id: 'page-title', tabIndex: -1 }}
  description='Discover and inspect registered resources.'
  breadcrumb={breadcrumb}
  actionsLabel='Resource actions'
  actions={<Button onClick={openRegistration}>Register resource</Button>}
/>`,
  props: [
    [
      'title / description / breadcrumb / actions',
      'ReactNode; supporting slots optional',
      'title required',
    ],
    ['as', 'div | header', 'div'],
    ['level', '1–6; semantic heading rank', '1'],
    [
      'variant',
      "display | title | page | section | subsection: the title's type role, as Heading's variant",
      'title',
    ],
    [
      'lead',
      'sets the description in the reading role at the reading measure, for a document that opens with it',
      'false',
    ],
    [
      'headingProps',
      'heading HTML attributes, including id and tabIndex',
      'undefined',
    ],
    ['actionsLabel', 'optional accessible group name', 'undefined'],
  ],
}
