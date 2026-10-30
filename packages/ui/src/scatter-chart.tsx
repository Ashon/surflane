'use client'
import * as React from 'react'
import { createPortal } from 'react-dom'
import {
  CartesianGrid,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart as RechartsScatterChart,
  XAxis,
  YAxis,
  usePlotArea,
  useXAxisScale,
  useYAxisScale,
} from 'recharts'
import { Table } from './table.js'
import { cx } from './parts.js'
import { useComponentDensity } from './sizing.js'
import { useLabels } from './label-context.js'
import {
  axisStep,
  isNumber,
  Marker,
  seriesColor,
  useFontReady,
} from './chart-shared.js'
import type { ChartTone } from './chart.js'

export type ScatterPoint = {
  id: string
  /** Names the point in the readout and the table, such as a holding. */
  label: string
  x: number | null | undefined
  y: number | null | undefined
  /** The key of the group the point belongs to, which sets its color and marker. */
  group?: string
}
export type ScatterGroup = {
  key: string
  label: string
  /** A color of your own, such as var(--surf-status-success-border), in place of
   * the category hue for its place. The marker still tells the groups apart. */
  color?: string
}
/** A line across the plot at x or at y, such as a midpoint that splits it into
 * quadrants. The legend names each with its value. */
export type ScatterReference =
  | { x: number; label: string; tone?: ChartTone }
  | { y: number; label: string; tone?: ChartTone }
/** Names for the four parts one x line and one y line make, set in their corners.
 * The x axis runs left to right in every direction, so the names are physical. */
export type ScatterQuadrants = {
  topLeft?: string
  topRight?: string
  bottomLeft?: string
  bottomRight?: string
}
export type ScatterChartLabels = {
  missing: string
  empty: string
  keyboardHelp: string
  values: (title: string) => string
  viewTable: string
  table: (title: string) => string
  tableCaption: string
  inspectHint: string
  noRows: string
  legend: (title: string) => string
  /** The readout's line for the group a point belongs to. */
  group: string
  /** The readout's line for the quadrant a point is in. */
  quadrant: string
}
const scatterLabels: ScatterChartLabels = {
  missing: 'Not available',
  empty: 'No points to display.',
  keyboardHelp:
    'Focus the chart and use Left/Right to step through points from left to right, Home and End for the first and last. Escape clears details. The data table lists every point.',
  values: (title) => `${title} values`,
  viewTable: 'View data table',
  table: (title) => `${title} data table`,
  tableCaption: 'Every point, including those without both values.',
  inspectHint: 'Hover, touch or use chart arrow keys to inspect a point.',
  noRows: 'No rows.',
  legend: (title) => `${title} legend`,
  group: 'Group',
  quadrant: 'Quadrant',
}
export type ScatterChartProps = Omit<
  React.ComponentPropsWithoutRef<'figure'>,
  'children' | 'title'
> & {
  title: string
  description: string
  data: readonly ScatterPoint[]
  /** Groups the points by color and marker, such as aligned and diverged. Without
   * them every point is one ink. */
  groups?: readonly ScatterGroup[]
  xLabel: string
  yLabel: string
  /** The units the readout, the table and the axis names write after each value. */
  xUnit?: string
  yUnit?: string
  /** The axes' extent, such as [0, 10] for a score. Defaults to round values around
   * the points and the references. */
  xDomain?: readonly [number, number]
  yDomain?: readonly [number, number]
  references?: readonly ScatterReference[]
  /** Names the four parts the first x reference and the first y reference make. */
  quadrants?: ScatterQuadrants
  /** Plot height in px: 280 by default, 180 when compact. */
  height?: number
  density?: 'default' | 'compact'
  locale?: string
  formatX?: (value: number) => string
  formatY?: (value: number) => string
  labels?: Partial<ScatterChartLabels>
}

const toneColors = {
  neutral: 'var(--surf-ink-muted)',
  caution: 'var(--surf-status-caution-fg)',
  danger: 'var(--surf-status-danger-fg)',
} as const

/** Round ticks across the values, or across the given extent. */
function axis(values: number[], domain?: readonly [number, number]) {
  const low = domain ? domain[0] : Math.min(...values)
  const high = domain ? domain[1] : Math.max(...values)
  const step = axisStep(low, high === low ? low + 1 : high) || 1
  const start = domain ? low : Math.floor(low / step) * step
  const end = domain ? high : Math.ceil(high / step) * step
  const ticks: number[] = []
  for (let tick = Math.ceil(start / step) * step; tick <= end + step / 1e6;)
    (ticks.push(Number(tick.toFixed(10))), (tick += step))
  return { domain: [start, end] as [number, number], ticks }
}

/** The active point's values beside it, for pointer and touch users; the readout
 * under the plot says the same for assistive technology. */
function FloatingPoint({
  host,
  point,
  children,
}: {
  host: HTMLElement | null
  point: ScatterPoint | undefined
  children: React.ReactNode
}) {
  const xScale = useXAxisScale()
  const yScale = useYAxisScale()
  const plot = usePlotArea()
  const box = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState({ width: 0, height: 0 })
  const x = point && isNumber(point.x) ? xScale?.(point.x) : undefined
  const y = point && isNumber(point.y) ? yScale?.(point.y) : undefined
  React.useLayoutEffect(() => {
    if (box.current)
      setSize({
        width: box.current.offsetWidth,
        height: box.current.offsetHeight,
      })
  }, [point?.id, plot?.width])
  if (!host || !plot || x === undefined || y === undefined) return null
  // The gap between the point and the box, in px: the --surf-space-3 step.
  const gap = 12
  const before = x > plot.x + plot.width / 2
  const left = Math.min(
    Math.max(before ? x - gap - size.width : x + gap, plot.x),
    plot.x + plot.width - size.width,
  )
  const top = Math.min(
    Math.max(y - size.height / 2, plot.y),
    plot.y + plot.height - size.height,
  )
  return createPortal(
    <div
      ref={box}
      className='surf-chart-tooltip'
      aria-hidden='true'
      style={{ left, top, visibility: size.width ? undefined : 'hidden' }}
    >
      {children}
    </div>,
    host,
  )
}

/** Two measures per item, one point each, such as holdings by quality and news
 * sentiment. Reference lines split the plot, into quadrants when there is one on
 * each axis; a keyboard readout and a data table carry every value. */
export const ScatterChart = function ScatterChart({
  title,
  description,
  data,
  groups,
  xLabel,
  yLabel,
  xUnit,
  yUnit,
  xDomain,
  yDomain,
  references = [],
  quadrants,
  height,
  density: ownDensity,
  locale,
  formatX,
  formatY,
  labels,
  className,
  ref,
  ...props
}: ScatterChartProps & { ref?: React.Ref<HTMLElement> }) {
  const provided = useLabels<ScatterChartLabels>('scatterChart')
  const text: ScatterChartLabels = {
    ...scatterLabels,
    ...provided,
    ...labels,
  }
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, '_')
  const density = useComponentDensity(ownDensity)
  const compact = density === 'compact'
  const chartHeight = Math.max(
    compact ? 120 : 200,
    height ?? (compact ? 180 : 280),
  )
  const [host, setHost] = React.useState<HTMLDivElement | null>(null)
  const [floatHost, setFloatHost] = React.useState<HTMLDivElement | null>(null)
  const fontsReady = useFontReady(
    host,
    data.map((point) => point.label).join(''),
  )
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 })
  const writeX = (value: number) =>
    formatX ? formatX(value) : number.format(value)
  const writeY = (value: number) =>
    formatY ? formatY(value) : number.format(value)
  const withUnit = (value: string, unit?: string) =>
    unit ? `${value} ${unit}` : value
  const plotted = data.filter((point) => isNumber(point.x) && isNumber(point.y))
  // Left/Right step through the points from left to right, then bottom to top.
  const order = [...plotted].sort(
    (a, b) =>
      (a.x as number) - (b.x as number) || (a.y as number) - (b.y as number),
  )
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const active = order.find((point) => point.id === activeId)
  const [tableOpened, setTableOpened] = React.useState(false)
  const xRefs = references.filter(
    (reference): reference is Extract<ScatterReference, { x: number }> =>
      'x' in reference,
  )
  const yRefs = references.filter(
    (reference): reference is Extract<ScatterReference, { y: number }> =>
      'y' in reference,
  )
  const xAxis = axis(
    [...plotted.map((point) => point.x as number), ...xRefs.map((r) => r.x)],
    xDomain,
  )
  const yAxis = axis(
    [...plotted.map((point) => point.y as number), ...yRefs.map((r) => r.y)],
    yDomain,
  )
  const groupList: readonly ScatterGroup[] = groups?.length
    ? groups
    : [{ key: '', label: '' }]
  const groupIndex = (point: ScatterPoint) =>
    groups?.length
      ? Math.max(
          0,
          groups.findIndex((group) => group.key === point.group),
        )
      : 0
  // Groups take the category hues, which points side by side tell apart, and their
  // markers; the chart's neutral inks are for lines that dashes tell apart.
  const colorFor = (index: number) =>
    groups?.length
      ? seriesColor(index, 'categorical', groups[index]?.color)
      : 'var(--surf-chart-series-1)'
  const split = quadrants && xRefs[0] && yRefs[0]
  const quadrantOf = (point: ScatterPoint) => {
    if (!split || !quadrants) return undefined
    const right = (point.x as number) >= xRefs[0].x
    const top = (point.y as number) >= yRefs[0].y
    return top
      ? right
        ? quadrants.topRight
        : quadrants.topLeft
      : right
        ? quadrants.bottomRight
        : quadrants.bottomLeft
  }
  const lines = (point: ScatterPoint) => [
    `${xLabel}: ${withUnit(writeX(point.x as number), xUnit)}`,
    `${yLabel}: ${withUnit(writeY(point.y as number), yUnit)}`,
    ...(groups?.length && point.group
      ? [
          `${text.group}: ${groups.find((group) => group.key === point.group)?.label ?? point.group}`,
        ]
      : []),
    ...(quadrantOf(point) ? [`${text.quadrant}: ${quadrantOf(point)}`] : []),
  ]
  const step = (to: number) => {
    if (!order.length) return
    setActiveId(order[Math.min(Math.max(to, 0), order.length - 1)].id)
  }
  const at = active ? order.indexOf(active) : -1
  const tick = { fill: 'var(--surf-ink-muted)', fontSize: 12 }
  const legend =
    (groups?.length ?? 0) > 0 || references.length > 0 ? (
      <ul className='surf-chart-legend' aria-label={text.legend(title)}>
        {groups?.map((group, index) => (
          <li key={group.key} className='surf-chart-legend-reference'>
            <svg width='16' height='16' viewBox='0 0 16 16' aria-hidden='true'>
              <Marker cx={8} cy={8} color={colorFor(index)} index={index} />
            </svg>
            <span>{group.label}</span>
          </li>
        ))}
        {references.map((reference, index) => (
          <li
            key={`reference-${index}`}
            className='surf-chart-legend-reference'
          >
            <svg width='24' height='16' viewBox='0 0 24 16' aria-hidden='true'>
              <line
                x1='0'
                y1='8'
                x2='24'
                y2='8'
                stroke={toneColors[reference.tone ?? 'neutral']}
                strokeWidth='1.5'
                strokeDasharray='4 3'
              />
            </svg>
            <span>
              {reference.label}{' '}
              {'x' in reference
                ? withUnit(writeX(reference.x), xUnit)
                : withUnit(writeY(reference.y), yUnit)}
            </span>
          </li>
        ))}
      </ul>
    ) : null
  const corners = split
    ? ([
        [
          'topLeft',
          xAxis.domain[0],
          xRefs[0].x,
          yRefs[0].y,
          yAxis.domain[1],
          'insideTopLeft',
        ],
        [
          'topRight',
          xRefs[0].x,
          xAxis.domain[1],
          yRefs[0].y,
          yAxis.domain[1],
          'insideTopRight',
        ],
        [
          'bottomLeft',
          xAxis.domain[0],
          xRefs[0].x,
          yAxis.domain[0],
          yRefs[0].y,
          'insideBottomLeft',
        ],
        [
          'bottomRight',
          xRefs[0].x,
          xAxis.domain[1],
          yAxis.domain[0],
          yRefs[0].y,
          'insideBottomRight',
        ],
      ] as const)
    : []
  return (
    <figure
      {...props}
      ref={ref}
      data-density={density}
      className={cx('surf-chart', className)}
      aria-labelledby={`${id}-title`}
    >
      <figcaption className='surf-chart-caption'>
        <strong id={`${id}-title`}>{title}</strong>
        <p id={`${id}-summary`}>{description}</p>
      </figcaption>
      <div className='surf-chart-frame'>
        <div className='surf-chart-key'>
          <p className='surf-chart-axis-label'>
            {yUnit ? `${yLabel} (${yUnit})` : yLabel}
          </p>
          {legend}
        </div>
        {plotted.length ? (
          <>
            <div
              className='surf-chart-plot surf-scatter-plot'
              tabIndex={0}
              role='application'
              aria-label={title}
              aria-describedby={`${id}-summary ${id}-keys`}
              onKeyDown={(event) => {
                const keys: Record<string, number> = {
                  ArrowRight: at + 1,
                  ArrowLeft: at < 0 ? 0 : at - 1,
                  Home: 0,
                  End: order.length - 1,
                }
                if (event.key in keys) {
                  event.preventDefault()
                  step(keys[event.key])
                } else if (event.key === 'Escape') setActiveId(null)
              }}
              onMouseLeave={() => setActiveId(null)}
            >
              <ResponsiveContainer
                width='100%'
                height={chartHeight}
                minWidth={0}
                initialDimension={{ width: 320, height: chartHeight }}
              >
                {/* The plot is the keyboard target; the surface takes no stop of its own. */}
                <RechartsScatterChart
                  accessibilityLayer={false}
                  margin={{ top: 16, right: 20, bottom: 8, left: 0 }}
                >
                  <CartesianGrid stroke='var(--surf-line)' />
                  {corners.map(([corner, x1, x2, y1, y2, position]) =>
                    quadrants?.[corner] ? (
                      <ReferenceArea
                        key={corner}
                        x1={x1}
                        x2={x2}
                        y1={y1}
                        y2={y2}
                        fill='none'
                        stroke='none'
                        label={{
                          value: quadrants[corner],
                          position,
                          className: 'surf-scatter-quadrant',
                        }}
                      />
                    ) : null,
                  )}
                  <XAxis
                    type='number'
                    dataKey='x'
                    domain={xAxis.domain}
                    ticks={xAxis.ticks}
                    tickFormatter={(value) => writeX(Number(value))}
                    tick={fontsReady && tick}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--surf-line)' }}
                    allowDataOverflow
                  />
                  <YAxis
                    type='number'
                    dataKey='y'
                    width={56}
                    domain={yAxis.domain}
                    ticks={yAxis.ticks}
                    tickFormatter={(value) => writeY(Number(value))}
                    tick={tick}
                    tickLine={false}
                    axisLine={false}
                    allowDataOverflow
                  />
                  {references.map((reference, index) => (
                    <ReferenceLine
                      key={index}
                      {...('x' in reference
                        ? { x: reference.x }
                        : { y: reference.y })}
                      stroke={toneColors[reference.tone ?? 'neutral']}
                      strokeDasharray='4 3'
                    />
                  ))}
                  {groupList.map((group, index) => (
                    <Scatter
                      key={group.key || 'points'}
                      name={group.label}
                      data={plotted.filter(
                        (point) =>
                          !groups?.length || groupIndex(point) === index,
                      )}
                      isAnimationActive={false}
                      shape={(shape: {
                        cx?: number
                        cy?: number
                        payload?: ScatterPoint
                      }) => (
                        <g
                          className='surf-scatter-point'
                          onMouseEnter={() =>
                            shape.payload && setActiveId(shape.payload.id)
                          }
                          onClick={() =>
                            shape.payload && setActiveId(shape.payload.id)
                          }
                        >
                          {/* A touch target wider than the marker. */}
                          <circle
                            cx={shape.cx}
                            cy={shape.cy}
                            r={10}
                            fill='transparent'
                          />
                          <Marker
                            cx={shape.cx}
                            cy={shape.cy}
                            color={colorFor(index)}
                            index={index}
                          />
                        </g>
                      )}
                    />
                  ))}
                  {active && (
                    <ReferenceDot
                      x={active.x as number}
                      y={active.y as number}
                      r={8}
                      className='surf-scatter-active'
                    />
                  )}
                  <FloatingPoint host={floatHost} point={active}>
                    {active && (
                      <>
                        <strong>{active.label}</strong>
                        <ul>
                          {lines(active).map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </FloatingPoint>
                </RechartsScatterChart>
              </ResponsiveContainer>
              <div className='surf-chart-float' ref={setFloatHost} />
            </div>
            <p className='surf-chart-axis-label surf-chart-x-label'>
              {xUnit ? `${xLabel} (${xUnit})` : xLabel}
            </p>
          </>
        ) : (
          <div className='surf-chart-empty' role='status'>
            <p>{text.empty}</p>
          </div>
        )}
      </div>
      {plotted.length > 0 && (
        <p className='surf-chart-help' id={`${id}-keys`}>
          {text.keyboardHelp}
        </p>
      )}
      <div
        className='surf-chart-inspector'
        ref={setHost}
        role='status'
        aria-live='polite'
        aria-atomic='true'
        aria-label={text.values(title)}
        hidden={!plotted.length}
      >
        <div className='surf-chart-readout' data-chart-readout={active?.id}>
          {active ? (
            <>
              <strong>{active.label}</strong>
              <ul>
                {lines(active).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </>
          ) : (
            <span>{text.inspectHint}</span>
          )}
        </div>
      </div>
      <details
        className='surf-chart-table'
        onToggle={(event) => {
          if (event.currentTarget.open) setTableOpened(true)
        }}
      >
        <summary>{text.viewTable}</summary>
        {tableOpened && (
          <Table.Container
            label={text.table(title)}
            orientation='both'
            scrollChain='contain'
          >
            <Table.Root density={density}>
              <Table.Caption>{text.tableCaption}</Table.Caption>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell scope='col'>{title}</Table.HeaderCell>
                  <Table.HeaderCell scope='col' numeric>
                    {xUnit ? `${xLabel} (${xUnit})` : xLabel}
                  </Table.HeaderCell>
                  <Table.HeaderCell scope='col' numeric>
                    {yUnit ? `${yLabel} (${yUnit})` : yLabel}
                  </Table.HeaderCell>
                  {groups?.length ? (
                    <Table.HeaderCell scope='col'>
                      {text.group}
                    </Table.HeaderCell>
                  ) : null}
                  {split ? (
                    <Table.HeaderCell scope='col'>
                      {text.quadrant}
                    </Table.HeaderCell>
                  ) : null}
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {data.length ? (
                  data.map((point) => (
                    <Table.Row key={point.id}>
                      <Table.HeaderCell scope='row'>
                        {point.label}
                      </Table.HeaderCell>
                      <Table.Cell numeric>
                        {isNumber(point.x) ? writeX(point.x) : text.missing}
                      </Table.Cell>
                      <Table.Cell numeric>
                        {isNumber(point.y) ? writeY(point.y) : text.missing}
                      </Table.Cell>
                      {groups?.length ? (
                        <Table.Cell>
                          {groups.find((group) => group.key === point.group)
                            ?.label ?? text.missing}
                        </Table.Cell>
                      ) : null}
                      {split ? (
                        <Table.Cell>
                          {isNumber(point.x) && isNumber(point.y)
                            ? (quadrantOf(point) ?? text.missing)
                            : text.missing}
                        </Table.Cell>
                      ) : null}
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={3}>{text.noRows}</Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </Table.Container>
        )}
      </details>
    </figure>
  )
}
