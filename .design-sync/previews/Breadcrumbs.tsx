import { Breadcrumbs } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Default = () => (
  <Breadcrumbs.Root aria-label='Service breadcrumb'>
    <Breadcrumbs.List>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Platform services</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Link href='#'>checkout-api</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Current>Deployments</Breadcrumbs.Current>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
)

export const TwoLevels = () => (
  <Breadcrumbs.Root aria-label='Settings breadcrumb'>
    <Breadcrumbs.List>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Settings</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Current>API tokens</Breadcrumbs.Current>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
)

export const LongTrail = () => (
  <Breadcrumbs.Root aria-label='Run breadcrumb'>
    <Breadcrumbs.List>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Acme Platform</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Link href='#'>Projects</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Link href='#'>search-indexer</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Link href='#'>Pipelines</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Current>Run 2,184</Breadcrumbs.Current>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
)
