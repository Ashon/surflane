import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Field,
  Fieldset,
  Select,
  NativeSelect,
  Button,
  InlineMessage,
  Spinner,
} from "@surflane/ui";
type Draft = { name: string; url: string; region: string };
type Outcome =
  "success" | "field-conflict" | "request-failure" | "permission-denied";
type Phase =
  | "idle"
  | "pending"
  | "field-error"
  | "request-error"
  | "permission"
  | "success";
const initial: Draft = { name: "", url: "", region: "cluster-a" };
/** A manually resolved local request: no product service is contacted. */
function previewRequest(id: number, values: Draft, outcome: Outcome) {
  const controller = new AbortController();
  let complete!: (reply: Outcome | "aborted") => void;
  const promise = new Promise<Outcome | "aborted">((resolve) => {
    complete = resolve;
    controller.signal.addEventListener("abort", () => resolve("aborted"), {
      once: true,
    });
  });
  return { id, values: { ...values }, outcome, controller, complete, promise };
}
export function FormWorkflowExample() {
  const [draft, setDraft] = useState<Draft>(initial),
    [outcome, setOutcome] = useState<Outcome>("success"),
    [phase, setPhase] = useState<Phase>("idle"),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [saved, setSaved] = useState<Draft | null>(null),
    [notice, setNotice] = useState(""),
    [attempts, setAttempts] = useState(0),
    [generation, setGeneration] = useState(0);
  const pending = useRef<ReturnType<typeof previewRequest> | null>(null),
    sequence = useRef(0);
  const name = useRef<HTMLInputElement>(null),
    submit = useRef<HTMLButtonElement>(null),
    cancel = useRef<HTMLButtonElement>(null),
    success = useRef<HTMLElement>(null),
    restore = useRef<HTMLButtonElement>(null);
  const nextFocus = useRef<
    "name" | "submit" | "cancel" | "success" | "restore" | null
  >(null);
  useEffect(() => {
    const target = nextFocus.current;
    if (target) {
      ({ name, submit, cancel, success, restore })[target].current?.focus();
      nextFocus.current = null;
    }
  }, [phase, generation]);
  useEffect(
    () => () => {
      const request = pending.current;
      pending.current = null;
      request?.controller.abort();
    },
    [],
  );
  const edit = (key: keyof Draft, value: string) => {
    if (pending.current) return;
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
    setPhase("idle");
    setNotice("");
    setSaved(null);
  };
  const start = (values: Draft) => {
    if (pending.current || phase === "permission") return;
    const request = previewRequest(++sequence.current, values, outcome);
    pending.current = request;
    setAttempts((value) => value + 1);
    setErrors({});
    setNotice("");
    setSaved(null);
    nextFocus.current = "cancel";
    setPhase("pending");
    void request.promise.then((reply) => {
      if (
        request.controller.signal.aborted ||
        pending.current !== request ||
        reply === "aborted"
      )
        return;
      pending.current = null;
      if (reply === "field-conflict") {
        setErrors({
          name: "This environment name is already registered. Choose another name.",
        });
        nextFocus.current = "name";
        setPhase("field-error");
      } else if (reply === "request-failure") {
        nextFocus.current = "submit";
        setPhase("request-error");
      } else if (reply === "permission-denied") {
        nextFocus.current = "restore";
        setPhase("permission");
      } else {
        setSaved(request.values);
        nextFocus.current = "success";
        setPhase("success");
      }
    });
  };
  const reset = () => {
    const request = pending.current;
    pending.current = null;
    request?.controller.abort();
    setDraft(initial);
    setErrors({});
    setSaved(null);
    setNotice("Preview reset.");
    nextFocus.current = "name";
    setPhase("idle");
    setGeneration((value) => value + 1);
  };
  const cancelRequest = () => {
    const request = pending.current;
    pending.current = null;
    request?.controller.abort();
    setNotice("Request canceled. Your draft is retained.");
    nextFocus.current = "name";
    setPhase("idle");
  };
  const busy = phase === "pending",
    restricted = phase === "permission";
  return (
    <div className="form-workflow-example">
      <label className="workflow-response">
        Preview response
        <NativeSelect
          value={outcome}
          disabled={busy}
          onChange={(event) => setOutcome(event.target.value as Outcome)}
        >
          <option value="success">Success</option>
          <option value="field-conflict">Field conflict</option>
          <option value="request-failure">Request failure</option>
          <option value="permission-denied">Permission denied</option>
        </NativeSelect>
      </label>
      <p>
        Responses are completed manually below so each submission state can be
        inspected. No environment is created.
      </p>
      {phase === "field-error" && (
        <InlineMessage.Root tone="danger" role="alert">
          <InlineMessage.Icon tone="danger" />
          <InlineMessage.Content>
            <InlineMessage.Title>
              Correct the highlighted field
            </InlineMessage.Title>
            <InlineMessage.Description>
              Your other inputs are retained.
            </InlineMessage.Description>
          </InlineMessage.Content>
        </InlineMessage.Root>
      )}
      {phase === "request-error" && (
        <InlineMessage.Root tone="danger" role="alert">
          <InlineMessage.Icon tone="danger" />
          <InlineMessage.Content>
            <InlineMessage.Title>
              The request could not be completed
            </InlineMessage.Title>
            <InlineMessage.Description>
              Your draft is retained. Change the preview response and retry when
              ready.
            </InlineMessage.Description>
          </InlineMessage.Content>
        </InlineMessage.Root>
      )}
      {restricted && (
        <InlineMessage.Root tone="caution" role="alert">
          <InlineMessage.Icon tone="caution" />
          <InlineMessage.Content>
            <InlineMessage.Title>
              Registration is not permitted
            </InlineMessage.Title>
            <InlineMessage.Description id="workflow-permission-reason">
              This preview account has no registration access. Inputs are
              preserved.
            </InlineMessage.Description>
            <InlineMessage.Actions>
              <Button
                ref={restore}
                variant="outline"
                onClick={() => {
                  setNotice("Preview access restored.");
                  nextFocus.current = "name";
                  setPhase("idle");
                }}
              >
                Restore preview access
              </Button>
            </InlineMessage.Actions>
          </InlineMessage.Content>
        </InlineMessage.Root>
      )}
      {phase === "success" && saved && (
        <InlineMessage.Root tone="success">
          <InlineMessage.Icon tone="success" />
          <InlineMessage.Content>
            <InlineMessage.Title ref={success} tabIndex={-1}>
              Registration preview complete
            </InlineMessage.Title>
            <InlineMessage.Description>
              {saved.name} / {saved.url} / {saved.region}
            </InlineMessage.Description>
            <InlineMessage.Actions>
              <Button variant="outline" onClick={reset}>
                Start another preview
              </Button>
            </InlineMessage.Actions>
          </InlineMessage.Content>
        </InlineMessage.Root>
      )}
      <Form<Draft>
        key={generation}
        aria-label="Environment registration preview"
        aria-busy={busy}
        errors={errors}
        onFormSubmit={start}
        onReset={(event) => {
          event.preventDefault();
          reset();
        }}
      >
        <Fieldset.Root
          disabled={busy || restricted}
          aria-describedby={
            restricted ? "workflow-permission-reason" : undefined
          }
        >
          <Fieldset.Legend>Environment details</Fieldset.Legend>
          <Field.Root name="name">
            <Field.Label>Environment name</Field.Label>
            <Field.Control
              ref={name}
              required
              pattern={"[a-z][a-z0-9\\-]{2,47}"}
              maxLength={48}
              value={draft.name}
              onChange={(event) => edit("name", event.target.value)}
              placeholder="preview-environment"
            />
            <Field.Description>
              3–48 lowercase letters, digits or hyphens; start with a letter.
            </Field.Description>
            <Field.Error />
          </Field.Root>
          <Field.Root name="url">
            <Field.Label>Service URL</Field.Label>
            <Field.Control
              type="url"
              required
              pattern="https://.+"
              value={draft.url}
              onChange={(event) => edit("url", event.target.value)}
              placeholder="https://api.example.test"
            />
            <Field.Description>Use an HTTPS endpoint.</Field.Description>
            <Field.Error />
          </Field.Root>
          <Field.Root name="region">
            <Field.Label>Cluster</Field.Label>
            <Select
              aria-label="Registration cluster"
              name="region"
              value={draft.region}
              onValueChange={(value) => edit("region", value)}
              options={[
                { value: "cluster-a", label: "Cluster A" },
                { value: "cluster-b", label: "Cluster B" },
              ]}
            />
          </Field.Root>
        </Fieldset.Root>
        <div className="actions">
          <Button ref={submit} type="submit" disabled={busy || restricted}>
            {busy
              ? "Submitting preview…"
              : phase === "request-error"
                ? "Retry registration"
                : "Register preview"}
          </Button>
          <Button type="reset" variant="outline" disabled={busy}>
            Reset preview
          </Button>
        </div>
      </Form>
      {busy && (
        <InlineMessage.Root tone="progress">
          <InlineMessage.Icon>
            <Spinner decorative size="sm" />
          </InlineMessage.Icon>
          <InlineMessage.Content>
            <InlineMessage.Title role="status">
              Submitting preview request
            </InlineMessage.Title>
            <InlineMessage.Description>
              Draft editing is paused. Complete or cancel this local request.
            </InlineMessage.Description>
            <InlineMessage.Actions>
              <Button
                variant="outline"
                onClick={() => {
                  const request = pending.current;
                  request?.complete(request.outcome);
                }}
              >
                Complete preview request
              </Button>
              <Button ref={cancel} variant="outline" onClick={cancelRequest}>
                Cancel request
              </Button>
            </InlineMessage.Actions>
          </InlineMessage.Content>
        </InlineMessage.Root>
      )}
      <p className="workflow-notice" role="status">
        {notice}
      </p>
      <p className="catalog-preview-note">
        Preview requests started: {attempts}. Real request transport,
        permissions and idempotency remain product responsibilities.
      </p>
    </div>
  );
}
