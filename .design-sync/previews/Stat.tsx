import {
  Card,
  Grid,
  Sparkline,
  Stat,
  formatCurrency,
  formatNumber,
  formatPercent,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const signed = (v: number) => formatPercent(v, { signed: true })

export const Default = () => (
  <Stat.Root>
    <Stat.Label>Requests per minute</Stat.Label>
    <Stat.Value>{formatNumber(1284)}</Stat.Value>
    <Stat.Change value={0.082} />
    <Stat.Caption>vs. the same hour yesterday</Stat.Caption>
  </Stat.Root>
)

// The sign sets the arrow; lowerIsBetter swaps the color for measures where a fall is good.
export const Directions = () => (
  <Grid columns={2} gap={6}>
    <Stat.Root>
      <Stat.Label>Deploy success</Stat.Label>
      <Stat.Value>{formatPercent(0.99)}</Stat.Value>
      <Stat.Change value={0.005} format={signed} />
      <Stat.Caption>vs. last week</Stat.Caption>
    </Stat.Root>
    <Stat.Root>
      <Stat.Label>Error rate</Stat.Label>
      <Stat.Value>{formatPercent(0.038, { precision: [1, 1] })}</Stat.Value>
      <Stat.Change value={0.31} lowerIsBetter format={signed} />
      <Stat.Caption>vs. last hour</Stat.Caption>
    </Stat.Root>
    <Stat.Root>
      <Stat.Label>p95 latency</Stat.Label>
      <Stat.Value>144 ms</Stat.Value>
      <Stat.Change value={-0.046} lowerIsBetter format={signed} />
      <Stat.Caption>vs. last week</Stat.Caption>
    </Stat.Root>
    <Stat.Root>
      <Stat.Label>Open incidents</Stat.Label>
      <Stat.Value>2</Stat.Value>
      <Stat.Change value={0} format={() => 'No change'} />
      <Stat.Caption>since yesterday</Stat.Caption>
    </Stat.Root>
  </Grid>
)

const weeks = {
  success: [
    0.94, 0.95, 0.93, 0.96, 0.97, 0.96, 0.97, 0.98, 0.97, 0.98, 0.985, 0.99,
  ],
  latency: [182, 176, 190, 171, 168, 172, 160, 158, 155, 149, 151, 144],
  errors: [
    0.021, 0.019, 0.024, 0.022, 0.02, 0.023, 0.025, 0.024, 0.027, 0.026, 0.029,
    0.038,
  ],
  cost: [
    42.1e3, 42.5e3, 43e3, 42.8e3, 44e3, 45.2e3, 46e3, 45.8e3, 47.1e3, 48e3,
    48.6e3, 49.2e3,
  ],
}

export const DashboardGrid = () => (
  <Grid columns={2} gap={4}>
    <Card.Root>
      <Card.Body>
        <Stat.Root>
          <Stat.Label>Deploy success</Stat.Label>
          <Stat.Value>{formatPercent(0.99)}</Stat.Value>
          <Stat.Change value={0.005} format={signed} />
          <Stat.Caption>vs. last week</Stat.Caption>
        </Stat.Root>
        <Sparkline
          data={weeks.success}
          label='Deploy success, 12 weeks, up 0.5%'
        />
      </Card.Body>
    </Card.Root>
    <Card.Root>
      <Card.Body>
        <Stat.Root>
          <Stat.Label>p95 latency</Stat.Label>
          <Stat.Value>144 ms</Stat.Value>
          <Stat.Change value={-0.046} lowerIsBetter format={signed} />
          <Stat.Caption>vs. last week</Stat.Caption>
        </Stat.Root>
        <Sparkline
          data={weeks.latency}
          lowerIsBetter
          label='p95 latency, 12 weeks, down 4.6%'
        />
      </Card.Body>
    </Card.Root>
    <Card.Root>
      <Card.Body>
        <Stat.Root>
          <Stat.Label>Cloud spend</Stat.Label>
          <Stat.Value>
            {formatCurrency(49200, 'USD', { compact: true })}
          </Stat.Value>
          <Stat.Change value={0.012} lowerIsBetter format={signed} />
          <Stat.Caption>this month</Stat.Caption>
        </Stat.Root>
        <Sparkline
          data={weeks.cost}
          lowerIsBetter
          label='Cloud spend, 12 weeks, up 1.2%'
        />
      </Card.Body>
    </Card.Root>
    <Card.Root>
      <Card.Body>
        <Stat.Root>
          <Stat.Label>Error rate</Stat.Label>
          <Stat.Value>{formatPercent(0.038, { precision: [1, 1] })}</Stat.Value>
          <Stat.Change value={0.31} lowerIsBetter format={signed} />
          <Stat.Caption>vs. last week</Stat.Caption>
        </Stat.Root>
        <Sparkline
          data={weeks.errors}
          lowerIsBetter
          label='Error rate, 12 weeks, up 31%'
        />
      </Card.Body>
    </Card.Root>
  </Grid>
)
