import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage: [
    'Wrap any content that waits for data in DataState, so loading, failure and emptiness never look the same. state says where the data stands; the content shows when it is ready, and stays under a caution when it is stale.',
    'loading draws a placeholder of placeholderHeight, so nothing moves when the data arrives. error says what failed, in message, with a retry when onRetry is set; after a retry focus moves to retryFocus, or the DataState itself. empty says why there is nothing, and what to do next.',
    'refreshing keeps the content, dimmed and busy, while new data comes, and announces it. Dashboard.Panel draws its body with DataState and shows its own spinner by the title.',
    'layout inline fits a line beside other text, block fills a card or a region, and page stands in for a whole page, centred.',
  ],
  avoid: [
    "Don't decide the state from the data alone: an empty result and a failure both have no data. Take it from the request.",
    "Don't clear the content while it refreshes, or show zero for an error.",
    "Don't announce a page load as a failure; say what failed and what the reader can do.",
  ],
  keyboard: [
    'The retry button is in the Tab order; Enter or Space retries.',
    'After a retry takes the button away, focus moves to retryFocus or the DataState, not the page.',
  ],
  anatomy:
    'Root(state, layout) → placeholder | message + retry | empty sentence | caution + content | content',
  tokens: [
    '--surf-status-danger-fg',
    '--surf-status-caution-fg',
    '--surf-ink-muted',
    '--surf-space-3',
    '--surf-duration-fast',
  ],
  code: `import { DataState } from '@surflane/ui'

<DataState
  state={query.isPending ? 'loading' : query.isError ? (query.data ? 'stale' : 'error') : query.data?.length ? 'ready' : 'empty'}
  refreshing={query.isFetching && !query.isPending}
  onRetry={() => query.refetch()}
  message={query.error?.message}
>
  <HoldingsTable rows={query.data} />
</DataState>`,
  props: [
    ['state', 'ready | loading | error | empty | stale', 'ready'],
    ['refreshing', 'keep the content, dimmed and busy', 'false'],
    ['onRetry', 'shows a retry with an error or stale values', '—'],
    ['message', 'why it failed or why it is empty', 'labels'],
    ['layout', 'inline | block | page', 'block'],
    [
      'placeholderHeight',
      "the loading placeholder's height",
      'Skeleton default',
    ],
    ['retryFocus', 'a ref to where focus goes after a retry', 'the DataState'],
    [
      'labels',
      '{ loading, refreshing, error, stale, retry, empty }; also from LabelsProvider',
      'English',
    ],
  ],
}
