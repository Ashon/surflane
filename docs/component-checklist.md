# Component checklist

What a component must satisfy before it ships, and what enforces each rule. Use it as the definition of done for a new component and as the review list for a changed one. A rule with no automated check names the review that holds it.

The foundation pages explain why each rule exists: [Visual hierarchy](https://surflane.page/foundations/hierarchy), [Interaction states](https://surflane.page/foundations/interaction), [Layout](https://surflane.page/foundations/layout), [Accessibility](https://surflane.page/foundations/accessibility) and [Content and localization](https://surflane.page/foundations/content). This page only gathers the rules and their checks.

## Package shape

| Rule                                                                        | Enforced by                          |
| --------------------------------------------------------------------------- | ------------------------------------ |
| One module per catalog page, with an entry point of the same name           | `check:package`                      |
| A `.css` entry per styled module, listed in `styles.css`                    | `check:package`                      |
| Each `.css` entry styles every class its module renders                     | `check:package`                      |
| Every class a stylesheet selects is rendered, and every rendered one styled | `check:package`                      |
| Only `surf-` classes; hooks for apps listed as hooks                        | `check:package`                      |
| A flat export for every namespace part (`Dialog.Root` and `DialogRoot`)     | `check:package`                      |
| Every stylesheet declares the layer order first; no nested imports          | `check:package`                      |
| Optional peers stay off the root entry                                      | `check:package`                      |
| Glyphs come from `Icon`, not inline SVG                                     | `check:package`                      |
| Renders on the server without a DOM, and the markup hydrates                | `check:ssr`, `tests/ssr/fixture.tsx` |
| CSS-only classes for presentation parts in `@surflane/css`                  | Review                               |

## Planes, lines and states

| Rule                                                                 | Enforced by                                                             |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Structure by planes before elevation, lines and points               | Review, [Visual hierarchy](https://surflane.page/foundations/hierarchy) |
| A recess reads `--surf-recessed`, which follows the plane it sits on | Review                                                                  |
| Hover and pressed are one state layer, a `background-image`          | `check:package`                                                         |
| Selected and current fills set `background-color` alone              | `check:package`                                                         |
| A selection restates itself in forced colors, with Highlight         | `check:package`, `forced-colors.spec.ts`                                |
| A popup keeps an edge in forced colors                               | `forced-colors.spec.ts`                                                 |
| Disabled fades the control alone and ignores input                   | `disabled-states.spec.ts`                                               |
| Read-only shows its value on the surface plane                       | `state-styles.spec.ts`                                                  |
| Status never by color alone: a word names it                         | Review, docs `avoid`                                                    |

## Type, space and size

| Rule                                                                              | Enforced by                                 |
| --------------------------------------------------------------------------------- | ------------------------------------------- |
| Type through role tokens or the size scheme, never a literal                      | `check:package`                             |
| Containers of app content wrap with `break-word`; only text parts take `anywhere` | `check:package`, `content-wrapping.spec.ts` |
| Literal lengths only fall, never rise                                             | `check:package` (ceiling)                   |
| `size`: small, default, large, following `SizeProvider`                           | `component-sizes.spec.ts`                   |
| Compact density makes nothing larger                                              | `density.spec.ts`                           |
| Compact keeps targets at 24px or more                                             | `touch-targets.spec.ts`                     |
| Touch targets reach 44px on coarse pointers                                       | `touch-targets.spec.ts`                     |

## Interaction

| Rule                                                                  | Enforced by                                        |
| --------------------------------------------------------------------- | -------------------------------------------------- |
| Keyboard focus draws one ring; a pointer press does not               | `focus-visibility.spec.ts`                         |
| No ring is clipped, at any width                                      | `focus-visibility.spec.ts`                         |
| Every keyboard stop in a preview shows focus                          | `focus-visibility.spec.ts`                         |
| Keys follow the WAI-ARIA pattern for the role                         | `keyboard-contracts.spec.ts`, the component's spec |
| Popups return focus where they opened; a dismissed part moves it on   | The component's spec                               |
| Nothing moves under reduced motion                                    | `reduced-motion.spec.ts`                           |
| Sides are logical, so right to left mirrors; physical ones are listed | `check:package`                                    |
| Popups follow `DirectionProvider`                                     | The component's spec                               |
| A shortcut is written with `Kbd` and its platform modifier            | Review                                             |

## API vocabulary

| Prop                                  | Means                                                                                                                 |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `size`                                | A scale: small, default, large                                                                                        |
| `variant`                             | A visual style or a type role                                                                                         |
| `tone`                                | A status meaning: neutral, info, success, danger, caution, progress                                                   |
| `density`                             | default or compact, following the surrounding density                                                                 |
| `labels`                              | Every text a component writes, as strings or functions; a client component also reads its group from `LabelsProvider` |
| `closeLabel`, `dismissLabel`          | One name a component writes                                                                                           |
| `labelHidden`                         | A label hidden from sight that stays the accessible name                                                              |
| `open`, `defaultOpen`, `onOpenChange` | Controlled and uncontrolled state, as in Base UI                                                                      |

`check:package` rejects misspelled Button variants and sizes. The rest is held in review against this table.

## Catalog and docs

| Rule                                                        | Enforced by                                             |
| ----------------------------------------------------------- | ------------------------------------------------------- |
| A catalog page: registry entry, example, docs               | `check:package`, `catalog.spec.ts`                      |
| Docs list only real tokens                                  | `catalog.spec.ts`                                       |
| Every page renders without console errors                   | `catalog.spec.ts`                                       |
| Every page passes axe at 320 and 1440px, light and dark     | `catalog.spec.ts`                                       |
| Korean docs, summary and example text                       | `i18n.spec.ts`, [Writing for Surflane](writing.md)      |
| Examples pass their own labels in Korean                    | `i18n.spec.ts`, `labels.spec.ts`                        |
| A section in the SSR fixture, so screenshots cover it       | `test:visual`                                           |
| A unit test for what renders on the server                  | `tests/unit/render.test.mjs`                            |
| A CHANGELOG entry under Unreleased                          | Review; `release:verify` requires the release's section |
| The catalog counts in README and `docs/catalog-coverage.md` | Written by `build:llms`                                 |

## Before a commit

Run the chain in this order, and commit only when it passes:

```sh
npm run build:catalog && npm run check:package && npm run check:ssr && npm run check:tailwind && npm run test:unit && npx playwright test && npm run test:browsers && npm run test:visual
```

Add `npm run check:examples` when the examples or the package's entry points change. Don't run the Chromium suite and the Docker screenshots at the same time: they share `test-results`.
