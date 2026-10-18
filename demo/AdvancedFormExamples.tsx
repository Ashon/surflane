import React, { useState } from "react";
import {
  Combobox,
  NumberField,
  Field,
  Form,
  Button,
  Checkbox,
} from "@surflane/ui";
export { advancedFormExampleIds } from "./exampleGroups";
const regions = [
  "Staging web",
  "Staging API",
  "Production edge",
  "Reserved environment",
  // Korean sample: exercises Hangul filtering and IME composition.
  "서울 스테이징 환경",
];
const roles = [
  { value: "reader", label: "Reader" },
  { value: "operator", label: "Operator" },
  { value: "auditor", label: "Auditor" },
];
function Flags({
  disabled,
  readOnly,
  setDisabled,
  setReadOnly,
}: {
  disabled: boolean;
  readOnly: boolean;
  setDisabled: (v: boolean) => void;
  setReadOnly: (v: boolean) => void;
}) {
  return (
    <div className="actions">
      <label className="pui-choice-label">
        <Checkbox.Root checked={disabled} onCheckedChange={setDisabled}>
          <Checkbox.Indicator />
        </Checkbox.Root>
        Disable controls
      </label>
      <label className="pui-choice-label">
        <Checkbox.Root checked={readOnly} onCheckedChange={setReadOnly}>
          <Checkbox.Indicator />
        </Checkbox.Root>
        Read only
      </label>
    </div>
  );
}
export function AdvancedFormExample({ id }: { id: string }) {
  const [result, setResult] = useState("No form submitted."),
    [disabled, setDisabled] = useState(false),
    [readOnly, setReadOnly] = useState(false),
    [cancelReset, setCancelReset] = useState(false),
    [cancelChanges, setCancelChanges] = useState(false);
  const [controlled, setControlled] = useState(3);
  const [controlledRegion, setControlledRegion] = useState<string | null>(
    "Staging API",
  );
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(
      [...new Set(data.keys())].map((name) => [
        name,
        name === "roles" ? data.getAll(name) : data.get(name),
      ]),
    );
    setResult(JSON.stringify(values));
  }
  if (id === "combobox")
    return (
      <div className="example-stack">
        <Flags {...{ disabled, readOnly, setDisabled, setReadOnly }} />
        <Form
          id="advanced-selection-form"
          onSubmit={submit}
          onReset={(e) => {
            if (cancelReset) e.preventDefault();
          }}
        >
          <Field.Root name="environment">
            <Field.Label>Target environment</Field.Label>
            <Field.Description>
              Select one registered environment. Reserved environment is
              unavailable.
            </Field.Description>
            <Combobox.Root
              items={regions}
              name="environment"
              defaultValue="Staging web"
              disabled={disabled}
              readOnly={readOnly}
              required
              onValueChange={(_, event) => {
                if (cancelChanges) event.cancel();
              }}
            >
              <Combobox.InputGroup>
                <Combobox.Input placeholder="Search environments…" />
                <Combobox.Clear />
                <Combobox.Trigger />
              </Combobox.InputGroup>
              <Combobox.Content>
                <Combobox.Empty>No matching environments.</Combobox.Empty>
                <Combobox.List>
                  {(region: string) => (
                    <Combobox.Item
                      key={region}
                      value={region}
                      disabled={region === "Reserved environment"}
                    >
                      <Combobox.ItemIndicator />
                      {region}
                    </Combobox.Item>
                  )}
                </Combobox.List>
              </Combobox.Content>
            </Combobox.Root>
            <Field.Error />
          </Field.Root>
          <Field.Root name="roles">
            <Field.Label>Test user roles</Field.Label>
            <Field.Description>
              Choose multiple roles; remove them individually.
            </Field.Description>
            <Combobox.Root
              items={roles}
              name="roles"
              multiple
              defaultValue={[roles[0]]}
              disabled={disabled}
              readOnly={readOnly}
            >
              <Combobox.InputGroup>
                <Combobox.Chips>
                  <Combobox.Value>
                    {(selected: typeof roles) =>
                      selected.map((role) => (
                        <Combobox.Chip key={role.value}>
                          {role.label}
                          <Combobox.ChipRemove
                            aria-label={`Remove ${role.label}`}
                          />
                        </Combobox.Chip>
                      ))
                    }
                  </Combobox.Value>
                  <Combobox.Input placeholder="Search roles…" />
                </Combobox.Chips>
                <Combobox.Trigger aria-label="Show roles" />
              </Combobox.InputGroup>
              <Combobox.Content>
                <Combobox.Empty>No matching roles.</Combobox.Empty>
                <Combobox.List>
                  {(role: (typeof roles)[number]) => (
                    <Combobox.Item key={role.value} value={role}>
                      <Combobox.ItemIndicator />
                      {role.label}
                    </Combobox.Item>
                  )}
                </Combobox.List>
              </Combobox.Content>
            </Combobox.Root>
            <Field.Error />
          </Field.Root>
          <div className="actions">
            <Button type="submit">Submit selection</Button>
            <Button type="reset" variant="outline">
              Reset selection
            </Button>
          </div>
        </Form>
        <Field.Root name="controlledEnvironment">
          <Field.Label>Controlled environment</Field.Label>
          <Field.Description>
            Linked to the form above; the parent retains its selected value on
            reset.
          </Field.Description>
          <Combobox.Root
            items={regions}
            form="advanced-selection-form"
            name="controlledEnvironment"
            value={controlledRegion}
            onValueChange={setControlledRegion}
            disabled={disabled}
            readOnly={readOnly}
          >
            <Combobox.InputGroup>
              <Combobox.Input placeholder="Search linked environments…" />
              <Combobox.Trigger aria-label="Show linked environments" />
            </Combobox.InputGroup>
            <Combobox.Content>
              <Combobox.Empty>No matching linked environments.</Combobox.Empty>
              <Combobox.List>
                {(region: string) => (
                  <Combobox.Item
                    key={region}
                    value={region}
                    disabled={region === "Reserved environment"}
                  >
                    <Combobox.ItemIndicator />
                    {region}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Content>
          </Combobox.Root>
        </Field.Root>
        <div className="actions">
          <Button variant="outline" onClick={() => setCancelReset((v) => !v)}>
            {cancelReset ? "Allow reset" : "Cancel reset"}
          </Button>
          <Button variant="outline" onClick={() => setCancelChanges((v) => !v)}>
            {cancelChanges
              ? "Allow selection changes"
              : "Cancel selection changes"}
          </Button>
        </div>
        <p role="status">{result}</p>
      </div>
    );
  return (
    <div className="example-stack">
      <Flags {...{ disabled, readOnly, setDisabled, setReadOnly }} />
      <Form
        onSubmit={submit}
        onReset={(e) => {
          if (cancelReset) e.preventDefault();
        }}
      >
        <Field.Root name="attempts">
          <Field.Label>Retry attempts</Field.Label>
          <Field.Description>
            Choose 1–8 attempts. Arrow keys and step buttons change by one.
          </Field.Description>
          <NumberField.Root
            name="attempts"
            defaultValue={2}
            min={1}
            max={8}
            step={1}
            required
            disabled={disabled}
            readOnly={readOnly}
            onValueChange={(_, event) => {
              if (cancelChanges) event.cancel();
            }}
          >
            <NumberField.Group>
              <NumberField.Decrement aria-label="Decrease attempts" />
              <NumberField.Input placeholder="Attempts" />
              <NumberField.Increment aria-label="Increase attempts" />
            </NumberField.Group>
          </NumberField.Root>
          <Field.Error />
        </Field.Root>
        <Field.Root name="budget">
          <Field.Label>Budget preview</Field.Label>
          <Field.Description>
            US dollars; submission contains the numeric value.
          </Field.Description>
          <NumberField.Root
            name="budget"
            defaultValue={1250.5}
            min={0}
            step={0.5}
            locale="en-US"
            format={{ style: "currency", currency: "USD" }}
            disabled={disabled}
            readOnly={readOnly}
          >
            <NumberField.Group>
              <NumberField.Decrement aria-label="Decrease budget" />
              <NumberField.Input />
              <NumberField.Increment aria-label="Increase budget" />
            </NumberField.Group>
          </NumberField.Root>
          <Field.Error />
        </Field.Root>
        <Field.Root name="controlled">
          <Field.Label>Controlled concurrency</Field.Label>
          <Field.Description>
            The parent owns this value, including reset decisions.
          </Field.Description>
          <NumberField.Root
            name="controlled"
            value={controlled}
            onValueChange={(v) => setControlled(v ?? 0)}
            min={0}
            max={10}
            disabled={disabled}
            readOnly={readOnly}
          >
            <NumberField.Group>
              <NumberField.Decrement aria-label="Decrease concurrency" />
              <NumberField.Input />
              <NumberField.Increment aria-label="Increase concurrency" />
            </NumberField.Group>
          </NumberField.Root>
          <Field.Error />
        </Field.Root>
        <div className="actions">
          <Button type="submit">Submit numbers</Button>
          <Button type="reset" variant="outline">
            Reset numbers
          </Button>
        </div>
      </Form>
      <div className="actions">
        <Button variant="outline" onClick={() => setCancelReset((v) => !v)}>
          {cancelReset ? "Allow reset" : "Cancel reset"}
        </Button>
        <Button variant="outline" onClick={() => setCancelChanges((v) => !v)}>
          {cancelChanges ? "Allow number changes" : "Cancel number changes"}
        </Button>
      </div>
      <p role="status">{result}</p>
    </div>
  );
}
