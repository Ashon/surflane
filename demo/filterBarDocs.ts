import type { ComponentDoc } from './componentDocs'
export const filterBarDocs: Record<string, ComponentDoc> = {
  'filter-bar': {
    usage:
      "Aligns search, category, and status filters on a shared baseline and connects the applied criteria to the result count. Small lists that apply instantly are derived from controlled state, and the Clear action returns focus to the search input. The catalog's own component and pattern indexes also use this pattern.",
    avoid:
      "Primitives don't handle server requests, URL routing, or permissions automatically. For server search, apply the query with a delay after IME composition ends or require an explicit submit, and cancel earlier requests or check response order. Provide aria-busy for loading results, retry with preserved input for failures, and an explanation for permission limits. Don't show server loading as an empty result.",
    anatomy:
      'FilterBar.Root(named search form) → Controls → Field(label + Input/Select) + Actions; optional applied-filter buttons and Summary(status). Results remain outside the form.',
    keyboard:
      "Inputs use standard editing keys, and Select's arrow keys and Enter/Escape are delegated to Base UI. Root doesn't intercept submit or reset, so the caller wires onSubmit/onReset. In instant-apply mode, call preventDefault so Enter doesn't reload the page. When a chip is removed, focus moves to the remaining input. Result announcements update only a text summary and don't read the whole list as a live region.",
    tokens: [
      '--space-2',
      '--space-4',
      '--control-height',
      '--ink-muted',
      '--type-caption-size',
      '--type-caption-leading',
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
        'native form events; state and requests controlled by caller',
        'native behavior',
      ],
      ['Field.width', 'search (2× flexible basis) | filter', 'filter'],
      [
        'Field.htmlFor',
        'optional explicit label association',
        'implicit label',
      ],
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
  },
}
