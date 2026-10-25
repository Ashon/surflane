# Framework integration

Surflane runs in any React 19 application whose bundler resolves ESM packages and CSS imports from `node_modules`. The packages are ESM-only; CommonJS `require` is not supported. The [examples](../examples) are minimal production setups, and `npm run check:examples` installs the packed tarballs into each of them, builds, serves and verifies server HTML, hydration, dialog focus and token loading in Chromium.

| Framework                     | Rendering                     | CSS entry                  | Theme attribute              | Example                                           |
| ----------------------------- | ----------------------------- | -------------------------- | ---------------------------- | ------------------------------------------------- |
| Next.js App Router            | React Server Components + SSR | `app/layout.tsx`           | `<html>` in `app/layout.tsx` | [examples/next](../examples/next)                 |
| React Router (framework mode) | SSR + hydration               | `app/root.tsx`             | `<html>` in `Layout`         | [examples/react-router](../examples/react-router) |
| Astro                         | Static/SSR React islands      | page or layout frontmatter | `<html>` in the layout       | [examples/astro](../examples/astro)               |
| Vite                          | Client rendering              | `src/main.tsx`             | `index.html`                 | [examples/vite](../examples/vite)                 |

Other React 19 frameworks that bundle with Vite, webpack or Turbopack follow the same three steps, but CI does not verify them. The [install guide](https://surflane.page/install) builds the commands and files for your framework and options.

## 1. Install

```sh
npm install @surflane/ui @surflane/design-tokens @surflane/css @base-ui/react
```

The three Surflane packages are released together with one version; install matching versions. Base UI is a peer dependency, 1.9 or later, so your app and Surflane share one copy.

## 2. Import CSS once

Import `@surflane/ui/all.css` once at the application root, from a stylesheet or the root module:

```css
@import '@surflane/ui/all.css';
```

It brings every Surflane stylesheet in the recommended order: `tokens.css`, `controls.css`, `foundations.css` and `typography.css` from `@surflane/design-tokens`, then `@surflane/ui/styles.css`. Import those files yourself to leave one out.

The stylesheets put their rules in [cascade layers](#cascade-layers), so your own unlayered CSS overrides them. Remove element rules such as `button { … }` or `body { font-family: … }` that a starter template adds to its global CSS: they would override Surflane components too.

### Component stylesheets

To ship only the styles of the components you use, import their stylesheets instead of `all.css`. Each component has one, at the path of its entry point with `.css`, and it brings the tokens and the styles of everything the component renders:

```css
@import '@surflane/css/typography.css';
@import '@surflane/ui/button.css';
@import '@surflane/ui/dialog.css';
@import '@surflane/ui/select.css';
```

Dialog's stylesheet lists Button's, for its close button. Vite, webpack and Next.js load a stylesheet that several components list once. Tailwind CSS keeps every import it meets, so with Tailwind CSS, import `all.css`. One component's stylesheet, with the tokens, is about 30 KB (6 KB gzipped); `all.css` is about 160 KB (24 KB gzipped). When you compose components yourself, such as an `Input` inside a `FilterBar` field, import both stylesheets.

The rules are the ones `all.css` brings, and they apply the same in any import order: a component's stylesheet comes after the stylesheets it includes, and size rules sit in their own layer. `styles.css` is the list of every component stylesheet. `@surflane/design-tokens` splits `presentation.css` and `foundations.css` the same way, under `presentation/` and `foundations/`.

Add `surf-typography` to `<body>` to apply document typography, including portalled overlays. With AppShell, which fills the window with a square edge, also set `body { margin: 0; background: var(--surf-chrome); }` so the browser's default margin never shows around it, and give `html`, `body` and the element your app renders into `height: 100%`, since the shell takes its container's height. Fonts are not bundled. Load Manrope, Pretendard, JetBrains Mono or your own families in the host, for example through `@fontsource-variable/*` packages. Without them, the token font stacks fall back to system fonts.

## 3. Set the theme before paint

Without `data-theme`, the tokens follow the system setting, and dark when there is none. `data-theme="light"` or `"dark"` on `<html>` fixes the choice. Resolve the theme before the first paint to avoid a flash:

- Server-rendered frameworks: read the preference (for example a cookie) on the server and render `<html data-theme="…">`. React Router reads it in the root `loader`.
- Next.js: reading `cookies()` in the root layout renders every page on demand, and fails the build under Cache Components. Render a default theme instead, apply the cookie from an inline `<script>` in `<head>`, and add `suppressHydrationWarning` to `<html>`.
- Client-only apps and static sites: set the attribute in an inline `<script>` in `<head>`, before the app bundle runs. The catalog's [`demo/index.html`](../demo/index.html) shows a cookie-based script that also supports a `system` mode.

The [install guide](https://surflane.page/install) shows each of these with a theme switch, and `npm run check:install-guide` builds them.

Animate later changes with `transitionTheme` from `@surflane/design-tokens/theme-transition`. Persisting the preference belongs to the application.

`data-theme` also works on any element: `<div data-theme="dark">` renders that subtree in the dark theme inside a light page, and the reverse. Every token, including aliases such as `--surf-control-hover-background`, resolves again inside the subtree. Use it for previews and embedded surfaces, not as a second page theme.

## Optional components

Chart, DatePicker, Markdown, Tree and syntax highlighting build on larger libraries. Each has its own entry point, and its library is an optional peer dependency: install it only when you use the component. The root `@surflane/ui` entry never imports them.

| Import                                                                                             | Install                                                            |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `Chart` from `@surflane/ui/chart`                                                                  | `recharts`                                                         |
| `DatePicker`, `DateRangePicker`, `TimeField`, `DateLocaleProvider` from `@surflane/ui/date-picker` | `react-aria-components`                                            |
| `Markdown` from `@surflane/ui/markdown`                                                            | `react-markdown remark-gfm`                                        |
| `Tree` from `@surflane/ui/tree`                                                                    | `@headless-tree/core @headless-tree/react @tanstack/react-virtual` |
| `SyntaxHighlighting` from `@surflane/ui/syntax-highlighting`                                       | `shiki`                                                            |

`CodeBlock` and `SyntaxHighlighter` render plain text by default. Wrap the app, or any subtree, in `<SyntaxHighlighting>` to color tokens; the engine and each grammar load on first use. In Next.js, render it in `app/layout.tsx`: it is a client component that takes server-rendered children.

Code shows as plain text until its tokens arrive. For a server render or a prerendered page, use `<SyntaxHighlighting suspense>`: each block waits for its tokens behind its own Suspense boundary, so the server writes highlighted HTML and hydration keeps it. In the browser, a block that appears or changes later shows plain text until its tokens arrive; nothing around it suspends. When you hydrate server-rendered HTML yourself, await `preloadSyntaxHighlighting(container)` from `@surflane/ui/syntax-highlighting` before `hydrateRoot`, so every block hydrates at once. It reads the tokens back from the server's HTML, so hydration loads neither the engine nor a grammar.

## Router links

`Link` and `LinkButton` render an anchor. Pass your router's link element as `render`: the router keeps client navigation, and Surflane adds the styling.

```tsx
import NextLink from 'next/link'
import { Link, LinkButton } from '@surflane/ui'

<Link render={<NextLink href='/docs' />}>Read the docs</Link>
<LinkButton variant='primary' render={<NextLink href='/projects/new' />}>
  New project
</LinkButton>
```

With React Router, render `<NavLink to='/docs' />`. `LinkButton` takes Button's `variant` and `size` but stays a link for assistive technology, so use it for navigation and keep `Button` for actions.

## Cascade layers

Every Surflane stylesheet puts its rules in five [cascade layers](https://developer.mozilla.org/docs/Web/CSS/@layer), lowest first:

| Layer                 | Contents                                                                               |
| --------------------- | -------------------------------------------------------------------------------------- |
| `surflane.tokens`     | Custom properties and inherited rendering hints                                        |
| `surflane.themes`     | Theme presets and theme builder output                                                 |
| `surflane.base`       | Composition, document typography and theme motion                                      |
| `surflane.components` | Controls, presentation classes and components                                          |
| `surflane.sizes`      | The size scheme and size variants: `SizeProvider`, a component's `size`, table density |

Each file starts with the same `@layer` order statement, so the order holds whichever file loads first. The browser compares layers before specificity:

- Unlayered CSS overrides every layer. Your `.settings-title { font-size: 20px }` overrides `.surf-card-title` whatever their specificity, and so does a stray `button { … }` rule.
- Keep a reset below Surflane by declaring its layer first. `@layer` statements may precede `@import`:

  ```css
  @layer reset, surflane;
  @import '@surflane/ui/all.css';

  @layer reset {
    *,
    ::before,
    ::after {
      box-sizing: border-box;
    }
  }
  ```

- `!important` reverses the order: an important declaration in a layer beats an important unlayered one. Surflane marks only a few declarations important: motion during a theme switch and under reduced motion, and the native scrollbar that ScrollArea replaces.

## Tailwind CSS v4

`@surflane/design-tokens/tailwind.css` maps the tokens to Tailwind CSS v4 utilities. Tailwind stays optional: the tokens and components work without it, and the bridge adds no runtime code.

```css
@import 'tailwindcss';
@import '@surflane/ui/all.css' layer(components);
@import '@surflane/design-tokens/tailwind.css';
```

Import every Surflane stylesheet with `layer(components)`. Surflane's layers then nest inside Tailwind's `components` layer, keeping their own order: above Preflight in `base`, below utilities. A utility such as `px-8` adjusts a `.surf-button`, and Preflight's `button` reset does not. Keep `tailwind.css` itself unlayered: it holds Tailwind directives, not rules.

| Tokens                                                                                         | Utilities                                          |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Color roles: `--surf-ink`, `--surf-canvas`, `--surf-surface`, `--surf-line`, `--surf-brand`, … | `text-ink`, `bg-canvas`, `border-line`, `bg-brand` |
| `--surf-space-*` (4px steps)                                                                   | `p-4`, `gap-6`, `p-10`: the same steps as Tailwind |
| `--surf-layout-page-inset`, `--surf-layout-gutter`, `--surf-layout-section-gap`                | `p-page`, `gap-gutter`, `py-section`               |
| `--surf-layout-reading`, `--surf-layout-content`, `--surf-layout-workspace`, …                 | `max-w-reading`, `max-w-content`, …                |
| `--surf-radius-*`, `--surf-shadow-*`                                                           | `rounded-md`, `rounded-sheet`, `shadow-float`      |
| `--surf-font-*`, `--surf-weight-*`, `--surf-type-*` size, leading and tracking                 | `font-display`, `font-medium`, `text-title`        |
| `--surf-tracking`, `--surf-tracking-mono`, `--surf-ease-in`, `--surf-ease-out`                 | `tracking-default`, `tracking-mono`, `ease-out`    |

Utilities read the tokens through `var()`, so they follow `data-theme`, including scoped themes, without a `dark:` variant. When you need one, `dark:` follows the nearest `data-theme`, not the operating system. The bridge never redefines a token: Tailwind emits no theme variables for it, even where Surflane and Tailwind share a name such as `--surf-radius-md`. Durations and layers have no Tailwind theme namespace; use them as `duration-(--surf-duration-fast)` and `z-(--surf-layer-dialog)`.

`npm run check:tailwind` compiles this setup with Tailwind CSS v4, checks every mapped utility and verifies the layer contract and `dark:` in Chromium.

## Themes

A theme changes three inputs: the neutral tint, the accent and the radius scale. Lightness never changes, so text keeps the contrast the default palette was measured for. Build and preview one in the [theme builder](https://surflane.page/foundations/themes).

Import a preset file with the tokens. Presets sit in the `surflane.themes` layer, above the tokens, so the import order does not matter. Neutral, accent and radius files combine freely:

```css
@import '@surflane/ui/all.css';
@import '@surflane/design-tokens/themes/stone.css';
@import '@surflane/design-tokens/themes/accent-violet.css';
@import '@surflane/design-tokens/themes/radius-small.css';
```

| Input   | Files                                                                           |
| ------- | ------------------------------------------------------------------------------- |
| Neutral | `slate.css` (default), `neutral.css`, `zinc.css`, `stone.css`                   |
| Accent  | `accent-cyan.css` (default), `-blue`, `-violet`, `-green`, `-amber`, `-rose`    |
| Radius  | `radius-none.css`, `radius-small.css`, `radius-default.css`, `radius-large.css` |

For your own inputs, generate the CSS with `@surflane/design-tokens/theme-builder`:

```ts
import { createTheme, themeCss } from '@surflane/design-tokens/theme-builder'

const css = themeCss(
  createTheme({
    neutral: { hue: 70, chroma: 0.6 },
    accent: { hue: 150, chroma: 0.14 },
    radius: 0.6,
  }),
)
```

- Theme files mirror the contexts in `tokens.css`, so `data-theme` and scoped theme regions keep working. `themeCss` output carries the same layer statement as the presets. With Tailwind, import theme files with `layer(components)` like the other Surflane files.
- Accent chroma is clamped to the sRGB gamut at the accent's fixed lightness. `contrastRatio(foreground, background)` measures any pair.
- Success keeps its own color, `--surf-success`, whatever the accent.
- Buttons, badges, chips, switches and segments draw their corners with `--surf-radius-pill`, half the tallest control, so by default every one is a pill. It scales with `radius` like the other corner tokens: a smaller scale rounds the larger parts' corners first, and `radius: 0` squares them. Circles and bars stay round: avatars, radios, slider knobs and progress bars.

## shadcn/ui

`@surflane/design-tokens/shadcn.css` maps the shadcn/ui variables, such as `--background`, `--primary`, `--border` and `--radius`, to Surflane tokens. shadcn components then follow every Surflane theme, including scoped `data-theme` regions.

```css
@import 'tailwindcss';
@import '@surflane/design-tokens/tokens.css' layer(components);
@import '@surflane/design-tokens/themes/stone.css' layer(components);
@import '@surflane/design-tokens/shadcn.css' layer(components);
@import '@surflane/design-tokens/tailwind.css';
```

In your shadcn CSS, keep the `@theme inline` block and delete the `:root` and `.dark` color blocks and the `@custom-variant dark` line. Unlayered variables there would override the bridge. Switch light and dark with `data-theme`, or leave it off to follow the system; `tailwind.css` makes `dark:` follow either. The bridge only reads Surflane tokens and never redefines one.

shadcn derives `--radius-sm` to `--radius-xl` from `--radius` (10px here), while `tailwind.css` maps the same names to the Surflane scale. Import `tailwind.css` after your shadcn `@theme` block, as above, so `rounded-lg` means the Surflane 16px corner everywhere.

## React Server Components

Stateless modules render on the server: Breadcrumbs, Card, Table, List, Stat, Sparkline, BarList, Spinner, Skeleton, EmptyState, the layout and typography parts, Icon, PageHeader and FilterBar. Every other module is a client module (`"use client"`). Server Components can import and render both, and pass serializable props, including React elements such as `render={<Button />}`.

- Use flat part names in Server Components: `DialogRoot`, `DialogTrigger`, `TabsList`, `FieldLabel`. A Server Component cannot dot into a client export, so `<Dialog.Root>` renders as an invalid element there. The namespace form works in Client Components, and both forms refer to the same component.
- Event handlers, render functions, `className` callbacks and label functions, such as Select's `labels.count` or Chart's `labels.values`, are functions. Pass them to a client module from a Client Component.
- Non-component values such as `iconNames` and `syntaxLanguages` arrive in Server Components as client references. Read them in Client Components.

- Some `labels` take functions, because their text holds a value: Chart, FileUpload, Tree, Pagination, Select, BarList and Dashboard.Panel. A Server Component can't pass a function, so set those labels in a small Client Component that wraps the part, as the catalog's own `CatalogCodeBlock` does for CodeBlock's text:

  ```tsx
  'use client'
  import { Pagination, type PaginationProps } from '@surflane/ui'

  export function LocalPagination(props: PaginationProps) {
    return <Pagination {...props} labels={{ page: (n) => `Go to page ${n}` }} />
  }
  ```

## Framework notes

### Next.js

Import the CSS file from `app/layout.tsx` and render `<html data-theme>` there. Pages can stay Server Components. See [examples/next/app/page.tsx](../examples/next/app/page.tsx).

### React Router

Import the CSS file in `app/root.tsx` and set the theme on `<html>` in `Layout`. Use a loader to read the theme cookie on the server.

### Astro

Add the React integration (`npx astro add react`). Compose Surflane parts inside a React component file and render it as an island, for example `<SurflaneDemo client:load />`. Import the CSS in the page or layout frontmatter.

### Vite

Import the CSS in `src/main.tsx` and set `data-theme` in `index.html` or in an inline script.
