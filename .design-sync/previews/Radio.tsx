import { ChoiceLabel, Radio, RadioGroup, Stack } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const item = (
  value: string,
  label: string,
  extra: {
    disabled?: boolean
    size?: 'small' | 'large'
    description?: string
  } = {},
) => (
  <ChoiceLabel
    key={value}
    control={
      <Radio.Root value={value} disabled={extra.disabled} size={extra.size}>
        <Radio.Indicator />
      </Radio.Root>
    }
    description={extra.description}
  >
    {label}
  </ChoiceLabel>
)

export const SelectedAndUnselected = () => (
  <RadioGroup
    name='environment'
    defaultValue='staging'
    aria-label='Environment'
  >
    {item('staging', 'Staging')}
    {item('production', 'Production')}
  </RadioGroup>
)

export const Disabled = () => (
  <Stack gap={3}>
    <RadioGroup name='tier' defaultValue='standard' aria-label='Support tier'>
      {item('standard', 'Standard support')}
      {item('enterprise', 'Enterprise support (contract required)', {
        disabled: true,
      })}
    </RadioGroup>
    <RadioGroup
      name='plan'
      defaultValue='annual'
      disabled
      aria-label='Billing period'
    >
      {item('annual', 'Annual billing (locked by finance)')}
      {item('monthly', 'Monthly billing')}
    </RadioGroup>
  </Stack>
)

export const WithDescription = () => (
  <RadioGroup name='retention' defaultValue='30d' aria-label='Log retention'>
    {item('7d', '7 days', {
      description: 'Enough for debugging the last release.',
    })}
    {item('30d', '30 days', { description: 'Covers a full on-call rotation.' })}
    {item('1y', '1 year', { description: 'Meets the SOC 2 audit window.' })}
  </RadioGroup>
)

export const Sizes = () => (
  <Stack gap={3}>
    <RadioGroup name='small' defaultValue='a' aria-label='Small radios'>
      {item('a', 'Small, selected', { size: 'small' })}
      {item('b', 'Small', { size: 'small' })}
    </RadioGroup>
    <RadioGroup name='default' defaultValue='a' aria-label='Default radios'>
      {item('a', 'Default, selected')}
      {item('b', 'Default')}
    </RadioGroup>
    <RadioGroup name='large' defaultValue='a' aria-label='Large radios'>
      {item('a', 'Large, selected', { size: 'large' })}
      {item('b', 'Large', { size: 'large' })}
    </RadioGroup>
  </Stack>
)
