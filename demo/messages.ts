// Catalog interface text in English. The Korean copy is demo/i18n/messages.ko.ts, which must keep
// these keys; data such as summaries and docs have their own overlays.

export const en = {
  skipToContent: 'Skip to content',
  brandHome: 'Surflane home',
  primarySections: 'Primary sections',
  primaryNavigation: 'Primary navigation',
  areas: {
    Overview: 'Overview',
    Foundations: 'Foundations',
    Components: 'Components',
    Patterns: 'Patterns',
    Coverage: 'Coverage',
  },
  areaNavigation: (area: string) => `${area} navigation`,
  themes: { light: 'Light', dark: 'Dark', system: 'System' },
  toggleTheme: (theme: string) => `Toggle theme: ${theme}`,
  switchTheme: (theme: string) => `Switch to ${theme} theme`,
  language: (name: string) => `Language: ${name}`,
  switchLanguageTo: (name: string) => `Switch to ${name}`,
  browseCatalog: 'Browse catalog',
  catalogSections: 'Catalog sections',
  catalogNavigation: 'Catalog navigation',
  onThisPage: 'On this page',
  sections: {
    'overview-foundations': 'Foundations first',
    'overview-components': 'Component pages',
    'overview-direction': 'Design direction',
    'coverage-scope': 'Scope and readiness',
    'coverage-waves': 'Delivery waves',
    'coverage-inventory': 'Coverage inventory',
    'coverage-ready': 'Definition of ready',
    'coverage-research': 'Research boundaries',
  },
  allFoundations: 'All foundations',
  allComponents: 'All components',
  allPatterns: 'All patterns',
  interactionLab: 'Interaction lab',
  pages: {
    '/': ['Surflane', 'Design system for platform development'],
    '/foundations': [
      'Foundations',
      'Apply shared standards for layout, typography, color, and motion.',
    ],
    '/foundations/layout': [
      'Layout',
      'Sets width, spacing, and grids for operational and reading screens.',
    ],
    '/foundations/typography': [
      'Typography',
      'Aligns the roles and reading rhythm of Hangul, Latin, and code text.',
    ],
    '/tokens': [
      'Design tokens',
      "Lists each theme's values and aliases for reference in code.",
    ],
    '/components': [
      'Components',
      'Find a component, then review its examples and usage guidance.',
    ],
    '/patterns': [
      'Patterns',
      'Compose shared components into product workflows.',
    ],
    '/coverage': [
      'Coverage',
      'Review the full web UI scope and its implementation status.',
    ],
    '/patterns/interaction-lab': [
      'Interaction lab',
      'Tests input, nested popups, panels, and themes in one example.',
    ],
    '/foundations/lab': [
      'Foundation lab',
      'Tests layout, typography, and tokens in one example.',
    ],
  } as Record<string, [string, string]>,
  notFound: [
    'Page not found',
    'Check the address or find the item in the catalog.',
  ] as [string, string],
  browseComponents: 'Browse components',
  license: '© 2026 ashon · MIT OR Apache-2.0',
  projectLinks: 'Project links',
  security: 'Security',
  closeCatalogNavigation: 'Close catalog navigation',
  closeMenu: 'Close menu',
  // Pagination's own defaults are English; the catalog passes these per language.
  pagination: {
    previous: 'Previous page',
    next: 'Next page',
    page: (page: number) => `Page ${page}`,
    more: 'More pages',
    summary: (page: number, count: number) => `Page ${page} of ${count}`,
  },
  detail: {
    baseUiReference: 'Base UI reference',
    toc: {
      preview: 'Preview',
      usage: 'Usage',
      guidelines: 'Guidelines',
      keyboard: 'Keyboard',
      code: 'Code',
      api: 'API',
      tokens: 'Tokens',
    },
    preview: 'Preview',
    previewNote:
      "Local preview. It doesn't affect real accounts, environments, or run data.",
    usage: 'Usage',
    guidelines: 'Guidelines',
    guidelinesNote:
      'Rules for real screens, each with a working design. The designs use the shipped parts and stay local.',
    sizeLead: 'Size:',
    sizeNote:
      'resizes the whole composition, including portals. The default size is Default.',
    sizeLink: 'Size guidance and comparisons',
    anatomy: 'Anatomy',
    keyboard: 'Keyboard and accessibility',
    accessibilityNote:
      "Give each control a name that describes its purpose. Connect error messages to their controls, and signal state with more than color. Automated checks don't replace manual keyboard and assistive technology testing.",
    code: 'Example code',
    codeNote:
      'Shared components take their styles from design tokens. Each example sets its own composition and accessibility attributes. The calling screen defines callbacks, refs, and product data.',
    api: 'Key API',
    apiTable: 'Component API table',
    apiCaption: (name: string) => `${name} — common wrapper props`,
    prop: 'Prop',
    contract: 'Contract',
    default: 'Default',
    apiNote:
      "The table lists the common wrapper's main props. See the package type declarations for the full types.",
    tokens: 'Related tokens',
    primitiveTitle: 'Primitive export; styling pending',
    plannedTitle: 'Implementation plan',
    primitiveBody:
      "This re-exports the original Base UI primitive. Don't treat it as a finished product component until shared styles, examples, and state testing are complete.",
    plannedBody:
      'This item is planned and tracked in coverage. It still needs a shared implementation or individual guidance, plus working behavior examples.',
    wave: (phase: number, group: string) => `Wave ${phase} / ${group}`,
    checklist: 'Acceptance checklist',
    readyNote:
      'To move to Available, the page needs the standard Preview, Usage, Keyboard, Code, API, and Tokens sections. It must also pass the common acceptance criteria above.',
    coverageLink: 'Read the coverage and delivery plan',
    related: 'Related pages',
    previous: (name: string) => `Previous: ${name}`,
    next: (name: string) => `Next: ${name}`,
  },
  library: {
    filter: 'Filter catalog',
    search: 'Search',
    searchLabel: 'Search catalog',
    searchPlaceholder: 'Name, purpose, category…',
    category: 'Category',
    categoryLabel: 'Component category',
    allCategories: 'All categories',
    readiness: 'Readiness',
    readinessLabel: 'Component readiness',
    allStages: 'All stages',
    clearFilters: 'Clear filters',
    count: (shown: number, total: number) => `${shown} / ${total} items`,
    components: (count: number) =>
      `${count} ${count === 1 ? 'component' : 'components'}`,
    empty: 'No matching items. Try a different search term or filter.',
    labTitle: 'Interaction lab',
    labBody:
      'Explore input, popups, nested panels, and themes together in one example.',
    labLink: 'Open interaction lab',
  },
  overview: {
    foundationsTitle: 'Foundations first',
    foundationsBody:
      'Review the shared tokens, typography, and layout first. Then read each component page for behavior and usage guidance.',
    layoutLink: 'Layout',
    layoutSummary: 'Width, spacing, grid',
    typographyLink: 'Typography',
    typographySummary: 'Hangul, Latin, code',
    tokensLink: 'Tokens',
    tokensSummary: 'Values, aliases, themes',
    componentsTitle: 'Component pages',
    componentsBody:
      'Each page covers examples, usage guidance, keyboard behavior, the key API, and tokens. Unimplemented items are labeled Planned. Unstyled re-exports are labeled Primitive only.',
    browseComponents: 'Browse components',
    reviewCoverage: 'Review coverage',
    directionTitle: 'Design direction',
    directionBody:
      'Surflane builds UI for platform development from consistent tokens, components, and patterns. It covers visual choices and implementation rules together. It evolves through real use and testing.',
    principle1Title: 'Surfaces first',
    principle1Body:
      'Build hierarchy with surfaces and whitespace. Use lines only where a boundary is needed.',
    principle2Title: 'Clear interaction',
    principle2Body:
      'Make state changes, focus, and keyboard and touch feedback clear.',
    principle3Title: 'Composable foundations',
    principle3Body:
      'Connect shared color, typography, spacing, and size standards through composable APIs.',
    directionNote:
      "This direction isn't a fixed, finished plan. New design decisions update the foundations and behavior examples, and refine the standards over time.",
  },
  hero: {
    eyebrow: 'Design system for platform development',
    title: 'The interface layer for platform teams.',
    lead: 'Tokens, accessible React components, and tested patterns for consoles, dashboards, and developer tools. Ready for Server Components.',
    browse: 'Browse components',
    quickStart: 'Read the quick start',
    install: 'Install',
    copyInstall: 'Copy install command',
  },
}

export type Messages = typeof en
