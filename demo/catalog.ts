export type Stage = 'available' | 'primitive' | 'planned'
export type Kind = 'component' | 'pattern' | 'foundation'
// A top-level shelf of the catalog. A component sits under /components unless the
// registry gives it a section of its own; charts read as components and earn /charts.
export type Section = 'charts'
export type CatalogItem = {
  id: string
  name: string
  group: string
  kind: Kind
  /** The section holding the page, when it is not the one its kind defaults to. */
  section?: Section
  stage: Stage
  phase: 0 | 1 | 2 | 3
  summary: string
  basis: string
  upstream?: string
}
export const stageLabels: Record<Stage, string> = {
  available: 'Available',
  primitive: 'Primitive only',
  planned: 'Planned',
}
const base = 'https://base-ui.com/react/components/'
const ready = new Set([
  'syntax-highlighter',
  'markdown',
  'chart',
  'scatter-chart',
  'date-picker',
  'time-range-picker',
  'tree',
  'file-upload',
  'toast',
  'otp-field',
  'navigation-menu',
  'context-menu',
  'preview-card',
  'toggle',
  'toggle-group',
  'segmented-control',
  'theme-switch',
  'toolbar',
  'menubar',
  'autocomplete',
  'slider',
  'combobox',
  'number-field',
  'card',
  'code',
  'pagination',
  'bottom-navigation',
  'table',
  'list',
  'stat',
  'description-list',
  'timeline',
  'sparkline',
  'bar-list',
  'proportion-bar',
  'diverging-bar',
  'inline-message',
  'banner',
  'empty-state',
  'progress',
  'meter',
  'spinner',
  'skeleton',
  'data-state',
  'tabs',
  'accordion',
  'collapsible',
  'avatar',
  'badge',
  'kbd',
  'separator',
  'link',
  'breadcrumbs',
  'field',
  'fieldset',
  'form',
  'textarea',
  'checkbox',
  'checkbox-group',
  'radio-group',
  'switch',
  'button',
  'input',
  'select',
  'native-select',
  'popover',
  'menu',
  'tooltip',
  'dialog',
  'alert-dialog',
  'sheet',
  'drawer',
  'scroll-area',
])
const raw = new Set<string>()
const definitions: [string, string, string, string, 0 | 1 | 2 | 3][] = [
  ['button', 'Button', 'Actions', 'Runs an action with a clear label.', 0],
  ['input', 'Input', 'Forms', 'Accepts short text and identifiers.', 0],
  ['select', 'Select', 'Forms', 'Picks one option from a fixed list.', 0],
  [
    'native-select',
    'NativeSelect adapter',
    'Forms',
    'Connects existing HTML option markup to the shared Select.',
    0,
  ],
  [
    'field',
    'Field',
    'Forms',
    'Connects a label, help text, error, and value.',
    1,
  ],
  ['fieldset', 'Fieldset', 'Forms', 'Groups related inputs under a legend.', 1],
  ['form', 'Form', 'Forms', 'Reports validation and submission results.', 1],
  ['textarea', 'Textarea', 'Forms', 'Accepts multi-line descriptions.', 1],
  [
    'checkbox',
    'Checkbox',
    'Selection',
    'Selects any number of independent options.',
    1,
  ],
  [
    'checkbox-group',
    'Checkbox Group',
    'Selection',
    'Connects multiple selections to a select-all checkbox.',
    1,
  ],
  [
    'radio-group',
    'Radio Group',
    'Selection',
    'Selects one of several mutually exclusive options.',
    1,
  ],
  [
    'switch',
    'Switch',
    'Selection',
    'Toggles a setting that applies immediately.',
    1,
  ],
  [
    'toggle',
    'Toggle',
    'Selection',
    'Switches between pressed and unpressed states.',
    2,
  ],
  [
    'toggle-group',
    'Toggle Group',
    'Selection',
    'Selects tool modes and display options.',
    2,
  ],
  [
    'segmented-control',
    'Segmented control',
    'Selection',
    'Chooses one value from a few, such as a period or a side.',
    2,
  ],
  [
    'theme-switch',
    'Theme switch',
    'Selection',
    'Chooses light, dark or the device setting, and remembers it.',
    2,
  ],
  [
    'combobox',
    'Combobox',
    'Forms',
    'Searches a list of options and selects one.',
    1,
  ],
  [
    'autocomplete',
    'Autocomplete',
    'Forms',
    'Browses suggestions while keeping the typed text.',
    2,
  ],
  [
    'number-field',
    'Number Field',
    'Forms',
    'Controls a numeric range with increment and decrement.',
    2,
  ],
  ['slider', 'Slider', 'Forms', 'Adjusts a value within a range.', 2],
  [
    'otp-field',
    'OTP Field',
    'Forms',
    'Accepts a one-time code split into separate slots.',
    3,
  ],
  [
    'date-picker',
    'Date / time picker',
    'Forms',
    'Accepts dates, times, and ranges in locale-specific formats.',
    3,
  ],
  [
    'time-range-picker',
    'Time range picker',
    'Forms',
    'Picks the span back from now a monitoring screen shows and how often it refreshes.',
    2,
  ],
  [
    'file-upload',
    'File upload',
    'Forms',
    'Explains file limits and upload status.',
    3,
  ],
  [
    'popover',
    'Popover',
    'Overlays',
    'Offers secondary tasks next to the trigger.',
    0,
  ],
  [
    'menu',
    'Menu',
    'Overlays',
    'Collects the actions for the current context.',
    0,
  ],
  [
    'context-menu',
    'Context Menu',
    'Overlays',
    'Opens actions on right-click or long press, with a visible menu fallback.',
    2,
  ],
  [
    'tooltip',
    'Tooltip',
    'Overlays',
    'Shows a short supplementary description on focus and hover.',
    0,
  ],
  [
    'preview-card',
    'Preview Card',
    'Overlays',
    "Previews a link's destination.",
    3,
  ],
  [
    'dialog',
    'Dialog',
    'Overlays',
    'Opens a standalone task that needs full attention.',
    0,
  ],
  [
    'alert-dialog',
    'Alert Dialog',
    'Overlays',
    'Asks for an explicit response before an action that can lose data.',
    0,
  ],
  [
    'sheet',
    'Sheet',
    'Overlays',
    'Opens a detail panel anchored to one side.',
    0,
  ],
  [
    'drawer',
    'Drawer',
    'Overlays',
    'Opens a task panel that closes with a swipe.',
    0,
  ],
  [
    'tabs',
    'Tabs',
    'Navigation',
    'Switches between panels in the same context.',
    1,
  ],
  [
    'accordion',
    'Accordion',
    'Navigation',
    'Expands details linked to their headings.',
    1,
  ],
  [
    'collapsible',
    'Collapsible',
    'Navigation',
    "Collapses and expands one section's details.",
    1,
  ],
  [
    'navigation-menu',
    'Navigation Menu',
    'Navigation',
    'Navigates related pages hierarchically.',
    2,
  ],
  [
    'menubar',
    'Menubar',
    'Navigation',
    'Navigates several action menus in one row.',
    3,
  ],
  [
    'toolbar',
    'Toolbar',
    'Actions',
    'Groups related tools for keyboard navigation.',
    2,
  ],
  ['link', 'Link', 'Navigation', 'Navigates to a clear destination.', 1],
  [
    'breadcrumbs',
    'Breadcrumbs',
    'Navigation',
    'Shows the current location and its parent path.',
    1,
  ],
  [
    'pagination',
    'Pagination',
    'Navigation',
    'Pages through large result sets.',
    2,
  ],
  [
    'bottom-navigation',
    'Bottom navigation',
    'Navigation',
    "Puts a phone's main destinations along the bottom edge.",
    2,
  ],
  [
    'avatar',
    'Avatar',
    'Data display',
    'Shows images for users and groups, with a fallback.',
    1,
  ],
  [
    'badge',
    'Badge / Status',
    'Data display',
    'Shows status with color, icon, and text together.',
    1,
  ],
  [
    'description-list',
    'Description list',
    'Data display',
    "Shows a resource's properties as terms and their values.",
    1,
  ],
  [
    'timeline',
    'Timeline',
    'Data display',
    'Shows events in time order, such as a deploy history or an audit log.',
    2,
  ],
  [
    'kbd',
    'Kbd',
    'Data display',
    'Writes a key or shortcut the way this platform does.',
    1,
  ],
  [
    'card',
    'Card / Surface',
    'Data display',
    'Groups only related information on a single surface.',
    1,
  ],
  [
    'table',
    'Table',
    'Data display',
    'Compares information in aligned rows and columns.',
    1,
  ],
  [
    'code',
    'Code block',
    'Data display',
    'Displays long identifiers and code with a copy action.',
    2,
  ],
  [
    'syntax-highlighter',
    'Syntax highlighter',
    'Data display',
    'Renders code in each language safely and legibly.',
    2,
  ],
  [
    'markdown',
    'Markdown',
    'Data display',
    'Renders documents, code, and tables in a shared reading style.',
    2,
  ],
  [
    'list',
    'List',
    'Data display',
    'Keeps repeated content and its actions aligned.',
    1,
  ],
  [
    'stat',
    'Stat',
    'Data display',
    'Shows a key figure with its change and what it covers.',
    2,
  ],
  [
    'tree',
    'Tree view',
    'Data display',
    'Navigates nested resources with the keyboard.',
    3,
  ],
  [
    'chart',
    'Chart',
    'Charts',
    'Shows trends with units, a legend, and an alternative table.',
    3,
  ],
  [
    'scatter-chart',
    'Scatter chart',
    'Charts',
    'Plots two measures per item, with reference lines that split it into quadrants.',
    3,
  ],
  [
    'sparkline',
    'Sparkline',
    'Charts',
    'Draws a small trend line inside a card or a table cell.',
    2,
  ],
  [
    'bar-list',
    'Bar list',
    'Charts',
    'Ranks named values with bars in proportion to the largest.',
    2,
  ],
  [
    'proportion-bar',
    'Proportion bar',
    'Charts',
    'Splits one bar into the parts of a whole, with a legend of their shares.',
    2,
  ],
  [
    'diverging-bar',
    'Diverging bar',
    'Charts',
    'Draws a signed value from a center line, a rise one way and a fall the other.',
    2,
  ],
  [
    'scroll-area',
    'Scroll Area',
    'Structure',
    'Adds horizontal and vertical scrolling within a layout.',
    0,
  ],
  [
    'separator',
    'Separator',
    'Structure',
    'Draws a full-width or inset boundary.',
    1,
  ],
  [
    'progress',
    'Progress',
    'Feedback',
    "Shows how much of a task is complete, or that it's running.",
    2,
  ],
  [
    'meter',
    'Meter',
    'Feedback',
    'Shows a measurement within a known range.',
    2,
  ],
  [
    'toast',
    'Toast',
    'Feedback',
    'Announces task results without blocking the flow.',
    1,
  ],
  [
    'data-state',
    'Data state',
    'Feedback',
    'Shows loading, an error with a retry, empty and stale data around any content.',
    2,
  ],
  [
    'banner',
    'Banner',
    'Feedback',
    'Tells everyone about a state of the whole product, across the app shell.',
    2,
  ],
  [
    'inline-message',
    'Inline message',
    'Feedback',
    'Explains information, warnings, and errors in the current context.',
    1,
  ],
  ['spinner', 'Spinner', 'Feedback', 'Indicates progress for short tasks.', 1],
  [
    'skeleton',
    'Skeleton',
    'Feedback',
    "Shows the content's structure while it loads.",
    1,
  ],
  [
    'empty-state',
    'Empty state',
    'Feedback',
    'Explains why there are no results and what to do next.',
    1,
  ],
]
const nonBase = new Set([
  'syntax-highlighter',
  'markdown',
  'native-select',
  'textarea',
  'date-picker',
  'time-range-picker',
  'file-upload',
  'sheet',
  'link',
  'breadcrumbs',
  'pagination',
  'bottom-navigation',
  'badge',
  'description-list',
  'timeline',
  'kbd',
  'card',
  'table',
  'code',
  'list',
  'stat',
  'sparkline',
  'bar-list',
  'proportion-bar',
  'diverging-bar',
  'tree',
  'chart',
  'scatter-chart',
  'inline-message',
  'banner',
  'spinner',
  'skeleton',
  'empty-state',
  'segmented-control',
  'theme-switch',
  'data-state',
])
const specialized = new Set([
  'date-picker',
  'file-upload',
  'tree',
  'chart',
  'scatter-chart',
])
// The registry's Charts group is the one component group with its own section: the
// six chart pages read at /charts, so the group name is what puts them there.
const chartGroup = 'Charts'
export const components: CatalogItem[] = definitions.map(
  ([id, name, group, summary, phase]) => ({
    id,
    name,
    group,
    summary,
    phase,
    kind: 'component',
    section: group === chartGroup ? 'charts' : undefined,
    stage: ready.has(id) ? 'available' : raw.has(id) ? 'primitive' : 'planned',
    basis:
      id === 'syntax-highlighter'
        ? 'Shiki TextMate composition'
        : id === 'markdown'
          ? 'react-markdown / remark-gfm composition'
          : id === 'segmented-control' || id === 'theme-switch'
            ? 'Base UI ToggleGroup composition'
            : id === 'native-select'
              ? 'Compatibility adapter'
              : id === 'sheet'
                ? 'Base UI Dialog composition'
                : id === 'date-picker'
                  ? 'React Aria / internationalized date composition'
                  : id === 'chart' || id === 'scatter-chart'
                    ? 'Recharts composition'
                    : id === 'tree'
                      ? 'Headless Tree / TanStack Virtual composition'
                      : id === 'file-upload'
                        ? 'Native file input / Base UI Field composition'
                        : specialized.has(id)
                          ? 'Library evaluation / product composition'
                          : nonBase.has(id)
                            ? 'Semantic HTML / product composition'
                            : 'Base UI',
    upstream: nonBase.has(id) ? undefined : base + id,
  }),
)
/** Components the catalog lists on their own shelf; every one is kind 'component'. */
export const charts: CatalogItem[] = components.filter(
  (item) => item.section === 'charts',
)
/** The pages listed under /components. The charts are listed under /charts. */
export const componentPages: CatalogItem[] = components.filter(
  (item) => !item.section,
)
const patternDefinitions: [string, string, string, 1 | 2 | 3][] = [
  [
    'app-shell',
    'App shell / Sidebar',
    'Frames content with collapsible navigation, brand and theme on top, account below.',
    1,
  ],
  [
    'page-header',
    'Page header',
    'Aligns and spaces the breadcrumb, title, description, and actions.',
    1,
  ],
  [
    'filter-bar',
    'Search / filter bar',
    'Connects search, filters, applied state, and reset.',
    1,
  ],
  [
    'data-table',
    'Data table',
    'Connects selection, sorting, filters, column settings, and pagination.',
    2,
  ],
  [
    'resource-list',
    'Resource list',
    'Connects item padding, hover areas, status, and detail links.',
    1,
  ],
  [
    'inline-confirmation',
    'Inline confirmation',
    'Confirms a lightweight action next to the control that triggered it.',
    1,
  ],
  [
    'form-workflow',
    'Form workflow',
    'Connects input, validation, server errors, and pending and success states.',
    1,
  ],
  [
    'async-job',
    'Async job / Run detail',
    'Connects queued, running, canceled, and partially failed states to build logs.',
    2,
  ],
  [
    'documentation',
    'Documentation page',
    'Organizes body text, table of contents, code, callouts, and language switching.',
    2,
  ],
  [
    'command-search',
    'Command search',
    'Connects quick navigation, commands, and search results from the keyboard.',
    3,
  ],
  [
    'error-recovery',
    'Error / permission / offline',
    'Explains failures, restricted access, lost connections, and recovery paths.',
    2,
  ],
  [
    'responsive-navigation',
    'Responsive navigation',
    'Collapses and expands desktop navigation on mobile.',
    1,
  ],
  [
    'dashboard',
    'Dashboard',
    'Lays out data panels on a responsive grid with their titles, states and refreshes.',
    2,
  ],
]
export const patterns: CatalogItem[] = patternDefinitions.map(
  ([id, name, summary, phase]) => ({
    id,
    name,
    summary,
    phase,
    group: 'Patterns',
    kind: 'pattern',
    stage: [
      'command-search',
      'async-job',
      'error-recovery',
      'documentation',
      'responsive-navigation',
      'data-table',
      'app-shell',
      'inline-confirmation',
      'page-header',
      'filter-bar',
      'resource-list',
      'form-workflow',
      'dashboard',
    ].includes(id)
      ? 'available'
      : 'planned',
    basis:
      id === 'inline-confirmation'
        ? 'Base UI Popover composition'
        : 'Product composition',
  }),
)
export const foundations: CatalogItem[] = [
  [
    'Structure',
    'layout',
    'Layout',
    'Sets containers, grids, spacing, and component sizes.',
  ],
  [
    'Structure',
    'hierarchy',
    'Visual hierarchy',
    'Orders planes, elevation, lines, and points from structure to detail.',
  ],
  [
    'Structure',
    'layers',
    'Layers',
    'Sets the stacking order of app chrome, dialogs, popups, and tooltips.',
  ],
  [
    'Style',
    'color',
    'Color',
    'Defines color roles, contrast minimums, and how palettes are built.',
  ],
  [
    'Style',
    'typography',
    'Typography',
    'Sets typefaces, type roles, line length, and Korean text rules.',
  ],
  [
    'Style',
    'iconography',
    'Iconography',
    'Sets icon sizes, stroke, direction, and accessible names.',
  ],
  [
    'Style',
    'themes',
    'Themes',
    'Applies light or dark to a page or region, and builds custom themes.',
  ],
  [
    'Behavior',
    'interaction',
    'Interaction states',
    'Defines how controls show hover, press, focus, selection, and pending work.',
  ],
  [
    'Behavior',
    'motion',
    'Motion',
    'Sets durations, easing, and reduced motion for every transition.',
  ],
  [
    'Standards',
    'accessibility',
    'Accessibility',
    'Sets the WCAG 2.2 AA baseline that every screen meets.',
  ],
  [
    'Standards',
    'content',
    'Content and localization',
    'Sets interface wording and the formats of numbers and dates.',
  ],
  [
    'Standards',
    'tokens',
    'Design tokens',
    "Lists every token's value, aliases, and source per theme.",
  ],
].map(([group, id, name, summary]) => ({
  id,
  name,
  summary,
  stage: 'available',
  phase: 0,
  kind: 'foundation',
  group,
  basis: 'Shared CSS tokens',
}))
export const catalog = [...foundations, ...components, ...patterns]
export function itemHref(item: CatalogItem) {
  if (item.kind === 'foundation')
    return item.id === 'tokens' ? '/tokens' : `/foundations/${item.id}`
  if (item.section) return `/${item.section}/${item.id}`
  return `/${item.kind === 'component' ? 'components' : 'patterns'}/${item.id}`
}
/** The page for a component id, wherever its section puts it. */
export function componentHref(id: string) {
  const item = components.find((i) => i.id === id)
  if (!item) throw new Error(`No component page for ${id}`)
  return itemHref(item)
}
/** Every page the catalog routes to; the build writes each one as HTML in both languages. */
export const pageRoutes = [
  ...new Set([
    '/',
    '/install',
    '/foundations',
    '/components',
    '/charts',
    '/patterns',
    '/coverage',
    '/foundations/lab',
    '/patterns/interaction-lab',
    ...catalog.map(itemHref),
  ]),
]
export const referenceSources = [
  {
    name: 'Recharts — Tooltip and keyboard readout',
    url: 'https://recharts.github.io/en-US/api/Tooltip/',
  },
  {
    name: 'React Aria — DatePicker / DateRangePicker / TimeField',
    url: 'https://react-aria.adobe.com/DatePicker',
  },
  {
    name: 'Internationalized date — local time, IANA zones, and DST disambiguation',
    url: 'https://react-aria.adobe.com/internationalized/date/CalendarDateTime',
  },
  {
    name: 'WAI-ARIA APG — Tree view',
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/treeview/',
  },
  {
    name: 'Headless Tree — declared hierarchy and virtualized rendering',
    url: 'https://headless-tree.lukasbach.com/recipe/virtualization/',
  },
  {
    name: 'TanStack Virtual — windowed rendering',
    url: 'https://tanstack.com/virtual/latest/docs/introduction',
  },
  {
    name: 'Base UI 1.9 — behavior primitives',
    url: 'https://base-ui.com/react/overview/about',
  },
  {
    name: 'Base UI — accessibility responsibilities',
    url: 'https://base-ui.com/react/overview/accessibility',
  },
  {
    name: 'Atlassian — enterprise UI coverage',
    url: 'https://atlassian.design/components',
  },
  {
    name: 'Carbon — components and patterns',
    url: 'https://www.carbondesignsystem.com/getting-started/about-carbon',
  },
]
