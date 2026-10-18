import type { ComponentDoc } from "./componentDocs";
export const formWorkflowDocs: Record<string, ComponentDoc> = {
  "form-workflow": {
    usage:
      "Connects validation, pending submission, field errors, request failures, restricted access, and success using Form, Field, Fieldset, and messages. Input values are kept in controlled state, and the result is described using the values copied at submit time. The local example completes the response manually with Complete preview request, so you can inspect each state.",
    avoid:
      "Don't hide service calls or permission policies inside primitives. Don't present errors as an empty success, and don't promise that canceling rolls back the server. The product API also needs server validation, permission checks, idempotency, and duplicate-request prevention. Restoring access in the example is a local simulation.",
    anatomy:
      "Preview response control → result message → named Form → Fieldset(Fields + errors) + submit/reset actions → pending request controls",
    keyboard:
      "Pre-submit validation is delegated to Base UI Form, which focuses the first invalid input. Server field errors connect through Field.name keys in errors. While pending, duplicate submissions are blocked and focus moves to Cancel. Field errors move focus to the input, request errors to Retry, and success to the result heading. After canceling or resetting, focus returns to the name input. Field links descriptions and errors, and meaning is never conveyed by color alone.",
    tokens: [
      "--space-2",
      "--space-4",
      "--control-height",
      "--control-radius",
      "--control-border",
      "--control-focus",
      "--status-danger-fg",
      "--status-success-bg",
    ],
    code: 'import { Form, Field, Fieldset, Button } from "@surflane/ui";\n\n<Form errors={serverErrors} onFormSubmit={submit} aria-busy={pending}>\n  <Fieldset.Root disabled={pending}>\n    <Fieldset.Legend>Environment details</Fieldset.Legend>\n    <Field.Root name="name">\n      <Field.Label>Environment name</Field.Label>\n      <Field.Control required value={name} onChange={e => setName(e.target.value)} />\n      <Field.Error />\n    </Field.Root>\n  </Fieldset.Root>\n  <Button type="submit" disabled={pending}>Register preview</Button>\n</Form>\n\n// Product-owned submission contract:\n// 1. Guard repeated submits before awaiting. Snapshot validated values.\n// 2. Retain an AbortController and request identity.\n// 3. Ignore aborted, superseded or unmounted responses.\n// 4. Map field errors by Field.name; preserve draft and restore meaningful focus.\n// 5. Server-side idempotency and authorization remain required.',
    props: [
      [
        "Form.onFormSubmit",
        "validated named fields; product-owned request callback",
        "Base UI Form",
      ],
      ["Form.errors", "map server validation to Field.name", "{}"],
      [
        "Fieldset.disabled",
        "lock draft editing during pending or permission restriction",
        "false",
      ],
      [
        "Request state",
        "idle / pending / field-error / request-error / permission / success",
        "caller-owned",
      ],
      [
        "Cancel / reset",
        "cancel preserves draft; reset explicitly restores initial controlled values",
        "caller-owned",
      ],
      [
        "Preview completion",
        "manually resolved Promise with AbortController and identity guard; no service request",
        "local only",
      ],
    ],
  },
};
