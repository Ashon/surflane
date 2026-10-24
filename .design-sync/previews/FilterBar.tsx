import {
  Button,
  FilterBar,
  Icon,
  Input,
  Select,
  StatusBadge,
  Table,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const environments = [
  { value: 'all', label: 'All environments' },
  { value: 'production', label: 'production' },
  { value: 'staging', label: 'staging' },
  { value: 'development', label: 'development' },
]
const states = [
  { value: 'all', label: 'All states' },
  { value: 'healthy', label: 'Healthy' },
  { value: 'degraded', label: 'Degraded' },
  { value: 'failing', label: 'Failing' },
]
const stay = (event: { preventDefault: () => void }) => event.preventDefault()

export const Default = () => (
  <FilterBar.Root label='Filter services' onSubmit={stay} onReset={stay}>
    <FilterBar.Controls>
      <FilterBar.Field width='search'>
        Search services
        <Input
          type='search'
          name='query'
          placeholder='Name or identifier'
          leadingIcon={<Icon name='search' />}
        />
      </FilterBar.Field>
      <FilterBar.Field>
        Environment
        <Select
          aria-label='Filter environment'
          defaultValue='all'
          options={environments}
        />
      </FilterBar.Field>
      <FilterBar.Field>
        State
        <Select aria-label='Filter state' defaultValue='all' options={states} />
      </FilterBar.Field>
      <FilterBar.Actions>
        <Button type='reset' variant='outline' disabled>
          Clear all filters
        </Button>
      </FilterBar.Actions>
    </FilterBar.Controls>
    <FilterBar.Summary>Showing all 24 services</FilterBar.Summary>
  </FilterBar.Root>
)

export const Applied = () => (
  <FilterBar.Root label='Filter services' onSubmit={stay} onReset={stay}>
    <FilterBar.Controls>
      <FilterBar.Field width='search'>
        Search services
        <Input
          type='search'
          name='query'
          defaultValue='api'
          placeholder='Name or identifier'
          leadingIcon={<Icon name='search' />}
        />
      </FilterBar.Field>
      <FilterBar.Field>
        Environment
        <Select
          aria-label='Filter environment'
          defaultValue='production'
          options={environments}
        />
      </FilterBar.Field>
      <FilterBar.Field>
        State
        <Select aria-label='Filter state' defaultValue='all' options={states} />
      </FilterBar.Field>
      <FilterBar.Actions>
        <Button type='reset' variant='outline'>
          Clear all filters
        </Button>
      </FilterBar.Actions>
    </FilterBar.Controls>
    <FilterBar.Actions aria-label='Applied filters' role='group'>
      <Button variant='ghost' aria-label='Remove search filter: api'>
        Search: api
        <Icon name='close' />
      </Button>
      <Button
        variant='ghost'
        aria-label='Remove environment filter: production'
      >
        production
        <Icon name='close' />
      </Button>
    </FilterBar.Actions>
    <FilterBar.Summary>3 of 24 services match 2 filters</FilterBar.Summary>
  </FilterBar.Root>
)

export const SearchOnly = () => (
  <FilterBar.Root label='Search audit log' onSubmit={stay}>
    <FilterBar.Controls>
      <FilterBar.Field width='search'>
        Search audit log
        <Input
          type='search'
          name='query'
          placeholder='Actor, action or resource'
          leadingIcon={<Icon name='search' />}
        />
      </FilterBar.Field>
      <FilterBar.Actions>
        <Button type='submit'>Search</Button>
      </FilterBar.Actions>
    </FilterBar.Controls>
    <FilterBar.Summary>1,204 events in the last 7 days</FilterBar.Summary>
  </FilterBar.Root>
)

const results = [
  ['checkout-api', 'production', 'success', 'Healthy'],
  ['payments-api', 'production', 'caution', 'Degraded'],
  ['ledger-api', 'production', 'success', 'Healthy'],
] as const

export const WithResults = () => (
  <div style={{ display: 'grid', gap: 'var(--surf-space-4)' }}>
    <FilterBar.Root label='Filter services' onSubmit={stay} onReset={stay}>
      <FilterBar.Controls>
        <FilterBar.Field width='search'>
          Search services
          <Input
            type='search'
            name='query'
            defaultValue='api'
            leadingIcon={<Icon name='search' />}
            aria-controls='filter-results'
          />
        </FilterBar.Field>
        <FilterBar.Field>
          Environment
          <Select
            aria-label='Filter environment'
            defaultValue='production'
            options={environments}
          />
        </FilterBar.Field>
        <FilterBar.Actions>
          <Button type='reset' variant='outline'>
            Clear all filters
          </Button>
        </FilterBar.Actions>
      </FilterBar.Controls>
      <FilterBar.Summary>3 of 24 services match 2 filters</FilterBar.Summary>
    </FilterBar.Root>
    <Table.Container label='Matching services' id='filter-results'>
      <Table.Root>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell scope='col'>Service</Table.HeaderCell>
            <Table.HeaderCell scope='col'>Environment</Table.HeaderCell>
            <Table.HeaderCell scope='col'>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {results.map(([name, env, tone, status]) => (
            <Table.Row key={name}>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{env}</Table.Cell>
              <Table.Cell>
                <StatusBadge tone={tone}>{status}</StatusBadge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.Container>
  </div>
)
