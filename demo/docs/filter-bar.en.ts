import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Align search, category, and status filters on a shared baseline. Tie the applied criteria to the result count. Derive small, instantly applied lists from controlled state. Clearing returns focus to the search input. The catalog's own component and pattern indexes use this pattern.",
  avoid: [
    "Don't expect the primitives to handle server requests, URL routing, or permissions. Wire them yourself.",
    "Don't send a server search on every keystroke. Apply the query after a delay once IME composition ends, or require an explicit submit.",
    "Don't let an earlier response overwrite a later one. Cancel earlier requests or check response order.",
    "Don't show server loading as an empty result. Mark loading results with aria-busy.",
    "Don't clear the input when a request fails. Keep it and offer retry.",
    "Don't hide permission limits. Explain them.",
  ],
  anatomy:
    'FilterBar.Root(named search form) → Controls → Field(label + Input/Select) + Actions; optional applied-filter buttons and Summary(status). Results remain outside the form.',
  keyboard: [
    "Inputs use standard editing keys. Base UI handles Select's arrow keys, Enter, and Escape.",
    "Root doesn't intercept submit or reset, so the caller wires onSubmit and onReset. In instant-apply mode, call preventDefault so Enter doesn't reload the page.",
    'Removing an applied filter moves focus to the remaining input.',
    'Result announcements update only the text summary. The whole list is never a live region.',
  ],
  tokens: [
    '--surf-space-2',
    '--surf-space-4',
    '--surf-control-height',
    '--surf-ink-muted',
    '--surf-type-caption-size',
    '--surf-type-caption-leading',
  ],
  code: `import { FilterBar, Input, Select, Button } from '@surflane/ui'

<FilterBar.Root
  label='Filter resources'
  onSubmit={(e) => e.preventDefault()}
  onReset={(e) => {
    e.preventDefault()
    resetFilters()
  }}
>
  <FilterBar.Controls>
    <FilterBar.Field width='search'>
      Search
      <Input
        type='search'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </FilterBar.Field>
    <FilterBar.Field>
      State
      <Select
        aria-label='Resource state'
        value={state}
        onValueChange={setState}
        options={states}
      />
    </FilterBar.Field>
    <FilterBar.Actions>
      <Button type='reset'>Clear filters</Button>
    </FilterBar.Actions>
  </FilterBar.Controls>
  <FilterBar.Summary>{count} results</FilterBar.Summary>
</FilterBar.Root>`,
  props: [
    ['Root.label', 'required accessible search landmark name', 'required'],
    [
      'Root.onSubmit / onReset',
      'native form events; caller controls state and requests',
      'native behavior',
    ],
    [
      'Field.width',
      "search takes the room left in the row | filter keeps 12rem and doesn't grow. On a phone every field fills its row.",
      'filter',
    ],
    ['Field.htmlFor', 'optional explicit label association', 'implicit label'],
    [
      'Summary',
      'polite status; aria-atomic=true, attributes overridable',
      'div',
    ],
    [
      'Controls / Actions',
      'wrapping layout slots; native div attributes and refs',
      'div',
    ],
  ],
}
