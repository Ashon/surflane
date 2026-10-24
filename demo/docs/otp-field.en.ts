import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Enter a short, fixed-length value, such as a verification or recovery code. Each slot is a real input. Pasted or autofilled values that arrive all at once fill across the slots. Field.Label names the first slot. Name each remaining slot with an aria-label for its position.',
  avoid: [
    "Don't split ordinary passwords or long identifiers into slots. Use a single Input instead.",
    "Don't treat completed input as successful verification. Handle server validation, expiry, and resending in the product.",
    "Don't repeat the actual code in logs or status messages. Report the state, not the value.",
    "Don't treat mask as encryption. It only hides the value visually and doesn't encrypt the submitted value.",
  ],
  anatomy:
    'Field → Label + Description + OTPField.Root(length) → Input slots / optional Group + decorative Separator; one hidden validation/submission input',
  keyboard:
    'Typing moves to the next slot. Arrow keys, Home, and End move between slots. Backspace and Delete edit. Pasting the whole code and IME composition work. Set direction with both DirectionProvider and the DOM dir. disabled excludes the field from editing and submission. readOnly keeps it readable and submitted.',
  tokens: [
    '--surf-control-background',
    '--surf-control-border',
    '--surf-control-focus',
    '--surf-control-radius',
    '--surf-control-placeholder',
    '--surf-status-danger-fg',
    '--surf-ink-muted',
    '--surf-font-code',
    '--surf-space-2',
  ],
  code: `import { OTPField, Field } from '@surflane/ui'

<Field.Root name='verificationCode'>
  <Field.Label>Verification code</Field.Label>
  <Field.Description>Enter the six-digit code.</Field.Description>
  <OTPField.Root length={6} required>
    {Array.from({ length: 6 }, (_, index) => (
      <OTPField.Input
        key={index}
        aria-label={index === 0 ? undefined : \`Character \${index + 1} of 6\`}
      />
    ))}
  </OTPField.Root>
  <Field.Error />
</Field.Root>`,
  props: [
    [
      'Root.length',
      'positive integer; render exactly this many Input parts',
      'required',
    ],
    [
      'Root.value / defaultValue / onValueChange',
      'string state; event.cancel() rejects changes',
      'empty string',
    ],
    [
      'Root.validationType / normalizeValue',
      'numeric | alpha | alphanumeric | none; idempotent normalizer',
      'numeric / —',
    ],
    [
      'Root.onValueInvalid / onValueComplete',
      'rejected-character / completed-entry callbacks; not an authentication result',
      '—',
    ],
    [
      'Root.autoComplete / inputMode',
      'first slot and validation input hints',
      'one-time-code / based on validationType',
    ],
    [
      'Root.autoSubmit',
      'calls requestSubmit() on the owning form when complete; explicit opt-in',
      'false',
    ],
    [
      'Root.name / form / required',
      'single submitted value; external form ownership; native validation',
      '— / — / false',
    ],
    [
      'Root.disabled / readOnly / mask',
      'disabled / noneditable / visual character masking',
      'false',
    ],
    [
      'Input.aria-label',
      'position-specific label for slots after the first',
      'caller provided',
    ],
    [
      'Group / Separator',
      'optional flex grouping; decorative separator has aria-hidden=true',
      '—',
    ],
    [
      'render / ref / className',
      'actual DOM ref and Base UI state callback',
      '—',
    ],
  ],
}
