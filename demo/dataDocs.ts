import type { ComponentDoc } from "./componentDocs";
export const dataDocs: Record<string, ComponentDoc> = {
  table: {
    usage:
      "Use it to compare relationships across rows and columns. Build a real table, caption, th scope=col/row, and td inside a named scroll region. The calling screen owns sorting, search, and selection state.",
    avoid:
      "Don't add a grid role or cell arrow-key navigation to an ordinary table. Don't rely on whole-row clicks; provide links, buttons, and checkboxes. selected is a visual state; the checkbox carries the selection semantics.",
    anatomy:
      "Container(ScrollArea) → Root(table) → Caption + Head(Row/HeaderCell) + Body(Row/Cell)",
    keyboard:
      "Tab moves through sort buttons, row selection, and actions. Update aria-sort on the sorted header. On small screens, focus goes to the labeled region, which scrolls horizontally. Rows themselves aren't focus targets.",
    tokens: [
      "--space-3",
      "--space-4",
      "--radius-md",
      "--interaction-hover-bg",
      "--selected",
    ],
    code: 'import { Table } from "@surflane/ui";\n\n<Table.Container label="Environment comparison">\n  <Table.Root>\n    <Table.Caption>Registered environments</Table.Caption>\n    <Table.Head><Table.Row>\n      <Table.HeaderCell scope="col">Name</Table.HeaderCell>\n      <Table.HeaderCell scope="col">Services</Table.HeaderCell>\n    </Table.Row></Table.Head>\n    <Table.Body><Table.Row>\n      <Table.HeaderCell scope="row">DEMO main</Table.HeaderCell>\n      <Table.Cell>3</Table.Cell>\n    </Table.Row></Table.Body>\n  </Table.Root>\n</Table.Container>',
    props: [
      ["Container.label", "accessible scroll-region name", "required"],
      [
        "Root / Caption / Head / Body / Foot",
        "native table element props",
        "—",
      ],
      [
        "HeaderCell.scope / aria-sort",
        "native header relationships and sort state",
        "caller supplied",
      ],
      [
        "Row.selected",
        "visual selection; use named checkbox for semantics",
        "false",
      ],
      ["Cell.colSpan / headers", "native table-cell attributes", "—"],
    ],
  },
  list: {
    usage:
      "Displays a repeated set of independent resources or history entries. Body text goes in Content, and status and actions go in Actions, with 16px horizontal and 12px vertical padding inside the hover surface.",
    avoid:
      "Don't repeat dividers or nest cards. Don't rely on whole-item clicks; use links and buttons to convey purpose. List is not a Listbox selection widget.",
    anatomy:
      "Root(ul role=list) → Item(li) → Content(Title + Description) + Actions",
    keyboard:
      "Keeps the native list structure and puts only the inner actions in the Tab order. On small screens, the actions move to the next line.",
    tokens: ["--space-3", "--space-4", "--radius-md", "--interaction-hover-bg"],
    code: 'import { List, Button } from "@surflane/ui";\n\n<List.Root aria-label="Registered environments">\n  <List.Item>\n    <List.Content>\n      <List.Title>DEMO main</List.Title>\n      <List.Description>3 discovered services</List.Description>\n    </List.Content>\n    <List.Actions><Button variant="outline">Inspect DEMO main</Button></List.Actions>\n  </List.Item>\n</List.Root>',
    props: [
      ["Root", "native ul props; semantic role=list", "—"],
      ["Item", "native li props", "—"],
      [
        "Item.selected",
        "visual row selection; Checkbox carries checked semantics",
        "false",
      ],
      ["Content / Title / Actions", "native div props", "—"],
      ["Description", "native p props", "—"],
    ],
  },
  "inline-message": {
    usage:
      "Explains a notice, error, or warning about the current task in terms of its cause and next step. Static messages don't create a live region; announce only asynchronous changes, with role=status or, when urgent, role=alert.",
    avoid:
      "Don't distinguish states by color alone. Don't announce every message as an alert on page load. Don't imply that retrying guarantees a real result.",
    anatomy: "Root(tone) → Icon(tone) + Content(Title + Description + Actions)",
    keyboard:
      "The message doesn't steal focus. Action buttons follow standard keyboard behavior. The icon is decorative; the title and description convey the status. The caller sets Root's role.",
    tokens: [
      "--status-danger-bg",
      "--status-danger-fg",
      "--status-caution-bg",
      "--status-success-bg",
      "--radius-md",
      "--space-4",
    ],
    code: 'import { InlineMessage, Button } from "@surflane/ui";\n\n<InlineMessage.Root tone="danger">\n  <InlineMessage.Icon tone="danger" />\n  <InlineMessage.Content>\n    <InlineMessage.Title>Discovery failed</InlineMessage.Title>\n    <InlineMessage.Description>Check the connection and retry.</InlineMessage.Description>\n    <InlineMessage.Actions><Button onClick={retry}>Retry</Button></InlineMessage.Actions>\n  </InlineMessage.Content>\n</InlineMessage.Root>',
    props: [
      [
        "Root.tone / Icon.tone",
        "neutral | success | danger | caution | progress",
        "neutral",
      ],
      [
        "Root.role",
        "native role; choose live announcements intentionally",
        "none",
      ],
      ["Icon.children", "custom decorative icon", "semantic status SVG"],
      ["Title / Description / Actions", "strong / p / div native props", "—"],
    ],
  },
  "empty-state": {
    usage:
      "Distinguishes a first-use state, no search results, and insufficient permissions, and explains why along with possible next steps. When existing content is present, show the state in the relevant region instead of replacing the whole screen.",
    avoid:
      "Don't present an error as an empty success state. Don't prompt users to create something they lack permission for, or make an action they can't perform the primary button.",
    anatomy:
      "Root → optional decorative Icon + Title(h3) + Description + Actions",
    keyboard:
      "There's no automatic focus or live region. Set Title.level to fit the surrounding heading hierarchy. Express clearing a search, creating an item, and permission guidance as clear buttons or links.",
    tokens: ["--space-6", "--space-4", "--ink-body", "--ink-muted"],
    code: 'import { EmptyState, Button } from "@surflane/ui";\n\n<EmptyState.Root>\n  <EmptyState.Title>No matching environments</EmptyState.Title>\n  <EmptyState.Description>Try another name or clear the filters.</EmptyState.Description>\n  <EmptyState.Actions><Button onClick={clearFilters}>Clear filters</Button></EmptyState.Actions>\n</EmptyState.Root>',
    props: [
      ["Root", "native div props; no automatic role or focus", "—"],
      ["Title", "native heading props + level (2–6)", "h3"],
      ["Icon", "native div props; mark decorative SVG aria-hidden", "—"],
      ["Description / Actions", "native p / div props", "—"],
    ],
  },
};
