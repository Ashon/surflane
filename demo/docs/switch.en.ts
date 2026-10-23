import type { ComponentDoc } from '../componentDocs'
const selection = [
  '--control-choice-size',
  '--control-choice-border',
  '--control-choice-selected-bg',
  '--control-choice-selected-fg',
  '--interaction-focus',
]
export const doc: ComponentDoc = {
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
}
