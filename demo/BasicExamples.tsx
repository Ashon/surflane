import React, { useRef, useState } from "react";
import {
  Button,
  Stack,
  Inline,
  Input,
  Select,
  NativeSelect,
  Popover,
  Menu,
  Tooltip,
  TooltipProvider,
  Dialog,
  AlertDialog,
  Sheet,
  Drawer,
  ScrollArea,
} from "@surflane/ui";
import { PanelsDemo } from "./PanelsDemo";
const regions = [
  { value: "staging", label: "Staging" },
  { value: "production", label: "Production" },
  { value: "unavailable", label: "Unavailable", disabled: true },
];
export function BasicExample({
  id,
  toggleTheme,
}: {
  id: string;
  toggleTheme: () => void;
}) {
  const [message, setMessage] = useState("No preview action taken.");
  const [selected, setSelected] = useState("staging");
  const [open, setOpen] = useState(false);
  const cancel = useRef<HTMLButtonElement>(null);
  let example: React.ReactNode;
  switch (id) {
    case "button":
      example = (
        <div className="example-stack">
          <div className="actions">
            <Button
              variant="primary"
              onClick={() => setMessage("Primary action previewed.")}
            >
              Run preview
            </Button>
            <Button
              variant="outline"
              onClick={() => setMessage("Secondary action previewed.")}
            >
              Inspect details
            </Button>
            <Button
              variant="ghost"
              onClick={() => setMessage("Ghost action previewed.")}
            >
              View history
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                setMessage("Destructive appearance only; nothing deleted.")
              }
            >
              Discard preview
            </Button>
            <Button disabled>Unavailable</Button>
          </div>
          <div className="button-variant-guide">
            <p>
              Default is the former name of Primary. The Default size means the
              base size and is separate from the color role.
            </p>
            <ScrollArea label="Button variants and sizes">
              <table className="button-variant-table">
                <caption>Emphasis level and size comparison</caption>
                <thead>
                  <tr>
                    <th scope="col">Role</th>
                    {["Small", "Default", "Large"].map((size) => (
                      <th key={size} scope="col">
                        {size}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ["primary", "Primary", "Primary action / brand surface"],
                      [
                        "secondary",
                        "Secondary",
                        "Secondary action / neutral surface",
                      ],
                      ["outline", "Outline", "Secondary action / border"],
                      ["ghost", "Ghost", "Low emphasis / transparent surface"],
                      [
                        "destructive",
                        "Destructive",
                        "Destructive action / semantic color",
                      ],
                      ["link", "Link", "Lightweight inline action"],
                    ] as const
                  ).map(([variant, label, description]) => (
                    <tr key={variant}>
                      <th scope="row">
                        {label}
                        <span>{description}</span>
                      </th>
                      {(["small", "default", "large"] as const).map((size) => (
                        <td key={size}>
                          <Button
                            variant={variant}
                            size={size}
                            aria-label={`${label}, ${size}`}
                            onClick={() =>
                              setMessage(`${label} / ${size} previewed.`)
                            }
                          >
                            {label}
                          </Button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </div>
        </div>
      );
      break;
    case "input":
      example = (
        <div className="grid">
          <label>
            Name
            <Input placeholder="Enter a name" />
          </label>
          <label>
            Read only
            <Input readOnly value="demo-e2e-01" />
          </label>
          <label>
            Project ID
            <Input
              placeholder="project-id"
              aria-invalid="true"
              aria-describedby="input-error"
            />
            <span id="input-error" className="field-error">
              Check the project ID.
            </span>
          </label>
          <label>
            Disabled
            <Input disabled placeholder="Unavailable" />
          </label>
        </div>
      );
      break;
    case "select":
    case "native-select":
      example = (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setMessage(
              "Submitted environment: " +
                new FormData(e.currentTarget).get("environment"),
            );
          }}
        >
          <label>
            Environment
            {id === "select" ? (
              <Select
                name="environment"
                options={regions}
                defaultValue="staging"
                aria-label="Environment"
              />
            ) : (
              <NativeSelect
                name="environment"
                aria-label="Environment"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                <option value="staging">Staging</option>
                <option value="production">Production</option>
                <option disabled value="unavailable">
                  Unavailable
                </option>
              </NativeSelect>
            )}
          </label>
          <div className="actions">
            <Button type="submit">Submit preview</Button>
            <Button type="reset" variant="outline">
              Reset
            </Button>
          </div>
        </form>
      );
      break;
    case "popover":
      example = (
        <Popover.Root>
          <Popover.Trigger render={<Button variant="outline" />}>
            Inspect account
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content>
              <Stack gap={4} className="spacing-example">
                <Stack gap={1} className="spacing-example">
                  <Popover.Title>Preview account</Popover.Title>
                  <Popover.Description>
                    Review details next to the trigger.
                  </Popover.Description>
                </Stack>
                <label>
                  Nickname
                  <Input placeholder="Display name" />
                </label>
                <Inline gap={2}>
                  <Popover.Close render={<Button variant="outline" />}>
                    Done
                  </Popover.Close>
                </Inline>
              </Stack>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      );
      break;
    case "menu":
      example = (
        <Menu.Root>
          <Menu.Trigger render={<Button variant="outline" />}>
            Open actions
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Content>
              <Menu.Item onClick={() => setMessage("Inspect selected.")}>
                Inspect
              </Menu.Item>
              <Menu.Item onClick={() => setMessage("Export selected.")}>
                Export preview
              </Menu.Item>
              <Menu.Item disabled>Delete unavailable</Menu.Item>
            </Menu.Content>
          </Menu.Portal>
        </Menu.Root>
      );
      break;
    case "tooltip":
      example = (
        <TooltipProvider delayDuration={200}>
          <Tooltip label="Inspect the build logs.">
            <Button variant="outline">Inspect logs</Button>
          </Tooltip>
        </TooltipProvider>
      );
      break;
    case "dialog":
      example = (
        <Dialog.Root>
          <Dialog.Trigger render={<Button variant="outline" />}>
            Open deployment plan
          </Dialog.Trigger>
          <Dialog.Content closeLabel="Close deployment plan">
            <Dialog.Header>
              <Dialog.Title>Deployment plan</Dialog.Title>
              <Dialog.Description>
                A preview that does not start a deployment.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <label>
                Environment
                <Select
                  options={regions}
                  defaultValue="staging"
                  aria-label="Dialog environment"
                />
              </label>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close render={<Button variant="outline" />}>
                Cancel
              </Dialog.Close>
              <Dialog.Close render={<Button />}>Save preview</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      );
      break;
    case "alert-dialog":
      example = (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
          <AlertDialog.Trigger render={<Button variant="outline" />}>
            Preview discard confirmation
          </AlertDialog.Trigger>
          <AlertDialog.Content initialFocus={cancel}>
            <AlertDialog.Header>
              <AlertDialog.Title>Discard this draft?</AlertDialog.Title>
              <AlertDialog.Description>
                Discards only the preview draft. Real resources are not
                affected.
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
                  setMessage("Preview draft discarded.");
                  setOpen(false);
                }}
              >
                Discard preview draft
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
      );
      break;
    case "inline-confirmation":
      example = (
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger render={<Button variant="outline" />}>
            Preview reset confirmation
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content>
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
                    setMessage("Preview filters reset.");
                    setOpen(false);
                  }}
                >
                  Reset preview filters
                </Button>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      );
      break;
    case "sheet":
    case "drawer":
      return <PanelsDemo toggleTheme={toggleTheme} view={id} />;
    case "scroll-area":
      example = (
        <ScrollArea
          label="Build revisions"
          orientation="both"
          style={{ maxHeight: 200 }}
        >
          <table>
            <caption>Preview build revisions</caption>
            <thead>
              <tr>
                <th scope="col">Service</th>
                <th scope="col">Start revision</th>
                <th scope="col">Finish revision</th>
              </tr>
            </thead>
            <tbody>
              {[
                "platform-api",
                "auth-gateway",
                "billing-service",
                "search-indexer",
                "notification-worker",
                "payments-api",
              ].map((s) => (
                <tr key={s}>
                  <th scope="row">{s}</th>
                  <td>
                    <code>sha256:8af4935c6e2b1542a302a89238c0</code>
                  </td>
                  <td>
                    <code>sha256:28c04592d081b1b83f1b2d46177a</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      );
      break;
    default:
      return null;
  }
  return (
    <div className="component-example">
      <div className="example-controls">{example}</div>
      {[
        "button",
        "select",
        "native-select",
        "menu",
        "alert-dialog",
        "inline-confirmation",
      ].includes(id) && (
        <p role="status" className="note">
          {message}
        </p>
      )}
    </div>
  );
}
