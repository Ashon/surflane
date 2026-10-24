import { Field, Inline, NativeSelect, Stack } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Default = () => (
  <Stack gap={4} style={{ maxWidth: '22rem' }}>
    <Field.Root name='environment'>
      <Field.Label htmlFor='ns-default-environment'>Environment</Field.Label>
      <NativeSelect
        id='ns-default-environment'
        name='environment'
        defaultValue='staging'
      >
        <option value='development'>Development</option>
        <option value='staging'>Staging</option>
        <option value='production'>Production</option>
        <option value='sandbox' disabled>
          Sandbox (retired)
        </option>
      </NativeSelect>
      <Field.Description>Where the next deployment runs.</Field.Description>
    </Field.Root>
  </Stack>
)

export const FilterRow = () => (
  <Inline gap={3}>
    <Field.Root name='environment' style={{ width: '10rem' }}>
      <Field.Label htmlFor='ns-filter-environment'>Environment</Field.Label>
      <NativeSelect id='ns-filter-environment' size='small' defaultValue='all'>
        <option value='all'>All environments</option>
        <option value='staging'>Staging</option>
        <option value='production'>Production</option>
      </NativeSelect>
    </Field.Root>
    <Field.Root name='region' style={{ width: '13rem' }}>
      <Field.Label htmlFor='ns-filter-region'>Region</Field.Label>
      <NativeSelect id='ns-filter-region' size='small' defaultValue='eu-west-1'>
        <optgroup label='Americas'>
          <option value='us-east-1'>us-east-1 (N. Virginia)</option>
          <option value='us-west-2'>us-west-2 (Oregon)</option>
        </optgroup>
        <optgroup label='Europe'>
          <option value='eu-west-1'>eu-west-1 (Ireland)</option>
          <option value='eu-central-1'>eu-central-1 (Frankfurt)</option>
        </optgroup>
      </NativeSelect>
    </Field.Root>
    <Field.Root name='status' style={{ width: '9rem' }}>
      <Field.Label htmlFor='ns-filter-status'>Status</Field.Label>
      <NativeSelect id='ns-filter-status' size='small' defaultValue='failing'>
        <option value='any'>Any status</option>
        <option value='healthy'>Healthy</option>
        <option value='failing'>Failing</option>
      </NativeSelect>
    </Field.Root>
  </Inline>
)

export const Sizes = () => (
  <Stack gap={4} style={{ maxWidth: '22rem' }}>
    {(['small', 'default', 'large'] as const).map((size) => (
      <Field.Root key={size}>
        <Field.Label htmlFor={`ns-size-${size}`}>
          {size[0].toUpperCase() + size.slice(1)}
        </Field.Label>
        <NativeSelect
          id={`ns-size-${size}`}
          size={size}
          defaultValue='production'
        >
          <option value='staging'>Staging</option>
          <option value='production'>Production</option>
        </NativeSelect>
      </Field.Root>
    ))}
  </Stack>
)

export const InvalidAndDisabled = () => (
  <Stack gap={4} style={{ maxWidth: '22rem' }}>
    <Field.Root name='team' invalid>
      <Field.Label htmlFor='ns-invalid-team'>Owning team</Field.Label>
      <NativeSelect
        id='ns-invalid-team'
        name='team'
        aria-invalid='true'
        defaultValue=''
      >
        <option value=''>Choose a team</option>
        <option value='platform'>Platform</option>
        <option value='payments'>Payments</option>
      </NativeSelect>
      <Field.Error match>Every service needs an owning team.</Field.Error>
    </Field.Root>
    <Field.Root name='tier' disabled>
      <Field.Label htmlFor='ns-disabled-tier'>Support tier</Field.Label>
      <NativeSelect
        id='ns-disabled-tier'
        name='tier'
        disabled
        defaultValue='business'
      >
        <option value='standard'>Standard</option>
        <option value='business'>Business</option>
      </NativeSelect>
    </Field.Root>
  </Stack>
)
