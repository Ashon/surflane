import React from 'react'
import {
  AppShell,
  Avatar,
  Button,
  CodeBlock,
  Heading,
  Icon,
  PageHeader,
  SizeProvider,
  StatusBadge,
  Table,
  Text,
  type IconName,
  type StatusTone,
} from '@surflane/ui'
import { Link, withBase } from './router'

const destinations: [string, IconName][] = [
  ['Overview', 'monitor'],
  ['Services', 'copy'],
  ['Deployments', 'play'],
  ['Settings', 'settings'],
]
const deployments: [string, string, StatusTone, string][] = [
  ['platform-api', 'production', 'success', 'Healthy'],
  ['auth-gateway', 'production', 'progress', 'Deploying'],
  ['billing-service', 'staging', 'success', 'Healthy'],
  ['search-indexer', 'staging', 'danger', 'Failed'],
  ['notification-worker', 'development', 'success', 'Healthy'],
]

export function LandingHero() {
  return (
    // The hero heading is the page title on "/", so route changes focus it like any page header.
    <section className='landing-hero' aria-labelledby='page-title'>
      <div className='landing-hero-copy'>
        <Text variant='label' color='secondary' className='landing-eyebrow'>
          Design system for platform development
        </Text>
        <Heading level={1} size='display' id='page-title' tabIndex={-1}>
          The interface layer for platform teams.
        </Heading>
        <Text variant='reading' color='secondary'>
          Tokens, accessible React components, and tested patterns for consoles,
          dashboards, and developer tools. Ready for Server Components.
        </Text>
        <div className='actions'>
          <Link
            className='pui-button'
            data-variant='primary'
            data-size='large'
            href='/components'
          >
            Browse components
          </Link>
          <a
            className='pui-button'
            data-variant='outline'
            data-size='large'
            href='https://github.com/Ashon/surflane/blob/main/docs/frameworks.md'
          >
            Read the quick start
          </a>
        </div>
        <CodeBlock
          className='landing-install'
          label='Install'
          code='npm i @surflane/ui @surflane/design-tokens'
          copyLabel='Copy install command'
        />
      </div>
      <div
        className='landing-console'
        aria-hidden='true'
        inert
        data-blueprint-decorative
      >
        {/* A product screen shown at reduced scale: compact controls, a page-size title. */}
        <SizeProvider size='small'>
          <AppShell.Root layout='workspace'>
            <AppShell.Sidebar data-blueprint-guide>
              {/* A fictional product: Acme is the customary placeholder company. */}
              <div className='landing-console-brand' data-blueprint-guide>
                <svg
                  className='landing-console-logo'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                  data-blueprint-guide
                >
                  <rect width='24' height='24' rx='6' />
                  <path d='m6.5 9.5 5.5-3 5.5 3-5.5 3z' />
                  <path d='m6.5 12.75 5.5 3 5.5-3' />
                  <path d='m6.5 15.75 5.5 3 5.5-3' />
                </svg>
                <span className='app-shell-brand-text'>
                  <AppShell.Label
                    className='app-shell-brand-name'
                    title='Acme Platform'
                    data-blueprint-guide
                  >
                    Acme Platform
                  </AppShell.Label>
                  <span className='app-shell-brand-workspace'>
                    platform-core
                  </span>
                </span>
              </div>
              <nav className='landing-console-nav'>
                {destinations.map(([label, icon]) => (
                  <AppShell.Link
                    key={label}
                    href='#'
                    label={label}
                    icon={<Icon name={icon} decorative />}
                    aria-current={label === 'Deployments' ? 'page' : undefined}
                  />
                ))}
              </nav>
              <AppShell.Footer>
                <div className='landing-console-account' data-blueprint-guide>
                  <Avatar.Root size='sm' data-blueprint-guide>
                    <Avatar.Image
                      alt=''
                      src={withBase('/avatar-preview.svg')}
                    />
                    <Avatar.Fallback>U</Avatar.Fallback>
                    <Avatar.Status />
                  </Avatar.Root>
                  <AppShell.Label data-blueprint-guide>user</AppShell.Label>
                </div>
              </AppShell.Footer>
            </AppShell.Sidebar>
            <AppShell.Content>
              <div className='landing-console-sheet' data-blueprint-guide>
                <PageHeader
                  size='page'
                  level={2}
                  title='Deployments'
                  description='Services across production, staging, and development.'
                  actions={
                    <Button variant='primary' size='small'>
                      New deployment
                    </Button>
                  }
                />
                <Table.Container label='Recent deployments'>
                  <Table.Root>
                    <Table.Head>
                      <Table.Row>
                        <Table.HeaderCell scope='col'>Service</Table.HeaderCell>
                        <Table.HeaderCell scope='col'>
                          Environment
                        </Table.HeaderCell>
                        <Table.HeaderCell scope='col'>Status</Table.HeaderCell>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {deployments.map(([service, env, tone, status]) => (
                        <Table.Row key={service}>
                          <Table.Cell>
                            <code>{service}</code>
                          </Table.Cell>
                          <Table.Cell>{env}</Table.Cell>
                          <Table.Cell>
                            <StatusBadge tone={tone}>{status}</StatusBadge>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Table.Container>
              </div>
            </AppShell.Content>
          </AppShell.Root>
        </SizeProvider>
      </div>
    </section>
  )
}
