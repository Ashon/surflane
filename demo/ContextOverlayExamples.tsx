import React, { useState } from "react";
import {
  ContextMenu,
  Menu,
  PreviewCard,
  Checkbox,
  DirectionProvider,
} from "@surflane/ui";
export { contextOverlayExampleIds } from "./exampleGroups";
function Items({
  pinned,
  setPinned,
  setAction,
}: {
  pinned: boolean;
  setPinned: (value: boolean) => void;
  setAction: (value: string) => void;
}) {
  return (
    <>
      <Menu.Item onClick={() => setAction("Log preview opened.")}>
        Open logs
      </Menu.Item>
      <Menu.CheckboxItem checked={pinned} onCheckedChange={setPinned}>
        <Menu.CheckboxItemIndicator />
        Pin logs
      </Menu.CheckboxItem>
      <Menu.Item disabled>Delete logs</Menu.Item>
      <Menu.Separator />
      <Menu.SubmenuRoot>
        <Menu.SubmenuTrigger>Export</Menu.SubmenuTrigger>
        <Menu.Portal>
          <ContextMenu.Content>
            <Menu.Item onClick={() => setAction("JSON export previewed.")}>
              JSON logs
            </Menu.Item>
          </ContextMenu.Content>
        </Menu.Portal>
      </Menu.SubmenuRoot>
    </>
  );
}

export function ContextOverlayExample({ id }: { id: string }) {
  const [pinned, setPinned] = useState(false);
  const [action, setAction] = useState("No log action taken.");
  const [disabled, setDisabled] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [cancel, setCancel] = useState(false);
  if (id === "context-menu")
    return (
      <div className="example-stack">
        <div className="actions">
          <label className="pui-choice-label">
            <Checkbox.Root checked={disabled} onCheckedChange={setDisabled}>
              <Checkbox.Indicator />
            </Checkbox.Root>
            Disable context menu
          </label>
          <label className="pui-choice-label">
            <Checkbox.Root checked={rtl} onCheckedChange={setRtl}>
              <Checkbox.Indicator />
            </Checkbox.Root>
            RTL preview
          </label>
        </div>
        <DirectionProvider direction={rtl ? "rtl" : "ltr"}>
          <div dir={rtl ? "rtl" : "ltr"} className="context-evidence">
            <ContextMenu.Root disabled={disabled}>
              <ContextMenu.Trigger
                className="context-evidence-target"
                aria-describedby="context-hint"
              >
                <strong>Platform API build logs</strong>
                <p id="context-hint">
                  Right-click or long-press for actions. The visible menu offers
                  the same actions with keyboard and touch.
                </p>
              </ContextMenu.Trigger>
              <ContextMenu.Portal>
                <ContextMenu.Content
                  aria-label="Log context actions"
                  positionerProps={{ collisionPadding: 12 }}
                >
                  <Items
                    pinned={pinned}
                    setPinned={setPinned}
                    setAction={setAction}
                  />
                </ContextMenu.Content>
              </ContextMenu.Portal>
            </ContextMenu.Root>
            <Menu.Root>
              <Menu.Trigger>Log actions</Menu.Trigger>
              <Menu.Portal>
                <Menu.Content aria-label="Log actions">
                  <Items
                    pinned={pinned}
                    setPinned={setPinned}
                    setAction={setAction}
                  />
                </Menu.Content>
              </Menu.Portal>
            </Menu.Root>
          </div>
        </DirectionProvider>
        <p role="status">
          {action} {pinned ? "Logs pinned." : "Logs unpinned."}
        </p>
      </div>
    );
  return (
    <div className="example-stack">
      <label className="pui-choice-label">
        <Checkbox.Root checked={cancel} onCheckedChange={setCancel}>
          <Checkbox.Indicator />
        </Checkbox.Root>
        Cancel preview opening
      </label>
      <PreviewCard.Root
        onOpenChange={(open, details) => {
          if (open && cancel) details.cancel();
        }}
      >
        <p>
          Read the{" "}
          <PreviewCard.Trigger href="#preview-destination">
            deployment policy guide
          </PreviewCard.Trigger>{" "}
          before configuring deployment checks.
        </p>
        <PreviewCard.Portal>
          <PreviewCard.Content>
            <strong>Deployment policy guide</strong>
            <p>
              Check allowed and blocked environments with temporary tokens. Keep
              redacted logs for each check.
            </p>
          </PreviewCard.Content>
        </PreviewCard.Portal>
      </PreviewCard.Root>
      <section
        id="preview-destination"
        tabIndex={-1}
        aria-labelledby="preview-destination-title"
      >
        <h3 id="preview-destination-title">Deployment policy guide</h3>
        <p>
          Check allowed and blocked environments with temporary tokens. Keep
          redacted logs for each check.
        </p>
        <p>
          The destination contains the same summary. No action or essential
          information is available only inside the preview.
        </p>
      </section>
    </div>
  );
}
