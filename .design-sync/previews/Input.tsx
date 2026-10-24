import { Field, Icon, Input, Stack } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Default = () => (
  <Stack gap={4} style={{ maxWidth: '22rem' }}>
    <Field.Root name='service'>
      <Field.Label>Service name</Field.Label>
      <Input placeholder='checkout-api' />
    </Field.Root>
  </Stack>
)

export const WithDescription = () => (
  <Stack gap={4} style={{ maxWidth: '22rem' }}>
    <Field.Root name='slug'>
      <Field.Label>Project slug</Field.Label>
      <Input defaultValue='payments-platform' />
      <Field.Description>
        Lowercase letters, numbers and hyphens. Used in every deployment URL.
      </Field.Description>
    </Field.Root>
  </Stack>
)

export const LeadingIcon = () => (
  <Stack gap={4} style={{ maxWidth: '22rem' }}>
    <Input
      aria-label='Search deployments'
      placeholder='Search deployments'
      leadingIcon={<Icon name='search' />}
    />
    <Input
      aria-label='Owner'
      defaultValue='platform-team'
      leadingIcon={<Icon name='user' />}
    />
  </Stack>
)

export const Sizes = () => (
  <Stack gap={4} style={{ maxWidth: '22rem' }}>
    <Field.Root>
      <Field.Label>Small</Field.Label>
      <Input size='small' placeholder='us-east-1' />
    </Field.Root>
    <Field.Root>
      <Field.Label>Default</Field.Label>
      <Input placeholder='us-east-1' />
    </Field.Root>
    <Field.Root>
      <Field.Label>Large</Field.Label>
      <Input size='large' placeholder='us-east-1' />
    </Field.Root>
  </Stack>
)

export const Invalid = () => (
  <Stack gap={4} style={{ maxWidth: '22rem' }}>
    <Field.Root name='projectId' invalid>
      <Field.Label>Project ID</Field.Label>
      <Input defaultValue='Payments Platform' />
      <Field.Error match>
        Use lowercase letters, numbers and hyphens only.
      </Field.Error>
    </Field.Root>
  </Stack>
)

export const ReadOnlyAndDisabled = () => (
  <Stack gap={4} style={{ maxWidth: '22rem' }}>
    <Field.Root>
      <Field.Label>Deployment ID</Field.Label>
      <Input readOnly value='dpl_7f3a91c2' />
    </Field.Root>
    <Field.Root disabled>
      <Field.Label>Custom domain</Field.Label>
      <Input placeholder='Available on the Team plan' />
    </Field.Root>
  </Stack>
)
