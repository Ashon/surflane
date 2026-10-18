<a href="https://surflane.page"><img src="https://surflane.page/brand/lockup-light.png" alt="Surflane" width="228" /></a>

# @surflane/design-tokens

Framework-neutral design tokens for the Surflane design system: OKLCH color roles, spacing, typography, sizing and motion as CSS custom properties. Browse them in the [catalog](https://surflane.page/tokens).

```sh
npm install @surflane/design-tokens
```

## Entry points

| Export             | Contents                                                                              |
| ------------------ | ------------------------------------------------------------------------------------- |
| `tokens.css`       | Theme roles, color, spacing, sizing, typography and motion tokens                     |
| `controls.css`     | Framework-neutral control classes such as `.pui-icon-button` and `.pui-control-group` |
| `foundations.css`  | Layout composition classes such as `.pui-container` and `.pui-stack`                  |
| `presentation.css` | Native presentation classes such as `.pui-avatar`                                     |
| `typography.css`   | Opt-in document typography through `.pui-typography`                                  |
| `motion.css`       | Theme transition timing and the `data-theme-switching` state                          |
| `theme.json`       | Each theme's `chrome` color, for example for `<meta name="theme-color">`              |
| `catalog.json`     | Generated token catalog with values, aliases and source locations                     |
| `theme-transition` | `transitionTheme(update)`, a reduced-motion-aware crossfade for theme changes         |

Tokens default to the dark theme. `data-theme="light"` on `<html>` selects the light theme. Set the attribute before the first paint, for example from a cookie on the server. `data-theme="light"` or `"dark"` on any other element scopes that theme to its subtree.

The tokens and classes work without React. With React, use them together with [`@surflane/ui`](https://www.npmjs.com/package/@surflane/ui), released with the same version.

## License

Copyright (c) 2026 ashon. Licensed under either of MIT or Apache-2.0, at your option.
