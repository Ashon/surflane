import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Show a short status with StatusBadge, which adds a semantic SVG for each tone. Use Badge for general labels or counts, on a neutral surface. Badges are borderless: status badges pair text and icon with a light tone surface from badge background tokens, separate from InlineMessage. Small status labels use 12px at medium (500) weight to stay legible. StatusDot is a status without words, for a state that text beside it names, such as a group's count: a flat dot in the tone's color, as an avatar's status marker is. live pulses it while the state is under way; attention blinks it three times as the state arrives, such as waiting for an answer, then holds it still.",
  avoid:
    "Don't convey status with color or an icon alone. Always include a text label: beside a StatusDot, or its label where no text says the state. Don't blink a dot to keep asking; attention blinks only as the state arrives. Use Button for actions instead of styling badges like buttons. Announce changes from one role=status sentence, not a live role on every badge.",
  keyboard:
    "Badges are static spans and aren't in the Tab order. To announce a status change, put role=status on one sentence.",
  anatomy:
    'Badge(text + optional icon) / StatusBadge(default semantic SVG + text) / StatusDot(dot; role=img with label, hidden without)',
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
    '--surf-status-dot-size',
    '--surf-motion-pulse',
  ],
  code: `import { Badge, Inline, StatusBadge, StatusDot, Text } from '@surflane/ui'

<Badge>3 environments</Badge>
<StatusBadge tone='success'>Passed</StatusBadge>
<div role='status'>
  <StatusBadge tone='progress'>Running</StatusBadge>
  <span>Deployment is in progress.</span>
</div>
<Inline gap={2}>
  <StatusDot tone='progress' live />
  <Text as='span'>Working 2</Text>
</Inline>
<StatusDot tone='caution' attention label='Waiting for you' />`,
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
    [
      'StatusDot label',
      "the state's name where no text nearby says it: the dot becomes role=img with that name; without it the dot is aria-hidden",
      '—',
    ],
    [
      'StatusDot live / attention',
      'live pulses while the state is under way; attention blinks three times as it arrives, then holds; one or the other, still when motion is reduced',
      'false',
    ],
  ],
}
