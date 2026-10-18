import React, { useState } from "react";
import {
  Tabs,
  Accordion,
  Collapsible,
  Avatar,
  Inline,
  Badge,
  StatusBadge,
  Separator,
  Link as TextLink,
  Breadcrumbs,
  Input,
  Checkbox,
  Select,
  Button,
  type StatusTone,
} from "@surflane/ui";
import { withBase } from "./router";
export { navigationExampleIds } from "./exampleGroups";
function Toggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="pui-choice-label">
      <Checkbox.Root checked={checked} onCheckedChange={onChange}>
        <Checkbox.Indicator />
      </Checkbox.Root>
      <span>{children}</span>
    </label>
  );
}
function TabsExample() {
  const [selected, setSelected] = useState<string | number | null>("overview"),
    [automatic, setAutomatic] = useState(false),
    [hold, setHold] = useState(false),
    [orientation, setOrientation] = useState<"horizontal" | "vertical">(
      "horizontal",
    );
  return (
    <div className="example-stack">
      <div className="grid">
        <label>
          Tab orientation
          <Select
            aria-label="Tab orientation"
            value={orientation}
            onValueChange={(v) => setOrientation(v as typeof orientation)}
            options={[
              { value: "horizontal", label: "Horizontal" },
              { value: "vertical", label: "Vertical" },
            ]}
          />
        </label>
        <div>
          <Toggle checked={automatic} onChange={setAutomatic}>
            Activate on focus
          </Toggle>
          <Toggle checked={hold} onChange={setHold}>
            Prevent tab changes
          </Toggle>
        </div>
      </div>
      <Tabs.Root
        value={selected}
        orientation={orientation}
        onValueChange={(value, event) => {
          if (hold && event.reason === "none") {
            event.cancel();
            return;
          }
          setSelected(value);
        }}
      >
        <Tabs.List aria-label="Deployment sections" activateOnFocus={automatic}>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="logs">Logs</Tabs.Tab>
          <Tabs.Tab value="unavailable" disabled>
            Unavailable
          </Tabs.Tab>
          <Tabs.Tab value="history">History</Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Panel value="overview" keepMounted>
          <p>Review the environment and deployment scope.</p>
          <label>
            Preview note
            <Input placeholder="Note retained across tabs" />
          </label>
        </Tabs.Panel>
        <Tabs.Panel value="logs" keepMounted>
          <p>Review the build logs for the selected pipeline run.</p>
          <StatusBadge tone="success">Passed</StatusBadge>
        </Tabs.Panel>
        <Tabs.Panel value="history" keepMounted>
          <p>Review recent runs and change history.</p>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}
function AccordionExample() {
  const [multiple, setMultiple] = useState(false),
    [open, setOpen] = useState<string[]>(["identity"]);
  return (
    <div className="example-stack">
      <Toggle
        checked={multiple}
        onChange={(next) => {
          setMultiple(next);
          if (!next) setOpen((old) => old.slice(0, 1));
        }}
      >
        Allow multiple sections
      </Toggle>
      <Accordion.Root
        value={open}
        onValueChange={setOpen}
        multiple={multiple}
        keepMounted
      >
        <Accordion.Item value="identity">
          <Accordion.Header>
            <Accordion.Trigger>Identity controls</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <p>Check service account permissions and team isolation.</p>
            <label>
              Case note
              <Input placeholder="Retained while collapsed" />
            </label>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="environments">
          <Accordion.Header>
            <Accordion.Trigger>Environment access</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <p>Compare access for allowed and blocked environments.</p>
            <StatusBadge tone="neutral">Not run</StatusBadge>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="unavailable" disabled>
          <Accordion.Header>
            <Accordion.Trigger>Unavailable policy</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Unavailable preview.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
function CollapsibleExample() {
  const [disabled, setDisabled] = useState(false);
  return (
    <div className="example-stack">
      <Toggle checked={disabled} onChange={setDisabled}>
        Disable disclosure
      </Toggle>
      <Collapsible.Root disabled={disabled}>
        <Collapsible.Trigger>Technical details</Collapsible.Trigger>
        <Collapsible.Panel keepMounted>
          <p>Review deployment results and redacted build logs.</p>
          <label>
            Build note
            <Input placeholder="Retained while collapsed" />
          </label>
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  );
}
function AvatarExample() {
  const [broken, setBroken] = useState(false),
    [loading, setLoading] = useState("idle");
  return (
    <div className="example-stack">
      <Inline gap={3}>
        <Avatar.Root
          role="img"
          aria-label="Preview profile"
          aria-description="Online"
          size="lg"
        >
          <Avatar.Image
            alt=""
            src={
              broken
                ? "data:image/png;base64,invalid-avatar"
                : withBase("/avatar-preview.svg")
            }
            onLoadingStatusChange={setLoading}
          />
          <Avatar.Fallback aria-hidden="true">CG</Avatar.Fallback>
          <Avatar.Status aria-hidden="true" />
        </Avatar.Root>
        <Avatar.Root role="img" aria-label="Documentation preview user">
          <Avatar.Fallback aria-hidden="true">CD</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root role="img" aria-label="Unknown preview user" size="sm">
          <Avatar.Fallback aria-hidden="true" />
        </Avatar.Root>
      </Inline>
      <Inline gap={3}>
        <Button variant="outline" onClick={() => setBroken(!broken)}>
          {broken ? "Restore preview image" : "Preview broken image"}
        </Button>
      </Inline>
      <p role="status">Image status: {loading}</p>
    </div>
  );
}
const badgeStates: {
  value: string;
  label: string;
  tone: StatusTone;
  description: string;
}[] = [
  {
    value: "passed",
    label: "Passed",
    tone: "success",
    description: "All checks passed.",
  },
  {
    value: "error",
    label: "Error",
    tone: "danger",
    description: "Review the error and try again.",
  },
  {
    value: "warning",
    label: "Warning",
    tone: "caution",
    description: "Needs further review.",
  },
  {
    value: "running",
    label: "Running",
    tone: "progress",
    description: "Deployment is in progress.",
  },
  {
    value: "pending",
    label: "Not run",
    tone: "neutral",
    description: "Not run yet.",
  },
];
function BadgeExample() {
  const [value, setValue] = useState("passed");
  const state = badgeStates.find((s) => s.value === value)!;
  return (
    <div className="example-stack">
      <div className="actions">
        {badgeStates.map((s) => (
          <StatusBadge tone={s.tone} key={s.value}>
            {s.label}
          </StatusBadge>
        ))}
        <Badge>3 environments</Badge>
      </div>
      <label>
        Status preview
        <Select
          aria-label="Status preview"
          value={value}
          onValueChange={setValue}
          options={badgeStates.map((s) => ({ value: s.value, label: s.label }))}
        />
      </label>
      <div role="status" className="status-sentence">
        <StatusBadge tone={state.tone}>{state.label}</StatusBadge>
        <span>{state.description}</span>
      </div>
    </div>
  );
}
function SeparatorExample() {
  const [inset, setInset] = useState(false);
  return (
    <div className="example-stack">
      <Toggle checked={inset} onChange={setInset}>
        Use inset separator
      </Toggle>
      <p>Environment overview</p>
      <Separator inset={inset} />
      <p>Deployment details</p>
      <div className="actions">
        <span>Staging</span>
        <Separator orientation="vertical" />
        <span>Production</span>
      </div>
    </div>
  );
}
function LinkExample() {
  return (
    <div className="example-stack">
      <p>
        <TextLink href="#link-preview-target">
          Inspect preview destination
        </TextLink>
      </p>
      <p>
        <TextLink
          href="https://base-ui.com/react/overview/about"
          target="_blank"
          rel="noreferrer"
        >
          Base UI documentation (opens in a new tab)
        </TextLink>
      </p>
      <p id="link-preview-target" tabIndex={-1}>
        Preview destination. Native anchors retain their browser behavior.
      </p>
    </div>
  );
}
function BreadcrumbExample() {
  return (
    <div className="example-stack">
      <Breadcrumbs.Root aria-label="Project breadcrumb">
        <Breadcrumbs.List>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href="#breadcrumb-preview-target">
              Platform services
            </Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Link href="#breadcrumb-preview-target">
              Projects
            </Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Current>demo-e2e-01</Breadcrumbs.Current>
          </Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>
      <p id="breadcrumb-preview-target" tabIndex={-1}>
        Shows the project path as an ordered list. The current location can
        remain unlinked.
      </p>
    </div>
  );
}
export function NavigationExample({ id }: { id: string }) {
  const examples: Record<string, React.ReactNode> = {
    tabs: <TabsExample />,
    accordion: <AccordionExample />,
    collapsible: <CollapsibleExample />,
    avatar: <AvatarExample />,
    badge: <BadgeExample />,
    separator: <SeparatorExample />,
    link: <LinkExample />,
    breadcrumbs: <BreadcrumbExample />,
  };
  return (
    <div className="component-example">
      <div className="example-controls">{examples[id]}</div>
    </div>
  );
}
