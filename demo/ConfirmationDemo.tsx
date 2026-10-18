import React, { useState, useRef } from "react";
import { AlertDialog, Popover, Button } from "@surflane/ui";

export function ConfirmationDemo() {
  const [open, setOpen] = useState(false),
    [inlineOpen, setInlineOpen] = useState(false);
  const [result, setResult] = useState("No preview action taken.");
  const cancel = useRef<HTMLButtonElement>(null);
  return (
    <section aria-labelledby="confirmations-title">
      <h2 id="confirmations-title">Confirmation</h2>
      <p className="note">
        Confirm important decisions in a small dialog and lightweight actions
        next to the button. This preview does not affect real data.
      </p>
      <div className="actions">
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
          <AlertDialog.Trigger render={<Button variant="outline" />}>
            Preview discard confirmation
          </AlertDialog.Trigger>
          <AlertDialog.Content initialFocus={cancel}>
            <AlertDialog.Header>
              <AlertDialog.Title>Discard this draft?</AlertDialog.Title>
              <AlertDialog.Description>
                Discards the preview draft in progress. Real tests and
                environments are not affected.
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <AlertDialog.Close
                ref={cancel}
                render={<Button variant="outline" />}
              >
                Keep draft
              </AlertDialog.Close>
              <Button
                variant="destructive"
                onClick={() => {
                  setResult("Preview draft discarded.");
                  setOpen(false);
                }}
              >
                Discard preview draft
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
        <Popover.Root open={inlineOpen} onOpenChange={setInlineOpen}>
          <Popover.Trigger render={<Button variant="outline" />}>
            Preview reset confirmation
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align="start">
              <Popover.Title>Reset preview filters?</Popover.Title>
              <Popover.Description>
                Resets the selected filters to their defaults.
              </Popover.Description>
              <div className="actions">
                <Popover.Close render={<Button variant="outline" />}>
                  Keep filters
                </Popover.Close>
                <Button
                  onClick={() => {
                    setResult("Preview filters reset.");
                    setInlineOpen(false);
                  }}
                >
                  Reset preview filters
                </Button>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
      <p role="status" className="note">
        {result}
      </p>
    </section>
  );
}
