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
    'Connect a label, description, and error to an input. Inside the same Field, the shared Input or Select can replace Field.Control.',
  avoid:
    "Don't use a placeholder in place of a label. Use Field.Label instead. Don't show errors with color alone. Write the message in Field.Error.",
  keyboard:
    'Clicking the label focuses the input. Submitting the form moves focus to the first invalid input. aria-describedby links the description and error to the input.',
  anatomy:
    'Field.Root → Label + Control (or Input / Select) + Description + Error',
  tokens: fields,
  code: `import { Field } from '@surflane/ui'

<Field.Root name='project'>
  <Field.Label>Project name</Field.Label>
  <Field.Control required placeholder='demo-e2e-01' />
  <Field.Description>Use a unique name.</Field.Description>
  <Field.Error />
</Field.Root>`,
  props: [
    ['Root.name / disabled / invalid', 'Base UI field state', '— / false / —'],
    ['Root.validationMode', 'onSubmit | onBlur | onChange', 'onSubmit'],
    ['Error.match', 'ValidityState key | boolean', 'automatic'],
  ],
}
