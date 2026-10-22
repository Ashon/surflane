import type { ComponentDoc } from './componentDocs'
const selection = [
  '--control-choice-size',
  '--control-choice-border',
  '--control-choice-selected-bg',
  '--control-choice-selected-fg',
  '--interaction-focus',
]
const fields = [
  '--control-height',
  '--control-radius',
  '--control-background',
  '--status-danger-fg',
  '--space-2',
]
export const formDocs: Record<string, ComponentDoc> = {
  field: {
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
      [
        'Root.name / disabled / invalid',
        'Base UI field state',
        '— / false / —',
      ],
      ['Root.validationMode', 'onSubmit | onBlur | onChange', 'onSubmit'],
      ['Error.match', 'ValidityState key | boolean', 'automatic'],
    ],
  },
  fieldset: {
    usage:
      "Group inputs on one topic under a Legend. The group's disabled state passes to child Fields.",
    avoid:
      "Don't use it just to draw a visual border. Use a Card instead. Keep an individual label on each input.",
    keyboard:
      'Tab follows the natural order of the inputs. A disabled group is excluded from interaction and form submission. Legend gives the group its accessible name.',
    anatomy: 'Fieldset.Root → Legend + related Fields',
    tokens: ['--space-4', '--type-subsection-size', '--ink'],
    code: `import { Fieldset, Field } from '@surflane/ui'

<Fieldset.Root disabled={disabled}>
  <Fieldset.Legend>Deployment target</Fieldset.Legend>
  <Field.Root name='project'>
    <Field.Label>Project name</Field.Label>
    <Field.Control />
  </Field.Root>
</Fieldset.Root>`,
    props: [
      ['Root.disabled', 'boolean; cascades to nested fields', 'false'],
      ['Legend', 'accessible group name', 'required content'],
    ],
  },
  form: {
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
  },
  textarea: {
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
      ['ref', 'HTMLTextAreaElement', '—'],
    ],
  },
  checkbox: {
    usage:
      'Select independent options. The mixed state shows a dash SVG. Read-only and disabled states look distinct.',
    avoid:
      "Don't use it for one choice among mutually exclusive options. Use RadioGroup instead. Don't distinguish states by color alone. Let the Indicator icon show the state too.",
    keyboard:
      "Tab focuses the checkbox. Space toggles it. Base UI's hidden input handles label clicks, form submission, and reset.",
    anatomy:
      'ChoiceLabel(control, description?) → Checkbox.Root + Indicator(default SVG) + text',
    tokens: selection,
    code: `import { Checkbox, ChoiceLabel } from '@surflane/ui'

<ChoiceLabel
  control={
    <Checkbox.Root name='cleanup' defaultChecked>
      <Checkbox.Indicator />
    </Checkbox.Root>
  }
  description='Removes accounts unused for 30 days.'
>
  Clean up temporary accounts
</ChoiceLabel>`,
    props: [
      [
        'Root.checked / defaultChecked',
        'controlled / uncontrolled boolean',
        '— / false',
      ],
      [
        'Root.indeterminate / readOnly / disabled',
        'mixed or unavailable state',
        'false',
      ],
      ['Root.name / value / uncheckedValue', 'native form values', '—'],
      ['Root.size', 'small | default | large', 'surrounding size'],
      [
        'ChoiceLabel control / description',
        'the control; text below the label, read as its description',
        '—',
      ],
    ],
  },
  'checkbox-group': {
    usage:
      'Manage several selections on one topic. The group drives the mixed state of a parent select-all checkbox. Pass every child value in allValues.',
    avoid:
      "Don't store the parent checkbox state separately from its children. Keep allValues in sync with the children's values instead.",
    keyboard:
      'Tab moves to each checkbox. Space toggles it. The parent selects or clears all items. It shows as mixed when only some are selected.',
    anatomy:
      'Fieldset → CheckboxGroup(allValues) → parent checkbox + value checkboxes',
    tokens: selection,
    code: `import { CheckboxGroup, Checkbox, ChoiceLabel } from '@surflane/ui'

<CheckboxGroup
  allValues={['staging', 'production']}
  defaultValue={['staging']}
  aria-label='Environments'
>
  <ChoiceLabel
    control={
      <Checkbox.Root parent>
        <Checkbox.Indicator />
      </Checkbox.Root>
    }
  >
    All environments
  </ChoiceLabel>
  {['staging', 'production'].map((value) => (
    <ChoiceLabel
      key={value}
      control={
        <Checkbox.Root name='environments' value={value}>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      {value}
    </ChoiceLabel>
  ))}
</CheckboxGroup>`,
    props: [
      [
        'value / defaultValue / onValueChange',
        'string[] and change callback',
        '—',
      ],
      ['allValues', 'all child values; required for parent checkbox', '—'],
      ['disabled', 'disables the group', 'false'],
    ],
  },
  'radio-group': {
    usage:
      'Choose one of several mutually exclusive options. Give the group and each item a name.',
    avoid:
      "Don't place a lone Radio without a name. Put each Radio in a named RadioGroup. Don't treat a selection change as submitting the whole form. Leave submission to the form's submit button.",
    keyboard:
      'Tab moves focus to the selected item. Arrow keys move the selection and skip disabled items.',
    anatomy:
      'RadioGroup → ChoiceLabel(control) → Radio.Root(value) / Indicator + text',
    tokens: selection,
    code: `import { ChoiceLabel, RadioGroup, Radio } from '@surflane/ui'

<RadioGroup name='source' defaultValue='live' aria-label='Log source'>
  {['live', 'simulation'].map((value) => (
    <ChoiceLabel
      key={value}
      control={
        <Radio.Root value={value}>
          <Radio.Indicator />
        </Radio.Root>
      }
    >
      {value}
    </ChoiceLabel>
  ))}
</RadioGroup>`,
    props: [
      [
        'value / defaultValue / onValueChange',
        'generic value and change callback',
        '—',
      ],
      [
        'name / required / readOnly / disabled',
        'group form and interaction state',
        '— / false',
      ],
      ['Radio.Root.value', 'option value', 'required'],
      ['Radio.Root.size', 'small | default | large', 'surrounding size'],
    ],
  },
  switch: {
    usage:
      "Toggle a setting that applies immediately. The thumb position and background change together. The label stays the same in both states. In read-only mode, the value is visible but can't change.",
    avoid:
      "Don't use it in place of an action button. Use Button instead. Don't use it for a multi-select list. Use CheckboxGroup instead.",
    keyboard:
      'Tab focuses the switch. Space toggles it. In forms, the name, value, and uncheckedValue props submit explicit values.',
    anatomy: 'ChoiceLabel(control) → Switch.Root + Thumb + stable label',
    tokens: [
      ...selection,
      '--control-switch-width',
      '--control-switch-height',
      '--control-switch-thumb',
    ],
    code: `import { ChoiceLabel, Switch } from '@surflane/ui'

<ChoiceLabel
  control={
    <Switch.Root
      name='refresh'
      defaultChecked
      value='enabled'
      uncheckedValue='disabled'
    >
      <Switch.Thumb />
    </Switch.Root>
  }
>
  Refresh run status
</ChoiceLabel>`,
    props: [
      [
        'checked / defaultChecked / onCheckedChange',
        'controlled / uncontrolled boolean and callback',
        '— / false',
      ],
      ['readOnly / disabled', 'prevents interaction', 'false'],
      ['Root.size', 'small | default | large', 'surrounding size'],
      ['name / value / uncheckedValue', 'form payload', '—'],
    ],
  },
}
