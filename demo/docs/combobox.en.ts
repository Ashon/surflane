import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
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
    '--surf-control-height',
    '--surf-control-radius',
    '--surf-control-border',
    '--surf-menu-background',
    '--surf-menu-hover-background',
    '--surf-selected',
    '--surf-layer-popup',
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
}
