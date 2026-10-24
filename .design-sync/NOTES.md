# design-sync notes for Surflane

## Setup

- Package shape. There is no Storybook; the catalog (`demo/`, surflane.page) is the documentation.
- Run the converter from the repo root with `--node-modules ./node_modules --entry ./packages/ui/dist/index.js`. The workspace package lives in `packages/ui`. Without `--entry` the package dir resolves to the `node_modules/@surflane/ui` symlink, and the package-relative config paths (`../../node_modules/...`, `../../.design-sync/...`) miss.
- `buildCmd` builds the packages, writes the catalog's Markdown (`build:llms`), then runs `.design-sync/prepare.mjs`. `prepare.mjs` does two things:
  - It copies each component, pattern and foundation page's Markdown into `.design-sync/.cache/docs/` with the catalog group as frontmatter `category`. That is the card grouping. The public Markdown stays unchanged.
  - It bundles `@surflane/ui/all.css` (with its imports inlined) into `packages/ui/.design-sync-css/surflane.css`. That file is `cssEntry`: design-sync copies it verbatim, and the file must sit inside the package. `all.css` itself is only `@import`s.
- `tokensGlob: "*tokens.css"` ships only the token definitions (`tokens.css` and `foundation-tokens.css`). The bundle already carries the rest. The default copied `tailwind.css`/`shadcn.css` and split files whose subfolder `@import`s break.
- `componentSrcMap` holds 343 nulls:
  - 337 are the flat aliases every compound exports for React Server Components (`DialogTrigger` = `Dialog.Trigger`).
  - 6 are non-visual exports: Slot, DirectionProvider, TooltipProvider, NativeSelectOption/OptGroup, GridItem.
  - Regenerate the alias list when a compound gains a part. The rule: a name N is an alias when a compound C exported from the root has `C[N.slice(C.length)] === root[N]`.
- The non-null `componentSrcMap` entries add the subpath-only components: Chart, DatePicker, DateRangePicker, TimeField, Markdown and Tree. `extraEntries` merges `@surflane/ui/{chart,date-picker,markdown,tree}` into `window.Surflane`. `@surflane/ui/syntax-highlighting` (shiki) is left out on purpose: it would add every grammar to the bundle. CodeBlock renders unhighlighted without it.
- `@surflane/ui/package.json` gained a top-level `types`. design-sync's `.d.ts` discovery reads `types`/`typings`, never `exports`.

## Previews

- Every preview starts with the host setup the install guide gives:
  ```ts
  document.documentElement.dataset.theme = 'light'
  document.body.classList.add('surf-typography')
  ```
  Surflane's default theme is dark (`:root`). On the card's white body a dark theme reads as light text on white. `surf-typography` gives body text the brand font; without it, text outside components falls back to the browser's serif.
- Import everything from `'@surflane/ui'`, including Chart, DatePicker, Markdown and Tree. The preview shim maps that package to `window.Surflane`, which carries the subpath entries too.
- Overlays render open in a `cardMode: "single"` card with a viewport, set in `cfg.overrides`. Open them statically with `defaultOpen` on the Root.

## Known render warns

- `[FONT_MISSING] "Pretendard", "Apple SD Gothic Neo"` are fallback names in the Hangul stack. The first family, 'Pretendard Variable', ships in `fonts/`.
- `[TOKENS_MISSING]`: 21 variables (`--anchor-width`, `--available-height`, `--active-tab-*`, `--accordion-panel-height`, …) are set at runtime by Base UI.

## Preview authoring (folded from the first sync's six batches)

- **Capture and card sizes:**
  - Each cell is captured at 900x700; anything past 700px is cut, so split long stories.
  - A single card shows the alphabetically first export unless `primaryStory` is set, so name the canonical story to sort first (`Default`) or pin it.
  - Surflane switches to the touch scheme at `max-width: 760px` (44px rows, 16px field text). Keep card viewports 800px or wider, or cards show phone density.
- **Layout:**
  - `Grid columns={3|4}` shows 2 columns below 1100px, so the Grid card needs a 1200px viewport.
  - Container's workspace (75rem) and wide (96rem) widths need a 1600px viewport to tell apart.
  - `Inline` centers items vertically; use `alignItems: 'flex-start'` for uneven stacks.
  - Input and Select fill their row.
- **Surfaces and contrast:**
  - Skeletons and `Card surface='canvas'` vanish on a same-tone surface. Preview skeletons on the sheet, and a canvas card on a subtle Surface.
  - Prose leaves `blockquote` unstyled.
- **Opening overlays and popups statically:**
  - Dialog family: `defaultOpen`, plus `initialFocus` on the first field (or the safe cancel button for AlertDialog), so focus doesn't put a heavy ring on the close X.
  - Menu: `SubmenuRoot defaultOpen` works; put the parent trigger at the row's start so the submenu opens rightward.
  - ContextMenu: `defaultOpen` puts the menu at the card's corner, so dispatch a synthetic contextmenu on the trigger at mount.
  - Tooltip: has no open prop, so focus the trigger on mount.
  - Combobox and Autocomplete: `defaultOpen`.
  - NavigationMenu: `Root.defaultValue` (needs Portal > Positioner > Popup > Viewport).
  - Menubar: `Menu.Root defaultOpen`.
  - Toast: render `Toast.Provider` and `Toast.Viewport` without a Portal; add toasts in a mount effect with `timeout: 0`.
  - Select: no `open` passthrough (a package gap), so its card is a column of closed states.
  - NativeSelect: can't open; vary by layout and state.
- **Component quirks:**
  - FileUpload: rows render from `defaultFiles` (`new File([...], name, { type })`); a no-op `transport` shows the per-file Upload button. Errors come only through `Form errors`.
  - Field: `Field.Root invalid` with `Field.Error match`, or `Form errors={{ name }}` with a bare `Field.Error`.
  - BottomNavigation: `visible='always' position='static'` renders it inside a cell.
  - AppShell: needs a container with an explicit height.
  - Sparkline: fills its container; size it with `style={{ inlineSize: 200 }}`.
  - Stat: several Stats wrap in an Inline, so use a 2-column Grid.
  - Pagination: collapses to a summary below 560px.
  - SyntaxHighlighter: without shiki, a mono block with no token colors (CodeBlock and Markdown fences too). `inline` is for a pre the caller owns, and `style` goes to `<code>`.
  - TimeField and DatePicker values need `Time`/`CalendarDate`. `@internationalized/date` is now in `extraEntries`, so those constructors are on `window.Surflane`.
- **Types:** the emitted `.d.ts` types compound parts as `any`. Read `packages/ui/src` for real props:
  - `Text` has `variant`/`color`/`weight`.
  - `Card.Title` and `EmptyState.Title` have `level`.
  - Progress and Meter have no tone or size.
  - Avatar.Status has no tone.
- **Package gaps found by the sync (not config):**
  - Select doesn't pass `open`/`defaultOpen`/`onOpenChange` through.
  - The date-picker entry doesn't re-export `Time`/`CalendarDate`.

## Status (2026-10-24)

- The first sync is paused for the 0.10 namespace rename (classes `pui-` → `surf-`, tokens → `--surf-*`) and the `@surflane/css` split.
- Project d32c3c1a-1c5d-4f54-9f70-ee6c0a01e5eb holds 60 verified cards from the pre-rename build. It has no `_ds_sync.json` anchor, which is a safe state: the next run re-verifies everything.
- Graded but not uploaded: Toast.
- Written but ungraded: the 10 overlay previews, Select, Combobox, Autocomplete, DatePicker, DateRangePicker, Menubar, NavigationMenu, AppShell, Grid and Container. Their config fixes are applied above. They were blocked by `[CONFIG_STALE]`: overrides were added without a full rebuild. Run `package-build.mjs` after any `cfg.overrides` change before scoped preview-rebuilds.
- After the rename:
  1. Rebuild.
  2. Regrade everything. Previews that use tokens inline change with the rename.
  3. Run the upload channel with a fresh plan (atomic path, since the project is pinned) and write the conventions header.

## Re-sync risks

- The alias exclusions in `componentSrcMap` go stale when a compound gains a part.
- Previews reference token names inline. After the `--surf-` rename, grep `.design-sync/previews` for `var(--` and update.
- `prepare.mjs` depends on `npm run build:llms` output and on `demo/catalog.ts` field names (`group`, `name`, `id`).
- The Pretendard dynamic subset (92 woff2) comes from `node_modules/pretendard`; a version bump changes the font files.
