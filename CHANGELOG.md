# Changelog

`@surflane/design-tokens` and `@surflane/ui` are released together with the same version. During 0.x, a minor version may change public API or visual contracts; patch versions do not.

## 0.2.1

### Fixed

- `ScrollArea` scrollbars no longer take taps on touch-only screens (`(hover: none) and (pointer: coarse)`).
  - The 10px bar overlays the edge of its content and caught pointer events even while hidden. A tap on a link or control under it hit the bar instead.
  - The bar still shows while content scrolls, as native mobile scrollbars do. Content scrolls by swiping.
  - With a mouse or trackpad, the bar can still be dragged.

`@surflane/design-tokens` has no changes in this release.

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
