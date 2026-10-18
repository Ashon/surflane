import type { ComponentDoc } from './componentDocs'
export const inputExtensionDocs: Record<string, ComponentDoc> = {
  autocomplete: {
    usage:
      "Offers suggestions for search and tag inputs that don't require a selection. Typed text is valid even without a matching suggestion, and Root.value is the input string, not a selected ID.",
    avoid:
      "Use Combobox when users must pick a registered resource. Don't treat text that isn't in the suggestions as an error, and don't submit the form unannounced right after a selection.",
    anatomy:
      'Root → Field(label/description/error) + InputGroup(Input/Clear/Trigger) + Content(Empty/Status + List/Item)',
    keyboard:
      "Typing narrows the suggestions, and arrow keys and Enter complete the text. Escape and Tab close the popup. By default, selecting an item doesn't submit the form. Base UI types for non-string object suggestions and grouped items are preserved.",
    tokens: [
      '--control-height',
      '--control-radius',
      '--menu-background',
      '--menu-hover-background',
      '--layer-popup',
    ],
    code: 'import { Autocomplete, Field } from "@surflane/ui";\n\n<Field.Root name="query">\n  <Field.Label>Pipeline search</Field.Label>\n  <Autocomplete.Root name="query" items={suggestions}>\n    <Autocomplete.InputGroup>\n      <Autocomplete.Input placeholder="Search scenarios…" />\n      <Autocomplete.Clear /><Autocomplete.Trigger />\n    </Autocomplete.InputGroup>\n    <Autocomplete.Content>\n      <Autocomplete.Empty>No suggestions. Free text is accepted.</Autocomplete.Empty>\n      <Autocomplete.List>{(item: string) => (\n        <Autocomplete.Item key={item} value={item}>{item}</Autocomplete.Item>\n      )}</Autocomplete.List>\n    </Autocomplete.Content>\n  </Autocomplete.Root>\n  <Field.Error />\n</Field.Root>',
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
      ['Content.positionerProps', 'popup placement options', 'sideOffset=6'],
      [
        'Root.name / form / required / disabled / readOnly',
        'native form ownership, reset and validation',
        'Base UI semantics',
      ],
    ],
  },
  slider: {
    usage:
      'Use it to adjust an approximate value or range within bounds. Show the value with its unit, and pair it with a NumberField for precise adjustment.',
    avoid:
      "Don't make dragging the only way to do tasks where exact values matter. Don't give both thumbs of a range the same name, and don't convey the current value with color alone.",
    anatomy:
      'Root → Label + Value + Control(Track/Indicator + one or more Thumbs)',
    keyboard:
      "Tab moves to each Thumb's range input. Arrow keys move by step, PageUp/PageDown by largeStep, and Home/End to the bounds. Give each range thumb its own name and unit. The default thumbAlignment=edge keeps thumbs inside the control. Form reset restores only uncontrolled values and preserves controlled values and canceled resets.",
    tokens: [
      '--brand',
      '--ink-muted',
      '--ink-body',
      '--canvas',
      '--interaction-focus',
      '--radius-full',
    ],
    code: 'import { Slider } from "@surflane/ui";\n\n<Slider.Root name="workers" defaultValue={3} min={1} max={16}>\n  <Slider.Label>Parallel workers</Slider.Label>\n  <Slider.Value>{(_, values) => `${values[0]} workers`}</Slider.Value>\n  <Slider.Control>\n    <Slider.Track><Slider.Indicator /></Slider.Track>\n    <Slider.Thumb getAriaValueText={(_, value) => `${value} workers`} />\n  </Slider.Control>\n</Slider.Root>',
    props: [
      [
        'Root.value / defaultValue',
        'number or readonly number[] with preserved generics',
        'min when omitted',
      ],
      [
        'Root.min / max / step / largeStep',
        'numeric bounds and keyboard increments',
        '0 / 100 / 1 / 10',
      ],
      [
        'Root.orientation / thumbAlignment',
        'horizontal | vertical / center | edge | edge-client-only',
        'horizontal / edge',
      ],
      [
        'Root.minStepsBetweenValues / thumbCollisionBehavior',
        'minimum range separation / push | swap | none',
        '0 / push',
      ],
      [
        'Root.onValueChange / onValueCommitted',
        'cancellable change / completed interaction callbacks',
        '—',
      ],
      [
        'Root.name / form / disabled',
        'native form ownership and disabled state',
        '—',
      ],
      [
        'Thumb.index / aria-label / getAriaValueText',
        'range thumb order, accessible name and units',
        'caller supplied for ranges',
      ],
    ],
  },
}
