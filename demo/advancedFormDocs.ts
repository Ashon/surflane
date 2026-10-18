import type { ComponentDoc } from './componentDocs'
export const advancedFormDocs: Record<string, ComponentDoc> = {
  combobox: {
    usage:
      'Use it for selections from a list long enough to need search. Unlike Autocomplete, which saves free text, it supports single selection and a chips layout for choosing multiple roles.',
    avoid:
      "Don't submit arbitrary search text as a valid selection. Name the Input with Field.Label or a native label, and give Clear, Trigger, and ChipRemove action names too.",
    anatomy:
      'Root → Field(label/description/error) + InputGroup(Input/Clear/Trigger or Chips) + Content(Portal/Positioner/Popup → Empty + List(Item/Indicator))',
    keyboard:
      "Typing filters the list, arrow keys move through candidates, and Enter selects. Escape closes an open popup and clears the selection when the popup is closed. Disabled candidates can't be selected. Remove individual values with a named ChipRemove. IME input, such as Korean, is handled by Base UI.",
    tokens: [
      '--control-height',
      '--control-radius',
      '--control-border',
      '--menu-background',
      '--menu-hover-background',
      '--selected',
      '--layer-popup',
    ],
    code: `import { Combobox, Field } from '@surflane/ui'

<Field.Root name='environment'>
  <Field.Label>Target environment</Field.Label>
  <Combobox.Root
    name='environment'
    items={environments}
    defaultValue='Staging web'
  >
    <Combobox.InputGroup>
      <Combobox.Input placeholder='Search environments…' />
      <Combobox.Clear />
      <Combobox.Trigger />
    </Combobox.InputGroup>
    <Combobox.Content>
      <Combobox.Empty>No matching environments.</Combobox.Empty>
      <Combobox.List>
        {(environment: string) => (
          <Combobox.Item key={environment} value={environment}>
            <Combobox.ItemIndicator />
            {environment}
          </Combobox.Item>
        )}
      </Combobox.List>
    </Combobox.Content>
  </Combobox.Root>
  <Field.Error />
</Field.Root>`,
    props: [
      [
        'Root.items / value / defaultValue',
        'Base UI generic item and selection types',
        'caller supplied',
      ],
      ['Root.multiple', 'array selection with Chips / ChipRemove', 'false'],
      [
        'Root.itemToStringLabel / itemToStringValue',
        'object display / submission mapping',
        'automatic for {label,value}',
      ],
      [
        'Root.inputValue / onInputValueChange',
        'controlled search query',
        'Base UI managed',
      ],
      [
        'Content.positionerProps',
        'side / align / sideOffset / collision options',
        'sideOffset=6',
      ],
      [
        'Root.name / form / required / disabled / readOnly',
        'form ownership and control state',
        'native form semantics',
      ],
      [
        'Form reset',
        'recreate internal query/selection model; canceled resets ignored; controlled props preserved',
        'enabled',
      ],
    ],
  },
  'number-field': {
    usage:
      'Use it for numeric input that needs a range, step, or display format. Offer direct typing alongside increment and decrement buttons, and keep the underlying number separate from display strings such as currency.',
    avoid:
      "Don't use it for identifiers that aren't calculated, such as phone numbers or postal codes. Don't force many clicks to enter small increments or make dragging the only input path.",
    anatomy:
      'Field(label/description/error) → Root → Group(Decrement + Input + Increment); optional ScrubArea',
    keyboard:
      "Supports direct typing, Up/Down arrow keys, and increment and decrement buttons. Respects the min/max range and distinguishes readOnly from disabled. Form reset returns uncontrolled values to their initial value, while controlled values keep the parent's value. Canceled changes and resets are respected.",
    tokens: [
      '--control-height',
      '--control-radius',
      '--control-background',
      '--control-focus',
      '--ink-body',
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
        'allow direct entry outside range for validation',
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
  },
}
