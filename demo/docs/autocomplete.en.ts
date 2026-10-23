import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Suggest values for search and tag inputs that don't require a selection. Typed text is valid even without a matching suggestion. Root.value is the input string, not a selected ID.",
  avoid:
    "Use Combobox when users must pick a registered resource. Don't treat text outside the suggestions as an error. Accept it as typed. Don't submit the form unannounced right after a selection. Announce it, or keep submitOnItemClick off.",
  anatomy:
    'Root → Field(label/description/error) + InputGroup(Input/Clear/Trigger) + Content(Empty/Status + List/Item)',
  keyboard:
    "Typing narrows the suggestions. Arrow keys and Enter complete the text. Escape or Tab closes the popup. By default, selecting an item doesn't submit the form. Base UI types for non-string object suggestions and grouped items are preserved.",
  tokens: [
    '--control-height',
    '--control-radius',
    '--menu-background',
    '--menu-hover-background',
    '--layer-popup',
  ],
  code: `import { Autocomplete, Field } from '@surflane/ui'

<Field.Root name='query'>
  <Field.Label>Pipeline search</Field.Label>
  <Autocomplete.Root name='query' items={suggestions}>
    <Autocomplete.InputGroup>
      <Autocomplete.Input placeholder='Search scenarios…' />
      <Autocomplete.Clear />
      <Autocomplete.Trigger />
    </Autocomplete.InputGroup>
    <Autocomplete.Content>
      <Autocomplete.Empty>
        No suggestions. Free text is accepted.
      </Autocomplete.Empty>
      <Autocomplete.List>
        {(item: string) => (
          <Autocomplete.Item key={item} value={item}>
            {item}
          </Autocomplete.Item>
        )}
      </Autocomplete.List>
    </Autocomplete.Content>
  </Autocomplete.Root>
  <Field.Error />
</Field.Root>`,
  props: [
    [
      'Root.value / defaultValue / onValueChange',
      'input text and cancellable Base UI callback',
      'Base UI managed',
    ],
    ['Root.mode', 'list | both | inline | none', 'list'],
    [
      'Root.items / filteredItems / filter',
      'flat/grouped suggestions; caller-owned remote results',
      '—',
    ],
    [
      'Root.itemToStringValue',
      'object to display/input text',
      'automatic for {label,value}',
    ],
    ['Root.submitOnItemClick', 'submit when a suggestion is chosen', 'false'],
    [
      'Content.side / align / sideOffset / collisionPadding',
      'popup placement',
      'sideOffset=6',
    ],
    [
      'Root.name / form / required / disabled / readOnly',
      'native form ownership, reset, and validation',
      'Base UI semantics',
    ],
  ],
}
