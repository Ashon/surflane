import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Indicate short processing of unknown length. On its own, describe the task with label. Inside a region that already announces the status, set decorative.',
  avoid:
    "Don't show a spinner indefinitely. Report failures, delays, and cancellation separately. Announce loading from one live region, not several.",
  keyboard:
    'By default, Spinner has role=status and visually hidden text. The decorative prop removes it from the accessibility tree. With reduced motion, rotation stops, but the static indicator and label remain.',
  anatomy: 'span(status) → decorative SVG + visually hidden label',
  tokens: ['--ink-body'],
  code: `import { Spinner } from '@surflane/ui'

<Spinner label='Syncing environments' />
<button disabled>
  <Spinner decorative size='small' /> Saving
</button>`,
  props: [
    ['label', 'string', 'Loading'],
    ['decorative', 'boolean', 'false'],
    ['size', 'small | default | large; sm / md / lg are deprecated', 'default'],
  ],
}
