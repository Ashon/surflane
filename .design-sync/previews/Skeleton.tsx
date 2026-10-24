import { Inline, Skeleton, Stack, Table, Text } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Shapes = () => (
  <Stack gap={4}>
    <Inline gap={4}>
      <Skeleton shape='circle' />
      <Text as='span' variant='caption' color='muted'>
        circle
      </Text>
    </Inline>
    <Stack gap={2}>
      <Skeleton style={{ width: '60%' }} />
      <Text as='span' variant='caption' color='muted'>
        text
      </Text>
    </Stack>
    <Stack gap={2}>
      <Skeleton shape='block' />
      <Text as='span' variant='caption' color='muted'>
        block
      </Text>
    </Stack>
  </Stack>
)

export const ServiceRow = () => (
  <section aria-label='Service owner' aria-busy='true'>
    <Stack gap={3}>
      <Inline gap={3}>
        <Skeleton shape='circle' />
        <div style={{ flex: 1 }}>
          <Stack gap={2}>
            <Skeleton style={{ width: '55%' }} />
            <Skeleton style={{ width: '80%' }} />
          </Stack>
        </div>
      </Inline>
      <Skeleton shape='block' />
      <Text variant='caption' color='muted' role='status'>
        Loading environment…
      </Text>
    </Stack>
  </section>
)

export const TableRows = () => (
  <Table.Container label='Deployments' aria-busy='true'>
    <Table.Root>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell scope='col'>Service</Table.HeaderCell>
          <Table.HeaderCell scope='col'>Version</Table.HeaderCell>
          <Table.HeaderCell scope='col'>Started</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {['70%', '55%', '80%'].map((w, i) => (
          <Table.Row key={i}>
            <Table.Cell>
              <Skeleton style={{ width: w }} />
            </Table.Cell>
            <Table.Cell>
              <Skeleton style={{ width: '50%' }} />
            </Table.Cell>
            <Table.Cell>
              <Skeleton style={{ width: '60%' }} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  </Table.Container>
)
