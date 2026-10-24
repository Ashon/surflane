import { Field, Stack, Textarea } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Default = () => (
  <Stack gap={4} style={{ maxWidth: '26rem' }}>
    <Field.Root name='description'>
      <Field.Label>Description</Field.Label>
      <Textarea rows={4} placeholder='Describe what this deployment changes' />
      <Field.Description>
        Shown in the deployment history. Up to 240 characters.
      </Field.Description>
    </Field.Root>
  </Stack>
)

export const Filled = () => (
  <Stack gap={4} style={{ maxWidth: '26rem' }}>
    <Field.Root name='releaseNotes'>
      <Field.Label>Release notes</Field.Label>
      <Textarea
        rows={4}
        defaultValue={
          'Moves checkout-api to the new connection pool.\nRaises the p95 latency budget to 250 ms for the eu-west-1 rollout.'
        }
      />
    </Field.Root>
  </Stack>
)

export const Sizes = () => (
  <Stack gap={4} style={{ maxWidth: '26rem' }}>
    <Field.Root>
      <Field.Label>Small</Field.Label>
      <Textarea
        size='small'
        rows={2}
        placeholder='Add a note for the on-call team'
      />
    </Field.Root>
    <Field.Root>
      <Field.Label>Default</Field.Label>
      <Textarea rows={2} placeholder='Add a note for the on-call team' />
    </Field.Root>
    <Field.Root>
      <Field.Label>Large</Field.Label>
      <Textarea
        size='large'
        rows={2}
        placeholder='Add a note for the on-call team'
      />
    </Field.Root>
  </Stack>
)

export const Invalid = () => (
  <Stack gap={4} style={{ maxWidth: '26rem' }}>
    <Field.Root name='rollbackReason' invalid>
      <Field.Label>Rollback reason</Field.Label>
      <Textarea rows={3} required />
      <Field.Error match>
        Explain why production is being rolled back.
      </Field.Error>
    </Field.Root>
  </Stack>
)

export const ReadOnlyAndDisabled = () => (
  <Stack gap={4} style={{ maxWidth: '26rem' }}>
    <Field.Root>
      <Field.Label>Incident summary</Field.Label>
      <Textarea
        rows={2}
        readOnly
        value='Elevated 502s on search-indexer between 14:02 and 14:19 UTC.'
      />
    </Field.Root>
    <Field.Root disabled>
      <Field.Label>Approver notes</Field.Label>
      <Textarea rows={2} placeholder='Only approvers can add notes' />
    </Field.Root>
  </Stack>
)
