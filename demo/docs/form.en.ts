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
    "Coordinate submit validation and server errors across several Fields. onFormSubmit collects values from named Fields. For the raw native submission values, read FormData in onSubmit. The preview's server error button only changes local state.",
  avoid:
    "Don't assume async validation always blocks submission. Handle real requests, permissions, and duplicate-submission prevention in the product.",
  keyboard:
    'Enter or the submit button validates the form and moves focus to the first invalid input. Editing an input clears its server error. Reset restores the initial values.',
  anatomy: 'Form → Field / Fieldset + submit / reset + result status',
  tokens: fields,
  code: `import { Form, Field, Button } from '@surflane/ui'

<Form errors={serverErrors} onFormSubmit={savePreview}>
  <Field.Root name='project'>
    <Field.Label>Project name</Field.Label>
    <Field.Control required />
    <Field.Error />
  </Field.Root>
  <Button type='submit'>Save preview</Button>
  <Button type='reset' variant='outline'>
    Reset
  </Button>
</Form>`,
  props: [
    [
      'onFormSubmit',
      '(values, eventDetails) => void; prevents native navigation',
      '—',
    ],
    ['errors', 'record keyed by Field.Root name', '—'],
    ['validationMode', 'onSubmit | onBlur | onChange', 'onSubmit'],
  ],
}
