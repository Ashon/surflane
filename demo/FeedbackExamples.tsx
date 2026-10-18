import React, { useState } from "react";
import { Button, Progress, Meter, Spinner, Skeleton } from "@surflane/ui";
export { feedbackExampleIds } from "./exampleGroups";
export function FeedbackExample({ id }: { id: string }) {
  const [value, setValue] = useState<number | null>(30);
  const [loading, setLoading] = useState(true);
  if (id === "progress")
    return (
      <div className="example-stack">
        <Progress.Root
          value={value}
          aria-valuetext={
            value === null
              ? "Waiting for worker"
              : `${value} of 100 checks completed`
          }
        >
          <Progress.Label>Deployment progress</Progress.Label>
          <Progress.Value>
            {(formatted, current) =>
              current === null ? "Waiting for worker" : formatted
            }
          </Progress.Value>
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
        <div className="actions">
          <Button
            variant="outline"
            onClick={() => setValue((v) => Math.min(100, (v ?? 0) + 10))}
          >
            Complete 10 checks
          </Button>
          <Button variant="outline" onClick={() => setValue(null)}>
            Wait for worker
          </Button>
          <Button variant="ghost" onClick={() => setValue(0)}>
            Reset progress
          </Button>
        </div>
        <p role="status">
          {value === 100
            ? "All checks completed."
            : "Preview only; no tests are running."}
        </p>
      </div>
    );
  if (id === "meter")
    return (
      <div className="example-stack">
        <Meter.Root
          value={value ?? 30}
          min={0}
          max={64}
          aria-valuetext={`${value ?? 30} GiB of 64 GiB`}
        >
          <Meter.Label>Memory allocation</Meter.Label>
          <Meter.Value>{(_, v) => `${v} / 64 GiB`}</Meter.Value>
          <Meter.Track>
            <Meter.Indicator />
          </Meter.Track>
        </Meter.Root>
        <div className="actions">
          <Button
            variant="outline"
            onClick={() => setValue((v) => Math.min(64, (v ?? 30) + 8))}
          >
            Allocate 8 GiB
          </Button>
          <Button variant="ghost" onClick={() => setValue(0)}>
            Release allocation
          </Button>
        </div>
        <p>Measurement of capacity; this is not a running task.</p>
      </div>
    );
  return (
    <div className="example-stack">
      <div className="actions">
        <Button variant="outline" onClick={() => setLoading((v) => !v)}>
          {loading ? "Finish preview loading" : "Reload preview"}
        </Button>
      </div>
      <section
        aria-label="Environment preview"
        aria-busy={loading}
        className="example-stack"
      >
        {loading ? (
          id === "spinner" ? (
            <div className="actions">
              <Spinner decorative size="sm" />
              <Spinner decorative />
              <Spinner decorative size="lg" />
              <span>Loading environment preview…</span>
            </div>
          ) : (
            <>
              <div className="actions">
                <Skeleton shape="circle" />
                <div style={{ flex: 1 }}>
                  <Skeleton style={{ width: "55%" }} />
                  <Skeleton style={{ marginTop: 12, width: "80%" }} />
                </div>
              </div>
              <Skeleton shape="block" />
            </>
          )
        ) : (
          <p>DEMO main — 3 services available.</p>
        )}
      </section>
      <p role="status">
        {loading
          ? "Loading environment preview…"
          : "Environment preview loaded."}
      </p>
      {id === "spinner" && (
        <div className="actions">
          <Spinner label="Background sync in progress" />
          <span>Standalone status example</span>
        </div>
      )}
      {id === "skeleton" && (
        <p>
          Placeholders are decorative. The containing region owns aria-busy and
          a single loading announcement.
        </p>
      )}
    </div>
  );
}
