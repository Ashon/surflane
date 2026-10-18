import React, { useEffect, useRef, useState } from 'react'
import { Button, CodeBlock, StatusBadge, Table } from '@surflane/ui'
import { Link } from './router'
import { contrastRatio } from './contrast'

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
    `Syntax: ${role}`,
    `--syntax-${role}`,
    '--code-bg',
    4.5,
  ]),
  ['Title', '--ink', '--canvas', 4.5],
  ['Body', '--ink-body', '--canvas', 4.5],
  ['Secondary text', '--ink-muted', '--canvas', 4.5],
  ['Inset content', '--ink-body', '--surface', 4.5],
  ['Selected content', '--ink', '--selected', 4.5],
  ['Brand action', '--on-brand', '--brand', 4.5],
  ['Brand text / link', '--brand-ink', '--canvas', 4.5],
  ...['neutral', 'success', 'danger', 'caution', 'progress'].map(
    (tone): [string, string, string, number] => [
      `Status: ${tone}`,
      `--status-${tone}-fg`,
      `--status-${tone}-bg`,
      4.5,
    ],
  ),
  ...['neutral', 'success', 'danger', 'caution', 'progress'].map(
    (tone): [string, string, string, number] => [
      `Badge: ${tone}`,
      `--status-${tone}-fg`,
      `--badge-${tone}-bg`,
      4.5,
    ],
  ),
  ['Text selection', '--selection-foreground', '--selection-background', 4.5],
  ['Chrome text', '--ink-body', '--chrome', 4.5],
  ['Input text', '--ink', '--control-background', 4.5],
  ['Input placeholder', '--control-placeholder', '--control-background', 4.5],
  ['Input hover text', '--ink', '--control-hover-background', 4.5],
  ['Focused input text', '--ink', '--control-focus-background', 4.5],
  ['Tooltip', '--tooltip-foreground', '--tooltip-background', 4.5],
  [
    'Choice mark',
    '--control-choice-selected-fg',
    '--control-choice-selected-bg',
    3,
  ],
  [
    'Choice hover mark',
    '--control-choice-selected-fg',
    '--control-choice-selected-hover-bg',
    3,
  ],
  ['Input boundary', '--control-border', '--canvas', 3],
  ['Input boundary / inside', '--control-border', '--control-background', 3],
  ['Input hover boundary', '--control-hover-border', '--canvas', 3],
  [
    'Input hover boundary / inside',
    '--control-hover-border',
    '--control-hover-background',
    3,
  ],
  ['Input focus / outside', '--control-focus', '--canvas', 3],
  ['Input focus / inside', '--control-focus', '--control-focus-background', 3],
  ['Choice boundary', '--control-choice-border', '--canvas', 3],
  ['Choice hover boundary', '--control-choice-hover-border', '--canvas', 3],
  [
    'Choice selected boundary',
    '--control-choice-selected-border',
    '--canvas',
    3,
  ],
  ['Error boundary', '--status-danger-fg', '--canvas', 3],
  ...[1, 2, 3].map((index): [string, string, string, number] => [
    `Chart series ${index}`,
    `--chart-series-${index}`,
    '--canvas',
    3,
  ]),
]
type Measurement = {
  ratio: number | null
  foreground: string
  background: string
}
export function ColorFoundation() {
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
      <nav className='page-toc' aria-label='On this page'>
        {['roles', 'contrast', 'states', 'application'].map((id) => (
          <a key={id} href={`#${id}`}>
            {id[0].toUpperCase() + id.slice(1)}
          </a>
        ))}
      </nav>
      <section id='roles'>
        <h2>Semantic roles</h2>
        <p>
          Reference roles, not color names. The same token name resolves to a
          readable combination in both the light and dark themes.
        </p>
        <dl className='color-role-list'>
          <div>
            <dt>Surface</dt>
            <dd>
              <code>--chrome</code> is for the outer app, <code>--canvas</code>{' '}
              for content, and <code>--surface</code> for inner surfaces such as
              code and lists. Don't keep adding nested cards.
            </dd>
          </div>
          <div>
            <dt>Text</dt>
            <dd>
              <code>--ink</code> is for headings, <code>--ink-body</code> for
              body text, and <code>--ink-muted</code> for descriptions.
              Descriptions also keep readable contrast.
            </dd>
          </div>
          <div>
            <dt>Brand</dt>
            <dd>
              <code>--brand</code> is the surface of primary actions, and{' '}
              <code>--on-brand</code> is the text on it. In the light theme,
              don't use green for small text on a white background. Links use{' '}
              <code>--brand-ink</code> together with an underline.
            </dd>
          </div>
          <div>
            <dt>Boundary</dt>
            <dd>
              <code>--line</code> is a decorative divider. Parts that identify
              controls, such as input boundaries and focus, use{' '}
              <code>--control-border</code> and <code>--control-focus</code> and
              are checked separately against adjacent surfaces.
            </dd>
          </div>
        </dl>
      </section>
      <section id='contrast'>
        <h2>Live color contrast</h2>
        <p>
          OKLCH is used to express and transition colors; contrast is calculated
          from WCAG relative luminance in linear sRGB. Changing the color model
          does not change the contrast criteria.
        </p>
        <p>
          Ratios are approximations from the current theme's computed colors,
          converted to 8-bit sRGB pixels. The threshold is 4.5:1 for normal text
          and 3:1 for large text. Large text is at least 18pt (24 CSS px), or at
          least 14pt (about 18.67 CSS px) when bold; text rows are compared
          against the normal-text threshold. Rows for input boundaries, focus
          borders, and selection marks are compared at 3:1 against the adjacent
          color.
        </p>
        <p>
          Displayed ratios are rounded to two decimal places, but results use
          the unrounded value. This does not evaluate transparent colors,
          gradients, images, ancestor opacity, overlap, anti-aliasing, or every
          interaction state. Recheck borderline values and real products with a
          separate tool.
        </p>
        {forcedColors && (
          <p role='status'>
            Forced colors mode is active. The user's system colors take
            precedence, and token contrast checks are skipped.
          </p>
        )}
        <div
          ref={root}
          data-color-measured={
            measurements.length === pairs.length || undefined
          }
        >
          <Table.Container
            label='Semantic color contrast'
            orientation='horizontal'
          >
            <Table.Root>
              <Table.Caption>
                Text, control boundaries, and status indicators in the current
                theme
              </Table.Caption>
              <Table.Head>
                <Table.Row>
                  {[
                    'Role',
                    'Foreground / background',
                    'Approx. ratio',
                    'Requirement',
                    'Result',
                  ].map((label) => (
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
                              : 'Not evaluated'}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          {threshold === 4.5
                            ? 'Text / 4.5:1'
                            : 'Non-text / 3:1'}
                        </Table.Cell>
                        <Table.Cell data-color-verdict>
                          {value?.ratio != null
                            ? value.ratio >= threshold
                              ? 'Meets threshold'
                              : 'Review required'
                            : 'Not evaluated'}
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
          {
            measurements.filter(
              (value, index) =>
                value.ratio != null && value.ratio >= pairs[index][3],
            ).length
          }{' '}
          / {pairs.length} combinations meet their threshold. Forced colors and
          unsupported colors are excluded from the results.
        </p>
        <p>
          Check that control boundaries, and the required icons or lines that
          identify state, reach at least 3:1 against adjacent colors. Don't
          apply the same rule wholesale to decorative dividers, secondary badge
          surfaces, or disabled controls. Compare each state's indicator with
          its adjacent surface, not the colors before and after hover with each
          other. The faint outer glow on focus is a secondary effect; the solid
          border is what identifies focus.
        </p>
        <p>
          <a href='https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html'>
            WCAG 1.4.3 — Text contrast
          </a>
          {' / '}
          <a href='https://www.w3.org/WAI/WCAG22/understanding/non-text-contrast.html'>
            WCAG 1.4.11 — Non-text contrast
          </a>
        </p>
      </section>
      <section id='states'>
        <h2>State beyond color</h2>
        <p>
          Text selection pairs an opaque neutral gray surface with a text color,
          both tuned to the theme. Drag to select the sentence below. This keeps
          a translucent highlight from overlapping body, code, or status
          surfaces and changing the contrast.
        </p>
        <p data-selection-sample>
          Selected text stays comfortable to read. It stays readable across
          surfaces.
        </p>
        <p>
          Status combines a label, an SVG icon, and position. Instead of
          accenting only one side of a rounded surface, use the full border and
          background. Brand actions and success states are also told apart by
          context and wording.
        </p>
        <div
          className='actions'
          role='group'
          aria-label='Semantic status examples'
        >
          <StatusBadge tone='success'>Passed</StatusBadge>
          <StatusBadge tone='danger'>Failed</StatusBadge>
          <StatusBadge tone='caution'>Needs review</StatusBadge>
          <StatusBadge tone='progress'>Running</StatusBadge>
          <StatusBadge>Not started</StatusBadge>
        </div>
        <div className='actions'>
          <Button
            onClick={() =>
              document.getElementById('contrast')?.scrollIntoView()
            }
          >
            Inspect contrast
          </Button>
          <Link href='/components/badge'>Badge usage and API</Link>
        </div>
        <p>
          These statuses are static examples. Announce real asynchronous results
          once, where they are needed, and keep errors and recovery actions in
          the page content.
        </p>
      </section>
      <section id='application'>
        <h2>Apply semantic color roles</h2>
        <ul>
          <li>
            Show task results with a status name and an icon, along with the
            reason for a failure and a recovery action.
          </li>
          <li>
            Distinguish data status from user selection. Express selection with
            checkboxes or a selected surface, and actions with clear buttons.
          </li>
          <li>
            Keep underlines on links in body text, and ensure readable contrast
            for code and secondary descriptions too.
          </li>
        </ul>
        <CodeBlock
          language='css'
          label='Semantic color example'
          code={
            '.resource-summary {\n  color: var(--ink-body);\n  background: var(--surface);\n}\n.resource-summary a {\n  color: var(--brand-ink);\n  text-decoration: underline;\n}'
          }
        />
        <p>
          Don't copy color values into products. See the{' '}
          <Link href='/tokens?q=--ink'>token browser</Link> and{' '}
          <Link href='/components/inline-message'>Inline message</Link> for the
          actual tokens and usage examples.
        </p>
      </section>
    </>
  )
}
