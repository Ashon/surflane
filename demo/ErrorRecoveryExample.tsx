import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  CodeBlock,
  Collapsible,
  EmptyState,
  Field,
  InlineMessage,
  NativeSelect,
  Spinner,
  StatusBadge,
} from "@surflane/ui";
import { Link } from "./router";
type Mode =
  "error" | "offline" | "permission" | "not-found" | "ready" | "pending";
type Reply = "success" | "error" | "permission" | "aborted";
type Request = {
  controller: AbortController;
  promise: Promise<Reply>;
  finish: (reply: Reply) => void;
  label: string;
  origin: Mode;
};
function requestPreview(label: string, origin: Mode): Request {
  const controller = new AbortController();
  let finish!: (reply: Reply) => void;
  const promise = new Promise<Reply>((resolve) => {
    finish = resolve;
    controller.signal.addEventListener("abort", () => resolve("aborted"), {
      once: true,
    });
  });
  return { controller, promise, finish, label, origin };
}
export function ErrorRecoveryExample() {
  const [mode, setMode] = useState<Mode>("error"),
    [outcome, setOutcome] = useState<Exclude<Reply, "aborted">>("success"),
    [label, setLabel] = useState("Sample environment"),
    [saved, setSaved] = useState<{ label: string; revision: number } | null>({
      label: "Sample environment",
      revision: 1,
    }),
    [attempts, setAttempts] = useState(0),
    [notice, setNotice] = useState("");
  const pending = useRef<Request | null>(null),
    input = useRef<HTMLInputElement>(null),
    cancel = useRef<HTMLButtonElement>(null),
    retry = useRef<HTMLButtonElement>(null),
    load = useRef<HTMLButtonElement>(null),
    restore = useRef<HTMLButtonElement>(null),
    result = useRef<HTMLHeadingElement>(null);
  const nextFocus = useRef<
    "input" | "cancel" | "retry" | "restore" | "result" | "load" | null
  >(null);
  useEffect(
    () => () => {
      pending.current?.controller.abort();
      pending.current = null;
    },
    [],
  );
  useEffect(() => {
    const targets = { input, cancel, retry, restore, result, load };
    if (nextFocus.current) {
      targets[nextFocus.current].current?.focus({ preventScroll: true });
      nextFocus.current = null;
    }
  }, [mode, saved]);
  function chooseMode(next: Mode) {
    const old = pending.current;
    pending.current = null;
    old?.controller.abort();
    if (next === "permission" || next === "not-found") setSaved(null);
    setNotice("");
    setMode(next);
  }
  function start() {
    if (pending.current || mode === "permission" || mode === "not-found")
      return;
    const request = requestPreview(label, mode);
    pending.current = request;
    setAttempts((n) => n + 1);
    setNotice("");
    nextFocus.current = "cancel";
    setMode("pending");
    void request.promise.then((reply) => {
      if (
        pending.current !== request ||
        request.controller.signal.aborted ||
        reply === "aborted"
      )
        return;
      pending.current = null;
      if (reply === "success") {
        setSaved((old) => ({
          label: request.label,
          revision: (old?.revision ?? 0) + 1,
        }));
        nextFocus.current = "result";
        setMode("ready");
        setNotice("Preview refreshed. No product resource was changed.");
      } else if (reply === "permission") {
        setSaved(null);
        nextFocus.current = "restore";
        setMode("permission");
      } else {
        nextFocus.current = "retry";
        setMode("error");
      }
    });
  }
  function cancelRequest() {
    const request = pending.current;
    if (!request) return;
    pending.current = null;
    request.controller.abort();
    nextFocus.current = "input";
    setMode(request.origin);
    setNotice("Retry canceled. Your draft is retained.");
  }
  const cached =
    Boolean(saved) && mode !== "permission" && mode !== "not-found";
  return (
    <div className="recovery-example">
      <div className="recovery-settings actions">
        <label>
          Preview recovery state
          <NativeSelect
            value={
              mode === "pending" ? (pending.current?.origin ?? "error") : mode
            }
            onChange={(event) => chooseMode(event.target.value as Mode)}
          >
            {["error", "offline", "permission", "not-found", "ready"].map(
              (value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ),
            )}
          </NativeSelect>
        </label>
        <label>
          Next retry result
          <NativeSelect
            disabled={mode === "pending"}
            value={outcome}
            onChange={(event) =>
              setOutcome(event.target.value as Exclude<Reply, "aborted">)
            }
          >
            {["success", "error", "permission"].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </NativeSelect>
        </label>
      </div>
      <Field.Root name="request-label">
        <Field.Label>Preview request label</Field.Label>
        <Field.Control
          ref={input}
          value={label}
          disabled={
            mode === "pending" || mode === "permission" || mode === "not-found"
          }
          onChange={(event) => setLabel(event.target.value)}
        />
        <Field.Description>
          Draft text stays local while recovery is in progress.
        </Field.Description>
      </Field.Root>
      {(mode === "error" || mode === "offline" || mode === "pending") && (
        <InlineMessage.Root
          tone={
            mode === "error"
              ? "danger"
              : mode === "offline"
                ? "caution"
                : "progress"
          }
          role={
            mode === "error"
              ? "alert"
              : mode === "pending"
                ? "status"
                : undefined
          }
        >
          <InlineMessage.Icon
            tone={
              mode === "error"
                ? "danger"
                : mode === "offline"
                  ? "caution"
                  : "progress"
            }
          >
            {mode === "pending" ? <Spinner decorative size="sm" /> : undefined}
          </InlineMessage.Icon>
          <InlineMessage.Content>
            <InlineMessage.Title>
              {mode === "error"
                ? "The resource request failed"
                : mode === "offline"
                  ? "Connection unavailable"
                  : "Retrying resource request"}
            </InlineMessage.Title>
            <InlineMessage.Description>
              {mode === "error"
                ? "Retry the request or inspect the safe preview details. Your draft is retained."
                : mode === "offline"
                  ? "Cached information may be outdated. Reconnect before requesting fresh data."
                  : "The local response is completed manually. Cancel preserves your draft."}
            </InlineMessage.Description>
            <InlineMessage.Actions>
              {mode === "pending" ? (
                <>
                  <Button
                    ref={cancel}
                    variant="outline"
                    onClick={cancelRequest}
                  >
                    Cancel retry
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => pending.current?.finish(outcome)}
                  >
                    Complete recovery response
                  </Button>
                </>
              ) : (
                <Button ref={retry} onClick={start}>
                  {mode === "error" ? "Retry preview" : "Reconnect preview"}
                </Button>
              )}
            </InlineMessage.Actions>
          </InlineMessage.Content>
        </InlineMessage.Root>
      )}
      {mode === "permission" && (
        <EmptyState.Root>
          <EmptyState.Title>Resource access required</EmptyState.Title>
          <EmptyState.Description>
            Cached resource data has been cleared. Restore preview access before
            loading it again.
          </EmptyState.Description>
          <EmptyState.Actions>
            <Button
              ref={restore}
              onClick={() => {
                nextFocus.current = "load";
                setNotice(
                  "Preview access restored. Load data to check access.",
                );
                setMode("ready");
              }}
            >
              Restore preview access
            </Button>
          </EmptyState.Actions>
        </EmptyState.Root>
      )}
      {mode === "not-found" && (
        <EmptyState.Root>
          <EmptyState.Title>Resource not found</EmptyState.Title>
          <EmptyState.Description>
            The address may be stale. Choose a resource from the list instead of
            retrying this address.
          </EmptyState.Description>
          <EmptyState.Actions>
            <Link className="pui-button" href="/patterns/resource-list">
              Browse resource examples
            </Link>
          </EmptyState.Actions>
        </EmptyState.Root>
      )}
      {mode === "ready" && (
        <div className="actions">
          <Button ref={load} onClick={start}>
            {saved ? "Refresh preview" : "Load preview"}
          </Button>
        </div>
      )}
      {cached && saved && (
        <section aria-label="Saved resource preview" className="recovery-saved">
          <h3 ref={result} tabIndex={-1}>
            Last saved preview
          </h3>
          <p>{saved.label}</p>
          <p>Revision {saved.revision}</p>
          <StatusBadge tone={mode === "ready" ? "success" : "caution"}>
            {mode === "ready" ? "Current preview" : "May be outdated"}
          </StatusBadge>
        </section>
      )}
      {mode === "error" && (
        <Collapsible.Root>
          <Collapsible.Trigger render={<Button variant="ghost" />}>
            Preview request details
          </Collapsible.Trigger>
          <Collapsible.Panel>
            <CodeBlock
              language="tsx"
              code={
                "Request: PREVIEW-503\nOperation: read resource preview\nStatus: temporary failure\nThis sample contains no credentials or product data."
              }
              label="Safe preview request details"
              copyLabel="Copy preview details"
            />
          </Collapsible.Panel>
        </Collapsible.Root>
      )}
      <p role="status" aria-label="Recovery result">
        {notice}
      </p>
      <p className="recovery-attempts">Preview requests started: {attempts}.</p>
    </div>
  );
}
