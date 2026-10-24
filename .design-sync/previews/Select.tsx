import { Field, Fieldset, Select, Stack } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const environments = [
  { value: 'development', label: 'Development' },
  { value: 'staging', label: 'Staging' },
  { value: 'production', label: 'Production' },
  { value: 'sandbox', label: 'Sandbox (retired)', disabled: true },
]

const regions = [
  {
    label: 'Americas',
    options: [
      { value: 'us-east-1', label: 'us-east-1 (N. Virginia)' },
      { value: 'us-west-2', label: 'us-west-2 (Oregon)' },
    ],
  },
  {
    label: 'Europe',
    options: [
      { value: 'eu-west-1', label: 'eu-west-1 (Ireland)' },
      { value: 'eu-central-1', label: 'eu-central-1 (Frankfurt)' },
    ],
  },
  {
    label: 'Asia Pacific',
    options: [
      { value: 'ap-northeast-2', label: 'ap-northeast-2 (Seoul)' },
      { value: 'ap-southeast-1', label: 'ap-southeast-1 (Singapore)' },
    ],
  },
]

const sizes = [
  { value: 'small', label: '2 vCPU · 4 GB' },
  { value: 'medium', label: '4 vCPU · 8 GB' },
  { value: 'large', label: '8 vCPU · 16 GB' },
]

export const DeployTarget = () => (
  <Fieldset.Root>
    <Fieldset.Legend>Deployment target</Fieldset.Legend>
    <Field.Root name='environment'>
      <Field.Label>Environment</Field.Label>
      <Select
        name='environment'
        aria-label='Environment'
        defaultValue='staging'
        options={environments}
      />
      <Field.Description>
        Production deploys need a second approver.
      </Field.Description>
    </Field.Root>
    <Field.Root name='region'>
      <Field.Label>Region</Field.Label>
      <Select
        name='region'
        aria-label='Region'
        defaultValue='eu-central-1'
        options={regions}
      />
    </Field.Root>
    <Field.Root name='instance'>
      <Field.Label>Instance size</Field.Label>
      <Select
        name='instance'
        aria-label='Instance size'
        defaultValue='medium'
        options={sizes}
      />
    </Field.Root>
  </Fieldset.Root>
)

export const Sizes = () => (
  <Stack gap={3}>
    <Select
      size='small'
      aria-label='Environment, small'
      defaultValue='development'
      options={environments}
    />
    <Select
      aria-label='Environment, default'
      defaultValue='staging'
      options={environments}
    />
    <Select
      size='large'
      aria-label='Environment, large'
      defaultValue='production'
      options={environments}
    />
  </Stack>
)

export const Invalid = () => (
  <Field.Root name='region' invalid>
    <Field.Label>Failover region</Field.Label>
    <Select
      name='region'
      aria-label='Failover region'
      aria-invalid
      defaultValue='eu-central-1'
      options={regions}
    />
    <Field.Error match>
      Pick a region other than the primary, eu-central-1.
    </Field.Error>
  </Field.Root>
)

export const Disabled = () => (
  <Field.Root name='environment' disabled>
    <Field.Label>Environment</Field.Label>
    <Select
      name='environment'
      aria-label='Environment'
      defaultValue='production'
      options={environments}
      disabled
    />
    <Field.Description>
      Locked while deploy #418 is rolling out.
    </Field.Description>
  </Field.Root>
)
