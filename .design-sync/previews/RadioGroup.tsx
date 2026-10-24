import { ChoiceLabel, Fieldset, Radio, RadioGroup } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const strategies = [
  {
    value: 'rolling',
    label: 'Rolling',
    description: 'Replaces 25% of instances at a time.',
  },
  {
    value: 'blue-green',
    label: 'Blue-green',
    description: 'Shifts traffic once the new fleet is healthy.',
  },
  {
    value: 'canary',
    label: 'Canary',
    description: 'Sends 5% of traffic to the new version first.',
  },
]

export const Default = () => (
  <Fieldset.Root>
    <Fieldset.Legend>Log source</Fieldset.Legend>
    <RadioGroup name='source' defaultValue='live' aria-label='Log source'>
      <ChoiceLabel
        control={
          <Radio.Root value='live'>
            <Radio.Indicator />
          </Radio.Root>
        }
      >
        Live stream
      </ChoiceLabel>
      <ChoiceLabel
        control={
          <Radio.Root value='archive'>
            <Radio.Indicator />
          </Radio.Root>
        }
      >
        Last 24 hours
      </ChoiceLabel>
      <ChoiceLabel
        control={
          <Radio.Root value='cold' disabled>
            <Radio.Indicator />
          </Radio.Root>
        }
      >
        Cold storage (restoring)
      </ChoiceLabel>
    </RadioGroup>
  </Fieldset.Root>
)

export const WithDescriptions = () => (
  <Fieldset.Root>
    <Fieldset.Legend>Rollout strategy</Fieldset.Legend>
    <RadioGroup
      name='strategy'
      defaultValue='canary'
      aria-label='Rollout strategy'
    >
      {strategies.map((s) => (
        <ChoiceLabel
          key={s.value}
          control={
            <Radio.Root value={s.value}>
              <Radio.Indicator />
            </Radio.Root>
          }
          description={s.description}
        >
          {s.label}
        </ChoiceLabel>
      ))}
    </RadioGroup>
  </Fieldset.Root>
)

export const ReadOnly = () => (
  <Fieldset.Root>
    <Fieldset.Legend>
      Rollout strategy (set by the release policy)
    </Fieldset.Legend>
    <RadioGroup
      name='strategy'
      defaultValue='blue-green'
      readOnly
      aria-label='Rollout strategy'
    >
      {strategies.map((s) => (
        <ChoiceLabel
          key={s.value}
          control={
            <Radio.Root value={s.value}>
              <Radio.Indicator />
            </Radio.Root>
          }
        >
          {s.label}
        </ChoiceLabel>
      ))}
    </RadioGroup>
  </Fieldset.Root>
)

export const Disabled = () => (
  <Fieldset.Root disabled>
    <Fieldset.Legend>Rollout strategy</Fieldset.Legend>
    <RadioGroup
      name='strategy'
      defaultValue='rolling'
      disabled
      aria-label='Rollout strategy'
    >
      {strategies.map((s) => (
        <ChoiceLabel
          key={s.value}
          control={
            <Radio.Root value={s.value}>
              <Radio.Indicator />
            </Radio.Root>
          }
        >
          {s.label}
        </ChoiceLabel>
      ))}
    </RadioGroup>
  </Fieldset.Root>
)
