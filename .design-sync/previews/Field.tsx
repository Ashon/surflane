import { Checkbox, Field, Stack } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Default = () => (
  <Stack gap={4} style={{ maxWidth: '22rem' }}>
    <Field.Root name='project'>
      <Field.Label>Project name</Field.Label>
      <Field.Control required placeholder='payments-platform' />
      <Field.Description>
        Use a unique name within the organization.
      </Field.Description>
      <Field.Error />
    </Field.Root>
  </Stack>
)

export const WithError = () => (
  <Stack gap={4} style={{ maxWidth: '22rem' }}>
    <Field.Root name='webhook' invalid>
      <Field.Label>Webhook URL</Field.Label>
      <Field.Control defaultValue='http://hooks.internal/deploys' />
      <Field.Description>
        Receives a POST when a deployment finishes.
      </Field.Description>
      <Field.Error match>Use an https:// URL.</Field.Error>
    </Field.Root>
  </Stack>
)

export const Disabled = () => (
  <Stack gap={4} style={{ maxWidth: '22rem' }}>
    <Field.Root name='region' disabled>
      <Field.Label>Primary region</Field.Label>
      <Field.Control defaultValue='eu-west-1' />
      <Field.Description>
        The region is fixed after the first deployment.
      </Field.Description>
    </Field.Root>
  </Stack>
)

export const CheckboxItem = () => (
  <Stack gap={2} style={{ maxWidth: '26rem' }}>
    <Field.Root name='includeLogs'>
      <Field.Item>
        <Checkbox.Root defaultChecked>
          <Checkbox.Indicator />
        </Checkbox.Root>
        <Field.Label>Attach build logs</Field.Label>
        <Field.Description>
          Logs older than 30 days are not included.
        </Field.Description>
      </Field.Item>
    </Field.Root>
    <Field.Root name='notify'>
      <Field.Item>
        <Checkbox.Root>
          <Checkbox.Indicator />
        </Checkbox.Root>
        <Field.Label>Notify #platform-oncall</Field.Label>
      </Field.Item>
    </Field.Root>
  </Stack>
)
