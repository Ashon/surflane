import type { ComponentDoc } from "./componentDocs";
export const asyncJobDocs: Record<string, ComponentDoc> = {
  "async-job": {
    usage:
      "Distinguishes queued, running, cancel requested, canceled, partially failed, and completed states. Progress shows the number of checks actually finished and doesn't promise an estimated duration. Connects the List's per-step status with explicit actions to open and copy logs. Local manual updates let you check each state.",
    avoid:
      "Don't present a cancel request as a completed cancellation or rollback. Don't turn partial failures into success. The product implements actually starting the job, server permissions, idempotency, event ordering, reconnection, and persistence. Decide whether to reuse a successful result only after checking its expiry and permissions. The example provides fixed samples only and doesn't send product requests.",
    keyboard:
      "After starting, focus moves to the request cancel button; after a cancel request, to the confirm button; and when the job ends, to the summary heading. Intermediate updates and opening logs don't steal focus. Status is announced with text and role=status, and copying logs runs from a separate button.",
    anatomy:
      "Preview inputs → start / cancel / deliver controls → run identity + environment snapshot + status → completed check count → step list → selected logs",
    tokens: [
      "--space-3",
      "--space-4",
      "--ink-muted",
      "--control-focus",
      "--status-caution-bg",
    ],
    code: `import {Progress, StatusBadge, List} from "@surflane/ui";\n\n<Progress.Root value={finishedChecks} max={totalChecks}>\n  <Progress.Label>Finished checks</Progress.Label>\n  <Progress.Track><Progress.Indicator /></Progress.Track>\n</Progress.Root>\n<StatusBadge tone="caution">Cancellation requested</StatusBadge>\n\n// Accept updates only for the current run and delivery version.\n// Cancellation is acknowledged by the worker before reporting canceled.\n// Retry creates a new run; reused results retain their original identity.`,
    props: [
      [
        "Run phase",
        "queued / running / cancel-requested / canceled / success / partial / failed",
        "queued after start",
      ],
      [
        "Next run result",
        "success / partial failure / blocking failure",
        "success",
      ],
      [
        "Run identity",
        "new ID per start/retry; environment and result snapshotted",
        "local preview",
      ],
      [
        "Update ownership",
        "AbortController + identity + version fence; synchronous duplicate guard",
        "caller-owned",
      ],
      [
        "Retry",
        "successful checks retained with source ID; unfinished checks reset",
        "new run ID",
      ],
      [
        "Logs",
        "fixed safe sample; explicit inspection and copy",
        "no product data",
      ],
    ],
  },
};
