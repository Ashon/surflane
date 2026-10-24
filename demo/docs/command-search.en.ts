import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage: [
    'Use command search for quick navigation. Build it from Dialog, an inline Combobox, and ScrollArea.',
    'Search matches whitespace-separated words in names, descriptions, and categories, in Hangul or Latin text.',
    "Planned items carry a Planned label and can't be selected.",
    'The example draws destinations from the catalog registry and adds a local theme command as a separate action.',
    'The page shortcut works only while the example is mounted.',
  ],
  avoid: [
    "Don't make command search the only way to navigate. Keep regular navigation alongside it.",
    "Don't intercept shortcuts in input fields, during IME composition, or in other modals. Let those keys reach the focused field or modal.",
    "Don't run a destructive action from a search selection alone. Route it through a confirmation flow.",
    "Don't expect the primitives to handle real permissions, the search server, limits for large data, or storage of personal data and recent searches. The product owns them.",
    'The example searches only the local registry and calls no accounts or services.',
  ],
  keyboard: [
    'Ctrl+K, ⌘K, or the button opens search and focuses the input. Tab stays inside the Dialog.',
    "Up Arrow, Down Arrow, and Enter follow Base UI Combobox's active-item rules. Planned items are skipped.",
    'After a page is chosen, the router manages the destination heading and scroll. The theme action runs on the current page and returns focus to the open button.',
    'Escape or closing returns focus to the open button.',
  ],
  anatomy:
    'Trigger / scoped shortcut → Dialog(Title, Description) → Combobox.Input → result count + ScrollArea(Empty, List, disabled/planned Item) → route or local command',
  tokens: [
    '--surf-space-3',
    '--surf-space-4',
    '--surf-ink-muted',
    '--surf-canvas',
    '--surf-control-focus',
    '--surf-selected',
  ],
  code: `import { Combobox, Dialog, ScrollArea } from '@surflane/ui'

<Combobox.Root
  inline
  open={open}
  onOpenChange={setOpen}
  items={commands}
  filter={matches}
  value={null}
  autoHighlight
  onValueChange={executeAllowedCommand}
>
  <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger>Search documentation</Dialog.Trigger>
    <Dialog.Content initialFocus={inputRef}>
      <Dialog.Title>Command search</Dialog.Title>
      <Dialog.Description>Choose a destination or command.</Dialog.Description>
      <Combobox.Input ref={inputRef} aria-label='Search pages and actions' />
      <ScrollArea orientation='vertical' label='Command results'>
        <Combobox.Empty>No results.</Combobox.Empty>
        <Combobox.List>
          {(command) => (
            <Combobox.Item value={command} disabled={!command.allowed}>
              {command.label}
            </Combobox.Item>
          )}
        </Combobox.List>
      </ScrollArea>
    </Dialog.Content>
  </Dialog.Root>
</Combobox.Root>

// Share open state; preserve destination focus after modal dismissal.
// Guard repeated execution and unregister route-scoped keyboard handlers.
// Permission checks and destructive-action confirmation belong to the product.`,
  props: [
    [
      'Source',
      'catalog registry destinations + local theme action',
      'caller-owned',
    ],
    [
      'Matching',
      'NFKC, case-insensitive, all whitespace-separated terms in name/summary/category',
      'local',
    ],
    [
      'Unavailable result',
      'Planned label, disabled option, no action',
      'registry stage',
    ],
    [
      'Shortcut',
      'Ctrl+K / Meta+K; ignore inputs, IME, repeats, other modals',
      'mounted route only',
    ],
    [
      'Selection',
      'one execution per opening; close before routing; clear query on reopen',
      'controlled',
    ],
    [
      'Focus',
      'cancel/action → trigger; navigation → destination heading',
      'Dialog + router',
    ],
  ],
}
