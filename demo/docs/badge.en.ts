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
    '--surf-badge-neutral-bg',
    '--surf-badge-success-bg',
    '--surf-badge-danger-bg',
    '--surf-badge-caution-bg',
    '--surf-badge-progress-bg',
    '--surf-badge-info-bg',
    '--surf-status-neutral-bg',
    '--surf-status-success-fg',
    '--surf-status-danger-fg',
    '--surf-status-caution-fg',
    '--surf-status-progress-bg',
    '--surf-status-info-fg',
    '--surf-status-badge-gap',
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
