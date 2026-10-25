import type { ComponentDoc } from '../componentDocs'
const fields = [
  '--surf-control-height',
  '--surf-control-radius',
  '--surf-control-background',
  '--surf-status-danger-fg',
  '--surf-space-2',
]
export const doc: ComponentDoc = {
  usage:
    'Enter multi-line descriptions and notes. Text starts at the top. Users can resize the field vertically. Inside Field.Root it takes the label, description and error from the field.',
  avoid:
    "Don't use it to edit large amounts of code. Use a dedicated code editor instead.",
  keyboard:
    'Enter inserts a line break. Tab moves to the next input. Native text editing and Korean IME input keep working.',
  anatomy:
    'Field.Root → Field.Label + Textarea (native textarea) + Field.Description + Field.Error',
  tokens: fields,
  code: `import { Field, Textarea } from '@surflane/ui'

<Field.Root name='description'>
  <Field.Label>Description</Field.Label>
  <Textarea rows={4} required placeholder='Describe the deployment goal' />
  <Field.Description>Keep the context concise.</Field.Description>
  <Field.Error />
</Field.Root>`,
  props: [
    [
      'rows / maxLength / required / disabled / readOnly',
      'native textarea props',
      'native defaults',
    ],
    [
      'variant',
      'default | embedded: embedded fills its pane with no edge of its own and rings inside on focus',
      'default',
    ],
    ['ref', 'HTMLTextAreaElement', '—'],
  ],
}
