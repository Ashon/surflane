import {
  Button,
  Field,
  Fieldset,
  Form,
  Inline,
  Select,
  Textarea,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const actions = (
  <Inline gap={2}>
    <Button type='submit'>Create service</Button>
    <Button type='reset' variant='outline'>
      Reset
    </Button>
  </Inline>
)

export const Default = () => (
  <Form style={{ maxWidth: '26rem' }} onFormSubmit={() => {}}>
    <Field.Root name='service'>
      <Field.Label>Service name</Field.Label>
      <Field.Control
        required
        pattern='[a-z0-9\-]+'
        placeholder='checkout-api'
      />
      <Field.Description>
        Lowercase letters, numbers and hyphens.
      </Field.Description>
      <Field.Error />
    </Field.Root>
    <Field.Root name='description'>
      <Field.Label>Description</Field.Label>
      <Textarea rows={3} placeholder='What does this service do?' />
    </Field.Root>
    {actions}
  </Form>
)

export const ServerError = () => (
  <Form
    style={{ maxWidth: '26rem' }}
    errors={{ service: 'checkout-api already exists in this project.' }}
    onFormSubmit={() => {}}
  >
    <Field.Root name='service'>
      <Field.Label>Service name</Field.Label>
      <Field.Control required defaultValue='checkout-api' />
      <Field.Error />
    </Field.Root>
    <Field.Root name='description'>
      <Field.Label>Description</Field.Label>
      <Textarea
        rows={3}
        defaultValue='Handles cart totals and payment intents.'
      />
    </Field.Root>
    {actions}
  </Form>
)

export const WithSections = () => (
  <Form style={{ maxWidth: '26rem' }} onFormSubmit={() => {}}>
    <Fieldset.Root>
      <Fieldset.Legend>Service</Fieldset.Legend>
      <Field.Root name='service'>
        <Field.Label>Service name</Field.Label>
        <Field.Control required defaultValue='search-indexer' />
      </Field.Root>
      <Field.Root name='team'>
        <Field.Label>Owning team</Field.Label>
        <Field.Control defaultValue='discovery' />
      </Field.Root>
    </Fieldset.Root>
    <Fieldset.Root>
      <Fieldset.Legend>Runtime</Fieldset.Legend>
      <Field.Root name='region'>
        <Field.Label>Region</Field.Label>
        <Select
          name='region'
          aria-label='Region'
          defaultValue='eu-west-1'
          options={[
            { value: 'us-east-1', label: 'us-east-1 (N. Virginia)' },
            { value: 'eu-west-1', label: 'eu-west-1 (Ireland)' },
            { value: 'ap-northeast-2', label: 'ap-northeast-2 (Seoul)' },
          ]}
        />
      </Field.Root>
    </Fieldset.Root>
    {actions}
  </Form>
)
