import { Checkbox, StatusBadge, Table } from '@surflane/ui'

document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const services = [
  {
    id: 'checkout',
    name: 'checkout-api',
    env: 'production',
    p95: 184,
    status: 'Healthy',
    tone: 'success',
  },
  {
    id: 'search',
    name: 'search-indexer',
    env: 'staging',
    p95: 412,
    status: 'Degraded',
    tone: 'caution',
  },
  {
    id: 'billing',
    name: 'billing-worker',
    env: 'production',
    p95: 96,
    status: 'Healthy',
    tone: 'success',
  },
  {
    id: 'reports',
    name: 'report-builder',
    env: 'development',
    p95: 1210,
    status: 'Failing',
    tone: 'danger',
  },
] as const

const rows = (selected?: string) =>
  services.map((s) => (
    <Table.Row key={s.id} selected={s.id === selected}>
      {selected !== undefined && (
        <Table.Cell>
          <Checkbox.Root
            aria-label={`Select ${s.name}`}
            defaultChecked={s.id === selected}
          >
            <Checkbox.Indicator />
          </Checkbox.Root>
        </Table.Cell>
      )}
      <Table.Cell>{s.name}</Table.Cell>
      <Table.Cell>{s.env}</Table.Cell>
      <Table.Cell numeric>{s.p95.toLocaleString('en-US')}</Table.Cell>
      <Table.Cell>
        <StatusBadge tone={s.tone}>{s.status}</StatusBadge>
      </Table.Cell>
    </Table.Row>
  ))

const head = (select: boolean) => (
  <Table.Head>
    <Table.Row>
      {select && (
        <Table.HeaderCell scope='col'>
          <Checkbox.Root
            aria-label='Select services on this page'
            indeterminate
          >
            <Checkbox.Indicator />
          </Checkbox.Root>
        </Table.HeaderCell>
      )}
      <Table.HeaderCell scope='col'>Service</Table.HeaderCell>
      <Table.HeaderCell scope='col'>Environment</Table.HeaderCell>
      <Table.HeaderCell scope='col' numeric>
        p95 latency (ms)
      </Table.HeaderCell>
      <Table.HeaderCell scope='col'>Status</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
)

export const Lined = () => (
  <Table.Container label='Services'>
    <Table.Root variant='lined'>
      <Table.Caption>Services</Table.Caption>
      {head(false)}
      <Table.Body>{rows()}</Table.Body>
    </Table.Root>
  </Table.Container>
)

export const Grid = () => (
  <Table.Container label='Services'>
    <Table.Root variant='grid' density='compact'>
      {head(false)}
      <Table.Body>{rows()}</Table.Body>
    </Table.Root>
  </Table.Container>
)

export const Striped = () => (
  <Table.Container label='Services'>
    <Table.Root variant='striped'>
      {head(false)}
      <Table.Body>{rows()}</Table.Body>
    </Table.Root>
  </Table.Container>
)

export const SelectedRow = () => (
  <Table.Container label='Services'>
    <Table.Root variant='lined'>
      {head(true)}
      <Table.Body>{rows('search')}</Table.Body>
    </Table.Root>
  </Table.Container>
)

export const Empty = () => (
  <Table.Container label='Services'>
    <Table.Root variant='lined'>
      {head(false)}
      <Table.Body>
        <Table.Message colSpan={4}>No services match “payments”.</Table.Message>
      </Table.Body>
    </Table.Root>
  </Table.Container>
)
