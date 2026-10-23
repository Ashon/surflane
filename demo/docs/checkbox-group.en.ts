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
}
