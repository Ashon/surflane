import { Breadcrumbs, Button, Icon, PageHeader } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const trail = (current: string) => (
  <Breadcrumbs.Root aria-label='Service breadcrumb'>
    <Breadcrumbs.List>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Services</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Link href='#'>checkout-api</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Current>{current}</Breadcrumbs.Current>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
)

export const Workspace = () => (
  <PageHeader
    as='header'
    size='workspace'
    level={1}
    title='Deployments'
    description='Every release of checkout-api across production, staging and development.'
    breadcrumb={trail('Deployments')}
    actionsLabel='Deployment actions'
    actions={
      <>
        <Button variant='outline'>View logs</Button>
        <Button variant='primary'>
          <Icon name='plus' />
          New deployment
        </Button>
      </>
    }
  />
)

export const Page = () => (
  <PageHeader
    size='page'
    level={1}
    title='Registered resources'
    description='Discover and inspect the 142 resources registered to platform-core.'
    actionsLabel='Resource actions'
    actions={<Button variant='primary'>Register resource</Button>}
  />
)

export const Document = () => (
  <PageHeader
    size='document'
    level={1}
    title='Rolling back a deployment'
    description='Return a service to its last healthy release in under a minute, without a new build.'
    breadcrumb={
      <Breadcrumbs.Root aria-label='Guide breadcrumb'>
        <Breadcrumbs.List>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href='#'>Guides</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Current>Rollbacks</Breadcrumbs.Current>
          </Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>
    }
  />
)

export const TitleOnly = () => <PageHeader title='Environment settings' />

export const LongTitle = () => (
  <PageHeader
    size='workspace'
    title='search-indexer-eu-west-1-blue-green-canary-rollout-2026-10'
    description='Canary at 10% of traffic since 09:40 UTC.'
    breadcrumb={trail('Canary rollout')}
    actionsLabel='Rollout actions'
    actions={
      <>
        <Button variant='outline'>Pause</Button>
        <Button variant='destructive'>Roll back</Button>
      </>
    }
  />
)
