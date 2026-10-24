import {
  ChoiceLabel,
  Field,
  Fieldset,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const environments = [
  { value: 'staging', label: 'Staging' },
  { value: 'production', label: 'Production' },
]

const target = (disabled = false) => (
  <Fieldset.Root disabled={disabled}>
    <Fieldset.Legend>Deployment target</Fieldset.Legend>
    <Field.Root name='project'>
      <Field.Label>Project name</Field.Label>
      <Field.Control defaultValue='payments-platform' />
    </Field.Root>
    <Field.Root name='environment'>
      <Field.Label>Environment</Field.Label>
      <Select
        name='environment'
        aria-label='Environment'
        defaultValue='staging'
        options={environments}
      />
      <Field.Description>
        Production deploys need an approver.
      </Field.Description>
    </Field.Root>
  </Fieldset.Root>
)

export const Default = () => (
  <Stack style={{ maxWidth: '22rem' }}>{target()}</Stack>
)

export const Disabled = () => (
  <Stack style={{ maxWidth: '22rem' }}>{target(true)}</Stack>
)

export const RadioChoices = () => (
  <Stack style={{ maxWidth: '26rem' }}>
    <Fieldset.Root>
      <Fieldset.Legend>Rollout strategy</Fieldset.Legend>
      <RadioGroup
        name='strategy'
        defaultValue='canary'
        aria-label='Rollout strategy'
      >
        <ChoiceLabel
          control={
            <Radio.Root value='canary'>
              <Radio.Indicator />
            </Radio.Root>
          }
          description='Send 5% of traffic first, then promote.'
        >
          Canary
        </ChoiceLabel>
        <ChoiceLabel
          control={
            <Radio.Root value='blue-green'>
              <Radio.Indicator />
            </Radio.Root>
          }
          description='Switch all traffic once the new stack is healthy.'
        >
          Blue-green
        </ChoiceLabel>
        <ChoiceLabel
          control={
            <Radio.Root value='recreate' disabled>
              <Radio.Indicator />
            </Radio.Root>
          }
          description='Not available for services with live traffic.'
        >
          Recreate
        </ChoiceLabel>
      </RadioGroup>
    </Fieldset.Root>
  </Stack>
)
