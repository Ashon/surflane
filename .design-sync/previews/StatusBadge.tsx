import { Icon, Inline, List, StatusBadge } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Tones = () => (
  <Inline gap={2}>
    <StatusBadge tone='neutral'>Queued</StatusBadge>
    <StatusBadge tone='info'>Maintenance</StatusBadge>
    <StatusBadge tone='progress'>Deploying</StatusBadge>
    <StatusBadge tone='success'>Healthy</StatusBadge>
    <StatusBadge tone='caution'>Degraded</StatusBadge>
    <StatusBadge tone='danger'>Failing</StatusBadge>
  </Inline>
)

export const Sizes = () => (
  <Inline gap={2}>
    <StatusBadge tone='success' size='small'>
      Passed
    </StatusBadge>
    <StatusBadge tone='success'>Passed</StatusBadge>
    <StatusBadge tone='success' size='large'>
      Passed
    </StatusBadge>
  </Inline>
)

export const CustomIcon = () => (
  <Inline gap={2}>
    <StatusBadge tone='neutral' icon={<Icon name='clock' />}>
      Scheduled
    </StatusBadge>
    <StatusBadge tone='danger' icon={false}>
      Rolled back
    </StatusBadge>
  </Inline>
)

const deployments = [
  {
    service: 'checkout-api',
    detail: 'v2.14.0 to production, 4 minutes ago',
    tone: 'progress',
    status: 'Deploying',
  },
  {
    service: 'search-indexer',
    detail: 'v1.8.3 to staging, 26 minutes ago',
    tone: 'success',
    status: 'Succeeded',
  },
  {
    service: 'billing-worker',
    detail: 'v3.0.1 to production, 1 hour ago',
    tone: 'danger',
    status: 'Failed',
  },
] as const

export const InList = () => (
  <List.Root aria-label='Recent deployments'>
    {deployments.map((d) => (
      <List.Item key={d.service}>
        <List.Content>
          <List.Title>{d.service}</List.Title>
          <List.Description>{d.detail}</List.Description>
        </List.Content>
        <List.Actions>
          <StatusBadge tone={d.tone}>{d.status}</StatusBadge>
        </List.Actions>
      </List.Item>
    ))}
  </List.Root>
)
