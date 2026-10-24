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
}
