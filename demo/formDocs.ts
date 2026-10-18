import type { ComponentDoc } from "./componentDocs";
const selection = [
  "--control-choice-size",
  "--control-choice-border",
  "--control-choice-selected-bg",
  "--control-choice-selected-fg",
  "--interaction-focus",
];
const fields = [
  "--control-height",
  "--control-radius",
  "--control-background",
  "--status-danger-fg",
  "--space-2",
];
export const formDocs: Record<string, ComponentDoc> = {
  field: {
    usage: "Connects a label, description, and error to an input.",
    avoid:
      "Don't use a placeholder in place of a label, and don't show errors with color alone. The shared Input and Select can also be connected inside the same Field instead of Field.Control.",
    keyboard:
      "Clicking the label focuses the input, and submitting the form moves focus to the first invalid input. Errors and descriptions are linked with aria-describedby.",
    anatomy:
      "Field.Root → Label + Control (or Input / Select) + Description + Error",
    tokens: fields,
    code: 'import { Field } from "@surflane/ui";\n\n<Field.Root name="project">\n  <Field.Label>Project name</Field.Label>\n  <Field.Control required placeholder="demo-e2e-01" />\n  <Field.Description>Use a unique name.</Field.Description>\n  <Field.Error />\n</Field.Root>',
    props: [
      [
        "Root.name / disabled / invalid",
        "Base UI field state",
        "— / false / —",
      ],
      ["Root.validationMode", "onSubmit | onBlur | onChange", "onSubmit"],
      ["Error.match", "ValidityState key | boolean", "automatic"],
    ],
  },
  fieldset: {
    usage:
      "Groups inputs on a single topic under a legend. Passes the group's disabled state to child Fields.",
    avoid:
      "Don't use it as a card just to draw a visual border. Keep an individual label on each input.",
    keyboard:
      "Each input keeps its natural Tab order. A disabled group is excluded from interaction and form submission.",
    anatomy: "Fieldset.Root → Legend + related Fields",
    tokens: ["--space-4", "--type-subsection-size", "--ink"],
    code: 'import { Fieldset, Field } from "@surflane/ui";\n\n<Fieldset.Root disabled={disabled}>\n  <Fieldset.Legend>Deployment target</Fieldset.Legend>\n  <Field.Root name="project">\n    <Field.Label>Project name</Field.Label>\n    <Field.Control />\n  </Field.Root>\n</Fieldset.Root>',
    props: [
      ["Root.disabled", "boolean; cascades to nested fields", "false"],
      ["Legend", "accessible group name", "required content"],
    ],
  },
  form: {
    usage:
      "Coordinates submit validation and server errors across multiple Fields. onFormSubmit collects values from named Fields; when you need the raw native submission values, read FormData in onSubmit. The server error button in the preview only changes local state.",
    avoid:
      "Don't assume async validation always blocks submission. The product handles real requests, permissions, and duplicate-submission prevention.",
    keyboard:
      "Enter or the submit button validates the form and moves focus to the first invalid input. Editing an input clears its server error, and Reset restores the initial values.",
    anatomy: "Form → Field / Fieldset + submit / reset + result status",
    tokens: fields,
    code: 'import { Form, Field, Button } from "@surflane/ui";\n\n<Form errors={serverErrors} onFormSubmit={savePreview}>\n  <Field.Root name="project">\n    <Field.Label>Project name</Field.Label>\n    <Field.Control required />\n    <Field.Error />\n  </Field.Root>\n  <Button type="submit">Save preview</Button>\n  <Button type="reset" variant="outline">Reset</Button>\n</Form>',
    props: [
      [
        "onFormSubmit",
        "(values, eventDetails) => void; prevents native navigation",
        "—",
      ],
      ["errors", "record keyed by Field.Root name", "—"],
      ["validationMode", "onSubmit | onBlur | onChange", "onSubmit"],
    ],
  },
  textarea: {
    usage:
      "Accepts multi-line descriptions and notes. Text starts at the top, and the field can be resized vertically.",
    avoid:
      "Don't use it as an editor for large amounts of code. To connect it to a Field, compose it through Field.Control's render prop.",
    keyboard:
      "Preserves native text editing, Enter for line breaks, and Korean IME input. Tab moves to the next input.",
    anatomy: "Field.Control render={<Textarea />} → native textarea",
    tokens: fields,
    code: 'import { Field, Textarea } from "@surflane/ui";\n\n<Field.Root name="description">\n  <Field.Label>Description</Field.Label>\n  <Field.Control render={<Textarea rows={4} />} required\n    placeholder="Describe the deployment goal" />\n  <Field.Description>Keep the context concise.</Field.Description>\n  <Field.Error />\n</Field.Root>',
    props: [
      [
        "rows / maxLength / required / disabled / readOnly",
        "native textarea props",
        "native defaults",
      ],
      ["ref", "HTMLTextAreaElement", "—"],
    ],
  },
  checkbox: {
    usage:
      "Selects independent options. The mixed state is shown with a dash SVG, and read-only and disabled states look distinct.",
    avoid:
      "Use Radio Group for a single choice among mutually exclusive options. Don't distinguish states by color alone.",
    keyboard:
      "Tab to the checkbox and press Space to toggle it. Label clicks, form submission, and reset are wired through Base UI's hidden input.",
    anatomy: "label → Checkbox.Root + Indicator(default SVG) + text",
    tokens: selection,
    code: 'import { Checkbox } from "@surflane/ui";\n\n<label className="pui-choice-label">\n  <Checkbox.Root name="cleanup" defaultChecked>\n    <Checkbox.Indicator />\n  </Checkbox.Root>\n  <span>Clean up temporary accounts</span>\n</label>',
    props: [
      [
        "Root.checked / defaultChecked",
        "controlled / uncontrolled boolean",
        "— / false",
      ],
      [
        "Root.indeterminate / readOnly / disabled",
        "mixed or unavailable state",
        "false",
      ],
      ["Root.name / value / uncheckedValue", "native form values", "—"],
    ],
  },
  "checkbox-group": {
    usage:
      "Manages multiple selections on the same topic and connects the mixed state of a select-all checkbox.",
    avoid:
      "Don't store the parent checkbox state separately from its children. Keep allValues in sync with the children's values.",
    keyboard:
      "Tab moves to each item and Space selects it. The parent selects or clears all items and shows as mixed when only some are selected.",
    anatomy:
      "Fieldset → CheckboxGroup(allValues) → parent checkbox + value checkboxes",
    tokens: selection,
    code: 'import { CheckboxGroup, Checkbox } from "@surflane/ui";\n\n<CheckboxGroup allValues={["staging", "production"]}\n  defaultValue={["staging"]} aria-label="Environments">\n  <label className="pui-choice-label">\n    <Checkbox.Root parent><Checkbox.Indicator /></Checkbox.Root>\n    <span>All environments</span>\n  </label>\n  {["staging", "production"].map(value => (\n    <label className="pui-choice-label" key={value}>\n      <Checkbox.Root name="environments" value={value}>\n        <Checkbox.Indicator />\n      </Checkbox.Root>\n      <span>{value}</span>\n    </label>\n  ))}\n</CheckboxGroup>',
    props: [
      [
        "value / defaultValue / onValueChange",
        "string[] and change callback",
        "—",
      ],
      ["allValues", "all child values; required for parent checkbox", "—"],
      ["disabled", "disables the group", "false"],
    ],
  },
  "radio-group": {
    usage:
      "Chooses one of several mutually exclusive options. Provide both a group name and a name for each item.",
    avoid:
      "Don't place a lone Radio without a name. Don't treat a selection change as submitting the whole form.",
    keyboard:
      "Tab moves into the selected item, and arrow keys move the selection. Disabled items are skipped.",
    anatomy: "RadioGroup → label + Radio.Root(value) / Indicator",
    tokens: selection,
    code: 'import { RadioGroup, Radio } from "@surflane/ui";\n\n<RadioGroup name="source" defaultValue="live" aria-label="Log source">\n  {["live", "simulation"].map(value => (\n    <label className="pui-choice-label" key={value}>\n      <Radio.Root value={value}><Radio.Indicator /></Radio.Root>\n      <span>{value}</span>\n    </label>\n  ))}\n</RadioGroup>',
    props: [
      [
        "value / defaultValue / onValueChange",
        "generic value and change callback",
        "—",
      ],
      [
        "name / required / readOnly / disabled",
        "group form and interaction state",
        "— / false",
      ],
      ["Radio.Root.value", "option value", "required"],
    ],
  },
  switch: {
    usage:
      "Turns a setting that applies immediately on or off. The thumb position and background change together, and the label stays the same in both states.",
    avoid:
      "Don't use it in place of an action button or a multi-select list. In read-only mode the value is visible but can't be changed.",
    keyboard:
      "Tab to the switch and press Space to toggle it. In forms, name / value / uncheckedValue submit explicit values.",
    anatomy: "label → Switch.Root + Thumb + stable label",
    tokens: [
      ...selection,
      "--control-switch-width",
      "--control-switch-height",
      "--control-switch-thumb",
    ],
    code: 'import { Switch } from "@surflane/ui";\n\n<label className="pui-choice-label">\n  <Switch.Root name="refresh" defaultChecked value="enabled"\n    uncheckedValue="disabled">\n    <Switch.Thumb />\n  </Switch.Root>\n  <span>Refresh run status</span>\n</label>',
    props: [
      [
        "checked / defaultChecked / onCheckedChange",
        "controlled / uncontrolled boolean and callback",
        "— / false",
      ],
      ["readOnly / disabled", "prevents interaction", "false"],
      ["name / value / uncheckedValue", "form payload", "—"],
    ],
  },
};
