# Contributing to Surflane

Word catalog text by [Writing for Surflane](docs/writing.md). [Release and validation](docs/release-and-validation.md) covers what each check proves and how a release ships. A new or changed component meets the [component checklist](docs/component-checklist.md).

## Develop

Use Node.js 24.

```sh
npm ci
npm run dev                  # catalog at http://127.0.0.1:8066
npm run build:catalog        # production catalog
npm run build:pages          # the site at https://surflane.page
npm run build:brand          # PNG brand assets from the mark
npm run check:package        # exports, types, class rules and bundle budgets
npm run test:unit            # unit tests in Node, after npm run build
npm run check:ssr            # render every component in plain Node
npx playwright install chromium
npm run check:examples       # Vite, Next.js, React Router and Astro apps
npm run test:browsers        # Chromium, Firefox and WebKit, in Docker; build the catalog first
npm test                     # the full Chromium suite
npm run test:visual          # package screenshots, in Docker
```

`test:browsers` and `test:visual` run in the Playwright Linux image that CI uses, within 4 CPUs and 8 GB of memory (`SURFLANE_CONTAINER_CPUS`, `SURFLANE_CONTAINER_MEMORY`), with one worker per CPU. `test:browsers` runs on the machine's own platform; `test:visual` renders on x86-64, as CI does, so its pixels match. Each platform keeps its image under a local `surflane-playwright` tag and its Linux dependencies in a `surflane-playwright-node-modules-<platform>` volume, installed again only when the lockfile changes. Don't run Firefox or WebKit natively on macOS: WebKit's window captures leaked window-server surfaces until the window server aborted.

## Unit tests

`tests/unit` runs in Node with `node:test`, no browser. It imports the built packages through their public entry points, as an app does, so run `npm run build` first.

- **Tokens:** the `--surf-` namespace, strict `data-theme` selectors, and the contrast each role promises. `token-colors.mjs` resolves `var()`, `color-mix()` and relative `oklch()` from `catalog.json`.
- **Theme builder:** contrast math, gamut clamping, radius scaling, and the CSS `themeCss` writes.
- **Formatting:** locale, sign, precision, compact figures and missing values.
- **Rendering:** the attributes components write on the server, through `react-dom/server`.
- **Module boundaries:** which built modules are server components and which carry `'use client'`.
- **Syntax engine:** roles per token, and lines that rebuild their source exactly.

Add a unit test for logic that has an answer without a browser. Layout, focus and pixels belong to the Playwright suites.

## Check what the package looks like

`tests/package` renders the built `@surflane/ui` with only its own CSS: no catalog styles that could hide a package bug. `npm run test:visual` compares each section of the SSR fixture, in both themes, with its baseline in `tests/package/__screenshots__`.

- The test runs in the Playwright Linux image that CI uses, through Docker, so the pixels match on any machine.
- Any changed pixel fails. Open the diff in `test-results` and decide whether the change is intended.
- When it is, rewrite the baselines with `npm run test:visual -- --update-snapshots=all` and commit them with the change.
- A component the fixture doesn't show isn't covered. Add it to `tests/ssr/fixture.tsx`, which the SSR check renders too.

## Package and release

```sh
npm run pack                            # content-addressed tarballs in artifacts/
npm run export:source                   # source archive without Git history
npm run check:public                    # scan the source for private context
npm run release:version -- 0.10.0       # set every package version
npm run release:verify -- v0.10.0       # check versions, peer ranges and changelog
```

- Local tarballs are versioned `<release>-dev.<hash>`. The manifests keep the release version.
- No command copies artifacts into other repositories or updates other apps.
- The source export holds only source and configuration. It leaves out Git metadata, dependencies, logs, reports, credentials and built output.
- A pushed `v*` tag runs the release workflow. It publishes the three packages to npm with trusted publishing and provenance.
- Breaking changes ship in batches; see [Release cadence](docs/release-and-validation.md#release-cadence).

## Write catalog text in English and Korean

The catalog reads in English and Korean. English is the default and the source. Korean lives in overlays beside it. Add or change both languages in the same pull request.

### Where text lives

| Text                                                            | English                             | Korean                                                             |
| --------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------ |
| Catalog interface: rail, sidebar, page header and shared labels | `en` in `demo/messages.ts`          | `demo/i18n/messages.ko.ts`                                         |
| Catalog names, summaries, groups and stages                     | `demo/catalog.ts`                   | `demo/i18n/catalog.ko.ts`, keyed by page path, group name or stage |
| Component and pattern docs: `usage`, `avoid`, `keyboard`, props | `demo/*Docs.ts`                     | `demo/i18n/docs/*.ko.ts`, keyed by item id; props by prop name     |
| Page and example text                                           | `en` in `demo/i18n/pages/<Page>.ts` | `ko` in the same file                                              |

A new `demo/i18n/docs/*.ko.ts` file loads without registration. The interface text and catalog data load as one Korean chunk through `demo/i18n/ko.ts`, only when a reader chooses Korean, so keep them out of the initial bundle: import them only from that file.

### Rules

- **Keep visible and accessible text out of JSX.** This covers headings, labels, `aria-label`, `aria-valuetext`, `title`, `placeholder`, toasts and validation errors. Put the text in the page's overlay and read it with `const t = text[useLocale().locale]`.
- **Give a new page its own overlay.** Name it after the page file:

  ```ts
  import type { Locale } from '../../i18n'

  const en = {
    title: 'Deployments',
    rows: (n: number) => `${n.toLocaleString('en-US')} rows`,
  }
  export const text: Record<Locale, typeof en> = {
    en,
    ko: {
      title: '배포',
      rows: (n: number) => `${n.toLocaleString('ko-KR')}개 행`,
    },
  }
  ```

- **Make text that holds a value a function.** Korean orders words differently, so don't join fragments such as `count + ' rows'`. Format numbers and dates inside the function with that language's locale, `en-US` or `ko-KR`.
- **Keep the same keys and arguments in both languages.** The type check fails on a missing Korean key in the interface or a page overlay. The catalog and docs overlays fall back to English instead, so nothing warns you there. Add those Korean entries yourself.
- **Keep API names in English.** Component names stay English in Korean text; foundation and pattern names are translated. Write prop, part, token and key names as the API spells them, and keep values such as `44px` and `4.5:1` unchanged.
- **Leave package defaults in English.** Built-in labels in `packages/ui` are English, and products pass their own.
- **Expect some text to stay English.** `llms.txt` and the Markdown page copies are generated from the English sources. Catalog `criteria` and `basis` have no Korean overlay yet.

### Korean style

Word Korean by the [Korean](docs/writing.md#korean) rules in the writing guide.

### Check both languages

- Switch languages with the rail button. It shows the other language: 가 on English pages, A on Korean pages.
- Run `npm run check:catalog`. It type-checks the catalog, including the interface and page overlays.
- Tests find controls by their English names, so update a test whenever an English name changes. `tests/i18n.spec.ts` renders every catalog page in Korean and fails on any page error. Run it with the tests for the pages you changed.

## Put styles in the component's stylesheet

- Each styled module has a stylesheet beside it, such as `packages/ui/src/menu.css` next to `menu.tsx`. Its rules style the classes that module renders. Rules that several components share live in an internal stylesheet, such as `choice.css` or `popup.css`, which each of them imports.
- A stylesheet imports `./base.css`, then the stylesheets of what its component renders, then its piece of `@surflane/css`, if it has one. `npm run check:package` fails when a stylesheet misses rules for a class its module renders.
- Rules that depend on size go in `@layer surflane.sizes`: the size scheme, a `size` variant or table density. They override a component's defaults whatever order the stylesheets load in.
- The package build flattens these imports: `scripts/build-styles.mjs` writes each stylesheet's rules alone and lists them once each, in the order `styles.css` loads them, so Tailwind CSS and plain `@import` never repeat a file.
