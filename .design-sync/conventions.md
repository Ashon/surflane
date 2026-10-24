# Building with Surflane

Surflane is a React design system for consoles, dashboards and developer tools. Every component is on `window.Surflane`. In code, import it from `'@surflane/ui'`.

## Setup

- `styles.css` carries the tokens, fonts and every component's CSS. No provider is needed for styling.
- Tokens default to the **dark** theme. For a light page, set `document.documentElement.dataset.theme = 'light'` before the first render. `data-theme="dark"` or `"light"` on any element scopes that theme to its subtree; other values are ignored.
- Add the class `surf-typography` to `<body>`, so text outside components uses the brand font. Without it, plain text falls back to the browser's serif.
- Density: wrap a region in `<SizeProvider size="small">` (or `default`, `large`). Most components also take `size`.

## Compose with components, not CSS

- **Layout:** use these components rather than writing flex or grid CSS.
  - `Container` (`width`: `workspace`, `reading`, `wide`, `full`).
  - `Stack` and `Inline` (`gap`: 0–20 on the space scale; `Inline justify="between"`).
  - `Grid` (`columns`: 1–4).
- **Hierarchy comes from planes**, then elevation, then borders. Group content on `Surface` (`surface`: `canvas` or `subtle`, plus `padding`) or `Card`, not on a bordered box.
- **Type:**
  - `Heading` takes `level` and `size`: `page`, `section`, `subsection`, `title`.
  - `Text` takes `variant`: `body`, `caption`, `label`, `table`, `reading`, `mono`, `metric`.
  - It also takes `color` (`primary`, `secondary`, `muted`) and `weight` (`regular`, `medium`).
- **Actions:** `Button`'s `variant` is one of these:
  - `primary`, the default: one key action per area.
  - `secondary` and `outline` for supporting actions.
  - `ghost`, `destructive` and `link`.
  - Sizes are `small`, `default`, `large`, and `icon` for square icon buttons.
- **Status:** `StatusBadge` and `Badge` take `tone`: `success`, `caution`, `danger`, `info`, `progress`, `neutral`. Status shows text and an icon, never color alone.
- **Compound parts:** components use dot notation, such as `Dialog.Root` › `Dialog.Trigger` › `Dialog.Content`, or `Table.Root` › `Table.Head` › `Table.Row` › `Table.HeaderCell`. Read each component's `.prompt.md` for its parts.

## Your own glue CSS

When a layout needs CSS the components don't give, use the tokens through `var(--surf-*)`:

- **Planes:** `--surf-canvas` and `--surf-surface`.
- **Text:** `--surf-ink`, `--surf-ink-body`, `--surf-ink-muted`.
- **Lines and accent:** `--surf-line` for lines, `--surf-brand` for the accent.
- **Space and corners:** `--surf-space-1` … `--surf-space-20`, and `--surf-radius-sm`, `-md`, `-lg`, `-sheet`, `-pill`.
- **Type:** `--surf-type-body-size`, `--surf-type-caption-size`, `--surf-type-section-size`.
- **Status:** `--surf-status-success-fg`, `-bg`, `-border`, and the same for each tone.

Never restyle the `surf-*` classes: they are the components' internals.

## Where the truth lives

- `styles.css` imports `tokens/tokens.css` (every token, in both themes) and `_ds_bundle.css`.
- Each component has a `.prompt.md` (usage, parts, keyboard) and a `.d.ts` (props).

## Example

```tsx
<Container width="workspace">
  <Stack gap={6}>
    <PageHeader
      title="Deployments"
      description="Services across production and staging."
      actions={<Button>New deployment</Button>}
    />
    <Table.Root variant="lined">
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell scope="col">Service</Table.HeaderCell>
          <Table.HeaderCell scope="col">p95 (ms)</Table.HeaderCell>
          <Table.HeaderCell scope="col">Status</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>checkout-api</Table.Cell>
          <Table.Cell numeric>184</Table.Cell>
          <Table.Cell><StatusBadge tone="success">Healthy</StatusBadge></Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  </Stack>
</Container>
```
