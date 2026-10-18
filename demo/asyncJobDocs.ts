import type { ComponentDoc } from './componentDocs'
export const asyncJobDocs: Record<string, ComponentDoc> = {
  'async-job': {
    usage:
      "Distinguish queued, running, cancel requested, canceled, partially failed, and completed states. Show progress as the count of finished checks. Don't promise an estimated duration. Pair each step's status in the List with explicit actions to open and copy logs. Deliver updates manually in the example to inspect each state.",
    avoid: [
      "Don't present a cancel request as a finished cancellation or a rollback. Report canceled only after the worker acknowledges it.",
      "Don't report a partial failure as success. Reuse a successful result only after checking its expiry and permissions.",
      "Don't expect the primitives to start the job or handle server permissions, idempotency, event ordering, reconnection, or persistence. The product owns them.",
      'The example uses fixed samples and sends no product requests.',
    ],
    keyboard: [
      'Starting the job moves focus to the cancel request button. Requesting cancellation moves focus to the confirm button.',
      "When the job ends, focus moves to the summary heading. Intermediate updates and opening logs don't move focus.",
      'A separate button copies the logs.',
      'Status is announced as text in role=status.',
    ],
    anatomy:
      'Preview inputs → start / cancel / deliver controls → run identity + environment snapshot + status → completed check count → step list → selected logs',
    tokens: [
      '--space-3',
      '--space-4',
      '--ink-muted',
      '--control-focus',
      '--status-caution-bg',
    ],
    code: `import { Progress, StatusBadge, List } from '@surflane/ui'

<Progress.Root value={finishedChecks} max={totalChecks}>
  <Progress.Label>Finished checks</Progress.Label>
  <Progress.Track>
    <Progress.Indicator />
  </Progress.Track>
</Progress.Root>
<StatusBadge tone='caution'>Cancellation requested</StatusBadge>

// Accept updates only for the current run and delivery version.
// Cancellation is acknowledged by the worker before reporting canceled.
// Retry creates a new run; reused results retain their original identity.`,
    props: [
      [
        'Run phase',
        'queued / running / cancel-requested / canceled / success / partial / failed',
        'queued after start',
      ],
      [
        'Next run result',
        'success / partial failure / blocking failure',
        'success',
      ],
      [
        'Run identity',
        'new ID per start/retry; environment and result snapshotted',
        'local preview',
      ],
      [
        'Update ownership',
        'AbortController + identity + version fence; synchronous duplicate guard',
        'caller-owned',
      ],
      [
        'Retry',
        'successful checks retained with source ID; unfinished checks reset',
        'new run ID',
      ],
      [
        'Logs',
        'fixed safe sample; explicit inspection and copy',
        'no product data',
      ],
    ],
  },
}
