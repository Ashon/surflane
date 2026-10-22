import type { ComponentDoc } from './componentDocs'
export const advancedFormDocs: Record<string, ComponentDoc> = {
  combobox: {
    usage:
      'Pick from a list long enough to need search. Combobox supports single selection and a Chips layout for multiple values, such as roles. Name the Input with Field.Label or a native label. Give Clear, Trigger, and ChipRemove action names too.',
    avoid:
      "Don't submit arbitrary search text as a valid selection. When free text is valid, use Autocomplete, which saves free text.",
    anatomy:
      'Root → Field(label/description/error) + InputGroup(Input/Clear/Trigger or Chips) + Content(Portal/Positioner/Popup → Empty + List(Item/Indicator))',
    keyboard: [
      'Typing filters the list. Base UI handles IME input, such as Korean.',
      'Arrow keys move through items.',
      "Enter selects an item. Disabled items can't be selected.",
      'Escape closes an open popup. With the popup closed, Escape clears the selection.',
      'Remove one value with its named ChipRemove.',
    ],
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
        'Content.side / align / sideOffset / collisionPadding',
        'popup placement',
        'sideOffset=6',
      ],
      [
        'Root.name / form / required / disabled / readOnly',
        'form ownership and control state',
        'native form semantics',
      ],
      [
        'Form reset',
        'recreates the internal query and selection; skips canceled resets; keeps controlled props',
        'enabled',
      ],
    ],
  },
  'number-field': {
    usage:
      'Enter a number that needs a range, step, or display format. Offer direct typing alongside the Increment and Decrement buttons. Keep the underlying number separate from display strings such as currency.',
    avoid:
      "Don't use it for identifiers that aren't calculated, such as phone numbers or postal codes. Use Input instead. Don't force many clicks for small increments, or make dragging the only input path. Keep direct typing available.",
    anatomy:
      'Field(label/description/error) → Root → Group(Decrement + Input + Increment); optional ScrubArea',
    keyboard: [
      'Type a value directly.',
      'The Up and Down arrow keys and the Increment and Decrement buttons change the value. It respects min and max.',
      'readOnly and disabled are distinct states.',
      "Form reset returns uncontrolled values to their initial value, and controlled values keep the parent's value. Canceled changes and resets are respected.",
    ],
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
        'allows typed values outside the range, for validation',
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
