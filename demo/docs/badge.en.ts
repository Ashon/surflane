import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
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
    '--badge-info-bg',
    '--status-neutral-bg',
    '--status-success-fg',
    '--status-danger-fg',
    '--status-caution-fg',
    '--status-progress-bg',
    '--status-info-fg',
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
    [
      'tone',
      'neutral | info | success | danger | caution | progress',
      'neutral',
    ],
    [
      'icon',
      'custom ReactNode; false hides icon',
      'Badge: none / StatusBadge: semantic SVG',
    ],
    ['children', 'visible status label or count', '—'],
  ],
}
