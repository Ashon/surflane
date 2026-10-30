// What each page checks before it is ready, shown on pages that are not yet available.
// Only DetailPage reads them, so they stay out of the catalog's first load.
import type { CatalogItem } from './catalog'

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
  Charts: [
    'Units, axis names and a summary, values in text beside or under every mark, and an alternative where a mark is the only carrier',
    'Distinctions beyond color, both themes, forced colors, and right to left',
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
  'time-range-picker': [
    'A named group of two selects and a named refresh button; the interval pauses while the page is hidden',
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
  'scatter-chart': [
    'Units on both axes, groups told apart by marker as well as color, a keyboard readout of each point, quadrant names, and an alternative table',
  ],
  stat: [
    'Label, value and change read as one description list; the change shows its direction by sign and arrow, not color alone',
  ],
  sparkline: [
    'An accessible name that states the trend, gaps for missing values, and no interaction',
  ],
  'bar-list': [
    'An ordered list whose names and values are text, decorative bars, and a named scroll region when it is bounded',
  ],
  'proportion-bar': [
    'A named group whose legend is the text, a decorative bar whose parts keep apart without color, and parts that keep their tone in both themes',
  ],
  'diverging-bar': [
    'A named image that states the value, one scale for bars side by side, and a fill that grows from the logical start right to left',
  ],
  banner: [
    'Spans the app shell above everything else, names its state in words, announces changes politely, and moves focus on when dismissed',
  ],
  'description-list': [
    'A native dl whose terms name their values, long values that wrap or keep the whole value when cut, and a copy action that names its term',
  ],
  timeline: [
    'An ordered list whose events name their time with a time element and their state in words, a current step announced as such, and details behind a disclosure',
  ],
  'data-state': [
    'Loading with a placeholder, an error with a retry that moves focus on, empty, stale values under a caution, and refreshing that keeps the content',
  ],
  'segmented-control': [
    'A string value, one always chosen unless required is false, a named group, and the same segments as the CSS-only control group',
  ],
  kbd: [
    'The platform modifier, ⌘ or Ctrl, decided in one place, and a spoken name for every symbol',
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
const patternCriteria = (id: string) =>
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
                      : id === 'dashboard'
                        ? [
                            'Composes Card, Popover, Skeleton, Spinner and InlineMessage into one panel frame on a responsive grid',
                            'Loading, refreshing with the previous value, error with retry, empty, long titles and spans',
                            'Checks group names, busy state, description buttons, 320px and themes',
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
                            ]
export function criteriaOf(item: CatalogItem): string[] {
  if (item.kind === 'foundation')
    return [
      'Principles, tokens, working examples, and per-product usage guidance',
    ]
  if (item.kind === 'pattern') return patternCriteria(item.id)
  return [
    ...criteriaByGroup[item.group],
    ...(specializedCriteria[item.id] ?? []),
    'Light, dark, and system themes, reduced motion, and 320px and zoom checks',
  ]
}
