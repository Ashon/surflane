import {
  Checkbox,
  ChoiceLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const WithCheckbox = () => (
  <Stack gap={1}>
    <ChoiceLabel
      control={
        <Checkbox.Root name='cleanup' defaultChecked>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      Delete preview environments after merge
    </ChoiceLabel>
    <ChoiceLabel
      control={
        <Checkbox.Root name='notify'>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      Notify #platform-oncall on failure
    </ChoiceLabel>
    <ChoiceLabel
      control={
        <Checkbox.Root indeterminate readOnly>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      Some regions selected
    </ChoiceLabel>
  </Stack>
)

export const WithSwitch = () => (
  <Stack gap={1}>
    <ChoiceLabel
      control={
        <Switch.Root name='autoDeploy' defaultChecked>
          <Switch.Thumb />
        </Switch.Root>
      }
    >
      Auto-deploy the main branch
    </ChoiceLabel>
    <ChoiceLabel
      control={
        <Switch.Root name='maintenance'>
          <Switch.Thumb />
        </Switch.Root>
      }
    >
      Maintenance mode
    </ChoiceLabel>
  </Stack>
)

export const WithRadio = () => (
  <RadioGroup name='runner' defaultValue='shared' aria-label='Build runner'>
    <ChoiceLabel
      control={
        <Radio.Root value='shared'>
          <Radio.Indicator />
        </Radio.Root>
      }
    >
      Shared runners
    </ChoiceLabel>
    <ChoiceLabel
      control={
        <Radio.Root value='dedicated'>
          <Radio.Indicator />
        </Radio.Root>
      }
    >
      Dedicated runners
    </ChoiceLabel>
  </RadioGroup>
)

export const WithDescription = () => (
  <Stack gap={3} style={{ maxWidth: '28rem' }}>
    <ChoiceLabel
      control={
        <Switch.Root name='protectBranch' defaultChecked>
          <Switch.Thumb />
        </Switch.Root>
      }
      description='Pushes to main need a passing build and one approving review.'
    >
      Protect the main branch
    </ChoiceLabel>
    <ChoiceLabel
      control={
        <Checkbox.Root name='sso'>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
      description='Members sign in through your identity provider. Existing sessions end.'
    >
      Require single sign-on
    </ChoiceLabel>
  </Stack>
)

export const Disabled = () => (
  <Stack gap={1}>
    <ChoiceLabel
      control={
        <Checkbox.Root disabled defaultChecked>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      Audit logging (always on for Enterprise)
    </ChoiceLabel>
    <ChoiceLabel
      control={
        <Switch.Root disabled>
          <Switch.Thumb />
        </Switch.Root>
      }
    >
      GPU runners (not available in this region)
    </ChoiceLabel>
  </Stack>
)
