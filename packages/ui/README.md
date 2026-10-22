<a href="https://surflane.page"><img src="https://surflane.page/brand/lockup-light.png" alt="Surflane" width="228" /></a>

# @surflane/ui

React 19 components for the Surflane design system, built on [Base UI](https://base-ui.com), with data, chart, date, tree, code highlighting and Markdown components. Browse them in the [catalog](https://surflane.page).

```sh
npm install @surflane/ui @surflane/design-tokens
```

`@surflane/ui` and `@surflane/design-tokens` are released together with the same version. The package is ESM-only.

## Usage

Import the stylesheets once at the application root. `all.css` brings the tokens, controls, composition, document typography and component styles:

```css
@import '@surflane/ui/all.css';
```

The rules sit in `surflane.*` cascade layers, so your unlayered CSS overrides them. Set `data-theme="light"` or `data-theme="dark"` on `<html>` before the first paint and add `pui-typography` to `<body>`.

```tsx
import {
  Button,
  DialogContent,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@surflane/ui'

export function Example() {
  return (
    <DialogRoot>
      <DialogTrigger render={<Button variant='primary' />}>Open</DialogTrigger>
      <DialogContent>
        <DialogTitle>Surflane</DialogTitle>
      </DialogContent>
    </DialogRoot>
  )
}
```

Compound components are available both as namespaces (`Dialog.Root`) and as flat names (`DialogRoot`). Use flat names in React Server Components, which cannot dot into client exports. Subpath entry points such as `@surflane/ui/button` and `@surflane/ui/dialog` keep bundles small.

## Frameworks

Next.js (App Router), React Router, Astro and Vite are verified in CI with example applications. See [framework integration](https://github.com/Ashon/surflane/blob/main/docs/frameworks.md) and [examples](https://github.com/Ashon/surflane/tree/main/examples).

## License

Copyright (c) 2026 ashon. Licensed under either of MIT or Apache-2.0, at your option.
