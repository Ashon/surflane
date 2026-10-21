<h1>
  <a href="https://surflane.page">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="demo/public/brand/lockup-dark.png" />
      <img src="demo/public/brand/lockup-light.png" alt="Surflane" width="228" />
    </picture>
  </a>
</h1>

A design system for platform development. Surflane connects reusable React components, framework-neutral tokens and application patterns with an [interactive catalog](https://surflane.page) of implementation guidance and working examples.

The catalog contains 10 foundations, 58 components and 12 patterns. Availability describes implemented examples, not accessibility certification. All application names, accounts, services and data in examples are fictional.

## Develop

Requires Node.js 24 and React 19 for UI consumers.

```sh
npm ci
npm run dev                 # http://127.0.0.1:8066
npm run build:catalog
npm run build:pages         # catalog site, https://surflane.page
npm run build:brand         # render PNG brand assets from the mark
npm run check:package
npm run check:ssr            # server-render every component in plain Node
npx playwright install chromium firefox webkit
npm run check:examples       # Vite, Next.js, React Router and Astro apps
npm run test:browsers        # production catalog must be built first
npm test                    # full Chromium suite
```

The catalog ships in English and Korean. Read [CONTRIBUTING.md](CONTRIBUTING.md) before you add or change catalog text.

## Packages

- `@surflane/design-tokens`: framework-neutral color, spacing, typography, sizing and motion tokens.
- `@surflane/ui`: React components built on Base UI, plus data, chart, code and Markdown components.

Both packages are released together with the same version under the `@surflane` npm scope. Install them with `npm install @surflane/ui @surflane/design-tokens`; the packages are ESM-only and require React 19.

```tsx
import '@surflane/design-tokens/tokens.css';
import '@surflane/design-tokens/controls.css';
import '@surflane/design-tokens/foundations.css';
import '@surflane/design-tokens/typography.css';
import '@surflane/ui/styles.css';
import { Button } from '@surflane/ui/button';
import { Input } from '@surflane/ui/input';

<Input name="name" aria-label="Name" />
<Button variant="primary" type="submit">Save</Button>
```

Surflane supports React Server Components, SSR and client-only apps. [Framework integration](docs/frameworks.md) covers Next.js, React Router, Astro and Vite, and [examples](examples) contains a verified app for each. In Server Components, use flat part names such as `DialogRoot` and `TabsList` instead of `Dialog.Root`.

Load the fonts once in the host application. The catalog demonstrates Manrope, Pretendard, JetBrains Mono and Noto Sans JP through their independent font packages. Theme persistence, authentication, routing and application data belong to the consuming application.

## Design direction

Surfaces establish hierarchy, with outlines reserved for boundaries and explicit outline variants. Colors use OKLCH and semantic roles. Text selection is neutral. Small/default/large sizing, reduced motion, keyboard focus, localized content and touch targets share common contracts.

These principles evolve through explicit design decisions and working examples. New direction belongs in the relevant foundation, component or pattern, with its tokens and interaction guidance kept in sync.

Root imports remain available. Explicit entry points include button, input, select, slot, popover, tooltip, dialog, sizing, chart, markdown and syntax-highlighter. Every namespace part also has a flat export with the same component, for example `Dialog.Trigger` and `DialogTrigger`. Button variants are primary, secondary, outline, ghost, destructive and link; default aliases primary. Component docs and live examples describe their detailed API.

## Artifacts and release checks

```sh
npm run pack            # local content-addressed package tarballs
npm run export:source   # clean source directory + tarball, without Git history
npm run check:public    # scan distributable source for private context
npm run release:version -- 0.2.0  # set both package versions
npm run release:verify -- v0.2.0  # check versions, peer range and changelog
```

`pack:local` is an alias for local packing. Local tarballs use a `-dev.<hash>` prerelease of the release version without changing the manifests. No command copies artifacts into neighboring repositories or updates other applications. The source export includes only project source/configuration; it excludes Git metadata, dependencies, local logs, reports, credentials, built catalog output and old artifacts.

Pushing a `v*` tag runs the release workflow, which publishes both packages to npm with trusted publishing and provenance. See [release validation](docs/release-and-validation.md), [changelog](CHANGELOG.md) and [source preparation](docs/source-preparation.md). The package scope and CSS namespace changed as part of this independent edition. Consumers must update imports and any custom `pui-*` selectors together; no legacy namespace adapter is shipped.

## License

Copyright (c) 2026 ashon. Licensed under either of [MIT](LICENSE-MIT) or [Apache-2.0](LICENSE-APACHE), at your option (`MIT OR Apache-2.0`). Third-party dependencies, including font packages, retain their own licenses.
