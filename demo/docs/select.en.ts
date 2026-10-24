import type { ComponentDoc } from '../componentDocs'
const controls = [
  '--surf-control-height',
  '--surf-control-radius',
  '--surf-interaction-focus',
  '--surf-control-background',
]
export const doc: ComponentDoc = {
  usage:
    'Pick one option from a fixed list. If the list is long enough to need search, use Combobox.',
  avoid:
    "Don't use Select to run actions. Use Menu instead. Check the selected result and the submitted value together.",
  keyboard:
    'Enter, Space, or an arrow key opens the listbox. Arrow keys and typing move between items. Escape closes only the listbox and returns focus.',
  anatomy:
    'Select → Trigger / Value / SVG chevron → Portal / Positioner / List / Item / Indicator',
  tokens: [...controls, '--surf-menu-border', '--surf-shadow-float'],
  code: `import { Select } from '@surflane/ui'

<Select
  name='environment'
  aria-label='Environment'
  defaultValue='staging'
  options={[
    { value: 'staging', label: 'Staging' },
    { value: 'production', label: 'Production' },
  ]}
/>`,
  props: [
    [
      'options',
      '{ value, label, disabled? }[], or groups { label, options }',
      'required',
    ],
    ['value / onValueChange', 'controlled value + callback', '—'],
    [
      'defaultValue / name / required / disabled',
      'selection and form props',
      '—',
    ],
    ['ref', 'the trigger button, as triggerRef', '—'],
  ],
}
