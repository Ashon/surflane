import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage: [
    "Use a resource list to keep one resource's title, secondary information, status, selection, and actions in one row. Build it from the existing List slots.",
    'Keep title links and per-row actions separate.',
    'The Checkbox carries the selection semantics. List.Item.selected only adds visual emphasis to the whole surface.',
    'Default padding is 12px vertical and 16px horizontal, with 8px between rows. Long identifiers wrap.',
  ],
  avoid: [
    "Don't turn an li into a fake clickable button or a listbox. Use the title link and per-row actions.",
    "Don't nest a Checkbox or Menu inside the title link. Keep each in its own slot.",
    "Don't convey results through status color alone. Name each status in text.",
    "Don't silently clear selections hidden by a search. Retain the hidden IDs.",
    "Don't leave the scope of select-all ambiguous. Make clear whether it covers the visible rows or the full dataset.",
    "Don't expect the primitives to handle server requests, permissions, page navigation, or the validity of selected IDs. The product owns them.",
  ],
  anatomy:
    'FilterBar → result summary + optional visible-selection controls → List.Root(ul) → Item(li) → Checkbox + Content(Title link + Description) + Actions(StatusBadge + Menu)',
  keyboard: [
    'Tab visits the selection checkbox, the title link, and the actions menu, in that order.',
    "Menus use Base UI's arrow keys, Enter, and Escape. Closing a menu returns focus to that row's trigger.",
    "Space toggles a Checkbox. Links keep the browser's open-in-new-tab and back behavior.",
    'Clearing a selection or recovering from an error returns focus to the remaining search input.',
    'Loading, error, restricted access, first-use empty, and no search results each get their own message.',
  ],
  tokens: [
    '--surf-space-2',
    '--surf-space-3',
    '--surf-space-4',
    '--surf-radius-md',
    '--surf-selected',
    '--surf-interaction-hover-bg',
    '--surf-ink-body',
    '--surf-ink-muted',
  ],
  code: `import { List, Checkbox, StatusBadge, Menu } from '@surflane/ui'

<List.Root aria-label='Registered resources'>
  {resources.map((resource) => (
    <List.Item key={resource.id} selected={selected.has(resource.id)}>
      <Checkbox.Root
        aria-label={\`Select \${resource.name}\`}
        checked={selected.has(resource.id)}
        onCheckedChange={(value) => select(resource.id, value)}
      >
        <Checkbox.Indicator />
      </Checkbox.Root>
      <List.Content>
        <List.Title>
          <a href={resource.href}>{resource.name}</a>
        </List.Title>
        <List.Description>{resource.description}</List.Description>
      </List.Content>
      <List.Actions>
        <StatusBadge tone='success'>Ready</StatusBadge>
        <Menu.Root>
          <Menu.Trigger aria-label={\`Actions for \${resource.name}\`}>
            Actions
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Content>
              <Menu.Item onClick={() => inspect(resource.id)}>
                Inspect
              </Menu.Item>
            </Menu.Content>
          </Menu.Portal>
        </Menu.Root>
      </List.Actions>
    </List.Item>
  ))}
</List.Root>`,
  props: [
    [
      'List.Root',
      'native ul attributes; supply an accessible collection name',
      'ul, role=list',
    ],
    [
      'List.Item.selected',
      'visual selection only; Checkbox carries checked state',
      'false',
    ],
    [
      'Content / Title / Description / Actions',
      'existing List slots and native attributes/refs',
      'div / div / p / div',
    ],
    [
      'Checkbox / Menu / StatusBadge',
      'existing public primitive APIs; permissions remain caller-controlled',
      'composed',
    ],
    [
      'Selection scope',
      'example selects visible editable resources and retains hidden IDs',
      'caller-owned',
    ],
    [
      'Loading / error / permission / empty',
      'explicit result branches; async request lifecycle remains caller-owned',
      'caller-owned',
    ],
  ],
}
