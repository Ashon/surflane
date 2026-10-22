export type Stage = 'available' | 'primitive' | 'planned'
export type Kind = 'component' | 'pattern' | 'foundation'
export type CatalogItem = {
  id: string
  name: string
  group: string
  kind: Kind
  stage: Stage
  phase: 0 | 1 | 2 | 3
  summary: string
  basis: string
  criteria: string[]
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
  'date-picker',
  'tree',
  'file-upload',
  'toast',
  'otp-field',
  'navigation-menu',
  'context-menu',
  'preview-card',
  'toggle',
  'toggle-group',
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
  'sparkline',
  'inline-message',
  'empty-state',
  'progress',
  'meter',
  'spinner',
  'skeleton',
  'tabs',
  'accordion',
  'collapsible',
  'avatar',
  'badge',
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
    'sparkline',
    'Sparkline',
    'Data display',
    'Draws a small trend line inside a card or a table cell.',
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
    'Data display',
    'Shows trends with units, a legend, and an alternative table.',
    3,
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
  'file-upload',
  'sheet',
  'link',
  'breadcrumbs',
  'pagination',
  'bottom-navigation',
  'badge',
  'card',
  'table',
  'code',
  'list',
  'stat',
  'sparkline',
  'tree',
  'chart',
  'inline-message',
  'spinner',
  'skeleton',
  'empty-state',
])
const criteriaByGroup: Record<string, string[]> = {
  Actions: [
    'Default, hover, focus, pressed, disabled, and in-progress states',
    'Enter or Space activation and duplicate-run prevention',
  ],
  Forms: [
    'Label, help text, error, required, disabled, and read-only',
    'Form submit, reset, autofill, and Korean IME input',
  ],
  Selection: [
    'Checked, unchecked, mixed, and disabled states',
    'Keyboard, labels, form submit, and reset',
  ],
  Overlays: [
    'Close, Escape, outside click, initial focus, and focus restoration',
    'Nested portals, small screens, open motion, and instant close',
  ],
  Navigation: [
    'Current, visited, active, and disabled styling',
    'Direct URLs, back navigation, keyboard, and focus',
  ],
  'Data display': [
    'Long Korean and English text, identifiers, empty values, and large data sets',
    'Responsive layout, semantic HTML, and text alternatives',
  ],
  Structure: [
    'Full width, inset, nesting, and overflow',
    'Keyboard scrolling and reflow when zoomed',
  ],
  Feedback: [
    'Per-status text, icon, color, and action',
    'Live announcements, duration, retry, and cancel',
  ],
}
const specializedCriteria: Record<string, string[]> = {
  'navigation-menu': [
    'nav, native links, current location, and closing on link selection',
    'Horizontal, vertical, and RTL keyboard movement, pointer, touch, and narrow screens',
  ],
  'context-menu': [
    'Same actions in a visible regular menu, shared state, and a keyboard path',
    'Pointer, long press, collision avoidance, and submenus',
  ],
  'preview-card': [
    'Native link navigation, hover delay, Escape, and focus retention',
    'Essential information lives at the destination, with no popup-only actions',
  ],
  'date-picker': [
    'Korean/English date and time formats, ranges, min/max, time zones, and DST handling',
  ],
  'file-upload': [
    'Extensions, size limits, upload progress, failure, cancel, retry, and a selection path besides drag and drop',
  ],
  tree: [
    'ARIA tree hierarchy, expansion, selection, arrow-key navigation, virtualization, and large data sets',
    'Headless Tree / TanStack Virtual, controlled state, focus recovery, RTL, and disabled nodes',
  ],
  chart: [
    'Units, axes, legend, distinctions beyond color, alternative table, empty values, and tooltip accessibility',
  ],
  stat: [
    'Label, value and change read as one description list; the change shows its direction by sign and arrow, not color alone',
  ],
  sparkline: [
    'An accessible name that states the trend, gaps for missing values, and no interaction',
  ],
  'otp-field': ['Code paste, autofill, deletion, errors, expiry, and resend'],
  'bottom-navigation': [
    'Three to five destinations, the current one marked, badges with a spoken meaning',
    'Safe-area padding, content padded by its height, and hidden where the sidebar shows',
  ],
  toast: [
    'aria-live priority, duration, pause on hover/focus, duplicates, and actions',
  ],
}
const specialized = new Set(['date-picker', 'file-upload', 'tree', 'chart'])
export const components: CatalogItem[] = definitions.map(
  ([id, name, group, summary, phase]) => ({
    id,
    name,
    group,
    summary,
    phase,
    kind: 'component',
    stage: ready.has(id) ? 'available' : raw.has(id) ? 'primitive' : 'planned',
    basis:
      id === 'syntax-highlighter'
        ? 'Shiki TextMate composition'
        : id === 'markdown'
          ? 'react-markdown / remark-gfm composition'
          : id === 'native-select'
            ? 'Compatibility adapter'
            : id === 'sheet'
              ? 'Base UI Dialog composition'
              : id === 'date-picker'
                ? 'React Aria / internationalized date composition'
                : id === 'chart'
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
    criteria: [
      ...criteriaByGroup[group],
      ...(specializedCriteria[id] ?? []),
      'Light, dark, and system themes, reduced motion, and 320px and zoom checks',
    ],
  }),
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
    ].includes(id)
      ? 'available'
      : 'planned',
    basis:
      id === 'inline-confirmation'
        ? 'Base UI Popover composition'
        : 'Product composition',
    criteria:
      id === 'command-search'
        ? [
            'Composes Dialog, inline Combobox, and ScrollArea',
            'Registry search, disabled Planned items, local commands, and destination navigation',
            'Checks keyboard, IME and shortcut scope, focus restoration, and 320px',
          ]
        : id === 'async-job'
          ? [
              'Composes Progress, List, and status and log primitives',
              'Queued, running, cancel request and confirmation, partial failure, and retry as a new run',
              'Checks duplicate starts, late updates, log sources, and focus',
            ]
          : id === 'error-recovery'
            ? [
                'Composes InlineMessage, EmptyState, and existing input and copy primitives',
                'Error, offline, permission, and invalid address states, each with a recovery action',
                'Checks drafts and cache, duplicate requests, blocking late responses, and focus restoration',
              ]
            : id === 'documentation'
              ? [
                  'Shared document composition of Prose, PageHeader, CodeBlock, and InlineMessage',
                  'Stable heading IDs, table of contents and current section, language switching, and long content',
                  'Checks direct links, keyboard, code copy, horizontal scrolling, 320px, and themes',
                ]
              : id === 'responsive-navigation'
                ? [
                    'Reuses the same navigation model across AppShell and Sheet',
                    'Desktop and mobile switching, long names, and read-only destinations',
                    'Checks focus after open, select, Escape, and viewport widening or narrowing, plus 320px',
                  ]
                : id === 'data-table'
                  ? [
                      'Composes existing Table, FilterBar, Checkbox, Menu, and Pagination',
                      'Filters, stable sorting, column settings, per-page selection, and bulk actions',
                      'Checks loading, error, permission, empty results, keyboard, and 320px',
                    ]
                  : id === 'app-shell'
                    ? [
                        'Shared layout slots, native links, and controlled collapse',
                        'Fixed icon positions, account at the bottom, theme at the top, and mobile Sheet navigation',
                        'Checks focus restoration, keyboard, long content, 320px, and themes',
                      ]
                    : id === 'form-workflow'
                      ? [
                          'Composes existing form and message primitives',
                          'Validation, submitting, field errors, request failure, permission, success, and cancel',
                          'Checks controlled input preservation, duplicate submits, blocking late responses, and focus restoration',
                        ]
                      : id === 'resource-list'
                        ? [
                            'Composes existing List, Checkbox, Menu, and status components',
                            'Selection, long content, loading, error, restricted access, empty results, and responsive layout',
                            'Checks padding, hover, focus, native links, and list semantics',
                          ]
                        : id === 'filter-bar'
                          ? [
                              'Shared composition of search, filters, summary, and reset',
                              'Instant apply, empty results, long input, and responsive alignment',
                              'Keyboard focus, result announcements, and real use in the catalog',
                            ]
                          : id === 'page-header'
                            ? [
                                'Shared structure for breadcrumb, title, description, and actions',
                                'Long titles, optional slots, and responsive placement',
                                'Heading hierarchy, keyboard, and real use in the catalog',
                              ]
                            : [
                                'Composes shared components and tokens, leaving domain logic in the product',
                                'Empty, loading, error, permission, long content, and responsive states',
                                'Checks keyboard flow, focus, and real product use',
                              ],
  }),
)
export const foundations: CatalogItem[] = [
  [
    'layout',
    'Layout',
    'Defines containers, spacing, grids, and reading width.',
    'available',
  ],
  [
    'typography',
    'Typography',
    'Defines fonts by role, sizes, line height, and rendering.',
    'available',
  ],
  [
    'tokens',
    'Design tokens',
    'Lists token values and aliases per theme, with search and code references.',
    'available',
  ],
  [
    'color',
    'Color / contrast',
    'Defines brand, neutral, and status colors and their contrast.',
    'available',
  ],
  [
    'themes',
    'Themes',
    'Builds a theme from a neutral tint, an accent, and a radius scale, and reports contrast.',
    'available',
  ],
  [
    'iconography',
    'Iconography',
    'Defines SVG size, stroke, alignment, and accessible names.',
    'available',
  ],
  [
    'interaction',
    'Interaction / states',
    'Defines pointer, keyboard, selection, disabled, and async states, plus recovery.',
    'available',
  ],
  [
    'motion',
    'Motion / theme',
    'Defines theme sync, enter, exit, and reduced motion.',
    'available',
  ],
  [
    'accessibility',
    'Accessibility',
    'Covers semantic structure, focus, keyboard, zoom, and status announcements.',
    'available',
  ],
  [
    'content',
    'Content / localization',
    'Covers Korean and English copy, error messages, and time and number formats.',
    'available',
  ],
  [
    'layers',
    'Layers / elevation',
    'Defines surfaces, layers, portals, shadows, and stacking rules.',
    'available',
  ],
].map(([id, name, summary, stage]) => ({
  id,
  name,
  summary,
  stage: stage as Stage,
  phase: stage === 'available' ? 0 : 1,
  kind: 'foundation',
  group: 'Foundations',
  basis: 'Shared CSS tokens',
  criteria: [
    'Principles, tokens, working examples, and per-product usage guidance',
  ],
}))
export const catalog = [...foundations, ...components, ...patterns]
export function itemHref(item: CatalogItem) {
  return item.kind === 'foundation'
    ? item.id === 'tokens'
      ? '/tokens'
      : `/foundations/${item.id}`
    : `/${item.kind === 'component' ? 'components' : 'patterns'}/${item.id}`
}
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
