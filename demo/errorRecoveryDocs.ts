import type { ComponentDoc } from './componentDocs'
export const errorRecoveryDocs: Record<string, ComponentDoc> = {
  'error-recovery': {
    usage: [
      'Show the cause of a failure with the possible next steps.',
      'A temporary request failure leads to retry, and a lost connection leads to retry after reconnecting. Restricted access leads to restoring access, and a bad address leads to browsing the list.',
      "Keep drafts, and mark cached data as stale. Clear the cache when access is lost or the resource can't be found.",
      'The example combines InlineMessage, EmptyState, Field, Button, Collapsible, and CodeBlock, and settles a local Promise manually. Complete each response to inspect every recovery state.',
    ],
    avoid: [
      "Don't turn errors into empty results or success. Show the error with its recovery action.",
      "Don't infer server availability from offline status alone. Confirm it with a real request.",
      "Don't leave unauthorized data or secrets in error details, the clipboard, or the cache.",
      "Don't present canceling as a rollback of server work.",
      "Don't rely on the example's local simulation of restoring access and reconnecting. The product owns real requests, retry counts, backoff, idempotency, online events, access requests, and server permission checks.",
    ],
    anatomy:
      'Failure/result preview controls → controlled draft Field → state-specific InlineMessage or EmptyState + recovery action → optional cached data with freshness status → safe collapsible diagnostics → outcome announcement',
    keyboard: [
      'The state selector keeps focus. Starting a retry moves focus to Cancel, and canceling returns focus to the draft input.',
      'Success moves focus to the result heading, and a failed retry moves focus to Retry. Restricted access moves focus to the restore access button.',
      "Restoring access moves focus to the refetch data button and doesn't count as immediate success.",
      "The details disclosure and copy messages follow their primitives' keyboard rules.",
      'Errors use role=alert. Progress and recovery results use status announcements.',
    ],
    tokens: [
      '--space-3',
      '--space-4',
      '--status-danger-fg',
      '--status-caution-bg',
      '--status-success-bg',
      '--ink-muted',
      '--control-focus',
    ],
    code: `import { InlineMessage, Button, EmptyState } from '@surflane/ui'

<InlineMessage.Root tone='danger' role='alert'>
  <InlineMessage.Content>
    <InlineMessage.Title>The request failed</InlineMessage.Title>
    <InlineMessage.Description>
      Your draft is retained.
    </InlineMessage.Description>
    <InlineMessage.Actions>
      <Button onClick={retry}>Retry</Button>
    </InlineMessage.Actions>
  </InlineMessage.Content>
</InlineMessage.Root>

// Request ownership remains in the product:
// guard duplicate starts synchronously; snapshot the draft; use AbortController.
// accept a response only if its identity is still current and not aborted.
// preserve draft on failure/cancel; clear protected caches on permission changes.
// restore meaningful focus and report freshness without implying successful mutation.
// diagnostics must be safe to display/copy and contain no credentials.`,
    props: [
      [
        'Recovery state',
        'error / offline / permission / not-found / ready / pending',
        'error',
      ],
      [
        'Next retry result',
        'success / error / permission; manually settled local Promise',
        'success',
      ],
      [
        'Request identity / AbortController',
        'synchronous duplicate guard; ignore canceled or superseded responses',
        'caller-owned',
      ],
      [
        'Draft / saved preview',
        'draft retained; cache freshness explicit; protected cache cleared on restriction',
        'local controlled state',
      ],
      [
        'Safe details',
        'collapsible fixed sample; CodeBlock copy is a separate explicit action',
        'no product data',
      ],
      [
        'Navigation recovery',
        'native list link when the resource address is invalid',
        '/patterns/resource-list',
      ],
    ],
  },
}
