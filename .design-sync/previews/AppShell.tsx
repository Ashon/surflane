import {
  AppShell,
  Avatar,
  Button,
  Icon,
  Menu,
  PageHeader,
  ScrollArea,
  StatusBadge,
  Table,
  type IconName,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

// A fictional product mark: stacked layers on the brand tile.
const mark = (
  <svg viewBox='0 0 24 24'>
    <rect width='24' height='24' rx='6' fill='var(--surf-brand)' />
    <path d='m6.5 9.5 5.5-3 5.5 3-5.5 3z' fill='var(--surf-on-brand)' />
    <path
      d='m6.5 12.75 5.5 3 5.5-3'
      fill='none'
      stroke='var(--surf-on-brand)'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='m6.5 15.75 5.5 3 5.5-3'
      fill='none'
      stroke='var(--surf-on-brand)'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

const destinations: [string, IconName][] = [
  ['Overview', 'monitor'],
  ['Services', 'copy'],
  ['Deployments', 'play'],
  ['Schedules', 'calendar'],
  ['Activity', 'clock'],
  ['Settings', 'settings'],
]

const deployments = [
  ['checkout-api', 'production', '2 min ago', 'success', 'Live'],
  ['search-indexer', 'staging', '14 min ago', 'caution', 'Rolling out'],
  ['billing-worker', 'production', '1 h ago', 'success', 'Live'],
  ['report-builder', 'development', '3 h ago', 'danger', 'Failed'],
] as const

const stay = (event: { preventDefault: () => void }) => event.preventDefault()

const Workspace = ({ collapsed = false }: { collapsed?: boolean }) => (
  // The shell takes its container's height.
  <div style={{ height: 640 }}>
    <AppShell.Root
      layout='workspace'
      shortcut={false}
      defaultCollapsed={collapsed}
    >
      <AppShell.Sidebar aria-label='Workspace sidebar'>
        <AppShell.Brand
          mark={mark}
          name='Acme Platform'
          description='platform-core'
        />
        <AppShell.SidebarToggle />
        <ScrollArea orientation='vertical' label='Destinations'>
          <AppShell.Nav label='Workspace'>
            {destinations.map(([label, icon]) => (
              <AppShell.Link
                key={label}
                href='#'
                onClick={stay}
                label={label}
                icon={<Icon name={icon} decorative />}
                aria-current={label === 'Deployments' ? 'page' : undefined}
              />
            ))}
          </AppShell.Nav>
        </ScrollArea>
        <AppShell.Footer>
          <Menu.Root>
            <AppShell.Link
              render={<Menu.Trigger />}
              icon={
                <Avatar.Root size='small'>
                  <Avatar.Fallback>MK</Avatar.Fallback>
                </Avatar.Root>
              }
              label='Mina Kim'
              aria-label='Account menu, Mina Kim'
            />
            <Menu.Portal>
              <Menu.Content>
                <Menu.Item>Profile</Menu.Item>
                <Menu.Item>Switch theme</Menu.Item>
                <Menu.Item>Sign out</Menu.Item>
              </Menu.Content>
            </Menu.Portal>
          </Menu.Root>
        </AppShell.Footer>
      </AppShell.Sidebar>
      <AppShell.Content>
        <ScrollArea orientation='vertical' label='Workspace content'>
          <AppShell.Page>
            <PageHeader
              size='workspace'
              level={1}
              title='Deployments'
              description='Recent releases across production, staging and development.'
              actionsLabel='Deployment actions'
              actions={
                <>
                  <Button variant='outline'>View logs</Button>
                  <Button variant='primary'>New deployment</Button>
                </>
              }
            />
            <Table.Container label='Recent deployments'>
              <Table.Root>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell scope='col'>Service</Table.HeaderCell>
                    <Table.HeaderCell scope='col'>Environment</Table.HeaderCell>
                    <Table.HeaderCell scope='col'>Deployed</Table.HeaderCell>
                    <Table.HeaderCell scope='col'>Status</Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {deployments.map(([service, env, when, tone, status]) => (
                    <Table.Row key={service}>
                      <Table.Cell>{service}</Table.Cell>
                      <Table.Cell>{env}</Table.Cell>
                      <Table.Cell>{when}</Table.Cell>
                      <Table.Cell>
                        <StatusBadge tone={tone}>{status}</StatusBadge>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.Container>
          </AppShell.Page>
        </ScrollArea>
      </AppShell.Content>
    </AppShell.Root>
  </div>
)

export const WorkspaceLayout = () => <Workspace />

export const CollapsedRail = () => <Workspace collapsed />
