import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Put a monitoring screen's data panels on one grid. Dashboard.Root fits as many columns as panels of 20rem; a phone shows one. Each Dashboard.Panel is a card with its title, an optional description behind an info button, actions at the end of its header, and the state of its data: a placeholder until the first data arrives, a message with retry when it fails, a sentence when the range is empty. While it refreshes, the content stays and a spinner shows by the title. A secondary panel can be collapsible: folded to its title and a summary line, remembered across visits. It keeps its own height, so beside a taller panel the rest of its row stays empty. Wrap a dense dashboard in SizeProvider size='small' density='compact': panels sit and pad 12px, titles take the label role, and the charts and tables inside turn compact.",
  avoid: [
    "Don't clear a panel while it refreshes. Keep the last values and set refreshing.",
    "Don't put a page's other sections in panels. A dashboard is the one place where every block is a card.",
    "Don't repeat the panel title in a compact chart. The chart keeps its title for assistive technology only.",
  ],
  keyboard:
    "Each panel is a group named by its title, busy while it loads or refreshes. The info button opens the description in a popover; Escape closes it. Retry and the header actions are ordinary buttons. When Retry clears the error and takes its button away, focus moves to the panel title. A collapsible panel's title is a button that says whether it is expanded: Enter or Space folds or unfolds it.",
  anatomy:
    'Root(grid) → Panel: Card(role=group, aria-labelledby, aria-busy) → header(Title(toggle button?), summary?, info Popover?, Spinner?, actions?) + body(DataState: Skeleton | InlineMessage + Retry | empty text | children), not rendered while folded',
  tokens: [
    '--surf-space-4',
    '--surf-space-3',
    '--surf-surface',
    '--surf-radius-lg',
    '--surf-size-card-padding-default',
    '--surf-control-height',
  ],
  code: `import { Dashboard } from '@surflane/ui/dashboard'
import { SizeProvider, Stat } from '@surflane/ui'

<SizeProvider size='small' density='compact'>
  <Dashboard.Root aria-label='Cluster overview'>
    <Dashboard.Panel
      title='GPU temperature'
      description='The hottest GPU on each node, every 10 minutes.'
      span={2}
      state={query.isPending ? 'loading' : query.isError ? 'error' : 'ready'}
      refreshing={query.isFetching}
      onRetry={() => query.refetch()}
    >
      <Chart density='compact' xScale='time' {...gpuChart} />
    </Dashboard.Panel>
  </Dashboard.Root>
</SizeProvider>`,
  props: [
    [
      'Root.label',
      'names the dashboard as a region of the page, such as "Cluster overview"',
      '—',
    ],
    [
      'Root.columns',
      'the most columns a wide screen shows, so a row planned for that many keeps its proportions',
      'as many as fit',
    ],
    [
      'Root style --surf-dashboard-panel-min-width',
      'the narrowest a panel gets before the grid drops a column',
      '20rem',
    ],
    [
      'Panel.title / level',
      'the heading and its level; a title cut short shows in full on hover',
      'required / 3',
    ],
    [
      'Panel.description',
      'what the panel shows and how it is measured, behind an info button',
      '—',
    ],
    [
      'Panel.state',
      'ready | loading | error | empty | stale: stale keeps the last content under a caution that the refresh failed, with retry',
      'ready',
    ],
    [
      'Panel.placeholderHeight',
      "the loading placeholder's height, as tall as the content will be, so the panels below don't move",
      '96px',
    ],
    [
      'Panel.refreshing',
      'keeps the content, shows a spinner by the title and marks the panel busy',
      'false',
    ],
    [
      'Panel.onRetry / message',
      'a retry button in the error or stale message / the error, stale or empty text',
      '— / labels',
    ],
    ['Panel.actions', 'controls at the end of the header', '—'],
    [
      'Panel.span',
      '1 | 2 | 3 | full: columns where they fit; one on a phone',
      '1',
    ],
    [
      'Panel.collapsible',
      'the title becomes a button that folds the panel to its title row; a folded panel does not render its content',
      'false',
    ],
    [
      'Panel.open / defaultOpen / onOpenChange',
      'whether a collapsible panel is open, controlled or not',
      '— / true / —',
    ],
    [
      'Panel.persist',
      'a localStorage key that remembers whether the panel is open across visits',
      '—',
    ],
    [
      'Panel.summary',
      'what a folded panel still says after its title, such as its worst value; cut short where the row is narrow',
      '—',
    ],
    [
      'Panel.labels',
      'about(title), loading, refreshing, error, stale, retry, empty',
      'English',
    ],
  ],
}
