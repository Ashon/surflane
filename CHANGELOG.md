# Changelog

`@surflane/design-tokens` and `@surflane/ui` are released together with the same version. During 0.x, a minor version may change public API or visual contracts; patch versions do not.

## Unreleased

### Added

- `ChoiceLabel` pairs a Checkbox, Radio or Switch with its label and an optional `description`. The label text alone names the control, the description is read as its description, and the control sits on the first line.
- `LinkButton` gives a link Button's `variant` and `size` and stays a link for assistive technology. `Link` and `LinkButton` take a router's link element as `render`, such as `<Link render={<NextLink href='/docs' />}>`.
- Dialog and AlertDialog `Content` take `size`: small, default and large are 420, 640 and 840px wide, and set the density inside. Popover `Content` takes `size` too (240, 320 and 480px), and `Popover.Title` and `Popover.Description` are styled. An overlay without `size` keeps its default width and the surrounding density. For a width alone, set `--dialog-width`, `--popover-width` or `--panel-width`.
- Sheet and Drawer `Content` take `flush`, which attaches the panel to its edge with square corners there, as a mobile bottom sheet sits.
- `Table.Container` takes `bleed`, which hangs the table by its cell inset so cell text lines up with the text around it.
- Select options can be groups, `{ label, options }`, shown under a heading. NativeSelect keeps optgroup labels the same way. Select forwards `ref` to its trigger.
- Checkbox, Radio and Switch take `size`. Without it they follow the surrounding size.
- Overlay width tokens: `--size-dialog-*`, `--size-popover-*` and `--size-panel-*`.
- Focus and target tokens: `--focus-ring-width`, `--focus-ring-offset`, `--focus-ring-inset` and `--control-focus-ring-size`, and `--control-target-size` (44px).
- `--layout-reading-measure` (54ch) holds reading text to about 70 Latin or 50 Hangul characters per line. Paragraphs, lists and quotes in `Prose` and `Markdown` keep to it, while tables, code and images still use the full reading width. The catalog's manual copy uses the same measure with the reading role (16/28).

### Changed

- Type roles set tracking alongside size and leading, as `--type-<role>-tracking`. Neither Manrope nor Pretendard has an optical size axis, so the roles adjust tracking by size:
  - Headings tighten as they grow: display and title −0.02em; page, section and metric −0.01em.
  - Captions open by +0.01em.
  - Body, reading, label, compact and code stay at 0.
  - With Tailwind CSS v4, `text-<role>` utilities apply the tracking too.
- Korean text inside `pui-typography` wraps between words (`word-break: keep-all`). Its word spaces widen to Pretendard's width through `--type-hangul-word-spacing` (0.05em): Manrope leads the body stack, so Korean took Manrope's narrower space.
- `--type-label-leading` is 20px at 14px, down from 22px. Buttons and other single-line controls already used 20px.
- A `--type-compact-*` role, 13/20, covers dense secondary text. `--type-table-*` and `--type-code-*` now alias it.
- Display grows from 32 to 40px and title from 28 to 32px with the screen.
  - `--type-workspace-title-*` and `--type-document-title-*` alias display, and `--type-document-section-size` aliases title.
  - Heading and PageHeader `size="workspace"` and `size="document"` render the display role.
- Components take their type from the role tokens, so changing a role reaches them. This changes a few components:
  - Dialog and panel titles move from 22px to the section role (20/28).
  - Toast descriptions move from 13/18 to 13/20.
  - Avatar initials move from 10px to the 12px minimum.
  - Menu and combobox group labels, chips, list descriptions and file upload hints take their role's leading instead of the parent's.
- `check:package` fails on literal font sizes, line heights or weights in package CSS.
- Every component draws the same focus ring: 2px, outside with a 2px offset, or inside where a container would clip it.
  - Checkbox, radio, switch, link, tabs panel and slider thumb rings move from a 3px offset to 2px.
  - Text field halos use `--control-focus-ring`.
- Button, menu and combobox items, navigation links, the file trigger and app shell links reach the 44px target on touch screens of any width (`pointer: coarse`), not only below 760px.
- Select, Menu and Combobox items share one item style:
  - The row is the control height: 36px, or 44px on touch. Menu and combobox rows are 2px shorter.
  - The check column has a 36px indent. Select's check moves 2px and its text 4px.
  - The corners take the control radius.
- Dialog and panel chrome uses the spacing scale and one close button clearance: the control height plus 16px on each side. Dialog headers clear the close button by 68px instead of 72px, and close buttons sit at the inline end in right-to-left text.
- Switch derives its padding and thumb travel from the switch tokens.
- Textarea is a Field control: inside Field.Root it takes the label, description and error, as Input does. It also accepts the size aliases.
- A popover fits its content up to 320px, or its `size` width, instead of up to the viewport width.
- `check:package` fails when a component stylesheet selects a class that no component renders. It also caps the literal lengths left in package CSS at 129, so the count can only fall.

## 0.4.0

### Added

- `@surflane/ui/all.css` imports every Surflane stylesheet in the recommended order: `tokens.css`, `controls.css`, `foundations.css`, `typography.css` and `styles.css`. One line replaces the five imports; with Tailwind CSS v4, import it with `layer(components)`.
- An [install guide](https://surflane.page/install) builds the commands and files for Next.js, Vite, React Router or Astro, with or without Tailwind CSS, brand fonts, a remembered theme and the optional components: it adds their libraries to the install command, shows their imports and wraps the app in `SyntaxHighlighting` when code highlighting is on. `npm run check:install-guide` builds what it shows into each framework's app and checks the result in Chromium.

### Changed

- Chart, DatePicker, Markdown, Tree and syntax highlighting moved to their own entry points, and their libraries became optional peer dependencies. Install a library only when you use its component. A fresh install of both packages drops from 186 packages and 164 MB to 14 packages and 32 MB, React included.
  - `Chart` imports from `@surflane/ui/chart` (needs `recharts`); `DatePicker`, `DateRangePicker`, `TimeField` and `DateLocaleProvider` from `@surflane/ui/date-picker` (`react-aria-components`); `Markdown` from `@surflane/ui/markdown` (`react-markdown`, `remark-gfm`); `Tree` from `@surflane/ui/tree` (`@headless-tree/core`, `@headless-tree/react`, `@tanstack/react-virtual`).
  - `CodeBlock` and `SyntaxHighlighter` stay in the root entry and render plain text by default. `SyntaxHighlighting` from `@surflane/ui/syntax-highlighting` turns highlighting on for everything inside it; it needs `shiki`.
  - `check:package` fails if the root entry reaches an optional peer, including through a dynamic import.
- Every stylesheet in both packages puts its rules in cascade layers, lowest first: `surflane.tokens`, `surflane.themes`, `surflane.base` and `surflane.components`. Each file starts with the same `@layer` order statement, so the order holds whichever file loads first. See [Cascade layers](https://github.com/Ashon/surflane/blob/main/docs/frameworks.md#cascade-layers).
  - Unlayered application CSS now overrides Surflane whatever its specificity. Before, a Surflane selector with higher specificity won.
  - Theme presets and `themeCss` output sit in `surflane.themes`, so they override the tokens in any import order.
  - Component styles override document typography (`.pui-typography`) and composition classes in any import order.
  - Surflane's few `!important` declarations, for motion during a theme switch and under reduced motion and for the native scrollbar that `ScrollArea` replaces, now hold against unlayered `!important` ones.
- `themeCss` output starts with the layer order statement and wraps its rules in `@layer surflane.themes`. `layerOrder` exports the statement.
- With Tailwind CSS v4, the docs import every Surflane stylesheet, including theme presets and `shadcn.css`, with `layer(components)`: above Preflight, below utilities. The `layer(theme)` imports from 0.3.0 keep working.
- Bundles carry only the components an app uses. Tabs, Accordion with Collapsible, and Avatar have their own modules, and component factories are marked pure, so a bundler drops what an app never renders. Importing Breadcrumbs alone bundles 1.4 KB instead of 54 KB. Exports and names are unchanged.
- Components write the full size name to `data-size`: `size="sm"` renders `data-size="small"`, and `md` and `lg` likewise.
- Toast `Close` and `Action` are small buttons, 32px, and 44px on touch screens. The close button was 36px, and the action stayed 32px on phones.

### Fixed

- Checkboxes, radios and switches in table cells center on the row. They rested on the text baseline, 2 to 3px above the middle, in every table and data table.
- The size aliases `sm`, `md` and `lg` render exactly like `small`, `default` and `large`. A `size="sm"` Button stayed 32px on touch screens instead of growing to the 44px target, and a `sm` Spinner was 16px against 14px for `small`. `pui-avatar` also accepts `data-size="small"` and `"large"` without React.
- Accordion and Collapsible triggers follow `SizeProvider`. Their size rules named classes the components do not render.
- Inside a `SizeProvider`, Sheet and Drawer headers keep the title clear of the close button, as they do outside one.
- Dialog, AlertDialog, Popover, Sheet and Drawer keep a function `className` on their content, close button, title and description. They dropped it.
- The CodeBlock copy button keeps its resting width when web fonts finish loading after a copy.

### Migration

- Import Chart, DatePicker, Markdown and Tree from their entry points, and install the libraries they need. Wrap the app in `<SyntaxHighlighting>` to keep highlighted code.
- Element rules in your global CSS, such as `button`, `a` or `body` rules from a starter template or a reset, now override Surflane components. Remove them, or move them into a layer declared before Surflane's: `@layer reset, surflane;` at the top of the stylesheet, then `@layer reset { … }`.
- CSS that selects `[data-size='sm']` or `[data-size='lg']` on a Surflane component now selects `[data-size='small']` or `[data-size='large']`.

## 0.3.0

0.2.1 was prepared but never published; its fix ships here.

### Added

- Themes. A theme changes three inputs: the neutral tint, the accent and the radius scale. Lightness never changes, so text keeps the contrast the default palette was measured for. Build one in the [theme builder](https://surflane.page/foundations/themes).
  - `@surflane/design-tokens/themes/*.css`: presets to load after `tokens.css`. Neutral, accent and radius files combine freely.
    - Neutral: `slate.css` (default), `neutral.css`, `zinc.css`, `stone.css`.
    - Accent: `accent-cyan.css` (default), `accent-blue.css`, `accent-violet.css`, `accent-green.css`, `accent-amber.css`, `accent-rose.css`.
    - Radius: `radius-none.css`, `radius-small.css`, `radius-default.css`, `radius-large.css`.
  - `@surflane/design-tokens/theme-builder`: `createTheme({ neutral, accent, radius })` and `themeCss(theme)` generate the same CSS for your own inputs. Accent chroma is clamped to the sRGB gamut. `contrastRatio` and `maxChroma` measure any color.
  - Theme files mirror the contexts in `tokens.css`, so `data-theme` and scoped theme regions keep working.
- `@surflane/design-tokens/shadcn.css` maps the shadcn/ui variables, such as `--background`, `--primary`, `--border` and `--radius`, plus the chart and sidebar variables, to Surflane tokens. shadcn components then follow Surflane themes. See [shadcn/ui](https://github.com/Ashon/surflane/blob/main/docs/frameworks.md#shadcnui).
- `--success`, the base for the success status colors. It equals the default accent, and accent themes leave it unchanged. Tailwind maps it to `success` utilities.
- Table parts for data-heavy screens. They are opt-in; existing tables render as before.
  - `Table.Root`: `density="compact"` sets 4px cell padding and 2px between rows. `stickyHeader` keeps the header in view inside a `Table.Container` with a bounded height and `orientation="both"`; `--table-surface` sets the header background.
  - `numeric` on `Table.HeaderCell` and `Table.Cell` aligns to the end with tabular figures.
  - `Table.SortHeader`: a column header with a sort button. Every sortable column shows its icon, and only the sorted column carries `aria-sort`. End-aligned columns put the icon before the label.
  - `Table.Truncate` keeps one line with an ellipsis; string content becomes the title. `Table.Message` is a full-width body row for loading, empty, error and permission messages, without hover.
  - `useTableSelection` keeps selection by row ID across pages, sorting and filters. It returns the page checkbox props (selectable rows on the current page only), each row's checkbox props and `hiddenCount` for selections on other pages.
  - Flat exports: `TableSortHeader`, `TableTruncate`, `TableMessage`.
  - `presentation.css` styles these through data attributes, so plain HTML tables can use them too.
- `Icon` name `more`, for row action menus.
- `AppShell.Page` (`AppShellPage`): the page surface inside a workspace `AppShell.Content`. It insets from the shell on every side but the sidebar's, with a radius concentric with the shell. Up to 760px, without the sidebar, it insets evenly and starts flush below a mobile `Header`. Before, callers wrote this surface themselves.

### Changed

- The success status colors (`--status-success-*`) derive from `--success` instead of `--brand`. Their default values are unchanged.
- `align` on `Table.HeaderCell` and `Table.Cell` takes `start`, `center` or `end`. It no longer passes through the obsolete HTML `align` attribute.

### Fixed

- `ScrollArea` scrollbars no longer take taps on touch-only screens (`(hover: none) and (pointer: coarse)`).
  - The 10px bar overlays the edge of its content and caught pointer events even while hidden. A tap on a link or control under it hit the bar instead.
  - The bar still shows while content scrolls, as native mobile scrollbars do. Content scrolls by swiping.
  - With a mouse or trackpad, the bar can still be dragged.

## 0.2.0

### Added

- `@surflane/design-tokens/tailwind.css`: a Tailwind CSS v4 theme that maps color roles, spacing, layout widths, radii, shadows, fonts, type steps, tracking and easing to utilities such as `bg-canvas`, `p-page` and `rounded-sheet`.
  - Utilities read the tokens through `var()`, so they follow `data-theme`, including scoped themes.
  - `dark:` follows the nearest `data-theme`, not the operating system.
  - The bridge never redefines a Surflane token.
  - See [Tailwind CSS v4](https://github.com/Ashon/surflane/blob/main/docs/frameworks.md#tailwind-css-v4) for the import order. Import Surflane styles into `layer(components)` so utilities can override them.
- Every theme block sets `color-scheme`, so native scrollbars, selects and date inputs render in the theme. Scoped `data-theme` regions get the same.

### Changed

- Hover is a state layer.
  - `--interaction-hover-bg` is now `--ink` at 8% alpha over whatever the item rests on, instead of `--surface`. Primary buttons use `--on-brand` at 8%.
  - Buttons add the layer over their own fill instead of a 3% brightness filter. This applies to every variant, toolbar buttons and menubar triggers. Link buttons thicken their underline.
  - Toolbar, menubar and app shell items now show hover on their own backgrounds. Before, the hover color matched those backgrounds.
- Pressed is the same layer, stronger. `--interaction-active-bg` is now `--ink` at 14% (`--on-brand` on primary buttons) instead of `--selected`.
  - Buttons, tabs, disclosure triggers, app shell links, tree toggles, chart legend buttons, segments, icon buttons, theme actions and pagination controls use it on `:active`. Buttons no longer use a brightness filter.
  - These controls set `-webkit-tap-highlight-color: transparent`. A tap shows their own layer in their own shape instead of the browser's rectangular highlight.
- `CodeBlock` shows the copy result inside its button and fades between labels. The status line below the block (`.pui-code-result`) is removed, so nothing below the block moves.
  - The default `copiedLabel` is now "Copied" and the default `copyErrorLabel` is now "Copy unavailable".
  - When copying fails, the source is selected.
- Dark theme contrast:
  - `--code-bg` steps below the chrome (Gray 95).
  - `--hover` rises to Gray 75.
  - `--status-danger-fg` keeps error text at 4.5:1 on `--selected`.
- Table cells use `overflow-wrap: break-word`, so columns size to whole words.
- Code text, including highlighted code, renders without ligatures.

### Fixed

- Horizontal scroll areas fade the edge that hides more content, so cut-off tables and code read as scrollable.
- Highlighted code keeps its background and corners while long lines scroll.
- Korean text (`lang="ko"`) in headings, text and prose wraps between words.
- The pagination summary stays on one line on narrow screens.
- Chart axis labels are cut at 24 characters instead of 14.
- In `catalog.json` and `theme.json`, token values no longer contain line breaks from source formatting.

## 0.1.0

First npm release.

- `@surflane/design-tokens`: OKLCH color roles, spacing, typography, sizing and motion tokens as CSS custom properties, the token catalog and `transitionTheme`.
- `@surflane/ui`: React 19 components built on Base UI, plus chart, date, tree, code highlighting and Markdown components. Root and subpath entry points are ESM with type declarations.
- React Server Components: every namespace part also has a flat export (`DialogRoot`, `DialogTrigger`, `TabsList`, ...), so Server Components can render compound components without dotting into a client module.
- Scoped themes: `data-theme` on any element re-themes its subtree, including alias tokens.
- Dual licensed under MIT or Apache-2.0.
