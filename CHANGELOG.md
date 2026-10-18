# Changelog

`@surflane/design-tokens` and `@surflane/ui` are released together with the same version. During 0.x, a minor version may change public API or visual contracts; patch versions do not.

## 0.1.0

First npm release.

- `@surflane/design-tokens`: OKLCH color roles, spacing, typography, sizing and motion tokens as CSS custom properties, the token catalog and `transitionTheme`.
- `@surflane/ui`: React 19 components built on Base UI, plus chart, date, tree, code highlighting and Markdown components. Root and subpath entry points are ESM with type declarations.
- React Server Components: every namespace part also has a flat export (`DialogRoot`, `DialogTrigger`, `TabsList`, ...), so Server Components can render compound components without dotting into a client module.
- Scoped themes: `data-theme` on any element re-themes its subtree, including alias tokens.
- Dual licensed under MIT or Apache-2.0.
