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
- `[GRID_OVERFLOW] … escape` fires on Meter, Progress, Slider, NativeSelect, Select, FilterBar, SizeProvider and Toast.
  - The cause is Base UI's visually hidden parts: hidden inputs, range inputs and value spans. They are 1x1, `clip-path: inset(50%)` and `position: fixed`.
  - The validator counts any fixed element that paints as escaping its cell, but nothing shows.
  - Don't apply the suggested `cardMode: "single"`: it would hide every story but one.
  - Base UI was 1.9.0 before and after the 0.10 peer move, so this is not a regression.
- `[RENDER_THIN] SizeProvider` with height 0: SizeProvider renders a `display: contents` wrapper, so the card root measures 0px. Its stories render normally.

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
- **Focus in static cards** (folded from the 0.10 regrade): with no pointer input, programmatic focus matches `:focus-visible`, so a focused button draws the heavy keyboard ring.
  - Overlays without fields (read-only Dialog, Sheet, Popover) focus the popup itself: `ref={popup} initialFocus={popup}`. Their popups set `outline: none`.
  - The safe-Cancel `initialFocus` advice above is for AlertDialog only.
- **Composition details:**
  - Menu and ContextMenu indent check and radio items but not plain items. Keep toggles in their own group between separators.
  - A Stack stretches its children, so put Badge, StatusBadge and Button in an Inline. A neutral Badge on a subtle Surface loses its pill.
  - `Inline justify='between'` spaces every child, so wrap an action group in its own Inline. For captioned stacks of uneven height, use `alignItems: 'flex-end'`.
  - List rows carry 16px inline padding. Don't pad a wrapper around a list, and keep companion text inside the list, or the edges misalign.
  - A vertical ScrollArea has no edge fade, so frame it (`Surface padding={0}`) and cut a line mid-height. Give a wide table real extra columns rather than a stretched `minWidth`.
  - `Button variant='link'` keeps its inline padding. In a Card footer, use an outline or ghost action.
  - Dialog and Sheet `size` set density as well as width.
  - FilterBar wraps its actions to a new row with three fields at 900px. That is the designed wrap.
  - The Icon set has `upload` but no `download`.
  - Meter's indicator is `--surf-ink-body` by design; Progress uses the brand color.
- **Values and copy:**
  - Give date, time and range fields a value whenever the copy refers to one. `CalendarDate` and `parseDate` import from `'@surflane/ui'`; a DateRangePicker `defaultValue` is `{ start, end }`. Without a value, the calendar opens on the capture clock's frozen month, May 2024.
  - Read-only and required fields have no visual cue, so say it in the description.
  - FileUpload's default labels are plural. For single-file stories, pass `labels={{ choose: 'Choose file', drop: 'or drop it here' }}`.
  - Markdown `headingLevel` shifts every heading, and prose styles only h2–h4. With `headingLevel={3}`, start the source at `#`.
  - The CodeBlock install line tracks the README: `npm install @surflane/ui @surflane/design-tokens @surflane/css @base-ui/react`.
- **Grading detail:** full-size cells are at `ds-bundle/_screenshots/review/raw/<group>__<Name>__<Cell>.png`. The review sheet is downscaled.
- **Types:** `[DTS_STYLE_SYSTEM]` drops own props that share a name with an HTML attribute the filter treats as styling. Text loses `color` this way, so `cfg.dtsPropsFor.Text` restores it. Chart and Tree keep `height`, CodeBlock and SyntaxHighlighter keep `wrap`, and Container keeps `width`.
- **Types:** the emitted `.d.ts` types compound parts as `any`. Read `packages/ui/src` for real props:
  - `Text` has `variant`/`color`/`weight`.
  - `Card.Title` and `EmptyState.Title` have `level`.
  - Progress and Meter have no tone or size.
  - Avatar.Status has no tone.
- **Package bugs found by the 0.10 re-sync, fixed in source (Unreleased, after 0.10.0):**
  - Skeleton painted `--surf-surface`, about 1.07:1 on a light canvas. It now paints `--surf-skeleton-base` and pulses to `-highlight`.
  - A Fieldset legend's margin added to the fieldset's gap.
- **Package gaps found by the sync (not config):**
  - Select doesn't pass `open`/`defaultOpen`/`onOpenChange` through.
  - The date-picker entry doesn't re-export `Time`/`CalendarDate`.

## Status

- 2026-10-24: re-synced after the 0.10 rename. The atomic upload went to project d32c3c1a-1c5d-4f54-9f70-ee6c0a01e5eb:
  - 81 components, 307 graded cells, all good.
  - 520 files uploaded, no deletes.
  - `_ds_sync.json` is now the anchor, so the next run diffs against it.
- The bundle was built from source that is ahead of npm 0.10.0. It carries the Unreleased Skeleton and Fieldset fixes.

## Re-sync risks

- `cfg.dtsPropsFor.Text` is hand-written. Update it when Text's props change in `packages/ui/src/typography.tsx`.
- `.design-sync/conventions.md` names tokens, props and components. Re-validate it against each build; `--surf-sheet`, for one, does not exist.

- The alias exclusions in `componentSrcMap` go stale when a compound gains a part.
- Previews reference token names inline. After the `--surf-` rename, grep `.design-sync/previews` for `var(--` and update.
- `prepare.mjs` depends on `npm run build:llms` output and on `demo/catalog.ts` field names (`group`, `name`, `id`).
- The Pretendard dynamic subset (92 woff2) comes from `node_modules/pretendard`; a version bump changes the font files.
