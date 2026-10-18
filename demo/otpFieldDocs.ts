import type { ComponentDoc } from './componentDocs'
export const otpFieldDocs: Record<string, ComponentDoc> = {
  'otp-field': {
    usage:
      'Enters short fixed-length values such as verification or recovery codes. Each slot is a real input, and pasted values and autofilled values that arrive all at once are distributed across the slots. Field.Label names the first slot, and the remaining slots are named with an aria-label that describes their position.',
    avoid:
      "Don't split ordinary passwords or long identifiers into multiple slots. Don't treat completed input as successful verification; server validation, expiry, and resending are handled by the product. Don't repeat the actual code in logs or status messages. mask only hides the value visually and doesn't encrypt the submitted value.",
    anatomy:
      'Field → Label + Description + OTPField.Root(length) → Input slots / optional Group + decorative Separator; one hidden validation/submission input',
    keyboard:
      'Typing moves to the next slot. Arrow keys and Home/End move between slots, and Backspace/Delete edits. Pasting the whole code and IME composition are supported. Set direction with both DirectionProvider and the DOM dir. disabled excludes the field from editing and submission; readOnly keeps it readable and submitted.',
    tokens: [
      '--control-background',
      '--control-border',
      '--control-focus',
      '--control-radius',
      '--control-placeholder',
      '--status-danger-fg',
      '--font-code',
      '--space-2',
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
        'rejected characters / completed entry callbacks; not authentication result',
        '—',
      ],
      [
        'Root.autoComplete / inputMode',
        'first slot and validation input hints',
        'one-time-code / based on validationType',
      ],
      [
        'Root.autoSubmit',
        'requestSubmit() owning form on completion; explicit opt-in',
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
  },
}
