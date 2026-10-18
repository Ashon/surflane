import type { ComponentDoc } from './componentDocs'
export const commandSearchDocs: Record<string, ComponentDoc> = {
  'command-search': {
    usage:
      "A quick-navigation pattern combining Dialog, an inline Combobox, and ScrollArea. It takes destinations from the catalog registry, searches whitespace-separated words in names, descriptions, and categories, and supports both Hangul and Latin text. Planned items are marked Planned and can't be selected. A local theme change command is also offered as a separate action. The page shortcut is active only while the example is mounted.",
    avoid:
      "Don't make command search the only navigation path. Don't intercept shortcuts in input fields, during IME composition, or in other modals. Don't run destructive actions from a search selection alone; route them through a confirmation flow. The product manages real permissions, the search server, limits for large data, and storage of personal data and recent searches. The example searches only the local registry and doesn't call accounts or services.",
    keyboard:
      "Opens with Ctrl+K or ⌘K and with the button, and focuses the input. Up/Down arrow keys and Enter follow Base UI Combobox's active-item rules. Planned items are skipped. Escape or closing returns focus to the open button, and after a page is chosen the existing router manages the destination heading and scroll. The theme action runs on the current page and returns focus to the open button. Tab stays inside the Dialog.",
    anatomy:
      'Trigger / scoped shortcut → Dialog(Title, Description) → Combobox.Input → result count + ScrollArea(Empty, List, disabled/planned Item) → route or local command',
    tokens: [
      '--space-3',
      '--space-4',
      '--ink-muted',
      '--canvas',
      '--control-focus',
      '--selected',
    ],
    code: `import {Combobox, Dialog, ScrollArea} from "@surflane/ui";\n\n<Combobox.Root inline open={open} onOpenChange={setOpen}\n  items={commands} filter={matches} value={null} autoHighlight\n  onValueChange={executeAllowedCommand}>\n  <Dialog.Root open={open} onOpenChange={setOpen}>\n    <Dialog.Trigger>Search documentation</Dialog.Trigger>\n    <Dialog.Content initialFocus={inputRef}>\n      <Dialog.Title>Command search</Dialog.Title>\n      <Dialog.Description>Choose a destination or command.</Dialog.Description>\n      <Combobox.Input ref={inputRef} aria-label="Search pages and actions" />\n      <ScrollArea orientation="vertical" label="Command results">\n        <Combobox.Empty>No results.</Combobox.Empty>\n        <Combobox.List>{command => <Combobox.Item\n          value={command} disabled={!command.allowed}>{command.label}</Combobox.Item>}\n        </Combobox.List>\n      </ScrollArea>\n    </Dialog.Content>\n  </Dialog.Root>\n</Combobox.Root>\n\n// Share open state; preserve destination focus after modal dismissal.\n// Guard repeated execution and unregister route-scoped keyboard handlers.\n// Permission checks and destructive-action confirmation belong to the product.`,
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
  },
}
