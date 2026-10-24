import { Button, Card, EmptyState, Icon } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const FirstUse = () => (
  <EmptyState.Root>
    <EmptyState.Icon>
      <Icon name='upload' size='large' />
    </EmptyState.Icon>
    <EmptyState.Title>No services deployed yet</EmptyState.Title>
    <EmptyState.Description>
      Connect a repository to build and deploy your first service to staging.
    </EmptyState.Description>
    <EmptyState.Actions>
      <Button variant='primary'>Connect repository</Button>
      <Button variant='ghost'>Read the setup guide</Button>
    </EmptyState.Actions>
  </EmptyState.Root>
)

export const NoResults = () => (
  <EmptyState.Root>
    <EmptyState.Icon>
      <Icon name='search' size='large' />
    </EmptyState.Icon>
    <EmptyState.Title>No matching environments</EmptyState.Title>
    <EmptyState.Description>
      Nothing matches “billing-eu”. Try another name or clear the filters.
    </EmptyState.Description>
    <EmptyState.Actions>
      <Button variant='outline'>Clear filters</Button>
    </EmptyState.Actions>
  </EmptyState.Root>
)

export const PermissionRequired = () => (
  <EmptyState.Root>
    <EmptyState.Icon>
      <Icon name='user' size='large' />
    </EmptyState.Icon>
    <EmptyState.Title>Production access required</EmptyState.Title>
    <EmptyState.Description>
      Ask a workspace admin for the Deployer role to see production releases.
    </EmptyState.Description>
    <EmptyState.Actions>
      <Button variant='outline'>Request access</Button>
    </EmptyState.Actions>
  </EmptyState.Root>
)

export const InCard = () => (
  <Card.Root>
    <Card.Header>
      <Card.Title>Scheduled jobs</Card.Title>
      <Card.Description>checkout-api · production</Card.Description>
    </Card.Header>
    <Card.Body>
      <EmptyState.Root>
        <EmptyState.Title level={4}>No jobs scheduled</EmptyState.Title>
        <EmptyState.Description>
          Cron jobs you add to this service run here on their schedule.
        </EmptyState.Description>
        <EmptyState.Actions>
          <Button variant='outline'>
            <Icon name='plus' />
            Add job
          </Button>
        </EmptyState.Actions>
      </EmptyState.Root>
    </Card.Body>
  </Card.Root>
)
