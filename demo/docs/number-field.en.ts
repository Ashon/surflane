import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Enter a number that needs a range, step, or display format. Offer direct typing alongside the Increment and Decrement buttons. Keep the underlying number separate from display strings such as currency.',
  avoid:
    "Don't use it for identifiers that aren't calculated, such as phone numbers or postal codes. Use Input instead. Don't force many clicks for small increments, or make dragging the only input path. Keep direct typing available.",
  anatomy:
    'Field(label/description/error) → Root → Group(Decrement + Input + Increment); optional ScrubArea',
  keyboard: [
    'Type a value directly.',
    'The Up and Down arrow keys and the Increment and Decrement buttons change the value. It respects min and max.',
    'readOnly and disabled are distinct states.',
    "Form reset returns uncontrolled values to their initial value, and controlled values keep the parent's value. Canceled changes and resets are respected.",
  ],
  tokens: [
    '--surf-control-height',
    '--surf-control-radius',
    '--surf-control-background',
    '--surf-control-focus',
    '--surf-ink-body',
  ],
  code: `import { NumberField, Field } from '@surflane/ui'

<Field.Root name='attempts'>
  <Field.Label>Retry attempts</Field.Label>
  <NumberField.Root name='attempts' defaultValue={2} min={1} max={8} step={1}>
    <NumberField.Group>
      <NumberField.Decrement aria-label='Decrease attempts' />
      <NumberField.Input />
      <NumberField.Increment aria-label='Increase attempts' />
    </NumberField.Group>
  </NumberField.Root>
  <Field.Error />
</Field.Root>`,
  props: [
    [
      'Root.value / defaultValue / onValueChange',
      'number | null / number / Base UI callback',
      'uncontrolled unless value supplied',
    ],
    ['Root.min / max / step', 'range and numeric step', 'Base UI defaults'],
    [
      'Root.locale / format',
      'Intl numeric locale / number-format options',
      'runtime locale',
    ],
    [
      'Root.allowOutOfRange',
      'allows typed values outside the range, for validation',
      'false',
    ],
    [
      'Root.name / form / required / disabled / readOnly',
      'form ownership and control state',
      'Base UI semantics',
    ],
    ['Root.onValueCommitted', 'finalized value callback', '—'],
    [
      'Increment / Decrement children',
      'custom content; default decorative SVG',
      'SVG plus/minus',
    ],
  ],
}
