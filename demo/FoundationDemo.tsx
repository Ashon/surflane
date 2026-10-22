import { GridBlueprint } from './BlueprintCanvas'
import React, { useRef, useState } from 'react'
import { ComponentSizeGuide } from './ComponentSizeGuide'
import { SpacingGuide } from './SpacingGuide'
import { LayoutGridGuide } from './LayoutGridGuide'
import { TypographyBrandGuide } from './TypographyBrandGuide'
import {
  Container,
  Stack,
  Inline,
  Grid,
  Surface,
  Heading,
  Text,
  PageHeader,
  Prose,
  Button,
  Select,
} from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/FoundationDemo'

export function FoundationDemo({
  view = 'all',
}: {
  view?: 'all' | 'layout' | 'typography'
}) {
  const t = text[useLocale().locale]
  const [profile, setProfile] = useState('workspace'),
    [density, setDensity] = useState('comfortable'),
    [guides, setGuides] = useState(true)
  const compact = density === 'compact'
  const layoutRef = useRef<HTMLDivElement>(null)
  return (
    <>
      {view !== 'typography' && (
        <section aria-labelledby='layout-title' id='layout'>
          <h2 id='layout-title'>
            {view === 'all' ? t.layoutHeadingAll : t.layoutHeadingSplit}
          </h2>
          <Text color='secondary'>{t.layoutIntro}</Text>
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
              <Stack gap={compact ? 4 : 6} data-testid='layout-stack'>
                <PageHeader
                  level={3}
                  size={compact ? 'page' : 'title'}
                  breadcrumb={
                    <nav aria-label={t.layoutBreadcrumb}>
                      <Inline gap={2}>
                        <a href='#layout'>{t.platformServices}</a>
                        <svg
                          width='14'
                          height='14'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          aria-hidden='true'
                        >
                          <path d='m9 6 6 6-6 6' />
                        </svg>
                        <Text as='span' variant='caption'>
                          {profile === 'reading'
                            ? t.crumbDocumentation
                            : t.crumbDeployments}
                        </Text>
                      </Inline>
                    </nav>
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
                    <Button
                      variant='outline'
                      aria-pressed={guides}
                      onClick={() => setGuides(!guides)}
                    >
                      {t.gridGuides}
                    </Button>
                  }
                />
                {profile !== 'reading' ? (
                  <Grid
                    columns={profile === 'wide' ? 4 : 3}
                    gap={compact ? 4 : 6}
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
          <div className='foundation-widths'>
            <Text variant='caption' color='muted'>
              {t.widthSpec}
            </Text>
          </div>
        </section>
      )}
      {view !== 'typography' && <SpacingGuide />}
      {view !== 'typography' && <ComponentSizeGuide />}
      {view !== 'typography' && <LayoutGridGuide />}
      {view !== 'layout' && <TypographyBrandGuide />}
      {view !== 'layout' && (
        <section aria-labelledby='typography-title' id='typography'>
          <h2 id='typography-title'>
            {view === 'all' ? t.typographyHeadingAll : t.typographyHeadingSplit}
          </h2>
          <Text color='secondary'>{t.typographyIntro}</Text>
          <div className='font-specimens'>
            <Surface>
              <Stack gap={3}>
                <Text variant='caption' color='muted'>
                  {t.displaySpecimenCaption}
                </Text>
                <Heading level={3} size='display'>
                  Platform engineering
                  <br />
                  <span lang='ko'>플랫폼 개발의 공통 언어</span>
                </Heading>
                <Text variant='caption'>40/48 → 32/38.4px, −0.02em</Text>
              </Stack>
            </Surface>
            <Surface>
              <Stack gap={3}>
                <Text variant='caption' color='muted'>
                  {t.bodySpecimenCaption}
                </Text>
                <Text id='specimen-latin'>
                  Ship every service through the same pipeline.
                </Text>
                <Text id='specimen-hangul' lang='ko'>
                  모든 서비스를 같은 파이프라인으로 배포합니다.
                </Text>
                <Text variant='caption'>14/22px / Reading 16/28px</Text>
              </Stack>
            </Surface>
          </div>
          <Surface>
            <Text variant='caption' color='muted'>
              {t.headingSizingNote}
            </Text>
          </Surface>
          <div className='type-scale' aria-label={t.typographyRoles}>
            {[
              [t.roleTitle, '32 / 40, −0.02em', 'title', 'Service overview'],
              [t.rolePage, '24 / 32, −0.01em', 'page', 'Deployment details'],
              [t.roleSection, '20 / 28, −0.01em', 'section', 'Release policy'],
              [t.roleSubsection, '16 / 24', 'subsection', 'Build logs'],
            ].map(([name, size, variant]) => (
              <div className='type-scale-row' key={name}>
                <Text
                  as='div'
                  variant='caption'
                  color='muted'
                  className='type-scale-meta'
                >
                  <span>{name}</span>
                  <span>{size}</span>
                </Text>
                <Heading level={3} size={variant as 'title'} lang='ko'>
                  플랫폼 서비스 / Platform services
                </Heading>
              </div>
            ))}
            {[
              [t.roleBody, '14 / 22', 'body'],
              [t.roleReading, '16 / 28', 'reading'],
              [t.roleLabel, '14 / 20', 'label'],
              [t.roleTable, '13 / 20', 'table'],
              [t.roleCaption, '12 / 18, +0.01em', 'caption'],
              [t.roleCode, '13 / 20', 'mono'],
              [t.roleMetric, '24 / 28, −0.01em', 'metric'],
            ].map(([name, size, variant]) => (
              <div className='type-scale-row' key={name}>
                <Text
                  as='div'
                  variant='caption'
                  color='muted'
                  className='type-scale-meta'
                >
                  <span>{name}</span>
                  <span>{size}</span>
                </Text>
                <Text
                  id={variant === 'mono' ? 'specimen-code' : undefined}
                  variant={variant as 'body'}
                  lang={
                    variant === 'mono' || variant === 'metric'
                      ? undefined
                      : 'ko'
                  }
                >
                  {variant === 'metric'
                    ? '128 / 256'
                    : variant === 'mono'
                      ? 'service_id = "platform-api-v2"'
                      : '서비스와 API, 빌드 번호 0123456789가 한 흐름으로 읽힙니다.'}
                </Text>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
