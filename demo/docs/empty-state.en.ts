import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Explain why there's nothing to show and offer possible next steps. Distinguish first use, no search results, and insufficient permissions. When other content is present, show the state in the relevant region instead of replacing the whole screen.",
  avoid:
    "Don't present an error as an empty success state. Use InlineMessage instead. Don't prompt people to create something they lack permission for. Don't make an action they can't perform the primary button. Offer permission guidance instead.",
  anatomy:
    'Root → optional decorative Icon + Title(h3) + Description + Actions',
  keyboard:
    "It doesn't take focus or create a live region. Set Title.level to fit the surrounding heading hierarchy. Offer clearing a search, creating an item, and permission guidance as clearly named buttons or links.",
  tokens: [
    '--surf-space-6',
    '--surf-space-4',
    '--surf-ink-body',
    '--surf-ink-muted',
  ],
  code: `import { EmptyState, Button } from '@surflane/ui'

<EmptyState.Root>
  <EmptyState.Title>No matching environments</EmptyState.Title>
  <EmptyState.Description>
    Try another name or clear the filters.
  </EmptyState.Description>
  <EmptyState.Actions>
    <Button onClick={clearFilters}>Clear filters</Button>
  </EmptyState.Actions>
</EmptyState.Root>`,
  props: [
    ['Root', 'native div props; no automatic role or focus', '—'],
    ['Title', 'native heading props + level (2–6)', 'h3'],
    ['Icon', 'native div props; set aria-hidden on a decorative SVG', '—'],
    ['Description / Actions', 'native p / div props', '—'],
  ],
}
