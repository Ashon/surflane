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

export function FoundationDemo({
  view = 'all',
}: {
  view?: 'all' | 'layout' | 'typography'
}) {
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
            {view === 'all' ? 'Layout' : 'Workspace and reading'}
          </h2>
          <Text color='secondary'>
            Build structure from content alignment and whitespace, not nested
            backgrounds. Compare width, spacing, and information density between
            workspace and documentation screens.
          </Text>
          <div className='foundation-controls'>
            <label>
              Layout profile
              <Select
                aria-label='Layout profile'
                value={profile}
                onValueChange={setProfile}
                options={[
                  { value: 'workspace', label: 'Workspace / operations' },
                  { value: 'reading', label: 'Reading / documentation' },
                  { value: 'wide', label: 'Wide / comparison' },
                ]}
              />
            </label>
            <label>
              Density
              <Select
                aria-label='Layout density'
                value={density}
                onValueChange={setDensity}
                options={[
                  { value: 'comfortable', label: 'Comfortable / 24px' },
                  { value: 'compact', label: 'Compact / 16px' },
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
                    <nav aria-label='Layout preview breadcrumb'>
                      <Inline gap={2}>
                        <a href='#layout'>Platform services</a>
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
                            ? 'Documentation'
                            : 'Deployments'}
                        </Text>
                      </Inline>
                    </nav>
                  }
                  title={
                    profile === 'reading'
                      ? 'Environment access'
                      : 'Platform workspace'
                  }
                  description={
                    profile === 'reading'
                      ? 'Read the rules for environment access and deployment.'
                      : 'Select environments, review pipeline runs, and check deployment results.'
                  }
                  actions={
                    <Button
                      variant='outline'
                      aria-pressed={guides}
                      onClick={() => setGuides(!guides)}
                    >
                      Grid guides
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
                      [
                        'Environments',
                        '03',
                        'Development, staging, production',
                      ],
                      ['Service checks', '87', 'Checks ready for review'],
                      ['Recent runs', '12', 'Pipeline runs and build logs'],
                      ...(profile === 'wide'
                        ? [['Clusters', '03', 'Comparison by cluster']]
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
                    <p>
                      Documentation and operational tools share one design
                      language but differ in information density. Documentation
                      favors sentence flow and the rhythm of long-form reading.
                    </p>
                    <h4>How services move between environments</h4>
                    <p>
                      Review service permissions with the deployment policy.
                      Korean text uses Pretendard and Latin text uses Manrope.
                      Identifiers such as <code>environment_id</code> use a
                      monospace font.
                    </p>
                    <p>
                      Read the policy, check the release notes, and confirm who
                      can deploy. This preview keeps the reading measure
                      separate from the workspace width.
                    </p>
                  </Prose>
                )}
              </Stack>
            </Container>
          </div>
          <div className='foundation-widths'>
            <Text variant='caption' color='muted'>
              Reading 52rem / Workspace 75rem / Wide 96rem / Base grid 4 / 6 /
              12 columns / Gutter 16 / 24px
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
            {view === 'all' ? 'Typography' : 'Specimens and scale'}
          </h2>
          <Text color='secondary'>
            Manrope / Pretendard / JetBrains Mono. Use weights 400 and 500.
            Choose the visual role and the HTML heading level separately.
            Antialiasing, kerning, and optical sizing hints apply everywhere.
            Faux bold is never synthesized. Actual rendering varies by browser
            and display.
          </Text>
          <div className='font-specimens'>
            <Surface>
              <Stack gap={3}>
                <Text variant='caption' color='muted'>
                  Display / Manrope + Pretendard / English and Korean sample
                </Text>
                <Heading level={3} size='display'>
                  Platform engineering
                  <br />
                  <span lang='ko'>플랫폼 개발의 공통 언어</span>
                </Heading>
                <Text variant='caption'>40/48 → 32/38.4px</Text>
              </Stack>
            </Surface>
            <Surface>
              <Stack gap={3}>
                <Text variant='caption' color='muted'>
                  Body / Manrope + Pretendard / English and Korean sample
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
              Size headings by role: 30–40px for primary screen titles, 24/32px
              for page titles, and 32–40px for reading-focused titles. Shared
              role and profile tokens connect them without forcing one size on
              every heading. The samples below mix Korean (Hangul) and English
              to show both scripts at each size.
            </Text>
          </Surface>
          <div className='type-scale' aria-label='Typography roles'>
            {[
              ['Title', '32 / 40', 'title', 'Service overview'],
              ['Page', '24 / 32', 'page', 'Deployment details'],
              ['Section', '20 / 28', 'section', 'Release policy'],
              ['Subsection', '16 / 24', 'subsection', 'Build logs'],
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
              ['Body', '14 / 22', 'body'],
              ['Reading', '16 / 28', 'reading'],
              ['Table', '13 / 20', 'table'],
              ['Caption', '12 / 18', 'caption'],
              ['Code', '13 / 20', 'mono'],
              ['Metric', '24 / 28', 'metric'],
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
