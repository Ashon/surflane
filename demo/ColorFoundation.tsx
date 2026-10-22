import React, { useEffect, useRef, useState } from 'react'
import { Button, CodeBlock, StatusBadge, Table } from '@surflane/ui'
import { Link } from './router'
import { contrastRatio } from './contrast'
import { useLocale } from './i18n'
import { text } from './i18n/pages/ColorFoundation'

type Measurement = {
  ratio: number | null
  foreground: string
  background: string
}
export function ColorFoundation() {
  const t = text[useLocale().locale]
  const pairs: [string, string, string, number][] = [
    ...[
      'plain',
      'comment',
      'keyword',
      'string',
      'number',
      'function',
      'tag',
      'attribute',
      'punctuation',
    ].map((role): [string, string, string, number] => [
      t.syntax(role),
      `--syntax-${role}`,
      '--code-bg',
      4.5,
    ]),
    [t.title, '--ink', '--canvas', 4.5],
    [t.body, '--ink-body', '--canvas', 4.5],
    [t.secondaryText, '--ink-muted', '--canvas', 4.5],
    [t.insetContent, '--ink-body', '--surface', 4.5],
    [t.selectedContent, '--ink', '--selected', 4.5],
    [t.errorTextOnSelection, '--status-danger-fg', '--selected', 4.5],
    [t.brandAction, '--on-brand', '--brand', 4.5],
    [t.brandTextLink, '--brand-ink', '--canvas', 4.5],
    ...['neutral', 'success', 'danger', 'caution', 'progress'].map(
      (tone): [string, string, string, number] => [
        t.status(tone),
        `--status-${tone}-fg`,
        `--status-${tone}-bg`,
        4.5,
      ],
    ),
    ...['neutral', 'success', 'danger', 'caution', 'progress'].map(
      (tone): [string, string, string, number] => [
        t.badge(tone),
        `--status-${tone}-fg`,
        `--badge-${tone}-bg`,
        4.5,
      ],
    ),
    [t.textSelection, '--selection-foreground', '--selection-background', 4.5],
    [t.chromeText, '--ink-body', '--chrome', 4.5],
    [t.inputText, '--ink', '--control-background', 4.5],
    [t.inputPlaceholder, '--control-placeholder', '--control-background', 4.5],
    [t.inputHoverText, '--ink', '--control-hover-background', 4.5],
    [t.focusedInputText, '--ink', '--control-focus-background', 4.5],
    [t.tooltip, '--tooltip-foreground', '--tooltip-background', 4.5],
    [
      t.choiceMark,
      '--control-choice-selected-fg',
      '--control-choice-selected-bg',
      3,
    ],
    [
      t.choiceHoverMark,
      '--control-choice-selected-fg',
      '--control-choice-selected-hover-bg',
      3,
    ],
    [t.inputBoundary, '--control-border', '--canvas', 3],
    [t.inputBoundaryInside, '--control-border', '--control-background', 3],
    [t.inputHoverBoundary, '--control-hover-border', '--canvas', 3],
    [
      t.inputHoverBoundaryInside,
      '--control-hover-border',
      '--control-hover-background',
      3,
    ],
    [t.inputFocusOutside, '--control-focus', '--canvas', 3],
    [t.inputFocusInside, '--control-focus', '--control-focus-background', 3],
    [t.choiceBoundary, '--control-choice-border', '--canvas', 3],
    [t.choiceHoverBoundary, '--control-choice-hover-border', '--canvas', 3],
    [
      t.choiceSelectedBoundary,
      '--control-choice-selected-border',
      '--canvas',
      3,
    ],
    [t.errorBoundary, '--status-danger-fg', '--canvas', 3],
    ...[1, 2, 3].map((index): [string, string, string, number] => [
      t.chartSeries(index),
      `--chart-series-${index}`,
      '--canvas',
      3,
    ]),
  ]
  const root = useRef<HTMLDivElement>(null)
  const [measurements, setMeasurements] = useState<Measurement[]>([])
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
        Array.from(
          root.current?.querySelectorAll<HTMLElement>('[data-color-pair]') ??
            [],
        ).map((element) => {
          const style = getComputedStyle(element)
          const a = pixel(style.color),
            b = pixel(style.backgroundColor)
          return {
            foreground: style.color,
            background: style.backgroundColor,
            ratio: a && b && !forced.matches ? contrastRatio(a, b) : null,
          }
        }),
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
    <>
      <nav className='page-toc' aria-label={t.onThisPage}>
        {t.nav.map(({ id, label }) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>
      <section id='roles'>
        <h2>{t.rolesHeading}</h2>
        <p>{t.rolesIntro}</p>
        <dl className='color-role-list'>
          <div>
            <dt>{t.surfaceRole}</dt>
            <dd>
              {t.surfaceUse} <code>--chrome</code>
              {t.surfaceChromeRest} <code>--canvas</code>
              {t.surfaceCanvasRest} <code>--surface</code>
              {t.surfaceSurfaceRest}
            </dd>
          </div>
          <div>
            <dt>{t.textRole}</dt>
            <dd>
              {t.textUse} <code>--ink</code>
              {t.textInkRest} <code>--ink-body</code>
              {t.textInkBodyRest} <code>--ink-muted</code>
              {t.textInkMutedRest}
            </dd>
          </div>
          <div>
            <dt>{t.brandRole}</dt>
            <dd>
              <code>--brand</code>
              {t.brandFills} <code>--on-brand</code>
              {t.brandOnIt} <code>--brand-ink</code>
              {t.brandInkRest}
            </dd>
          </div>
          <div>
            <dt>{t.boundaryRole}</dt>
            <dd>
              <code>--line</code>
              {t.boundaryLineRest} <code>--control-border</code>
              {t.boundaryBorderRest} <code>--control-focus</code>
              {t.boundaryFocusRest}
            </dd>
          </div>
        </dl>
      </section>
      <section id='contrast'>
        <h2>{t.contrastHeading}</h2>
        <p>{t.contrastIntro}</p>
        <p>{t.contrastSteps}</p>
        <p>{t.contrastThresholds}</p>
        <p>{t.contrastApprox}</p>
        {forcedColors && <p role='status'>{t.forcedColorsStatus}</p>}
        <div
          ref={root}
          data-color-measured={
            measurements.length === pairs.length || undefined
          }
        >
          <Table.Container
            bleed
            label={t.contrastTableLabel}
            orientation='horizontal'
          >
            <Table.Root>
              <Table.Caption>{t.contrastTableCaption}</Table.Caption>
              <Table.Head>
                <Table.Row>
                  {t.columns.map((label) => (
                    <Table.HeaderCell key={label} scope='col'>
                      {label}
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {pairs.map(
                  ([name, foreground, background, threshold], index) => {
                    const value = measurements[index]
                    return (
                      <Table.Row
                        key={name}
                        data-color-row={name}
                        data-color-threshold={threshold}
                      >
                        <Table.HeaderCell scope='row'>{name}</Table.HeaderCell>
                        <Table.Cell>
                          <span
                            className='color-pair-swatch'
                            aria-hidden='true'
                            data-color-pair
                            style={{
                              color: `var(${foreground})`,
                              backgroundColor: `var(${background})`,
                            }}
                          >
                            <span />
                          </span>
                          <div>
                            <Link
                              href={`/tokens?q=${encodeURIComponent(foreground)}`}
                            >
                              <code>{foreground}</code>
                            </Link>
                          </div>
                          <div>
                            <Link
                              href={`/tokens?q=${encodeURIComponent(background)}`}
                            >
                              <code>{background}</code>
                            </Link>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <span data-color-ratio>
                            {value?.ratio != null
                              ? `${value.ratio.toFixed(2)}:1`
                              : t.notEvaluated}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          {threshold === 4.5
                            ? t.textThreshold
                            : t.nonTextThreshold}
                        </Table.Cell>
                        <Table.Cell data-color-verdict>
                          {value?.ratio != null
                            ? value.ratio >= threshold
                              ? t.meetsThreshold
                              : t.reviewRequired
                            : t.notEvaluated}
                        </Table.Cell>
                      </Table.Row>
                    )
                  },
                )}
              </Table.Body>
            </Table.Root>
          </Table.Container>
        </div>
        <p data-color-summary>
          {t.summary(
            measurements.filter(
              (value, index) =>
                value.ratio != null && value.ratio >= pairs[index][3],
            ).length,
            pairs.length,
          )}
        </p>
        <p>{t.indicatorContrast}</p>
        <p>
          <a href='https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html'>
            {t.wcagTextContrast}
          </a>
          {' / '}
          <a href='https://www.w3.org/WAI/WCAG22/understanding/non-text-contrast.html'>
            {t.wcagNonTextContrast}
          </a>
        </p>
      </section>
      <section id='states'>
        <h2>{t.statesHeading}</h2>
        <p>{t.statesIntro}</p>
        <p data-selection-sample>{t.selectionSample}</p>
        <p>{t.statusIndicators}</p>
        <div
          className='actions'
          role='group'
          aria-label={t.statusExamplesLabel}
        >
          <StatusBadge tone='success'>{t.passed}</StatusBadge>
          <StatusBadge tone='danger'>{t.failed}</StatusBadge>
          <StatusBadge tone='caution'>{t.needsReview}</StatusBadge>
          <StatusBadge tone='progress'>{t.running}</StatusBadge>
          <StatusBadge>{t.notStarted}</StatusBadge>
        </div>
        <div className='actions'>
          <Button
            onClick={() =>
              document.getElementById('contrast')?.scrollIntoView()
            }
          >
            {t.inspectContrast}
          </Button>
          <Link href='/components/badge'>{t.badgeUsage}</Link>
        </div>
        <p>{t.staticStatusesNote}</p>
      </section>
      <section id='application'>
        <h2>{t.applicationHeading}</h2>
        <ul>
          <li>{t.tipStatusResults}</li>
          <li>{t.tipSelection}</li>
          <li>{t.tipLinks}</li>
        </ul>
        <CodeBlock
          language='css'
          label={t.codeExampleLabel}
          code={
            '.resource-summary {\n  color: var(--ink-body);\n  background: var(--surface);\n}\n.resource-summary a {\n  color: var(--brand-ink);\n  text-decoration: underline;\n}'
          }
        />
        <p>
          {t.applyFooterStart}{' '}
          <Link href='/tokens?q=--ink'>{t.tokenBrowserLink}</Link>
          {t.applyFooterMid}{' '}
          <Link href='/components/inline-message'>{t.inlineMessageLink}</Link>
          {t.applyFooterEnd}
        </p>
      </section>
    </>
  )
}
