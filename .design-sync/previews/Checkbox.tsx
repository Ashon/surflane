import { Checkbox, ChoiceLabel, Stack } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const States = () => (
  <Stack gap={2}>
    <ChoiceLabel
      control={
        <Checkbox.Root name='autoRollback' defaultChecked>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      Roll back automatically on failed health checks
    </ChoiceLabel>
    <ChoiceLabel
      control={
        <Checkbox.Root name='notifyOncall'>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      Page the on-call engineer
    </ChoiceLabel>
    <ChoiceLabel
      control={
        <Checkbox.Root indeterminate>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      Some regions selected
    </ChoiceLabel>
  </Stack>
)

export const WithDescription = () => (
  <ChoiceLabel
    control={
      <Checkbox.Root name='cleanup' defaultChecked>
        <Checkbox.Indicator />
      </Checkbox.Root>
    }
    description='Removes preview environments with no deploys in 30 days.'
  >
    Clean up stale preview environments
  </ChoiceLabel>
)

export const ReadOnlyAndDisabled = () => (
  <Stack gap={2}>
    <ChoiceLabel
      control={
        <Checkbox.Root defaultChecked readOnly>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      Require signed commits (set by the org policy)
    </ChoiceLabel>
    <ChoiceLabel
      control={
        <Checkbox.Root indeterminate readOnly>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      Partial selection, read-only
    </ChoiceLabel>
    <ChoiceLabel
      control={
        <Checkbox.Root disabled>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      Deploy to sandbox (retired)
    </ChoiceLabel>
    <ChoiceLabel
      control={
        <Checkbox.Root defaultChecked disabled>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      Keep audit logs (always on)
    </ChoiceLabel>
  </Stack>
)

export const Sizes = () => (
  <Stack gap={2}>
    <ChoiceLabel
      control={
        <Checkbox.Root size='small' defaultChecked>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      Small
    </ChoiceLabel>
    <ChoiceLabel
      control={
        <Checkbox.Root defaultChecked>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      Default
    </ChoiceLabel>
    <ChoiceLabel
      control={
        <Checkbox.Root size='large' defaultChecked>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      Large
    </ChoiceLabel>
  </Stack>
)
