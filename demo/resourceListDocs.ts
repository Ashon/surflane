import type { ComponentDoc } from './componentDocs'
export const resourceListDocs: Record<string, ComponentDoc> = {
  'resource-list': {
    usage:
      "Places a related resource's title, secondary information, status, selection, and actions in one row. Reuses the existing List slots, with default padding of 12px vertical and 16px horizontal and 8px between rows. Title links and per-row actions are separate, and long identifiers wrap. The Checkbox carries the selection semantics, and Item.selected only adds visual emphasis to the whole surface.",
    avoid:
      "Don't turn an li into a clickable fake button or a listbox. Don't nest a Checkbox/Menu inside the title link, and don't convey results through status color alone. Don't silently clear selections hidden by a search, or blur select-all between the visible rows and the full dataset. The product decides server requests, permissions, page navigation, and the validity of selected IDs.",
    anatomy:
      'FilterBar → result summary + optional visible-selection controls → List.Root(ul) → Item(li) → Checkbox + Content(Title link + Description) + Actions(StatusBadge + Menu)',
    keyboard:
      "The normal Tab order visits the selection checkbox, the title link, and the actions menu. Space toggles a Checkbox, and menus use Base UI's arrow keys and Enter/Escape. Closing a menu returns focus to that row's trigger. Links keep the browser's open-in-new-tab and back behavior. After clearing a selection or recovering from an error, focus returns to the remaining search input. Loading, error, restricted access, first-use empty, and no search results each get their own message.",
    tokens: [
      '--space-2',
      '--space-3',
      '--space-4',
      '--radius-md',
      '--selected',
      '--interaction-hover-bg',
      '--ink-body',
      '--ink-muted',
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
  },
}
