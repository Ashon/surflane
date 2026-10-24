import { Field, NumberField, Stack } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Default = () => (
  <Stack gap={4} style={{ maxWidth: '22rem' }}>
    <Field.Root name='attempts'>
      <Field.Label>Retry attempts</Field.Label>
      <NumberField.Root
        name='attempts'
        defaultValue={2}
        min={1}
        max={8}
        step={1}
      >
        <NumberField.Group>
          <NumberField.Decrement aria-label='Decrease attempts' />
          <NumberField.Input />
          <NumberField.Increment aria-label='Increase attempts' />
        </NumberField.Group>
      </NumberField.Root>
      <Field.Description>
        Between 1 and 8 attempts per failed job.
      </Field.Description>
      <Field.Error />
    </Field.Root>
  </Stack>
)

export const Currency = () => (
  <Stack gap={4} style={{ maxWidth: '22rem' }}>
    <Field.Root name='budget'>
      <Field.Label>Monthly compute budget</Field.Label>
      <NumberField.Root
        name='budget'
        defaultValue={1250.5}
        min={0}
        step={0.5}
        locale='en-US'
        format={{ style: 'currency', currency: 'USD' }}
      >
        <NumberField.Group>
          <NumberField.Decrement aria-label='Decrease budget' />
          <NumberField.Input />
          <NumberField.Increment aria-label='Increase budget' />
        </NumberField.Group>
      </NumberField.Root>
      <Field.Description>
        Alerts the team at 80% of the budget.
      </Field.Description>
    </Field.Root>
  </Stack>
)

export const Percent = () => (
  <Stack gap={4} style={{ maxWidth: '22rem' }}>
    <Field.Root name='canary'>
      <Field.Label>Canary traffic</Field.Label>
      <NumberField.Root
        name='canary'
        defaultValue={0.05}
        min={0}
        max={1}
        step={0.05}
        locale='en-US'
        format={{ style: 'percent' }}
      >
        <NumberField.Group>
          <NumberField.Decrement aria-label='Decrease canary traffic' />
          <NumberField.Input />
          <NumberField.Increment aria-label='Increase canary traffic' />
        </NumberField.Group>
      </NumberField.Root>
    </Field.Root>
  </Stack>
)

export const ReadOnlyAndDisabled = () => (
  <Stack gap={4} style={{ maxWidth: '22rem' }}>
    <Field.Root name='replicas'>
      <Field.Label>Replicas</Field.Label>
      <NumberField.Root name='replicas' defaultValue={3} readOnly>
        <NumberField.Group>
          <NumberField.Decrement aria-label='Decrease replicas' />
          <NumberField.Input />
          <NumberField.Increment aria-label='Increase replicas' />
        </NumberField.Group>
      </NumberField.Root>
      <Field.Description>Managed by the autoscaler.</Field.Description>
    </Field.Root>
    <Field.Root name='timeout' disabled>
      <Field.Label>Request timeout (s)</Field.Label>
      <NumberField.Root name='timeout' defaultValue={30} disabled>
        <NumberField.Group>
          <NumberField.Decrement aria-label='Decrease timeout' />
          <NumberField.Input />
          <NumberField.Increment aria-label='Increase timeout' />
        </NumberField.Group>
      </NumberField.Root>
    </Field.Root>
  </Stack>
)

export const Invalid = () => (
  <Stack gap={4} style={{ maxWidth: '22rem' }}>
    <Field.Root name='concurrency' invalid>
      <Field.Label>Max concurrency</Field.Label>
      <NumberField.Root
        name='concurrency'
        defaultValue={64}
        min={1}
        max={32}
        allowOutOfRange
      >
        <NumberField.Group>
          <NumberField.Decrement aria-label='Decrease concurrency' />
          <NumberField.Input />
          <NumberField.Increment aria-label='Increase concurrency' />
        </NumberField.Group>
      </NumberField.Root>
      <Field.Error match>
        The staging plan allows up to 32 concurrent builds.
      </Field.Error>
    </Field.Root>
  </Stack>
)
