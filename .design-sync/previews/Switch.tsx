import { ChoiceLabel, Stack, Switch } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const OnAndOff = () => (
  <Stack gap={2}>
    <ChoiceLabel
      control={
        <Switch.Root
          name='refresh'
          defaultChecked
          value='enabled'
          uncheckedValue='disabled'
        >
          <Switch.Thumb />
        </Switch.Root>
      }
    >
      Refresh run status
    </ChoiceLabel>
    <ChoiceLabel
      control={
        <Switch.Root name='verbose'>
          <Switch.Thumb />
        </Switch.Root>
      }
    >
      Verbose build logs
    </ChoiceLabel>
  </Stack>
)

export const WithDescription = () => (
  <ChoiceLabel
    control={
      <Switch.Root name='autoscale' defaultChecked>
        <Switch.Thumb />
      </Switch.Root>
    }
    description='Adds instances when CPU stays above 70% for 5 minutes.'
  >
    Autoscale checkout-api
  </ChoiceLabel>
)

export const ReadOnlyAndDisabled = () => (
  <Stack gap={2}>
    <ChoiceLabel
      control={
        <Switch.Root readOnly defaultChecked>
          <Switch.Thumb />
        </Switch.Root>
      }
    >
      Encrypt backups (required by policy)
    </ChoiceLabel>
    <ChoiceLabel
      control={
        <Switch.Root disabled>
          <Switch.Thumb />
        </Switch.Root>
      }
    >
      Maintenance mode (needs admin)
    </ChoiceLabel>
    <ChoiceLabel
      control={
        <Switch.Root disabled defaultChecked>
          <Switch.Thumb />
        </Switch.Root>
      }
    >
      Health checks (always on)
    </ChoiceLabel>
  </Stack>
)

export const Sizes = () => (
  <Stack gap={2}>
    <ChoiceLabel
      control={
        <Switch.Root size='small' defaultChecked>
          <Switch.Thumb />
        </Switch.Root>
      }
    >
      Small
    </ChoiceLabel>
    <ChoiceLabel
      control={
        <Switch.Root defaultChecked>
          <Switch.Thumb />
        </Switch.Root>
      }
    >
      Default
    </ChoiceLabel>
    <ChoiceLabel
      control={
        <Switch.Root size='large' defaultChecked>
          <Switch.Thumb />
        </Switch.Root>
      }
    >
      Large
    </ChoiceLabel>
  </Stack>
)
