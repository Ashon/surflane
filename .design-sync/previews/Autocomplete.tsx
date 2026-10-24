import { Autocomplete, Field } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const pipelines = [
  'deploy checkout-api',
  'deploy search-indexer',
  'deploy billing-worker',
  'rollback checkout-api',
  'nightly integration tests',
  'rotate staging secrets',
]

const groupedTags = [
  { value: 'Teams', items: ['team:payments', 'team:platform', 'team:search'] },
  { value: 'Regions', items: ['region:us-east-1', 'region:eu-central-1'] },
]

const suggestions = (
  <Autocomplete.Content>
    <Autocomplete.Empty>
      No suggestions. Free text is accepted.
    </Autocomplete.Empty>
    <Autocomplete.List>
      {(text: string) => (
        <Autocomplete.Item key={text} value={text}>
          {text}
        </Autocomplete.Item>
      )}
    </Autocomplete.List>
  </Autocomplete.Content>
)

export const Default = () => (
  <Field.Root name='query'>
    <Field.Label>Pipeline search</Field.Label>
    <Autocomplete.Root
      name='query'
      items={pipelines}
      defaultValue='deploy'
      defaultOpen
    >
      <Autocomplete.InputGroup>
        <Autocomplete.Input placeholder='Search pipelines…' />
        <Autocomplete.Clear />
        <Autocomplete.Trigger />
      </Autocomplete.InputGroup>
      {suggestions}
    </Autocomplete.Root>
  </Field.Root>
)

export const Grouped = () => (
  <Field.Root name='tag'>
    <Field.Label>Filter services by tag</Field.Label>
    <Autocomplete.Root name='tag' items={groupedTags} defaultOpen>
      <Autocomplete.InputGroup>
        <Autocomplete.Input placeholder='Search or enter a tag…' />
        <Autocomplete.Trigger aria-label='Show tags' />
      </Autocomplete.InputGroup>
      <Autocomplete.Content>
        <Autocomplete.Empty>
          No suggested tags. Free text is accepted.
        </Autocomplete.Empty>
        <Autocomplete.List>
          {(group: (typeof groupedTags)[number]) => (
            <Autocomplete.Group key={group.value} items={group.items}>
              <Autocomplete.GroupLabel>{group.value}</Autocomplete.GroupLabel>
              <Autocomplete.Collection>
                {(tag: string) => (
                  <Autocomplete.Item key={tag} value={tag}>
                    {tag}
                  </Autocomplete.Item>
                )}
              </Autocomplete.Collection>
            </Autocomplete.Group>
          )}
        </Autocomplete.List>
      </Autocomplete.Content>
    </Autocomplete.Root>
  </Field.Root>
)

export const FreeText = () => (
  <Field.Root name='query'>
    <Field.Label>Pipeline search</Field.Label>
    <Autocomplete.Root
      name='query'
      items={pipelines}
      defaultValue='canary payments-gateway'
    >
      <Autocomplete.InputGroup>
        <Autocomplete.Input placeholder='Search pipelines…' />
        <Autocomplete.Clear />
        <Autocomplete.Trigger />
      </Autocomplete.InputGroup>
      {suggestions}
    </Autocomplete.Root>
    <Field.Description>
      Text outside the suggestions is searched as typed.
    </Field.Description>
  </Field.Root>
)

export const Disabled = () => (
  <Field.Root name='query' disabled>
    <Field.Label>Pipeline search</Field.Label>
    <Autocomplete.Root
      name='query'
      items={pipelines}
      defaultValue='nightly integration tests'
      disabled
    >
      <Autocomplete.InputGroup>
        <Autocomplete.Input placeholder='Search pipelines…' />
        <Autocomplete.Trigger />
      </Autocomplete.InputGroup>
      {suggestions}
    </Autocomplete.Root>
    <Field.Description>
      Search is paused while the index rebuilds.
    </Field.Description>
  </Field.Root>
)
