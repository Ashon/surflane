# Catalog coverage

The canonical registry is demo/catalog.ts. The current scope contains <!-- catalog-counts -->12 foundations, 68 components and 13 patterns<!-- /catalog-counts -->. Availability means that an implementation, example and documentation exist; it does not imply certification or adoption by any external application.

## Foundations

Layout and spacing, typography, design tokens, color and contrast, iconography, interaction states, motion and theme, accessibility, content and localization, and layers describe common composition contracts. The color foundation measures 72 semantic foreground/background pairs in the active browser theme. Layout guides are overlays and must not move the UI they explain.

## Components

Actions, forms, selection, overlays, navigation, data display, structure and feedback are grouped by the registry. The catalog includes shared sizing, Button visual priorities, chart summaries and table alternatives, code highlighting and safe Markdown rendering. Search and readiness filters retain category grouping and accessible counts.

Base UI owns primitive keyboard and focus behavior. Adapters preserve native form values, cancellation, controlled state, reset and external form ownership. Specialized chart, date, tree, highlighting and Markdown behavior uses the dependencies declared in the UI package manifest. Documentation must describe actual implemented behavior rather than inventing an unavailable primitive.

## Patterns

Patterns compose reusable components into fictional application flows: app shells, page headers, resource lists, filtering, tables, forms, asynchronous jobs, recovery, command search and documentation. Options live outside the framed preview. Example actions remain local; examples do not authenticate users, request real application data or write to remote services.

## Acceptance criteria

- Public types, root/subpath entry points and actual package exports agree.
- Keyboard focus, names, dismissal, native submission/reset and error recovery remain testable.
- Both themes, narrow reflow, reduced motion, text enlargement, directionality and touch targets have automated coverage where supported by the engine.
- Colors meet the criteria stated for their semantic role, with status labels and non-color cues.
- Async examples reject stale results and preserve user-owned state.
- Code and Markdown preserve source text, safe URL handling and accessible scroll/copy behavior.
- Bundle budgets, source-context scanning and local packing pass before preparing an artifact.

Run npm run build:catalog, npm run check:package, npm run check:public and the Playwright suites described in README. Report actual results for the current source revision. Manual assistive-technology and device checks remain separate from automated Axe and browser emulation.

## Public references

- [Base UI](https://base-ui.com/react/overview/about)
- [Base UI accessibility](https://base-ui.com/react/overview/accessibility)
- [WAI-ARIA patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WCAG non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
