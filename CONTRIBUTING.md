# Contributing to Surflane

Set up and run the project as [Develop](README.md#develop) describes. Word catalog text by [Writing for Surflane](docs/writing.md).

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
- A stylesheet imports `./base.css`, then the stylesheets of what its component renders, then its piece of `@surflane/design-tokens`, if it has one. `npm run check:package` fails when a stylesheet misses rules for a class its module renders.
- Rules that depend on size go in `@layer surflane.sizes`: the size scheme, a `size` variant or table density. They override a component's defaults whatever order the stylesheets load in.
- The package build flattens these imports: `scripts/build-styles.mjs` writes each stylesheet's rules alone and lists them once each, in the order `styles.css` loads them, so Tailwind CSS and plain `@import` never repeat a file.
