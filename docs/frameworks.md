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
@import "@surflane/design-tokens/tokens.css";
@import "@surflane/design-tokens/controls.css";
@import "@surflane/design-tokens/foundations.css";
@import "@surflane/design-tokens/typography.css";
@import "@surflane/ui/styles.css";
```

Add `pui-typography` to `<body>` to apply document typography, including portalled overlays. Fonts are not bundled. Load Manrope, Pretendard, JetBrains Mono or your own families in the host, for example through `@fontsource-variable/*` packages. Without them, the token font stacks fall back to system fonts.

## 3. Set the theme before paint

Tokens default to the dark theme. `data-theme="light"` on `<html>` selects the light theme. Resolve the theme before the first paint to avoid a flash:

- Server-rendered frameworks: read the preference (for example a cookie) on the server and render `<html data-theme="…">`.
- Client-only apps: set the attribute in an inline `<script>` in `<head>`, before the app bundle runs. The catalog's [`demo/index.html`](../demo/index.html) shows a cookie-based script that also supports a `system` mode.

Animate later changes with `transitionTheme` from `@surflane/design-tokens/theme-transition`. Persisting the preference belongs to the application.

`data-theme` also works on any element: `<div data-theme="dark">` renders that subtree in the dark theme inside a light page, and the reverse. Every token, including aliases such as `--control-hover-background`, resolves again inside the subtree. Use it for previews and embedded surfaces, not as a second page theme.

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
