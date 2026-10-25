import React, { useRef, useState } from 'react'
import {
  Button,
  Container,
  Grid,
  Inline,
  PageHeader,
  Prose,
  Select,
  Stack,
  Table,
  Text,
  Toggle,
  Breadcrumbs,
} from '@surflane/ui'
import { GridBlueprint } from './BlueprintCanvas'
import { ComponentSizeGuide } from './ComponentSizeGuide'
import { FoundationPage, FoundationSection } from './FoundationPage'
import { LayoutGridGuide } from './LayoutGridGuide'
import { SpacingGuide } from './SpacingGuide'
import { Link } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/LayoutFoundation'

/** A page in each container profile and density, with grid guides over it. */
export function LayoutPreview() {
  const t = text[useLocale().locale]
  const [profile, setProfile] = useState('workspace'),
    [density, setDensity] = useState('comfortable'),
    [guides, setGuides] = useState(true)
  const compact = density === 'compact'
  const layoutRef = useRef<HTMLDivElement>(null)
  return (
    <>
      <div className='foundation-controls'>
        <label>
          {t.layoutProfile}
          <Select
            aria-label={t.layoutProfile}
            value={profile}
            onValueChange={setProfile}
            options={[
              { value: 'workspace', label: t.profileWorkspace },
              { value: 'reading', label: t.profileReading },
              { value: 'wide', label: t.profileWide },
            ]}
          />
        </label>
        <label>
          {t.density}
          <Select
            aria-label={t.layoutDensity}
            value={density}
            onValueChange={setDensity}
            options={[
              { value: 'comfortable', label: t.densityComfortable },
              { value: 'compact', label: t.densityCompact },
            ]}
          />
        </label>
      </div>
      <div
        id='layout-preview'
        className='layout-preview-shell'
        data-profile={profile}
        data-density={density}
      >
        <Container
          width={profile as 'reading' | 'workspace' | 'wide'}
          data-testid='layout-container'
          className='layout-guide-container'
          ref={layoutRef}
          data-grid-guides={guides || undefined}
        >
          <GridBlueprint hostRef={layoutRef} visible={guides} />
          <Stack gap={compact ? 3 : 6} data-testid='layout-stack'>
            <PageHeader
              level={3}
              variant={compact ? 'page' : 'title'}
              breadcrumb={
                <Breadcrumbs.Root aria-label={t.layoutBreadcrumb}>
                  <Breadcrumbs.List>
                    <Breadcrumbs.Item>
                      <Breadcrumbs.Link href='#layout-preview'>
                        {t.platformServices}
                      </Breadcrumbs.Link>
                    </Breadcrumbs.Item>
                    <Breadcrumbs.Item>
                      <Breadcrumbs.Separator />
                      <Breadcrumbs.Current>
                        {profile === 'reading'
                          ? t.crumbDocumentation
                          : t.crumbDeployments}
                      </Breadcrumbs.Current>
                    </Breadcrumbs.Item>
                  </Breadcrumbs.List>
                </Breadcrumbs.Root>
              }
              title={
                profile === 'reading'
                  ? t.pageHeadingEnvAccess
                  : t.pageHeadingWorkspace
              }
              description={
                profile === 'reading'
                  ? t.pageDescEnvAccess
                  : t.pageDescWorkspace
              }
              actions={
                <Toggle pressed={guides} onPressedChange={setGuides}>
                  {t.gridGuides}
                </Toggle>
              }
            />
            {profile !== 'reading' ? (
              <Grid
                columns={profile === 'wide' ? 4 : 3}
                gap={compact ? 3 : 6}
                data-testid='layout-grid'
              >
                {[
                  [t.statEnvironments, '03', t.statEnvironmentsDesc],
                  [t.statServiceChecks, '87', t.statServiceChecksDesc],
                  [t.statRecentRuns, '12', t.statRecentRunsDesc],
                  ...(profile === 'wide'
                    ? [[t.statClusters, '03', t.statClustersDesc]]
                    : []),
                ].map(([name, value, desc]) => (
                  <div className='foundation-stat' key={name}>
                    <Stack gap={2}>
                      <Text variant='label'>{name}</Text>
                      <Text variant='metric'>{value}</Text>
                      <Text variant='caption' color='muted'>
                        {desc}
                      </Text>
                    </Stack>
                  </div>
                ))}
              </Grid>
            ) : (
              <Prose data-testid='reading-preview'>
                <p>{t.readingPara1}</p>
                <h4>{t.readingHeading}</h4>
                <p>
                  {t.readingPara2Intro} <code>environment_id</code>{' '}
                  {t.readingPara2Tail}
                </p>
                <p>{t.readingPara3}</p>
              </Prose>
            )}
          </Stack>
        </Container>
      </div>
    </>
  )
}

export function LayoutFoundation() {
  const t = text[useLocale().locale]
  return (
    <FoundationPage
      principles={t.principles}
      sections={t.sections}
      related={[
        '/foundations/typography',
        '/foundations/hierarchy',
        '/foundations/accessibility',
        '/patterns/app-shell',
      ]}
    >
      <FoundationSection id='containers'>
        <p>{t.containersIntro}</p>
        <Table.Container
          bleed
          label={t.containersTableLabel}
          orientation='horizontal'
        >
          <Table.Root>
            <Table.Caption>{t.containersCaption}</Table.Caption>
            <Table.Head>
              <Table.Row>
                {[
                  t.containerHeader,
                  t.maxWidthHeader,
                  t.tokenHeader,
                  t.useHeader,
                ].map((label) => (
                  <Table.HeaderCell key={label} scope='col'>
                    {label}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {t.containers.map(([name, width, token, use]) => (
                <Table.Row key={name}>
                  <Table.HeaderCell scope='row'>{name}</Table.HeaderCell>
                  <Table.Cell>{width}</Table.Cell>
                  <Table.Cell>
                    <Link href={`/tokens?q=${token}`}>
                      <code>{token}</code>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{use}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
        <p>
          {t.measureStart}
          <Link href='/foundations/typography'>{t.measureLink}</Link>
          {t.measureEnd}
        </p>
        <LayoutPreview />
      </FoundationSection>
      <FoundationSection id='grid-system'>
        <LayoutGridGuide />
      </FoundationSection>
      <FoundationSection id='spacing'>
        <SpacingGuide />
      </FoundationSection>
      <FoundationSection id='component-sizes'>
        <ComponentSizeGuide />
      </FoundationSection>
    </FoundationPage>
  )
}
