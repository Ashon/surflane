<a href="https://surflane.page"><img src="https://surflane.page/brand/lockup-light.png" alt="Surflane" width="228" /></a>

# @surflane/design-tokens

Framework-neutral design tokens for the Surflane design system: OKLCH color roles, spacing, typography, sizing and motion as CSS custom properties. Browse them in the [catalog](https://surflane.page/tokens).

```sh
npm install @surflane/design-tokens
```

## Entry points

| Export             | Contents                                                                             |
| ------------------ | ------------------------------------------------------------------------------------ |
| `tokens.css`       | Theme roles, color, spacing, sizing, typography and motion tokens                    |
| `motion.css`       | Theme transition timing and the `data-theme-switching` state                         |
| `theme.json`       | Each theme's `chrome` color, for example for `<meta name="theme-color">`             |
| `catalog.json`     | Generated token catalog with values, aliases and source locations                    |
| `tailwind.css`     | Tailwind CSS v4 theme: utilities such as `bg-canvas`, `p-page` and `rounded-sheet`   |
| `theme-transition` | `transitionTheme(update)`, a reduced-motion-aware crossfade for theme changes        |
| `themes/*.css`     | Theme presets: neutral tints, accents and radius scales, layered above the tokens    |
| `theme-builder`    | `createTheme` and `themeCss` for your own neutral, accent and radius inputs          |
| `shadcn.css`       | shadcn/ui variables such as `--background` and `--primary` mapped to Surflane tokens |

The CSS-only classes that once shipped here, such as controls, layout composition, presentation and document typography, are in [`@surflane/css`](https://www.npmjs.com/package/@surflane/css).

Tokens default to the dark theme. `data-theme="light"` on `<html>` selects the light theme. Set the attribute before the first paint, for example from a cookie on the server. `data-theme="light"` or `"dark"` on any other element scopes that theme to its subtree.

A theme changes the neutral tint, the accent and the radius scale while lightness, and so contrast, stays fixed. See [Themes](https://github.com/Ashon/surflane/blob/main/docs/frameworks.md#themes), or build one in the [theme builder](https://surflane.page/foundations/themes).

Every stylesheet puts its rules in the `surflane.tokens`, `surflane.themes`, `surflane.base`, `surflane.components` and `surflane.sizes` cascade layers, so your unlayered CSS overrides them. See [Cascade layers](https://github.com/Ashon/surflane/blob/main/docs/frameworks.md#cascade-layers).

With Tailwind CSS v4, `tailwind.css` maps the tokens to utilities that read them, so utilities follow scoped themes too. See [Tailwind CSS v4](https://github.com/Ashon/surflane/blob/main/docs/frameworks.md#tailwind-css-v4) for the imports.

The tokens and classes work without React. With React, use them together with [`@surflane/ui`](https://www.npmjs.com/package/@surflane/ui), released with the same version.

## License

Copyright (c) 2026 ashon. Licensed under either of MIT or Apache-2.0, at your option.
