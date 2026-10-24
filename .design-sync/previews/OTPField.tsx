import { Field, Form, OTPField, Stack } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const slots = (label: string, indexes: number[]) =>
  indexes.map((index) => (
    <OTPField.Input
      key={index}
      aria-label={
        index === 0 ? undefined : `${label} character ${index + 1} of 6`
      }
    />
  ))

export const Default = () => (
  <Stack style={{ maxWidth: '26rem' }}>
    <Field.Root name='verificationCode'>
      <Field.Label>Verification code</Field.Label>
      <Field.Description>
        Enter the six-digit code sent to your authenticator app.
      </Field.Description>
      <OTPField.Root length={6} required>
        {slots('Verification', [0, 1, 2, 3, 4, 5])}
      </OTPField.Root>
      <Field.Error />
    </Field.Root>
  </Stack>
)

export const Grouped = () => (
  <Stack style={{ maxWidth: '26rem' }}>
    <Field.Root name='deployCode'>
      <Field.Label>Production deploy code</Field.Label>
      <Field.Description>
        Read the code from the approval request.
      </Field.Description>
      <OTPField.Root length={6} defaultValue='482'>
        <OTPField.Group>{slots('Deploy code', [0, 1, 2])}</OTPField.Group>
        <OTPField.Separator />
        <OTPField.Group>{slots('Deploy code', [3, 4, 5])}</OTPField.Group>
      </OTPField.Root>
    </Field.Root>
  </Stack>
)

export const Alphanumeric = () => (
  <Stack style={{ maxWidth: '26rem' }}>
    <Field.Root name='recoveryCode'>
      <Field.Label>Recovery code</Field.Label>
      <Field.Description>
        Letters and numbers, from your saved recovery codes.
      </Field.Description>
      <OTPField.Root
        length={6}
        validationType='alphanumeric'
        defaultValue='A7C9XZ'
      >
        {slots('Recovery', [0, 1, 2, 3, 4, 5])}
      </OTPField.Root>
    </Field.Root>
  </Stack>
)

export const Masked = () => (
  <Stack style={{ maxWidth: '26rem' }}>
    <Field.Root name='pin'>
      <Field.Label>Break-glass PIN</Field.Label>
      <OTPField.Root length={6} mask defaultValue='9041'>
        {slots('PIN', [0, 1, 2, 3, 4, 5])}
      </OTPField.Root>
    </Field.Root>
  </Stack>
)

export const Expired = () => (
  <Form
    style={{ maxWidth: '26rem' }}
    errors={{ verificationCode: 'This code has expired. Request a new one.' }}
  >
    <Field.Root name='verificationCode'>
      <Field.Label>Verification code</Field.Label>
      <OTPField.Root length={6} defaultValue='318274'>
        {slots('Verification', [0, 1, 2, 3, 4, 5])}
      </OTPField.Root>
      <Field.Error />
    </Field.Root>
  </Form>
)

export const Disabled = () => (
  <Stack style={{ maxWidth: '26rem' }}>
    <Field.Root name='verificationCode' disabled>
      <Field.Label>Verification code</Field.Label>
      <Field.Description>
        Too many attempts. Try again in 5 minutes.
      </Field.Description>
      <OTPField.Root length={6} disabled>
        {slots('Verification', [0, 1, 2, 3, 4, 5])}
      </OTPField.Root>
    </Field.Root>
  </Stack>
)
