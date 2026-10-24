import type { ComponentDoc } from '../componentDocs'
const selection = [
  '--surf-control-choice-size',
  '--surf-control-choice-border',
  '--surf-control-choice-selected-bg',
  '--surf-control-choice-selected-fg',
  '--surf-interaction-focus',
]
export const doc: ComponentDoc = {
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
}
