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
  useActiveTooltipCoordinate,
  useActiveTooltipLabel,
  useIsTooltipActive,
  usePlotArea,
  type DotProps,
} from 'recharts'
import { createPortal } from 'react-dom'
import { Table } from './table.js'
import { Button } from './button.js'
import { cx } from './parts.js'

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
  /** Keeps 0 on the value axis. Turn it off for values far from zero, such as
   * prices, so the line uses the height; bars always start at zero. */
  includeZero?: boolean
  /** neutral tells series apart by ink, dashes and markers. categorical adds six hues,
   * for categories that color must separate, such as buckets or sectors. */
  palette?: 'neutral' | 'categorical'
  locale?: string
  formatValue?: (value: number) => string
  /** Text the chart shows or announces; pass translations here. */
  labels?: Partial<ChartLabels>
  hiddenSeries?: readonly string[]
  defaultHiddenSeries?: readonly string[]
  onHiddenSeriesChange?: (keys: string[]) => void
}
export type ChartLabels = {
  missing: string
  empty: string
  noSeries: string
  showAll: string
  keyboardHelp: string
  values: (title: string) => string
  viewTable: string
  table: (title: string) => string
  tableCaption: (unit: string) => string
  /** The readout before any point is inspected. */
  inspectHint: string
  /** The data table's only row when there is no data. */
  noRows: string
  /** The legend list, given the chart's title. */
  legend: (title: string) => string
  /** A legend button that shows or hides a series. */
  series: (label: string) => string
}
const chartLabels: ChartLabels = {
  missing: 'Not available',
  empty: 'No numeric measurements to display.',
  noSeries: 'No series selected.',
  showAll: 'Show all series',
  keyboardHelp:
    'Focus the chart and use Left/Right to inspect points. Escape clears details. The data table includes every series.',
  values: (title) => `${title} values`,
  viewTable: 'View data table',
  table: (title) => `${title} data table`,
  tableCaption: (unit) =>
    `All input measurements, including hidden series. Unit: ${unit}.`,
  inspectHint: 'Hover, touch or use chart arrow keys to inspect a measurement.',
  noRows: 'No rows.',
  legend: (title) => `${title} series`,
  series: (label) => `${label} series`,
}
/** The round step at or above a raw step: 1, 2, 2.5 or 5 times a power of ten. */
function roundStep(raw: number) {
  if (!(raw > 0)) return 0
  const power = 10 ** Math.floor(Math.log10(raw))
  return power * ([1, 2, 2.5, 5, 10].find((f) => f * power >= raw) ?? 10)
}
const dashes = [undefined, '7 4', '2 4', '10 3 2 3', '12 5', '4 3']
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

/** A series' swatch, as the legend and the floating values draw it. */
function SeriesMark({
  type,
  index,
  color,
  pattern,
}: {
  type: 'line' | 'bar' | 'area'
  index: number
  color: string
  pattern: string
}) {
  return (
    <svg
      className='pui-chart-mark'
      viewBox='0 0 32 20'
      aria-hidden='true'
      focusable='false'
    >
      {type === 'bar' ? (
        <>
          <defs>
            <Pattern id={pattern} color={color} index={index} />
          </defs>
          <rect
            x='4'
            y='3'
            width='24'
            height='14'
            rx='2'
            fill={`url(#${pattern})`}
          />
        </>
      ) : (
        <>
          <path
            d='M1 10h30'
            stroke={color}
            strokeWidth='2'
            strokeDasharray={dashes[index % dashes.length]}
          />
          <Marker cx={16} cy={10} index={index} color={color} />
        </>
      )}
    </svg>
  )
}
/** The active point's values beside it, for pointer and touch users. The readout
 * below the plot announces the same values, so this copy stays out of the
 * accessibility tree. It sits on the side of the point with more room and stays
 * inside the plot. */
function FloatingValues({
  host,
  hidden,
  render,
}: {
  host: HTMLElement | null
  hidden: boolean
  render: (label: string) => React.ReactNode
}) {
  const active = useIsTooltipActive()
  const label = useActiveTooltipLabel()
  const point = useActiveTooltipCoordinate()
  const plot = usePlotArea()
  const box = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(0)
  const shown = Boolean(
    host && !hidden && active && label !== undefined && point && plot,
  )
  React.useLayoutEffect(() => {
    if (shown && box.current) setWidth(box.current.offsetWidth)
  }, [shown, label, plot?.width])
  if (!shown || !point || !plot) return null
  // The gap between the point and the box, in px: the --space-3 step.
  const gap = 12
  const start = point.x > plot.x + plot.width / 2
  const left = Math.min(
    Math.max(start ? point.x - gap - width : point.x + gap, plot.x),
    plot.x + plot.width - width,
  )
  return createPortal(
    <div
      ref={box}
      className='pui-chart-tooltip'
      aria-hidden='true'
      style={{ left, top: plot.y, visibility: width ? undefined : 'hidden' }}
    >
      {render(String(label))}
    </div>,
    host!,
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
      includeZero = true,
      palette = 'neutral',
      locale = 'en-US',
      formatValue,
      labels,
      hiddenSeries,
      defaultHiddenSeries = [],
      onHiddenSeriesChange,
      className,
      ...props
    },
    ref,
  ) {
    const text: ChartLabels = { ...chartLabels, ...labels }
    const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, '_')
    const colorFor = (index: number) =>
      palette === 'categorical'
        ? `var(--chart-category-${(index % 6) + 1})`
        : `var(--chart-series-${(index % 3) + 1})`
    const [internalHidden, setInternalHidden] =
      React.useState<readonly string[]>(defaultHiddenSeries)
    const hidden = new Set(hiddenSeries ?? internalHidden)
    const visible = series.filter((s) => !hidden.has(s.key))
    const [host, setHost] = React.useState<HTMLDivElement | null>(null)
    const [floatHost, setFloatHost] = React.useState<HTMLDivElement | null>(
      null,
    )
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
        : text.missing
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
    // Bars grow from zero, so they always keep it on the axis. Without zero, the axis
    // spans the values, widened to round steps so its ticks read cleanly.
    const keepZero = includeZero || type === 'bar'
    const start = keepZero ? 0 : (values[0] ?? 0)
    const low = values.reduce((a, b) => Math.min(a, b), start),
      high = values.reduce((a, b) => Math.max(a, b), start)
    const step = keepZero ? 0 : roundStep((high - low) / 4)
    const min = step ? Math.floor(low / step) * step : low,
      max = step ? Math.ceil(high / step) * step : high
    const ticks = step
      ? Array.from(
          { length: Math.round((max - min) / step) + 1 },
          (_, index) => min + index * step,
        )
      : undefined
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
        className={cx('pui-chart', className)}
        aria-labelledby={`${id}-title`}
      >
        <figcaption className='pui-chart-caption'>
          <strong id={`${id}-title`}>{title}</strong>
          <p id={`${id}-summary`}>{description}</p>
        </figcaption>
        <div className='pui-chart-frame'>
          <div className='pui-chart-key'>
            <p className='pui-chart-axis-label'>
              {yLabel} ({unit})
            </p>
            <ul className='pui-chart-legend' aria-label={text.legend(title)}>
              {series.map((s, index) => (
                <li key={s.key}>
                  <button
                    ref={index === 0 ? firstLegend : undefined}
                    type='button'
                    className='pui-chart-legend-button'
                    aria-label={text.series(s.label)}
                    aria-pressed={!hidden.has(s.key)}
                    onClick={() => toggle(s.key)}
                  >
                    <SeriesMark
                      type={type}
                      index={index}
                      color={colorFor(index)}
                      pattern={`${id}-legend-${index}`}
                    />
                    <span>{s.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {hasValues ? (
            <>
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
                      ticks={ticks}
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
                                <span>{text.inspectHint}</span>
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
                    <FloatingValues
                      host={floatHost}
                      hidden={dismissed}
                      render={(label) => {
                        const row = byId.get(label)
                        if (!row) return null
                        return (
                          <>
                            <strong>{row.label}</strong>
                            <ul>
                              {series.map((s, index) =>
                                hidden.has(s.key) ? null : (
                                  <li key={s.key}>
                                    <SeriesMark
                                      type={type}
                                      index={index}
                                      color={colorFor(index)}
                                      pattern={`${id}-float-${index}`}
                                    />
                                    <span>{s.label}</span>
                                    <span className='pui-chart-tooltip-value'>
                                      {format(row.values[s.key])}
                                    </span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </>
                        )
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
                <div className='pui-chart-float' ref={setFloatHost} />
              </div>
              <p className='pui-chart-axis-label pui-chart-x-label'>{xLabel}</p>
            </>
          ) : (
            <div className='pui-chart-empty' role='status'>
              {visible.length === 0 && series.length > 0 ? (
                <>
                  <p>{text.noSeries}</p>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setRestoreRequested(true)
                      changeHidden([])
                    }}
                  >
                    {text.showAll}
                  </Button>
                </>
              ) : (
                <p>{text.empty}</p>
              )}
            </div>
          )}
        </div>
        {hasValues && (
          <p className='pui-chart-help' id={`${id}-keys`}>
            {text.keyboardHelp}
          </p>
        )}
        <div
          className='pui-chart-inspector'
          ref={setHost}
          role='status'
          aria-live='polite'
          aria-atomic='true'
          aria-label={text.values(title)}
          hidden={!hasValues}
        />
        <details className='pui-chart-table'>
          <summary>{text.viewTable}</summary>
          <Table.Container
            label={text.table(title)}
            orientation='both'
            scrollChain='contain'
          >
            <Table.Root>
              <Table.Caption>{text.tableCaption(unit)}</Table.Caption>
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
                      {text.noRows}
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
