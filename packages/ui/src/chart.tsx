'use client'
import * as React from 'react'
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type DotProps,
} from 'recharts'
import { Table } from './data.js'
import { Button } from './button.js'

export type ChartDatum = {
  id: string
  label: string
  values: Readonly<Record<string, number | null | undefined>>
}
export type ChartSeries = { key: string; label: string }
export type ChartProps = Omit<
  React.ComponentPropsWithoutRef<'figure'>,
  'children' | 'title'
> & {
  title: string
  description: string
  data: readonly ChartDatum[]
  series: readonly ChartSeries[]
  unit: string
  xLabel: string
  yLabel: string
  type?: 'line' | 'bar' | 'area'
  height?: number
  locale?: string
  formatValue?: (value: number) => string
  missingLabel?: string
  emptyLabel?: string
  hiddenSeries?: readonly string[]
  defaultHiddenSeries?: readonly string[]
  onHiddenSeriesChange?: (keys: string[]) => void
}
const dashes = [undefined, '7 4', '2 4', '10 3 2 3', '12 5', '4 3']
const colorFor = (index: number) => `var(--chart-series-${(index % 3) + 1})`
function Marker({
  cx,
  cy,
  color,
  index,
}: Pick<DotProps, 'cx' | 'cy'> & { color: string; index: number }) {
  if (
    typeof cx !== 'number' ||
    typeof cy !== 'number' ||
    !Number.isFinite(cx) ||
    !Number.isFinite(cy)
  )
    return null
  const props = { fill: 'var(--canvas)', stroke: color, strokeWidth: 1.8 }
  return index % 3 === 0 ? (
    <circle cx={cx} cy={cy} r={3.5} {...props} />
  ) : index % 3 === 1 ? (
    <rect x={cx - 3.5} y={cy - 3.5} width={7} height={7} {...props} />
  ) : (
    <path d={`M${cx},${cy - 4.5}l4.5,8h-9Z`} {...props} />
  )
}
function Pattern({
  id,
  index,
  color,
}: {
  id: string
  index: number
  color: string
}) {
  return (
    <pattern id={id} patternUnits='userSpaceOnUse' width='8' height='8'>
      <rect width='8' height='8' fill={color} />
      {index % 3 === 1 ? (
        <path
          d='M-2 2L2-2M0 8L8 0M6 10L10 6'
          stroke='var(--canvas)'
          strokeWidth='1.5'
        />
      ) : index % 3 === 2 ? (
        <circle cx='4' cy='4' r='1.4' fill='var(--canvas)' />
      ) : null}
    </pattern>
  )
}

/** Cartesian trends with a persistent, keyboard-readable tooltip region and a
 * full data-table alternative. Missing values are gaps, never fabricated zeros. */
export const Chart = /* @__PURE__ */ React.forwardRef<HTMLElement, ChartProps>(
  function Chart(
    {
      title,
      description,
      data,
      series,
      unit,
      xLabel,
      yLabel,
      type = 'line',
      height = 280,
      locale = 'en-US',
      formatValue,
      missingLabel = 'Not available',
      emptyLabel = 'No numeric measurements to display.',
      hiddenSeries,
      defaultHiddenSeries = [],
      onHiddenSeriesChange,
      className,
      ...props
    },
    ref,
  ) {
    const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, '_')
    const [internalHidden, setInternalHidden] =
      React.useState<readonly string[]>(defaultHiddenSeries)
    const hidden = new Set(hiddenSeries ?? internalHidden)
    const visible = series.filter((s) => !hidden.has(s.key))
    const [host, setHost] = React.useState<HTMLDivElement | null>(null)
    const [dismissed, setDismissed] = React.useState(false)
    const firstLegend = React.useRef<HTMLButtonElement>(null)
    const [restoreRequested, setRestoreRequested] = React.useState(false)
    React.useLayoutEffect(() => {
      if (!restoreRequested) return
      if (visible.length > 0) firstLegend.current?.focus()
      setRestoreRequested(false)
    }, [restoreRequested, visible.length])
    const number = React.useMemo(
      () => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }),
      [locale],
    )
    const compact = React.useMemo(
      () =>
        new Intl.NumberFormat(locale, {
          notation: 'compact',
          maximumFractionDigits: 1,
        }),
      [locale],
    )
    const format = (value: number | null | undefined) =>
      typeof value === 'number' && Number.isFinite(value)
        ? `${formatValue ? formatValue(value) : number.format(value)} ${unit}`
        : missingLabel
    const rows = React.useMemo(() => {
      const ids = new Set<string>(),
        keys = new Set<string>()
      for (const s of series) {
        if (!s.key || keys.has(s.key))
          throw new Error('Chart series keys must be non-empty and unique')
        keys.add(s.key)
      }
      return data.map((row) => {
        if (!row.id || ids.has(row.id))
          throw new Error('Chart datum IDs must be non-empty and unique')
        ids.add(row.id)
        return {
          ...row,
          values: Object.fromEntries(
            series.map((s) => [
              s.key,
              typeof row.values[s.key] === 'number' &&
              Number.isFinite(row.values[s.key])
                ? row.values[s.key]
                : null,
            ]),
          ),
        }
      })
    }, [data, series])
    const byId = new Map(rows.map((row) => [row.id, row]))
    const values = rows
      .flatMap((row) => visible.map((s) => row.values[s.key]))
      .filter((value): value is number => typeof value === 'number')
    const min = values.reduce((a, b) => Math.min(a, b), 0),
      max = values.reduce((a, b) => Math.max(a, b), 0)
    const hasValues = values.length > 0
    const changeHidden = (next: string[]) => {
      if (hiddenSeries === undefined) setInternalHidden(next)
      onHiddenSeriesChange?.(next)
    }
    const toggle = (key: string) =>
      changeHidden(
        series
          .filter((s) => (s.key === key ? !hidden.has(key) : hidden.has(s.key)))
          .map((s) => s.key),
      )
    const chartHeight = Number.isFinite(height) ? Math.max(200, height) : 280
    return (
      <figure
        {...props}
        ref={ref}
        className={['pui-chart', className].filter(Boolean).join(' ')}
        aria-labelledby={`${id}-title`}
      >
        <figcaption className='pui-chart-caption'>
          <strong id={`${id}-title`}>{title}</strong>
          <p id={`${id}-summary`}>{description}</p>
        </figcaption>
        <ul className='pui-chart-legend' aria-label={`${title} series`}>
          {series.map((s, index) => (
            <li key={s.key}>
              <button
                ref={index === 0 ? firstLegend : undefined}
                type='button'
                className='pui-chart-legend-button'
                aria-label={`${s.label} series`}
                aria-pressed={!hidden.has(s.key)}
                onClick={() => toggle(s.key)}
              >
                <svg
                  width='32'
                  height='20'
                  viewBox='0 0 32 20'
                  aria-hidden='true'
                >
                  {type === 'bar' ? (
                    <>
                      <defs>
                        <Pattern
                          id={`${id}-legend-${index}`}
                          color={colorFor(index)}
                          index={index}
                        />
                      </defs>
                      <rect
                        x='4'
                        y='3'
                        width='24'
                        height='14'
                        rx='2'
                        fill={`url(#${id}-legend-${index})`}
                      />
                    </>
                  ) : (
                    <>
                      <path
                        d='M1 10h30'
                        stroke={colorFor(index)}
                        strokeWidth='2'
                        strokeDasharray={dashes[index % dashes.length]}
                      />
                      <Marker
                        cx={16}
                        cy={10}
                        index={index}
                        color={colorFor(index)}
                      />
                    </>
                  )}
                </svg>
                <span>{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className='pui-chart-axis-label'>
          {yLabel} ({unit})
        </p>
        {hasValues ? (
          <>
            <p className='pui-chart-help' id={`${id}-keys`}>
              Focus the chart and use Left/Right to inspect points. Escape
              clears details. The data table includes every series.
            </p>
            <div
              className='pui-chart-plot'
              onKeyDownCapture={(event) => {
                if (event.key === 'Escape') setDismissed(true)
                else if (
                  event.key === 'ArrowLeft' ||
                  event.key === 'ArrowRight'
                )
                  setDismissed(false)
              }}
              onMouseMoveCapture={() => setDismissed(false)}
              onTouchStartCapture={() => setDismissed(false)}
              onFocusCapture={() => setDismissed(false)}
            >
              <ResponsiveContainer
                width='100%'
                height={chartHeight}
                minWidth={0}
                initialDimension={{ width: 320, height: chartHeight }}
              >
                <ComposedChart
                  data={rows}
                  accessibilityLayer
                  role='application'
                  aria-label={title}
                  aria-describedby={`${id}-summary ${id}-keys`}
                  margin={{ top: 16, right: 20, bottom: 8, left: 0 }}
                >
                  <defs>
                    {series.map((s, index) => (
                      <Pattern
                        key={s.key}
                        id={`${id}-pattern-${index}`}
                        index={index}
                        color={colorFor(index)}
                      />
                    ))}
                  </defs>
                  <CartesianGrid vertical={false} stroke='var(--line)' />
                  <XAxis
                    dataKey='id'
                    tickFormatter={(value) => {
                      const label =
                        byId.get(String(value))?.label ?? String(value)
                      // minTickGap already drops ticks that would overlap; the cap
                      // only keeps one very long label from crowding the axis.
                      return label.length > 24
                        ? label.slice(0, 23) + '…'
                        : label
                    }}
                    tick={{ fill: 'var(--ink-muted)', fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--line)' }}
                    minTickGap={24}
                    interval='preserveStartEnd'
                  />
                  <YAxis
                    width={56}
                    tickFormatter={(value) => compact.format(Number(value))}
                    tick={{ fill: 'var(--ink-muted)', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    domain={[min, max === min ? max + 1 : max]}
                  />
                  <ReferenceLine y={0} stroke='var(--ink-muted)' />
                  {host && (
                    <Tooltip
                      portal={host}
                      isAnimationActive={false}
                      active={dismissed ? false : undefined}
                      filterNull={false}
                      cursor={
                        dismissed
                          ? false
                          : {
                              stroke: 'var(--control-border)',
                              fill: 'transparent',
                            }
                      }
                      wrapperStyle={{
                        position: 'static',
                        visibility: 'visible',
                        pointerEvents: 'auto',
                      }}
                      content={(tooltip) => {
                        const row =
                          tooltip.active && !dismissed
                            ? byId.get(String(tooltip.label))
                            : undefined
                        return (
                          <div
                            className='pui-chart-readout'
                            data-chart-readout={row?.id}
                          >
                            {row ? (
                              <>
                                <strong>{row.label}</strong>
                                <ul>
                                  {visible.map((s) => (
                                    <li key={s.key}>
                                      {s.label}: {format(row.values[s.key])}
                                    </li>
                                  ))}
                                </ul>
                              </>
                            ) : (
                              <span>
                                Hover, touch or use chart arrow keys to inspect
                                a measurement.
                              </span>
                            )}
                          </div>
                        )
                      }}
                    />
                  )}
                  {series.map((s, index) => {
                    const common = {
                      name: s.label,
                      dataKey: (row: ChartDatum) => row.values[s.key] ?? null,
                      hide: hidden.has(s.key),
                      isAnimationActive: false,
                      stroke: colorFor(index),
                    }
                    return type === 'bar' ? (
                      <Bar
                        key={s.key}
                        {...common}
                        fill={`url(#${id}-pattern-${index})`}
                        maxBarSize={48}
                      />
                    ) : type === 'area' ? (
                      <Area
                        key={s.key}
                        {...common}
                        type='linear'
                        strokeWidth={2}
                        strokeDasharray={dashes[index % dashes.length]}
                        fill={`url(#${id}-pattern-${index})`}
                        fillOpacity={0.12}
                        connectNulls={false}
                        dot={
                          rows.length > 40
                            ? false
                            : (dot) => (
                                <Marker
                                  {...dot}
                                  color={colorFor(index)}
                                  index={index}
                                />
                              )
                        }
                        activeDot={false}
                      />
                    ) : (
                      <Line
                        key={s.key}
                        {...common}
                        type='linear'
                        strokeWidth={2}
                        strokeDasharray={dashes[index % dashes.length]}
                        connectNulls={false}
                        dot={
                          rows.length > 40
                            ? false
                            : (dot) => (
                                <Marker
                                  {...dot}
                                  color={colorFor(index)}
                                  index={index}
                                />
                              )
                        }
                        activeDot={false}
                      />
                    )
                  })}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className='pui-chart-axis-label pui-chart-x-label'>{xLabel}</p>
          </>
        ) : (
          <div className='pui-chart-empty' role='status'>
            {visible.length === 0 && series.length > 0 ? (
              <>
                <p>No series selected.</p>
                <Button
                  variant='outline'
                  onClick={() => {
                    setRestoreRequested(true)
                    changeHidden([])
                  }}
                >
                  Show all series
                </Button>
              </>
            ) : (
              <p>{emptyLabel}</p>
            )}
          </div>
        )}
        <div
          className='pui-chart-inspector'
          ref={setHost}
          role='status'
          aria-live='polite'
          aria-atomic='true'
          aria-label={`${title} values`}
          hidden={!hasValues}
        />
        <details className='pui-chart-table'>
          <summary>View data table</summary>
          <Table.Container
            label={`${title} data table`}
            orientation='both'
            scrollChain='contain'
            style={{ maxHeight: 320 }}
          >
            <Table.Root>
              <Table.Caption>
                All input measurements, including hidden series. Unit: {unit}.
              </Table.Caption>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell scope='col'>{xLabel}</Table.HeaderCell>
                  {series.map((s) => (
                    <Table.HeaderCell key={s.key} scope='col'>
                      {s.label} ({unit})
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {rows.length ? (
                  rows.map((row) => (
                    <Table.Row key={row.id}>
                      <Table.HeaderCell scope='row'>
                        {row.label}
                      </Table.HeaderCell>
                      {series.map((s) => (
                        <Table.Cell key={s.key}>
                          {format(row.values[s.key])}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={series.length + 1}>
                      No rows.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </Table.Container>
        </details>
      </figure>
    )
  },
)
