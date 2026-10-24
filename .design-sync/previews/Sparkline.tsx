import { Inline, Sparkline, Stack, Table, Text } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

// A sparkline fills the width it is given; these rows give it 200px beside a label.
const line = { inlineSize: 200 }
const name = { inlineSize: 112 }

const requests = [1180, 1240, 1210, 1302, 1265, 1290, 1340, 1322, 1388, 1410]

export const Sizes = () => (
  <Stack gap={3}>
    {(['small', 'default', 'large'] as const).map((size) => (
      <Inline key={size} gap={3}>
        <Text as='span' variant='caption' color='muted' style={name}>
          {size}
        </Text>
        <Sparkline
          data={requests}
          size={size}
          style={line}
          label='checkout-api requests per minute, 10 hours, up 19%'
        />
      </Inline>
    ))}
  </Stack>
)

const trends = [
  {
    name: 'Throughput',
    value: '1,410 rpm',
    data: requests,
    label: 'Throughput, up 19%',
  },
  {
    name: 'Success rate',
    value: '98.1%',
    data: [99.9, 99.8, 99.9, 99.6, 99.2, 98.9, 98.7, 98.8, 98.4, 98.1],
    label: 'Success rate, down 1.8 points',
  },
  {
    name: 'p95 latency',
    value: '166 ms',
    data: [212, 205, 198, 201, 190, 184, 178, 181, 172, 166],
    lowerIsBetter: true,
    label: 'p95 latency, down 22%, which is good',
  },
  {
    name: 'Queue depth',
    value: '42 jobs',
    data: [40, 44, 41, 43, 42, 40, 43, 41, 42, 42],
    trend: 'flat' as const,
    label: 'Queue depth, steady around 42',
  },
]

export const Trends = () => (
  <Stack gap={3}>
    {trends.map((t) => (
      <Inline key={t.name} gap={3}>
        <Text as='span' variant='caption' color='muted' style={name}>
          {t.name}
        </Text>
        <Sparkline
          data={t.data}
          lowerIsBetter={t.lowerIsBetter}
          trend={t.trend}
          style={line}
          label={t.label}
        />
        <Text as='span' variant='table'>
          {t.value}
        </Text>
      </Inline>
    ))}
  </Stack>
)

export const BaselineAndGap = () => (
  <Stack gap={4}>
    <Inline gap={3}>
      <Text as='span' variant='caption' color='muted' style={name}>
        vs. SLO 99.5%
      </Text>
      <Sparkline
        data={[99.7, 99.6, 99.4, 99.3, 99.6, 99.8, 99.7, 99.9]}
        baseline={99.5}
        size='large'
        style={line}
        label='Availability against a 99.5% SLO, ending above it'
      />
    </Inline>
    <Inline gap={3}>
      <Text as='span' variant='caption' color='muted' style={name}>
        Two hours missing
      </Text>
      <Sparkline
        data={[420, 455, 440, null, null, 470, 440, 410] as number[]}
        size='large'
        style={line}
        label='billing-worker jobs per minute, two hours missing'
      />
    </Inline>
  </Stack>
)

const services = [
  {
    name: 'checkout-api',
    p95: 144,
    series: [182, 176, 190, 171, 160, 152, 144],
  },
  {
    name: 'search-indexer',
    p95: 412,
    series: [310, 322, 340, 365, 380, 398, 412],
  },
  { name: 'billing-worker', p95: 96, series: [101, 99, 98, 97, 99, 96, 96] },
]

export const InTable = () => (
  <Table.Container label='Service latency'>
    <Table.Root variant='lined' density='compact'>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell scope='col'>Service</Table.HeaderCell>
          <Table.HeaderCell scope='col' numeric>
            p95 (ms)
          </Table.HeaderCell>
          <Table.HeaderCell scope='col'>7 days</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {services.map((s) => (
          <Table.Row key={s.name}>
            <Table.Cell>{s.name}</Table.Cell>
            <Table.Cell numeric>{s.p95}</Table.Cell>
            <Table.Cell>
              <Sparkline
                data={s.series}
                size='small'
                lowerIsBetter
                label={`${s.name} p95 latency over 7 days`}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  </Table.Container>
)
