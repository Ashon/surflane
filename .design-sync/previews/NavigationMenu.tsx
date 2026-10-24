import { NavigationMenu, Text } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const frame = { padding: 24, minBlockSize: 360 }
const links = { display: 'grid', gap: 'var(--surf-space-2)' } as const
const block = { display: 'block' } as const

const Destination = ({
  title,
  description,
  active = false,
}: {
  title: string
  description: string
  active?: boolean
}) => (
  <NavigationMenu.Link href='#' active={active} closeOnClick>
    <Text as='span' weight='medium' style={block}>
      {title}
    </Text>
    <Text as='span' variant='caption' color='secondary' style={block}>
      {description}
    </Text>
  </NavigationMenu.Link>
)

const Menu = ({ open }: { open?: 'products' | 'learn' }) => (
  <NavigationMenu.Root<'products' | 'learn'>
    aria-label='Platform navigation'
    defaultValue={open ?? null}
  >
    <NavigationMenu.List>
      <NavigationMenu.Item value='products'>
        <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <div style={links}>
            <Destination
              title='Workspace'
              description='Services, deployments and environments in one place.'
              active
            />
            <Destination
              title='Inventory'
              description='Every registered resource, its owner and its cost.'
            />
            <Destination
              title='Pipelines'
              description='Build, test and release on every merge.'
            />
          </div>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      <NavigationMenu.Item value='learn'>
        <NavigationMenu.Trigger>Learn</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <div style={links}>
            <Destination
              title='Deployment guide'
              description='Ship a service from an empty repository.'
            />
            <Destination
              title='API reference'
              description='Endpoints, tokens and rate limits.'
            />
          </div>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      <NavigationMenu.Item>
        <NavigationMenu.Link href='#'>Pricing</NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>
    <NavigationMenu.Portal>
      <NavigationMenu.Positioner
        align='start'
        sideOffset={8}
        collisionPadding={12}
      >
        <NavigationMenu.Popup aria-label='Platform destinations'>
          <NavigationMenu.Viewport />
        </NavigationMenu.Popup>
      </NavigationMenu.Positioner>
    </NavigationMenu.Portal>
  </NavigationMenu.Root>
)

export const ProductsOpen = () => (
  <div style={frame}>
    <Menu open='products' />
  </div>
)

export const LearnOpen = () => (
  <div style={frame}>
    <Menu open='learn' />
  </div>
)

export const Closed = () => (
  <div style={frame}>
    <Menu />
  </div>
)
