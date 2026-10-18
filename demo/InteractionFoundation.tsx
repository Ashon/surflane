import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  CodeBlock,
  Field,
  Inline,
  InlineMessage,
  Input,
  Spinner,
  Table,
  Toggle,
} from "@surflane/ui";
import { Link } from "./router";
type Outcome = "idle" | "pending" | "success" | "error" | "canceled";
const states = [
  [
    "Default",
    "The default state, ready to act",
    "Clearly shows the label, role, and next action",
  ],
  [
    "Hover",
    "The pointer is over the target",
    "Brief color and surface feedback; essential information is always available",
  ],
  [
    "Focus visible",
    "The keyboard user's current position",
    "An immediate focus ring separated from the surface; Tab order is preserved",
  ],
  [
    "Active",
    "The brief moment while pressed",
    "Press feedback on the button; never mistaken for a persistent selection",
  ],
  [
    "Pressed / selected",
    "A selection that persists",
    "Toggle and selection components change their state and ARIA value together",
  ],
  [
    "Disabled",
    "The action itself cannot run",
    "Native disabled state, with the reason in adjacent text",
  ],
  [
    "Read only",
    "The value can be read and copied",
    "Preserves the value and focus; restricts only editing and changes",
  ],
  [
    "Pending",
    "The action started and is waiting for a result",
    "Prevents duplicate requests, announces status, offers a cancel path when possible",
  ],
  [
    "Error / success",
    "The result of the actual action",
    "A persistent result and recovery path; never conveyed by motion alone",
  ],
];
export function InteractionFoundation() {
  const [included, setIncluded] = useState(false),
    [fail, setFail] = useState(false),
    [outcome, setOutcome] = useState<Outcome>("idle"),
    [attempts, setAttempts] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runButton = useRef<HTMLButtonElement>(null);
  const busy = outcome === "pending";
  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );
  function run() {
    if (timer.current !== null) return;
    setAttempts((value) => value + 1);
    setOutcome("pending");
    const shouldFail = fail;
    timer.current = setTimeout(() => {
      timer.current = null;
      setOutcome(shouldFail ? "error" : "success");
    }, 900);
  }
  function cancel() {
    if (timer.current === null) return;
    clearTimeout(timer.current);
    timer.current = null;
    setOutcome("canceled");
    runButton.current?.focus();
  }
  const status = {
    idle: "No preview has run.",
    pending: "Local preview running.",
    success: "Local preview completed. No resources were created.",
    error: "Local preview failed. Review the persistent message and retry.",
    canceled: "Local preview canceled. You can run it again.",
  }[outcome];
  return (
    <>
      <nav className="page-toc" aria-label="On this page">
        {["states", "activation", "async-work", "keyboard", "application"].map(
          (id) => (
            <a key={id} href={`#${id}`}>
              {id
                .split("-")
                .map((word) => word[0].toUpperCase() + word.slice(1))
                .join(" ")}
            </a>
          ),
        )}
      </nav>
      <section id="states">
        <h2>One action, understandable states</h2>
        <p>
          States tell users which actions are available now and what actually
          happened. Pointer hover and active, keyboard focus, persistent
          selection, and pending server work each mean something different.
          Don't merge them into a single color, and don't offer actions only on
          hover.
        </p>
        <Table.Container
          label="Interaction state contracts"
          orientation="horizontal"
        >
          <Table.Root>
            <Table.Caption>
              State contracts for shared controls and product actions
            </Table.Caption>
            <Table.Head>
              <Table.Row>
                {["State", "Meaning", "Contract"].map((label) => (
                  <Table.HeaderCell key={label} scope="col">
                    {label}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {states.map(([state, meaning, contract]) => (
                <Table.Row key={state}>
                  <Table.HeaderCell scope="row">{state}</Table.HeaderCell>
                  <Table.Cell>{meaning}</Table.Cell>
                  <Table.Cell>{contract}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
      </section>
      <section id="activation">
        <h2>Distinguish selection from activation</h2>
        <p>
          Mouse, touch, Enter, and Space must all run the same action. Below,
          the Toggle shows a persistent selection, the disabled button shows an
          action that can't run, and the read-only input shows a copyable value.
          State changes apply only to this local example.
        </p>
        <Inline gap={3}>
          <Toggle
            value="evidence"
            pressed={included}
            onPressedChange={setIncluded}
          >
            Include evidence
          </Toggle>
          <Button
            variant="outline"
            disabled
            aria-describedby="unavailable-reason"
          >
            Unavailable preview
          </Button>
        </Inline>
        <p id="unavailable-reason">
          Unavailable preview: this example has no connected external
          environment.
        </p>
        <p data-evidence-selection>
          {included ? "Evidence included." : "Evidence excluded."}
        </p>
        <Field.Root className="content-name-field">
          <Field.Label>Read-only resource ID</Field.Label>
          <Field.Description>
            You can focus and copy this value, but you can't edit it.
          </Field.Description>
          <Input readOnly value="demo-e2e-42" />
        </Field.Root>
        <p>
          Don't add clickable divs, positive tabIndex values, or separate
          keydown handlers that run the action a second time. Keep the native
          keyboard semantics of Base UI buttons and the ARIA contracts of
          selection components.
        </p>
      </section>
      <section id="async-work">
        <h2>Pending is not completion</h2>
        <p>
          Below is a 900ms local task. You can reproduce failure, cancellation,
          and retry; no server requests are made and no resources are created.
          While pending, the run button keeps focus and blocks duplicate runs;
          after cancellation, focus returns to the run button. Completion itself
          doesn't move the user's focus.
        </p>
        <div className="example-stack interaction-work-preview">
          <label className="pui-choice-label">
            <Checkbox.Root
              checked={fail}
              disabled={busy}
              onCheckedChange={setFail}
            >
              <Checkbox.Indicator />
            </Checkbox.Root>
            Fail local preview
          </label>
          <Inline gap={3}>
            <Button
              ref={runButton}
              disabled={busy}
              focusableWhenDisabled
              aria-busy={busy}
              onClick={run}
            >
              {busy && <Spinner decorative size="sm" />}Run local preview
            </Button>
            <Button variant="outline" disabled={!busy} onClick={cancel}>
              Cancel local preview
            </Button>
          </Inline>
          <p>
            Started attempts: <span data-local-attempts>{attempts}</span>
          </p>
          <p
            role="status"
            aria-label="Local preview result"
            aria-atomic="true"
            data-local-result
          >
            {status}
          </p>
          {outcome === "error" && (
            <InlineMessage.Root tone="danger">
              <InlineMessage.Icon tone="danger" />
              <InlineMessage.Content>
                <InlineMessage.Title>
                  Preview needs attention
                </InlineMessage.Title>
                <InlineMessage.Description>
                  This is a sample failure. Clear the failure option and try
                  again with Run local preview. It doesn't indicate a real
                  system failure or a permission problem.
                </InlineMessage.Description>
              </InlineMessage.Content>
            </InlineMessage.Root>
          )}
        </div>
        <CodeBlock
          language="tsx"
          code={`<Button
  disabled={pending}
  focusableWhenDisabled
  aria-busy={pending}
  onClick={startPreview}
>
  {pending && <Spinner decorative size="sm" />}
  Run local preview
</Button>
<p role="status" aria-atomic="true">{resultMessage}</p>

// Also guard duplicate starts in the handler. Cancel timers / requests on cleanup.
// For real writes, the server still owns idempotency and authorization.`}
        />
        <p>
          In this pattern, aria-disabled is paired with a JavaScript guard.
          Don't assume that a button with only a state attribute blocks
          requests. For real write operations, the server and the product must
          guarantee idempotency, authorization, and whether cancellation is
          possible.
        </p>
      </section>
      <section id="keyboard">
        <h2>Keep every input path usable</h2>
        <ul>
          <li>
            Tab and Shift+Tab follow a meaningful DOM order. Buttons respond to
            Enter and Space, links to Enter, and composite components follow the
            arrow-key contract in their own guides.
          </li>
          <li>
            When a popup opens, set its initial focus; after Escape or closing,
            restore focus to the original trigger. Async completion doesn't
            steal the current focus.
          </li>
          <li>
            Give touch users a path that doesn't require hover, and preserve the
            touch targets for labels, close, and cancel. Pair drag and swipe
            with click and keyboard alternatives.
          </li>
          <li>
            Scrolling uses the shared ScrollArea and keeps wheel, keyboard, and
            touch support. Transitions don't change the DOM order of content or
            current input values.
          </li>
        </ul>
        <p>
          Review these together with the{" "}
          <Link href="/foundations/accessibility">
            accessibility error and focus examples
          </Link>
          ,{" "}
          <Link href="/components/drawer">alternative controls in Drawer</Link>,
          and{" "}
          <Link href="/components/toast">F6, dismiss, and pause in Toast</Link>.
        </p>
      </section>
      <section id="application">
        <h2>Connect behavior to motion and products</h2>
        <p>
          Keep visual transition time separate from actual task time. Show focus
          rings and status text immediately, and use the per-component tokens
          from the{" "}
          <Link href="/foundations/motion#transitions">transition policy</Link>{" "}
          and the{" "}
          <Link href="/foundations/motion#easing">easing mechanism</Link>.
          Success, error, cancellation, and every task path must stay the same
          with reduced motion.
        </p>
        <p>
          Actions such as start, cancel, save, and edit connect this state model
          to their actual results and recovery policies. The local delay and
          failure option on this page are not evidence of operational status.
        </p>
        <p>
          References:{" "}
          <a href="https://base-ui.com/react/components/button">
            Base UI Button
          </a>
          ,{" "}
          <a href="https://www.w3.org/WAI/ARIA/apg/patterns/button/">
            WAI-ARIA button pattern
          </a>
          . See the <Link href="/components">individual component pages</Link>{" "}
          for each component's API, focus, and keyboard documentation.
        </p>
      </section>
    </>
  );
}
