import {
  Button,
  Card,
  Inline,
  Sparkline,
  Stat,
  StatusBadge,
  Surface,
  Text,
  formatPercent,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Default = () => (
  <Card.Root aria-labelledby='card-checkout-title' style={{ maxWidth: 400 }}>
    <Card.Header>
      <Card.Title id='card-checkout-title'>checkout-api</Card.Title>
      <Card.Description>Production, us-east-1 and eu-west-2</Card.Description>
    </Card.Header>
    <Card.Body>
      <Text>
        v2.14.0 is serving 1.2k requests a minute with a p95 of 184 ms.
      </Text>
    </Card.Body>
    <Card.Footer>
      <StatusBadge tone='success'>Healthy</StatusBadge>
      <Button variant='outline'>View service</Button>
    </Card.Footer>
  </Card.Root>
)

// canvas matches the page, so it reads as a card only on a subtle plane.
export const CanvasSurface = () => (
  <Surface style={{ maxWidth: 448 }}>
    <Card.Root surface='canvas' aria-labelledby='card-incident-title'>
      <Card.Header>
        <Card.Title id='card-incident-title'>
          Elevated 5xx on search-indexer
        </Card.Title>
        <Card.Description>
          Opened 14 minutes ago by the error-rate alert
        </Card.Description>
      </Card.Header>
      <Card.Body>
        <Text>
          Error rate is 3.8% in staging after the v1.8.3 rollout. Rolling back
          is the suggested first step.
        </Text>
      </Card.Body>
      <Card.Footer>
        <StatusBadge tone='danger'>Sev 2</StatusBadge>
        <Inline gap={2}>
          <Button variant='ghost'>Acknowledge</Button>
          <Button variant='primary'>Roll back</Button>
        </Inline>
      </Card.Footer>
    </Card.Root>
  </Surface>
)

const latency = [182, 176, 190, 171, 168, 172, 160, 158, 155, 149, 151, 144]

export const MetricCard = () => (
  <Card.Root style={{ maxWidth: 280 }}>
    <Card.Body>
      <Stat.Root>
        <Stat.Label>p95 latency</Stat.Label>
        <Stat.Value>144 ms</Stat.Value>
        <Stat.Change
          value={-0.046}
          lowerIsBetter
          format={(v: number) => formatPercent(v, { signed: true })}
        />
        <Stat.Caption>vs. last week</Stat.Caption>
      </Stat.Root>
      <Sparkline
        data={latency}
        lowerIsBetter
        label='p95 latency, 12 weeks, down 4.6%'
      />
    </Card.Body>
  </Card.Root>
)

export const CompactPadding = () => (
  <Card.Root padding={4} style={{ maxWidth: 320 }}>
    <Card.Header>
      <Card.Title level={4}>Release window</Card.Title>
      <Card.Description>Weekdays, 09:00 to 16:00 KST</Card.Description>
    </Card.Header>
    <Card.Footer>
      <Button variant='link'>Edit window</Button>
    </Card.Footer>
  </Card.Root>
)
