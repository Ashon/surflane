import { Badge, Grid, GridItem, Inline, Stack, Surface, Text } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const stats = [
  ['Environments', '03', 'production, staging, preview'],
  ['Service checks', '87', 'passing in the last hour'],
  ['Recent runs', '12', 'deployments since Monday'],
  ['Clusters', '04', 'across two regions'],
] as const

const tile = ([name, value, desc]: (typeof stats)[number]) => (
  <Surface padding={4} key={name}>
    <Stack gap={2}>
      <Text variant='label'>{name}</Text>
      <Text variant='metric'>{value}</Text>
      <Text variant='caption' color='muted'>
        {desc}
      </Text>
    </Stack>
  </Surface>
)

export const TwoColumns = () => (
  <Grid columns={2} gap={4}>
    {stats.map(tile)}
  </Grid>
)

export const ThreeColumns = () => (
  <Grid columns={3} gap={4}>
    {stats.slice(0, 3).map(tile)}
  </Grid>
)

export const FourColumns = () => (
  <Grid columns={4} gap={4}>
    {stats.map(tile)}
  </Grid>
)

export const Gaps = () => (
  <Stack gap={4}>
    {([2, 4, 6] as const).map((gap) => (
      <Stack gap={1} key={gap}>
        <Text as='span' variant='caption' color='muted'>
          gap={gap} · {gap * 4}px
        </Text>
        <Grid columns={2} gap={gap}>
          {['us-east-1', 'eu-west-1'].map((r) => (
            <Surface padding={3} key={r}>
              <Text as='span' variant='label'>
                {r}
              </Text>
            </Surface>
          ))}
        </Grid>
      </Stack>
    ))}
  </Stack>
)

export const LayoutSpans = () => (
  <Grid columns='layout' gap={4}>
    <GridItem span={8} mediumSpan={4} smallSpan={4}>
      <Surface padding={4} style={{ blockSize: '100%' }}>
        <Stack gap={1}>
          <Text variant='label'>Primary content · span 8</Text>
          <Text color='secondary'>Deployment timeline for checkout-api</Text>
        </Stack>
      </Surface>
    </GridItem>
    <GridItem span={4} mediumSpan={2} smallSpan={4}>
      <Surface padding={4} style={{ blockSize: '100%' }}>
        <Stack gap={1}>
          <Text variant='label'>Details · span 4</Text>
          <Inline gap={2}>
            <Badge tone='success'>Healthy</Badge>
            <Text as='span' variant='caption' color='muted'>
              3 of 3 replicas ready
            </Text>
          </Inline>
        </Stack>
      </Surface>
    </GridItem>
    <GridItem span={12} mediumSpan={6} smallSpan={4}>
      <Surface padding={4}>
        <Stack gap={1}>
          <Text variant='label'>Full-width results · span 12</Text>
          <Text color='secondary'>142 log lines matched “timeout”</Text>
        </Stack>
      </Surface>
    </GridItem>
  </Grid>
)
