import { Button, Checkbox, List, StatusBadge } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const environments = [
  {
    id: 'prod-us',
    name: 'production-us',
    detail: 'us-east-1, 14 services',
    tone: 'success',
    status: 'Healthy',
  },
  {
    id: 'prod-eu',
    name: 'production-eu',
    detail: 'eu-west-2, 12 services',
    tone: 'caution',
    status: 'Degraded',
  },
  {
    id: 'staging',
    name: 'staging',
    detail: 'us-east-1, 16 services',
    tone: 'progress',
    status: 'Deploying',
  },
] as const

export const WithActions = () => (
  <List.Root aria-label='Environments'>
    {environments.map((env) => (
      <List.Item key={env.id}>
        <List.Content>
          <List.Title>{env.name}</List.Title>
          <List.Description>{env.detail}</List.Description>
        </List.Content>
        <List.Actions>
          <StatusBadge tone={env.tone}>{env.status}</StatusBadge>
          <Button variant='outline' size='small'>
            Inspect
          </Button>
        </List.Actions>
      </List.Item>
    ))}
  </List.Root>
)

export const Selectable = () => (
  <List.Root aria-label='Services to restart'>
    {[
      {
        id: 'checkout',
        name: 'checkout-api',
        detail: '6 replicas, v2.14.0',
        selected: true,
      },
      {
        id: 'billing',
        name: 'billing-worker',
        detail: '3 replicas, v3.0.1',
        selected: true,
      },
      {
        id: 'search',
        name: 'search-indexer',
        detail: '4 replicas, v1.8.3',
        selected: false,
      },
    ].map((s) => (
      <List.Item key={s.id} selected={s.selected}>
        <Checkbox.Root
          aria-label={`Select ${s.name}`}
          defaultChecked={s.selected}
        >
          <Checkbox.Indicator />
        </Checkbox.Root>
        <List.Content>
          <List.Title>{s.name}</List.Title>
          <List.Description>{s.detail}</List.Description>
        </List.Content>
      </List.Item>
    ))}
  </List.Root>
)

export const History = () => (
  <List.Root aria-label='Audit log'>
    {[
      ['Mina Park promoted v2.14.0 to production', 'Today at 10:42'],
      ['Jonas Weber rotated the payments API key', 'Today at 09:15'],
      ['Deploy bot rolled back search-indexer to v1.8.2', 'Yesterday at 22:07'],
    ].map(([title, when]) => (
      <List.Item key={title}>
        <List.Content>
          <List.Title>{title}</List.Title>
          <List.Description>{when}</List.Description>
        </List.Content>
      </List.Item>
    ))}
  </List.Root>
)
