import { Checkbox, CheckboxGroup, ChoiceLabel, Fieldset } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const regions = [
  { value: 'us-east-1', label: 'us-east-1 (N. Virginia)' },
  { value: 'eu-central-1', label: 'eu-central-1 (Frankfurt)' },
  { value: 'ap-northeast-2', label: 'ap-northeast-2 (Seoul)' },
]
const allRegions = regions.map((r) => r.value)

const regionGroup = (defaultValue: string[], disabled?: boolean) => (
  <Fieldset.Root disabled={disabled}>
    <Fieldset.Legend>Deploy regions</Fieldset.Legend>
    <CheckboxGroup
      allValues={allRegions}
      defaultValue={defaultValue}
      disabled={disabled}
      aria-label='Deploy regions'
    >
      <ChoiceLabel
        control={
          <Checkbox.Root parent>
            <Checkbox.Indicator />
          </Checkbox.Root>
        }
      >
        All regions
      </ChoiceLabel>
      {regions.map((region) => (
        <ChoiceLabel
          key={region.value}
          control={
            <Checkbox.Root name='regions' value={region.value}>
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          {region.label}
        </ChoiceLabel>
      ))}
    </CheckboxGroup>
  </Fieldset.Root>
)

export const PartlySelected = () => regionGroup(['eu-central-1'])

export const AllSelected = () => regionGroup(allRegions)

export const WithDescriptions = () => (
  <Fieldset.Root>
    <Fieldset.Legend>Alert channels</Fieldset.Legend>
    <CheckboxGroup
      defaultValue={['pager', 'slack']}
      aria-label='Alert channels'
    >
      <ChoiceLabel
        control={
          <Checkbox.Root name='channels' value='pager'>
            <Checkbox.Indicator />
          </Checkbox.Root>
        }
        description='Pages the primary on-call for sev-1 and sev-2.'
      >
        Pager
      </ChoiceLabel>
      <ChoiceLabel
        control={
          <Checkbox.Root name='channels' value='slack'>
            <Checkbox.Indicator />
          </Checkbox.Root>
        }
        description='Posts to #ops-alerts with a link to the runbook.'
      >
        Slack
      </ChoiceLabel>
      <ChoiceLabel
        control={
          <Checkbox.Root name='channels' value='email'>
            <Checkbox.Indicator />
          </Checkbox.Root>
        }
        description='A daily digest to the service owners.'
      >
        Email
      </ChoiceLabel>
    </CheckboxGroup>
  </Fieldset.Root>
)

export const Disabled = () => regionGroup(['us-east-1', 'ap-northeast-2'], true)
