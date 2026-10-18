import type { ComponentDoc } from './componentDocs'
export const formWorkflowDocs: Record<string, ComponentDoc> = {
  'form-workflow': {
    usage:
      'Connect validation, pending submission, field errors, request failures, restricted access, and success with Form, Field, Fieldset, and messages. Keep input values in controlled state. Describe the result with the values copied at submit time. The example settles the response manually. Use Complete preview request to inspect each state.',
    avoid: [
      "Don't hide service calls or permission policies inside primitives. Keep them in the product.",
      "Don't present errors as an empty success. Show field errors, request failures, and restricted access as their own states.",
      "Don't promise that canceling rolls back the server. Canceling stops the request and preserves the draft.",
      "Don't rely on client checks alone. The product API also needs server validation, permission checks, idempotency, and duplicate-request prevention.",
      'The example simulates restoring access locally.',
    ],
    anatomy:
      'Preview response control → result message → named Form → Fieldset(Fields + errors) + submit/reset actions → pending request controls',
    keyboard: [
      'Base UI Form runs pre-submit validation and focuses the first invalid input.',
      'While pending, duplicate submissions are blocked and focus moves to Cancel.',
      'Server field errors map to fields through Field.name keys in errors. A field error moves focus to its input, a request error to Retry, and success to the result heading.',
      'Canceling or resetting returns focus to the name input.',
      'Field links each description and error to its control. Color never carries meaning alone.',
    ],
    tokens: [
      '--space-2',
      '--space-4',
      '--control-height',
      '--control-radius',
      '--control-border',
      '--control-focus',
      '--status-danger-fg',
      '--status-success-bg',
    ],
    code: `import { Form, Field, Fieldset, Button } from '@surflane/ui'

<Form errors={serverErrors} onFormSubmit={submit} aria-busy={pending}>
  <Fieldset.Root disabled={pending}>
    <Fieldset.Legend>Environment details</Fieldset.Legend>
    <Field.Root name='name'>
      <Field.Label>Environment name</Field.Label>
      <Field.Control
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Field.Error />
    </Field.Root>
  </Fieldset.Root>
  <Button type='submit' disabled={pending}>
    Register preview
  </Button>
</Form>

// Product-owned submission contract:
// 1. Guard repeated submits before awaiting. Snapshot validated values.
// 2. Retain an AbortController and request identity.
// 3. Ignore aborted, superseded or unmounted responses.
// 4. Map field errors by Field.name; preserve draft and restore meaningful focus.
// 5. Server-side idempotency and authorization remain required.`,
    props: [
      [
        'Form.onFormSubmit',
        'validated named fields; product-owned request callback',
        'Base UI Form',
      ],
      ['Form.errors', 'map server validation to Field.name', '{}'],
      [
        'Fieldset.disabled',
        'lock draft editing during pending or permission restriction',
        'false',
      ],
      [
        'Request state',
        'idle / pending / field-error / request-error / permission / success',
        'caller-owned',
      ],
      [
        'Cancel / reset',
        'cancel preserves draft; reset explicitly restores initial controlled values',
        'caller-owned',
      ],
      [
        'Preview completion',
        'manually resolved Promise with AbortController and identity guard; no service request',
        'local only',
      ],
    ],
  },
}
