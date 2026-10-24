import {
  BottomNavigation,
  Heading,
  Icon,
  List,
  StatusBadge,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

// The bar is fixed to the viewport and hidden above 760px by default. A preview
// shows it in the flow at every width: visible='always', position='static'.
const stay = (event: { preventDefault: () => void }) => event.preventDefault()

export const Default = () => (
  <BottomNavigation.Root
    aria-label='Primary'
    visible='always'
    position='static'
  >
    <BottomNavigation.Item
      href='#'
      onClick={stay}
      icon={<Icon name='play' />}
      label='Runs'
      current
    />
    <BottomNavigation.Item
      href='#'
      onClick={stay}
      icon={<Icon name='calendar' />}
      label='Schedule'
    />
    <BottomNavigation.Item
      href='#'
      onClick={stay}
      icon={<Icon name='clock' />}
      label='Activity'
    />
    <BottomNavigation.Item
      href='#'
      onClick={stay}
      icon={<Icon name='user' />}
      label='Account'
    />
  </BottomNavigation.Root>
)

export const WithBadges = () => (
  <BottomNavigation.Root
    aria-label='Primary'
    visible='always'
    position='static'
  >
    <BottomNavigation.Item
      href='#'
      onClick={stay}
      icon={<Icon name='play' />}
      label='Runs'
    />
    <BottomNavigation.Item
      href='#'
      onClick={stay}
      icon={<Icon name='alert' />}
      label='Alerts'
      badge={128}
      badgeLabel='128 open alerts'
    />
    <BottomNavigation.Item
      href='#'
      onClick={stay}
      icon={<Icon name='clock' />}
      label='Activity'
      current
      badge={3}
      badgeLabel='3 unread'
    />
    <BottomNavigation.Item
      href='#'
      onClick={stay}
      icon={<Icon name='user' />}
      label='Account'
      badge
      badgeLabel='Account needs attention'
    />
  </BottomNavigation.Root>
)

export const FiveDestinations = () => (
  <BottomNavigation.Root
    aria-label='Primary'
    visible='always'
    position='static'
  >
    <BottomNavigation.Item
      href='#'
      onClick={stay}
      icon={<Icon name='monitor' />}
      label='Overview'
    />
    <BottomNavigation.Item
      href='#'
      onClick={stay}
      icon={<Icon name='copy' />}
      label='Services'
      current
    />
    <BottomNavigation.Item
      href='#'
      onClick={stay}
      icon={<Icon name='play' />}
      label='Deploys'
    />
    <BottomNavigation.Item
      href='#'
      onClick={stay}
      icon={<Icon name='search' />}
      label='Search'
    />
    <BottomNavigation.Item
      href='#'
      onClick={stay}
      icon={<Icon name='settings' />}
      label='Settings'
    />
  </BottomNavigation.Root>
)

const runs = [
  ['checkout-api #418', 'production · 2 min ago', 'success', 'Passed'],
  ['search-indexer #96', 'staging · 14 min ago', 'caution', 'Running'],
  ['billing-worker #233', 'production · 1 h ago', 'success', 'Passed'],
  ['report-builder #57', 'development · 3 h ago', 'danger', 'Failed'],
] as const

export const PhoneScreen = () => (
  <section
    aria-label='Phone screen'
    style={{
      display: 'flex',
      flexDirection: 'column',
      inlineSize: '100%',
      maxInlineSize: 390,
      blockSize: 460,
      overflow: 'hidden',
      border: '1px solid var(--surf-line)',
      borderRadius: 'var(--surf-radius-lg)',
      background: 'var(--surf-canvas)',
    }}
  >
    <Heading
      level={3}
      size='page'
      style={{
        margin: 0,
        padding: 'var(--surf-space-4) var(--surf-space-4) var(--surf-space-2)',
      }}
    >
      Runs
    </Heading>
    {/* List rows carry their own inline padding, which lines titles up with
        the heading's 16px inset. */}
    <div style={{ flex: 1, minBlockSize: 0 }}>
      <List.Root aria-label='Recent runs'>
        {runs.map(([name, meta, tone, status]) => (
          <List.Item key={name}>
            <List.Content>
              <List.Title>{name}</List.Title>
              <List.Description>{meta}</List.Description>
            </List.Content>
            <List.Actions>
              <StatusBadge tone={tone}>{status}</StatusBadge>
            </List.Actions>
          </List.Item>
        ))}
      </List.Root>
    </div>
    <BottomNavigation.Root
      aria-label='Primary'
      visible='always'
      position='static'
    >
      <BottomNavigation.Item
        href='#'
        onClick={stay}
        icon={<Icon name='play' />}
        label='Runs'
        current
      />
      <BottomNavigation.Item
        href='#'
        onClick={stay}
        icon={<Icon name='calendar' />}
        label='Schedule'
      />
      <BottomNavigation.Item
        href='#'
        onClick={stay}
        icon={<Icon name='clock' />}
        label='Activity'
        badge={3}
        badgeLabel='3 unread'
      />
      <BottomNavigation.Item
        href='#'
        onClick={stay}
        icon={<Icon name='user' />}
        label='Account'
      />
    </BottomNavigation.Root>
  </section>
)
