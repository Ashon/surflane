# Framework integration

Surflane runs in any React 19 application whose bundler resolves ESM packages and CSS imports from `node_modules`. The packages are ESM-only; CommonJS `require` is not supported. The [examples](../examples) are minimal production setups, and `npm run check:examples` installs the packed tarballs into each of them, builds, serves and verifies server HTML, hydration, dialog focus and token loading in Chromium.

| Framework                     | Rendering                     | CSS entry                  | Theme attribute              | Example                                           |
| ----------------------------- | ----------------------------- | -------------------------- | ---------------------------- | ------------------------------------------------- |
| Next.js App Router            | React Server Components + SSR | `app/layout.tsx`           | `<html>` in `app/layout.tsx` | [examples/next](../examples/next)                 |
| React Router (framework mode) | SSR + hydration               | `app/root.tsx`             | `<html>` in `Layout`         | [examples/react-router](../examples/react-router) |
| Astro                         | Static/SSR React islands      | page or layout frontmatter | `<html>` in the layout       | [examples/astro](../examples/astro)               |
| Vite                          | Client rendering              | `src/main.tsx`             | `index.html`                 | [examples/vite](../examples/vite)                 |

Other React 19 frameworks that bundle with Vite, webpack or Turbopack follow the same three steps, but CI does not verify them.

## 1. Install

```sh
npm install @surflane/ui @surflane/design-tokens
```

Both packages are released together with the same version. Install matching versions.

## 2. Import CSS once

Import the stylesheets once at the application root, in this order:

```css
@import '@surflane/design-tokens/tokens.css';
@import '@surflane/design-tokens/controls.css';
@import '@surflane/design-tokens/foundations.css';
@import '@surflane/design-tokens/typography.css';
@import '@surflane/ui/styles.css';
```

Add `pui-typography` to `<body>` to apply document typography, including portalled overlays. Fonts are not bundled. Load Manrope, Pretendard, JetBrains Mono or your own families in the host, for example through `@fontsource-variable/*` packages. Without them, the token font stacks fall back to system fonts.

## 3. Set the theme before paint

Tokens default to the dark theme. `data-theme="light"` on `<html>` selects the light theme. Resolve the theme before the first paint to avoid a flash:

- Server-rendered frameworks: read the preference (for example a cookie) on the server and render `<html data-theme="…">`.
- Client-only apps: set the attribute in an inline `<script>` in `<head>`, before the app bundle runs. The catalog's [`demo/index.html`](../demo/index.html) shows a cookie-based script that also supports a `system` mode.

Animate later changes with `transitionTheme` from `@surflane/design-tokens/theme-transition`. Persisting the preference belongs to the application.

`data-theme` also works on any element: `<div data-theme="dark">` renders that subtree in the dark theme inside a light page, and the reverse. Every token, including aliases such as `--control-hover-background`, resolves again inside the subtree. Use it for previews and embedded surfaces, not as a second page theme.

## Tailwind CSS v4

`@surflane/design-tokens/tailwind.css` maps the tokens to Tailwind CSS v4 utilities. Tailwind stays optional: the tokens and components work without it, and the bridge adds no runtime code.

```css
@import 'tailwindcss';
@import '@surflane/design-tokens/tokens.css' layer(theme);
@import '@surflane/design-tokens/controls.css' layer(components);
@import '@surflane/design-tokens/foundations.css' layer(components);
@import '@surflane/design-tokens/typography.css' layer(components);
@import '@surflane/ui/styles.css' layer(components);
@import '@surflane/design-tokens/tailwind.css';
```

Import the Surflane stylesheets into Tailwind's layers. Unlayered styles win over every layer, so without `layer(components)` a utility such as `px-8` could not adjust a `.pui-button`.

| Tokens                                                                | Utilities                                          |
| --------------------------------------------------------------------- | -------------------------------------------------- |
| Color roles: `--ink`, `--canvas`, `--surface`, `--line`, `--brand`, … | `text-ink`, `bg-canvas`, `border-line`, `bg-brand` |
| `--space-*` (4px steps)                                               | `p-4`, `gap-6`, `p-10`: the same steps as Tailwind |
| `--layout-page-inset`, `--layout-gutter`, `--layout-section-gap`      | `p-page`, `gap-gutter`, `py-section`               |
| `--layout-reading`, `--layout-content`, `--layout-workspace`, …       | `max-w-reading`, `max-w-content`, …                |
| `--radius-*`, `--shadow-*`                                            | `rounded-md`, `rounded-sheet`, `shadow-float`      |
| `--font-*`, `--weight-*`, `--type-*-size` with `--type-*-leading`     | `font-display`, `font-medium`, `text-title`        |
| `--tracking`, `--tracking-mono`, `--ease-in`, `--ease-out`            | `tracking-default`, `tracking-mono`, `ease-out`    |

Utilities read the tokens through `var()`, so they follow `data-theme`, including scoped themes, without a `dark:` variant. When you need one, `dark:` follows the nearest `data-theme`, not the operating system. The bridge never redefines a token: Tailwind emits no theme variables for it, even where Surflane and Tailwind share a name such as `--radius-md`. Durations and layers have no Tailwind theme namespace; use them as `duration-(--duration-fast)` and `z-(--layer-dialog)`.

`npm run check:tailwind` compiles this setup with Tailwind CSS v4, checks every mapped utility and verifies the layer order and `dark:` in Chromium.

## Themes

A theme changes three inputs: the neutral tint, the accent and the radius scale. Lightness never changes, so text keeps the contrast the default palette was measured for. Build and preview one in the [theme builder](https://surflane.page/foundations/themes).

Import a preset file after the tokens. Neutral, accent and radius files combine freely:

```css
@import '@surflane/design-tokens/tokens.css';
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

- Theme files mirror the contexts in `tokens.css`, so `data-theme` and scoped theme regions keep working. Load them after the tokens; with Tailwind, import them into `layer(theme)` right after `tokens.css`.
- Accent chroma is clamped to the sRGB gamut at the accent's fixed lightness. `contrastRatio(foreground, background)` measures any pair.
- Success keeps its own color, `--success`, whatever the accent.

## shadcn/ui

`@surflane/design-tokens/shadcn.css` maps the shadcn/ui variables, such as `--background`, `--primary`, `--border` and `--radius`, to Surflane tokens. shadcn components then follow every Surflane theme, including scoped `data-theme` regions.

```css
@import 'tailwindcss';
@import '@surflane/design-tokens/tokens.css' layer(theme);
@import '@surflane/design-tokens/themes/stone.css' layer(theme);
@import '@surflane/design-tokens/shadcn.css' layer(theme);
@import '@surflane/design-tokens/tailwind.css';
```

In your shadcn CSS, keep the `@theme inline` block and delete the `:root` and `.dark` color blocks and the `@custom-variant dark` line. Unlayered variables there would override the bridge. Switch light and dark with `data-theme`; `tailwind.css` makes `dark:` follow it. The bridge only reads Surflane tokens and never redefines one.

## React Server Components

Every `@surflane/ui` module is a client module (`"use client"`). Server Components can import and render Surflane components and pass serializable props, including React elements such as `render={<Button />}`.

- Use flat part names in Server Components: `DialogRoot`, `DialogTrigger`, `TabsList`, `FieldLabel`. A Server Component cannot dot into a client export, so `<Dialog.Root>` renders as an invalid element there. The namespace form works in Client Components, and both forms refer to the same component.
- Event handlers, render functions and `className` callbacks are functions. Pass them from a Client Component.
- Non-component values such as `iconNames` and `syntaxLanguages` arrive in Server Components as client references. Read them in Client Components.

## Framework notes

### Next.js

Import the CSS file from `app/layout.tsx` and render `<html data-theme>` there. Pages can stay Server Components. See [examples/next/app/page.tsx](../examples/next/app/page.tsx).

### React Router

Import the CSS file in `app/root.tsx` and set the theme on `<html>` in `Layout`. Use a loader to read the theme cookie on the server.

### Astro

Add the React integration (`npx astro add react`). Compose Surflane parts inside a React component file and render it as an island, for example `<SurflaneDemo client:load />`. Import the CSS in the page or layout frontmatter.

### Vite

Import the CSS in `src/main.tsx` and set `data-theme` in `index.html` or in an inline script.
