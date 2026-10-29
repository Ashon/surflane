import React, { useEffect, useRef, useState } from 'react'
import { lazy } from './lazy'
import { Inline, StatusBadge, Table } from '@surflane/ui'
import { CatalogCodeBlock as CodeBlock } from './CatalogCodeBlock'
import { Link } from './router'
import { contrastRatio } from './contrast'
import { DeferredContent, useLive } from './DeferredContent'
import { FoundationPage, FoundationSection } from './FoundationPage'

// The lab and its color math load as their own chunk and render after the page.
const PaletteLab = lazy(() =>
  import('./PaletteLab').then((module) => ({ default: module.PaletteLab })),
)
import { useLocale } from './i18n'
import {
  text,
  type Direction,
  type PairGroupId,
  type SwatchKind,
  type Tone,
} from './i18n/pages/ColorFoundation'

type Measurement = {
  ratio: number | null
  foreground: string
  background: string
}
type Pair = [name: string, foreground: string, background: string]
type PairGroup = { id: PairGroupId; threshold: 4.5 | 3; pairs: Pair[] }
const tones: Tone[] = [
  'neutral',
  'info',
  'success',
  'danger',
  'caution',
  'progress',
]
const syntaxRoles = [
  'plain',
  'comment',
  'keyword',
  'string',
  'number',
  'function',
  'tag',
  'attribute',
  'punctuation',
]

/** A token drawn in one theme, whatever theme the page is in: a fill, a text color
 * on the surface it belongs to, or a line around that surface. */
function Swatch({
  token,
  kind,
  on = '--surf-canvas',
  theme,
}: {
  token: string
  kind: SwatchKind
  on?: string
  theme: 'light' | 'dark'
}) {
  return (
    <span
      className='color-chip'
      data-theme={theme}
      data-kind={kind}
      aria-hidden='true'
      style={
        {
          '--swatch': `var(${token})`,
          '--swatch-on': `var(${on})`,
        } as React.CSSProperties
      }
    >
      <span>{kind === 'text' ? 'Aa' : null}</span>
    </span>
  )
}
function SwatchPair(props: { token: string; kind: SwatchKind; on?: string }) {
  return (
    <span className='color-chip-pair'>
      <Swatch {...props} theme='light' />
      <Swatch {...props} theme='dark' />
    </span>
  )
}
function TokenLink({ token }: { token: string }) {
  return (
    <Link href={`/tokens?q=${encodeURIComponent(token)}`}>
      <code>{token}</code>
    </Link>
  )
}

export function ColorFoundation() {
  const live = useLive()
  const t = text[useLocale().locale]
  const groups: PairGroup[] = [
    {
      id: 'text',
      threshold: 4.5,
      pairs: [
        [t.title, '--surf-ink', '--surf-canvas'],
        [t.body, '--surf-ink-body', '--surf-canvas'],
        [t.secondaryText, '--surf-ink-muted', '--surf-canvas'],
        [t.insetContent, '--surf-ink-body', '--surf-surface'],
        [t.chromeText, '--surf-ink-body', '--surf-chrome'],
        [t.selectedContent, '--surf-ink', '--surf-selected'],
        [t.errorTextOnSelection, '--surf-status-danger-fg', '--surf-selected'],
        [t.brandAction, '--surf-on-brand', '--surf-brand'],
        [t.brandTextLink, '--surf-brand-ink', '--surf-canvas'],
        [
          t.textSelection,
          '--surf-selection-foreground',
          '--surf-selection-background',
        ],
        [t.tooltip, '--surf-tooltip-foreground', '--surf-tooltip-background'],
      ],
    },
    {
      id: 'status',
      threshold: 4.5,
      pairs: [
        ...tones.map((tone): Pair => [
          t.status(tone),
          `--surf-status-${tone}-fg`,
          `--surf-status-${tone}-bg`,
        ]),
        ...tones.map((tone): Pair => [
          t.badge(tone),
          `--surf-status-${tone}-fg`,
          `--surf-badge-${tone}-bg`,
        ]),
      ],
    },
    {
      id: 'trend',
      threshold: 4.5,
      pairs: (['up', 'down'] as const).flatMap((direction): Pair[] => [
        [t.trend(direction), `--surf-trend-${direction}-fg`, '--surf-canvas'],
        [
          t.trendSurface(direction),
          `--surf-trend-${direction}-fg`,
          `--surf-trend-${direction}-bg`,
        ],
      ]),
    },
    {
      id: 'controlText',
      threshold: 4.5,
      pairs: [
        [t.inputText, '--surf-ink', '--surf-control-background'],
        [
          t.inputPlaceholder,
          '--surf-control-placeholder',
          '--surf-control-background',
        ],
        [t.focusedInputText, '--surf-ink', '--surf-control-focus-background'],
      ],
    },
    {
      id: 'controlEdges',
      threshold: 3,
      pairs: [
        [
          t.choiceMark,
          '--surf-control-choice-selected-fg',
          '--surf-control-choice-selected-bg',
        ],
        [
          t.choiceHoverMark,
          '--surf-control-choice-selected-fg',
          '--surf-control-choice-selected-hover-bg',
        ],
        [t.inputBoundary, '--surf-control-border', '--surf-canvas'],
        [
          t.inputBoundaryInside,
          '--surf-control-border',
          '--surf-control-background',
        ],
        [t.inputHoverBoundary, '--surf-control-hover-border', '--surf-canvas'],
        [t.inputFocusOutside, '--surf-control-focus', '--surf-canvas'],
        [
          t.inputFocusInside,
          '--surf-control-focus',
          '--surf-control-focus-background',
        ],
        [t.choiceBoundary, '--surf-control-choice-border', '--surf-canvas'],
        [
          t.choiceHoverBoundary,
          '--surf-control-choice-hover-border',
          '--surf-canvas',
        ],
        [
          t.choiceSelectedBoundary,
          '--surf-control-choice-selected-border',
          '--surf-canvas',
        ],
        [t.errorBoundary, '--surf-status-danger-fg', '--surf-canvas'],
        [t.progressFill, '--surf-brand-mark', '--surf-surface'],
        [t.progressFillSheet, '--surf-brand-mark', '--surf-canvas'],
        ...(['success', 'danger', 'caution', 'info', 'neutral'] as const).map(
          (tone): Pair => [
            t.statusBorder(tone),
            `--surf-status-${tone}-border`,
            '--surf-canvas',
          ],
        ),
      ],
    },
    {
      id: 'charts',
      threshold: 3,
      pairs: [
        ...[1, 2, 3].map((index): Pair => [
          t.chartSeries(index),
          `--surf-chart-series-${index}`,
          '--surf-canvas',
        ]),
        ...Array.from({ length: 12 }, (_, index) => index + 1).map(
          (index): Pair => [
            t.chartCategory(index),
            `--surf-chart-category-${index}`,
            '--surf-canvas',
          ],
        ),
      ],
    },
    {
      id: 'syntax',
      threshold: 4.5,
      pairs: syntaxRoles.map((role): Pair => [
        t.syntax(role),
        `--surf-syntax-${role}`,
        '--surf-code-bg',
      ]),
    },
  ]
  const pairCount = groups.reduce((sum, group) => sum + group.pairs.length, 0)
  const root = useRef<HTMLDivElement>(null)
  const [measurements, setMeasurements] = useState<Record<string, Measurement>>(
    {},
  )
  const [forcedColors, setForcedColors] = useState(false)
  useEffect(() => {
    const forced = matchMedia('(forced-colors: active)')
    const update = () => {
      setForcedColors(forced.matches)
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 1
      const context = canvas.getContext('2d', { willReadFrequently: true })
      const pixel = (color: string) => {
        if (!context || !CSS.supports('color', color)) return null
        context.clearRect(0, 0, 1, 1)
        context.fillStyle = color
        context.fillRect(0, 0, 1, 1)
        const rgba = Array.from(context.getImageData(0, 0, 1, 1).data)
        return rgba[3] === 255 ? rgba : null
      }
      setMeasurements(
        Object.fromEntries(
          Array.from(
            root.current?.querySelectorAll<HTMLElement>('[data-color-pair]') ??
              [],
          ).map((element) => {
            const style = getComputedStyle(element)
            const a = pixel(style.color),
              b = pixel(style.backgroundColor)
            return [
              element.dataset.colorPair ?? '',
              {
                foreground: style.color,
                background: style.backgroundColor,
                ratio: a && b && !forced.matches ? contrastRatio(a, b) : null,
              },
            ]
          }),
        ),
      )
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'style'],
    })
    forced.addEventListener('change', update)
    const scheme = matchMedia('(prefers-color-scheme: dark)')
    scheme.addEventListener('change', update)
    return () => {
      observer.disconnect()
      forced.removeEventListener('change', update)
      scheme.removeEventListener('change', update)
    }
  }, [])
  return (
    <FoundationPage
      principles={t.principles}
      sections={t.sections}
      related={[
        '/foundations/hierarchy',
        '/foundations/themes',
        '/foundations/interaction',
        '/tokens',
      ]}
    >
      <FoundationSection id='roles'>
        <p>
          {t.rolesIntro} <Link href='/tokens'>{t.tokensLink}</Link>
          {t.rolesIntroEnd}
        </p>
        {t.roleGroups.map((group) => (
          <div key={group.id} className='color-group'>
            <h3>{group.title}</h3>
            <Table.Container label={group.title} orientation='horizontal'>
              <Table.Root density='compact' className='color-table'>
                <Table.Head>
                  <Table.Row>
                    {t.roleColumns.map((label) => (
                      <Table.HeaderCell key={label} scope='col'>
                        {label}
                      </Table.HeaderCell>
                    ))}
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {group.rows.map(([token, kind, use, on]) => (
                    <Table.Row key={token}>
                      <Table.Cell>
                        <Swatch
                          token={token}
                          kind={kind}
                          on={on}
                          theme='light'
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Swatch
                          token={token}
                          kind={kind}
                          on={on}
                          theme='dark'
                        />
                      </Table.Cell>
                      <Table.HeaderCell scope='row'>
                        <TokenLink token={token} />
                      </Table.HeaderCell>
                      <Table.Cell>{use}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.Container>
          </div>
        ))}
        <div className='color-group'>
          <h3>{t.statusTitle}</h3>
          <Table.Container label={t.statusTitle} orientation='horizontal'>
            <Table.Root density='compact' className='color-table'>
              <Table.Head>
                <Table.Row>
                  {t.statusColumns.map((label, index) => (
                    <Table.HeaderCell key={label} scope='col'>
                      {index ? <code>{label}</code> : label}
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {tones.map((tone) => (
                  <Table.Row key={tone}>
                    <Table.HeaderCell scope='row'>
                      {t.tones[tone]}
                    </Table.HeaderCell>
                    <Table.Cell>
                      <SwatchPair
                        token={`--surf-status-${tone}-fg`}
                        kind='text'
                        on={`--surf-status-${tone}-bg`}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <SwatchPair
                        token={`--surf-status-${tone}-bg`}
                        kind='fill'
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <SwatchPair
                        token={`--surf-badge-${tone}-bg`}
                        kind='fill'
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.Container>
        </div>
        <div className='color-group'>
          <h3>{t.trendTitle}</h3>
          <Table.Container label={t.trendTitle} orientation='horizontal'>
            <Table.Root density='compact' className='color-table'>
              <Table.Head>
                <Table.Row>
                  {t.trendColumns.map((label, index) => (
                    <Table.HeaderCell key={label} scope='col'>
                      {index ? <code>{label}</code> : label}
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {(['up', 'down', 'flat'] as Direction[]).map((direction) => (
                  <Table.Row key={direction}>
                    <Table.HeaderCell scope='row'>
                      {t.directions[direction]}
                    </Table.HeaderCell>
                    <Table.Cell>
                      <SwatchPair
                        token={`--surf-trend-${direction}-fg`}
                        kind='text'
                        on={
                          direction === 'flat'
                            ? '--surf-canvas'
                            : `--surf-trend-${direction}-bg`
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {direction === 'flat' ? (
                        '—'
                      ) : (
                        <SwatchPair
                          token={`--surf-trend-${direction}-bg`}
                          kind='fill'
                        />
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.Container>
          <p>{t.trendNote}</p>
        </div>
        <div className='color-group'>
          <h3>{t.chartTitle}</h3>
          <Table.Container label={t.chartTitle} orientation='horizontal'>
            <Table.Root density='compact' className='color-table'>
              <Table.Head>
                <Table.Row>
                  {t.chartColumns.map((label) => (
                    <Table.HeaderCell key={label} scope='col'>
                      {label}
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {(
                  [
                    ['series', 3],
                    ['categories', 12],
                  ] as const
                ).map(([set, count]) => {
                  const prefix =
                    set === 'series' ? '--chart-series-' : '--chart-category-'
                  const tokens = Array.from(
                    { length: count },
                    (_, index) => `${prefix}${index + 1}`,
                  )
                  return (
                    <Table.Row key={set}>
                      <Table.HeaderCell scope='row'>
                        {t.chartSets[set]}
                      </Table.HeaderCell>
                      {(['light', 'dark'] as const).map((theme) => (
                        <Table.Cell key={theme}>
                          <span className='color-chip-strip'>
                            {tokens.map((token) => (
                              <Swatch
                                key={token}
                                token={token}
                                kind='fill'
                                theme={theme}
                              />
                            ))}
                          </span>
                        </Table.Cell>
                      ))}
                      <Table.Cell>
                        <code>
                          {prefix}1…{count}
                        </code>
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table.Root>
          </Table.Container>
          <p>{t.chartNote}</p>
        </div>
        <p>{t.codeIntro}</p>
        <CodeBlock
          language='css'
          label={t.codeExampleLabel}
          code={
            '.resource-summary {\n  color: var(--surf-ink-body);\n  background: var(--surf-surface);\n}\n.resource-summary a {\n  color: var(--surf-brand-ink);\n  text-decoration: underline;\n}'
          }
        />
      </FoundationSection>
      <FoundationSection id='contrast'>
        <p>{t.contrastThresholds}</p>
        <p>{t.contrastSurfaces}</p>
        <p>{t.contrastMethod}</p>
        {forcedColors && <p role='status'>{t.forcedColorsStatus}</p>}
        <div
          ref={root}
          data-color-measured={
            Object.keys(measurements).length === pairCount || undefined
          }
        >
          {groups.map((group) => (
            <div key={group.id} className='color-group'>
              <h3>
                {t.groups[group.id]}{' '}
                <span className='color-group-minimum'>
                  {t.minimum(group.threshold)}
                </span>
              </h3>
              <Table.Container
                label={t.groups[group.id]}
                orientation='horizontal'
              >
                <Table.Root density='compact' className='color-table'>
                  <Table.Head>
                    <Table.Row>
                      {t.pairColumns.map((label, index) => (
                        <Table.HeaderCell
                          key={label}
                          scope='col'
                          numeric={index === 3}
                        >
                          {label}
                        </Table.HeaderCell>
                      ))}
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {group.pairs.map(([name, foreground, background]) => {
                      const value = measurements[name]
                      return (
                        <Table.Row
                          key={name}
                          data-color-row={name}
                          data-color-threshold={group.threshold}
                        >
                          <Table.HeaderCell scope='row'>
                            <span className='color-pair'>
                              <span
                                className='color-pair-chip'
                                aria-hidden='true'
                                data-color-pair={name}
                                data-kind={
                                  group.threshold === 3 ? 'mark' : 'text'
                                }
                                style={{
                                  color: `var(${foreground})`,
                                  backgroundColor: `var(${background})`,
                                }}
                              >
                                {group.threshold === 3 ? <span /> : 'Aa'}
                              </span>
                              {name}
                            </span>
                          </Table.HeaderCell>
                          <Table.Cell>
                            <TokenLink token={foreground} />
                          </Table.Cell>
                          <Table.Cell>
                            <TokenLink token={background} />
                          </Table.Cell>
                          <Table.Cell numeric>
                            <span data-color-ratio>
                              {value?.ratio != null
                                ? `${value.ratio.toFixed(2)}:1`
                                : t.notEvaluated}
                            </span>
                          </Table.Cell>
                          <Table.Cell data-color-verdict>
                            {value?.ratio != null
                              ? value.ratio >= group.threshold
                                ? t.meetsThreshold
                                : t.reviewRequired
                              : t.notEvaluated}
                          </Table.Cell>
                        </Table.Row>
                      )
                    })}
                  </Table.Body>
                </Table.Root>
              </Table.Container>
            </div>
          ))}
        </div>
        <p data-color-summary>
          {t.summary(
            groups
              .flatMap((group) =>
                group.pairs.map(([name]) => [name, group.threshold] as const),
              )
              .filter(([name, threshold]) => {
                const ratio = measurements[name]?.ratio
                return ratio != null && ratio >= threshold
              }).length,
            pairCount,
          )}
        </p>
        <p>
          <a href='https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html'>
            {t.wcagTextContrast}
          </a>
          {' / '}
          <a href='https://www.w3.org/WAI/WCAG22/understanding/non-text-contrast.html'>
            {t.wcagNonTextContrast}
          </a>
        </p>
      </FoundationSection>
      <FoundationSection id='status'>
        <p>{t.statusIntro}</p>
        <Inline gap={3} role='group' aria-label={t.statusExamplesLabel}>
          <StatusBadge tone='success'>{t.passed}</StatusBadge>
          <StatusBadge tone='danger'>{t.failed}</StatusBadge>
          <StatusBadge tone='caution'>{t.needsReview}</StatusBadge>
          <StatusBadge tone='progress'>{t.running}</StatusBadge>
          <StatusBadge>{t.notStarted}</StatusBadge>
        </Inline>
        <p data-selection-sample>{t.selectionSample}</p>
      </FoundationSection>
      <FoundationSection id='oklch'>
        <p>{t.oklchIntro}</p>
        <Table.Container label={t.oklchLabel} orientation='horizontal'>
          <Table.Root density='compact'>
            <Table.Head>
              <Table.Row>
                {t.oklchColumns.map((label) => (
                  <Table.HeaderCell key={label} scope='col'>
                    {label}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {t.oklchRows.map(([decision, rule, value]) => (
                <Table.Row key={decision}>
                  <Table.HeaderCell scope='row'>{decision}</Table.HeaderCell>
                  <Table.Cell>{rule}</Table.Cell>
                  <Table.Cell>{value}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
      </FoundationSection>
      <FoundationSection id='lab'>
        <p>{t.labIntro}</p>
        {/* The lab reads tokens from the live page, so it loads after hydration. */}
        <DeferredContent scope='preview'>
          {live && <PaletteLab />}
        </DeferredContent>
      </FoundationSection>
    </FoundationPage>
  )
}
