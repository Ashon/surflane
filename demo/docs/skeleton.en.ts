import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Preview the structure of loading content with a decorative placeholder. Give the parent region aria-busy and a readable loading message. Replace the skeleton with real content when loading finishes. Set lines for a paragraph and width for a short label instead of sizing the span yourself.',
  avoid:
    "Don't treat it as real data or input. For structure you can't predict, show one generic block instead of many fake cards.",
  keyboard:
    'Skeleton is always aria-hidden=true and never takes focus. The parent announces the loading state once. With reduced motion, the pulse stops.',
  anatomy: 'decorative span; parent loading region owns announcements',
  tokens: [
    '--surf-skeleton-base',
    '--surf-skeleton-highlight',
    '--surf-radius-sm',
    '--surf-radius-md',
  ],
  code: `import { Skeleton } from '@surflane/ui'

<section aria-label='Environment' aria-busy={loading}>
  {loading ? <Skeleton shape='block' /> : <EnvironmentDetails />}
</section>
<p role='status'>{loading ? 'Loading environment…' : 'Environment loaded.'}</p>`,
  props: [
    ['shape', 'text | block | circle', 'text'],
    [
      'width',
      "how wide a text line or a block runs, such as '55%' or '12ch'",
      '100%',
    ],
    [
      'lines',
      "text lines in one placeholder, a line's gap apart; the last runs to 60%, as a paragraph's does. In a row it takes the room beside a circle",
      '1',
    ],
    ['style / className', 'native span layout overrides', '—'],
    ['aria-hidden', 'always true', 'true'],
  ],
}
