import type { ComponentDoc } from './componentDocs'
export const errorRecoveryDocs: Record<string, ComponentDoc> = {
  'error-recovery': {
    usage:
      "Shows the cause of a failure together with possible next steps. A temporary request failure leads to retry, a lost connection to retry after reconnecting, restricted access to restoring access, and a bad address to browsing the list. The example combines InlineMessage, EmptyState, Field, Button, Collapsible, and CodeBlock. Drafts are preserved and cached data is marked as stale, and the cache is cleared when access is lost or the resource can't be found. Responses complete a local Promise manually, so you can inspect each recovery state.",
    avoid:
      "Don't turn errors into empty results or success. Don't conclude server availability from offline status alone; confirm it with a real request. Don't leave unauthorized data or secrets in error details, the clipboard, or the cache. Don't present canceling as rolling back server work. The product implements real requests, retry counts, backoff, and idempotency, online events, access requests, and server permission checks. Restoring access and reconnecting in the example are local simulations.",
    anatomy:
      'Failure/result preview controls → controlled draft Field → state-specific InlineMessage or EmptyState + recovery action → optional cached data with freshness status → safe collapsible diagnostics → outcome announcement',
    keyboard:
      "The state selector keeps focus. Starting a retry moves focus to Cancel, success to the result heading, a failed retry to Retry, and restricted access to the restore access button. Canceling returns focus to the draft input. Restoring access moves focus to the refetch data button and isn't treated as immediate success. Errors use role=alert, and progress and recovery results use appropriate status announcements. The details disclosure and copy messages follow the keyboard rules of the existing primitives.",
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
