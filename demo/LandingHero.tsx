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
  LinkButton,
} from '@surflane/ui'
import { Link, withBase } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/LandingHero'

export function LandingHero() {
  const t = text[useLocale().locale]
  const destinations: [string, IconName][] = [
    [t.overview, 'monitor'],
    [t.services, 'copy'],
    [t.deployments, 'play'],
    [t.settings, 'settings'],
  ]
  const deployments: [string, string, StatusTone, string][] = [
    ['platform-api', 'production', 'success', t.healthy],
    ['auth-gateway', 'production', 'progress', t.deploying],
    ['billing-service', 'staging', 'success', t.healthy],
    ['search-indexer', 'staging', 'danger', t.failed],
    ['notification-worker', 'development', 'success', t.healthy],
  ]
  return (
    // The hero heading is the page title on "/", so route changes focus it like any page header.
    <section className='landing-hero' aria-labelledby='page-title'>
      <div className='landing-hero-copy'>
        <Text variant='label' color='secondary' className='landing-eyebrow'>
          {t.eyebrow}
        </Text>
        <Heading level={1} size='display' id='page-title' tabIndex={-1}>
          {t.title}
        </Heading>
        <Text variant='reading' color='secondary'>
          {t.lead}
        </Text>
        <div className='actions'>
          <LinkButton
            variant='primary'
            size='large'
            render={<Link href='/components' />}
          >
            {t.browse}
          </LinkButton>
          <LinkButton
            variant='outline'
            size='large'
            render={<Link href='/install' />}
          >
            {t.quickStart}
          </LinkButton>
        </div>
        <CodeBlock
          className='landing-install'
          label={t.install}
          code='npm i @surflane/ui @surflane/design-tokens'
          copyLabel={t.copyInstall}
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
          <AppShell.Root layout='workspace' shortcut={false}>
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
                    aria-current={label === t.deployments ? 'page' : undefined}
                  />
                ))}
              </nav>
              <AppShell.Footer>
                <div className='landing-console-account' data-blueprint-guide>
                  <Avatar.Root size='small' data-blueprint-guide>
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
              <AppShell.Page
                className='landing-console-sheet'
                data-blueprint-guide
              >
                <PageHeader
                  size='page'
                  level={2}
                  title={t.pageTitle}
                  description={t.pageDescription}
                  actions={
                    <Button variant='primary' size='small'>
                      {t.newDeployment}
                    </Button>
                  }
                />
                <Table.Container label={t.tableLabel}>
                  <Table.Root>
                    <Table.Head>
                      <Table.Row>
                        <Table.HeaderCell scope='col'>
                          {t.service}
                        </Table.HeaderCell>
                        <Table.HeaderCell scope='col'>
                          {t.environment}
                        </Table.HeaderCell>
                        <Table.HeaderCell scope='col'>
                          {t.status}
                        </Table.HeaderCell>
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
              </AppShell.Page>
            </AppShell.Content>
          </AppShell.Root>
        </SizeProvider>
      </div>
    </section>
  )
}
