'use client'
import * as React from 'react'
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  useActiveTooltipCoordinate,
  useActiveTooltipLabel,
  useIsTooltipActive,
  usePlotArea,
  useXAxisScale,
  useYAxisScale,
  ZIndexLayer,
  DefaultZIndexes,
  type DotProps,
} from 'recharts'
import { createPortal } from 'react-dom'
import { Table } from './table.js'
import { Button } from './button.js'
import { Popover } from './popover.js'
import { cx } from './parts.js'
import { useComponentDensity } from './sizing.js'
import { useLabels } from './label-context.js'
import {
  axisStep,
  cueAt,
  isNumber,
  Marker,
  roundStep,
  seriesColor,
  useFontReady,
} from './chart-shared.js'

export type ChartDatum = {
  id: string
  /** What the readout and the table call the row, such as its full date and time. */
  label: string
  /** When the row was measured, in ms since the epoch or as a Date. Required for
   * xScale="time", where it places the row on the axis. */
  time?: number | Date
  values: Readonly<Record<string, number | null | undefined>>
}
export type ChartSeries = {
  key: string
  label: string
  /** A color of your own, such as var(--surf-chart-category-3), in place of the
   * palette's. Marks and dashes still tell the series apart. */
  color?: string
  /** A series the others are read against, such as a benchmark index or a plan:
   * drawn thinner, in muted ink and under the others. Its dash and marks still tell
   * it apart. */
  comparison?: boolean
  /** The key of the series this one plans, such as a target beside its actual: drawn
   * in that series' color and marker, dashed, thinner and under it, while the
   * series it plans stays solid. */
  planOf?: string
}
/** The difference between a series and the one it is read against, named on each
 * side. */
export type ChartDifference = {
  /** The series read against the other, such as a portfolio. */
  series: string
  /** The series it is read against, such as its benchmark. */
  against: string
  /** Names the side where series is above, such as "Ahead of the benchmark". */
  above: string
  /** Names the side where series is below, such as "Behind the benchmark". */
  below: string
}
/** @deprecated The earlier name for ChartDifference. */
export type ChartGap = ChartDifference
export type ChartTone = 'neutral' | 'caution' | 'danger'
/** A place on the x axis: a datum's id on a category axis, or a time, in ms or as a
 * Date, on a time axis. */
export type ChartPosition = string | number | Date
/** A threshold line at y, or a band from one value to another, such as a target
 * range; an event line at x, or a period from xFrom to xTo, such as a deploy or a
 * maintenance window. The legend names each with its value or its place. */
export type ChartReference =
  | { y: number; label: string; tone?: ChartTone }
  | { from: number; to: number; label: string; tone?: ChartTone }
  | { x: ChartPosition; label: string; tone?: ChartTone }
  | {
      xFrom: ChartPosition
      xTo: ChartPosition
      label: string
      tone?: ChartTone
    }
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
  /** Plot height in px: 280 by default, 180 when compact. fill makes the chart take
   * its container's height, as in a stretched dashboard row, and the plot the room
   * its caption and legend leave, never less than the default. */
  height?: number | 'fill'
  /** Keeps 0 on the value axis. Turn it off for values far from zero, such as
   * prices, so the line uses the height; bars always start at zero. */
  includeZero?: boolean
  /** neutral tells series apart by ink, dashes and markers. categorical adds twelve
   * hues, for categories that color must separate, such as buckets or sectors.
   * extended adds a second dozen, the same twelve hues a step deeper, for a chart
   * with more series than twelve, such as a fleet of services on one plot. */
  palette?: 'neutral' | 'categorical' | 'extended'
  /** false draws every line solid and leaves the markers to tell the series apart,
   * for a house style that reads lines without dashes. A plan keeps its dash, which
   * is what makes it a plan, and the bars' fill patterns stay either way. Set
   * --surf-chart-line-width for the lines' weight, and
   * --surf-chart-line-quiet-ratio: 1 to give a comparison or plan the same weight
   * as the rest. */
  dashes?: boolean
  /** category spaces the rows evenly and names them by label. time places them by
   * data[].time, puts ticks on round times and breaks a line where sampling stops. */
  xScale?: 'category' | 'time'
  /** On a time axis, the longest wait between rows a line runs across, in ms;
   * past it the line breaks, as where sampling stopped. Twice the usual interval by
   * default. For closes on trading days, four days carries a line over weekends
   * and a holiday. A missing value still breaks it. */
  breakAfter?: number
  /** log suits values across orders of magnitude, such as prefill and decode
   * throughput. Zero and negative values stay off the plot and in the table. */
  yScale?: 'linear' | 'log'
  /** step holds each value until the next, for values sampled when they change. */
  curve?: 'linear' | 'step'
  /** Stacks bar and area series, so the top of the stack is their total. */
  stacked?: boolean
  /** Shades the difference between two series of a line chart, in the trend-up
   * color where the first is above and trend-down where it is below, such as a
   * portfolio's lead over its benchmark. The legend names both sides; inspecting a
   * row says which side it is on and by how much. */
  difference?: ChartDifference
  /** @deprecated The earlier name for difference. */
  gap?: ChartDifference
  /** Thresholds and target bands over the plot, which the value axis reaches, and
   * events and periods across it, which inspecting a row names. */
  references?: readonly ChartReference[]
  /** compact keeps the plot, legend and floating values for a dashboard card; the
   * caption, keyboard help and readout stay for assistive technology. Without it the
   * chart follows a SizeProvider density. Its data table takes the same density. */
  density?: 'default' | 'compact'
  /** Leaves the marks alone, for a trend on a card: no axes, grid, legend or axis
   * names on screen. The readout, keyboard, references and data table stay, and the
   * axis names stay for assistive technology. */
  minimal?: boolean
  /** Labels the highest and lowest value of the first shown series with its value
   * and where it falls, such as a period's high and low. */
  extremes?: boolean
  /** Above the plot, beside the value axis name, or below it. */
  legendPosition?: 'top' | 'bottom'
  /** Shows this many series in the legend; the rest fold behind a "+N" button. auto
   * keeps the legend on one line: as many as fit the chart's width, the rest folded. */
  legendLimit?: number | 'auto'
  locale?: string
  /** Formats a value for the readout, the table and the value axis ticks. The unit
   * follows it in the readout and the table, and names the axis. */
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
  /** The button that opens the series past legendLimit. */
  moreSeries: (count: number) => string
  /** The "+N" button when the folded entries include references. */
  moreEntries: (count: number) => string
  /** The sum of stacked series in the readout. */
  total: string
  /** Names the highest value's label, with extremes. */
  high: string
  /** Names the lowest value's label, with extremes. */
  low: string
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
  moreSeries: (count) => `${count} more series`,
  moreEntries: (count) => `${count} more in the legend`,
  total: 'Total',
  high: 'High',
  low: 'Low',
}
const lineDashes = [undefined, '7 4', '2 4', '10 3 2 3', '12 5', '4 3']
// A plan's dash: short and even, as a target line reads.
const planDash = '5 4'
const trendColors = {
  above: 'var(--surf-trend-up-fg)',
  below: 'var(--surf-trend-down-fg)',
} as const
const toneColors = {
  neutral: 'var(--surf-ink-muted)',
  caution: 'var(--surf-status-caution-fg)',
  danger: 'var(--surf-status-danger-fg)',
} as const
const MINUTE = 60_000,
  HOUR = 60 * MINUTE,
  DAY = 24 * HOUR
type TimeUnit = 'minute' | 'hour' | 'day' | 'month' | 'year'
const timeSteps: [TimeUnit, number, number][] = [
  ['minute', 1, MINUTE],
  ['minute', 5, 5 * MINUTE],
  ['minute', 15, 15 * MINUTE],
  ['minute', 30, 30 * MINUTE],
  ['hour', 1, HOUR],
  ['hour', 3, 3 * HOUR],
  ['hour', 6, 6 * HOUR],
  ['hour', 12, 12 * HOUR],
  ['day', 1, DAY],
  ['day', 2, 2 * DAY],
  ['day', 7, 7 * DAY],
  ['month', 1, 30 * DAY],
  ['month', 3, 91 * DAY],
  ['month', 6, 182 * DAY],
  ['year', 1, 365 * DAY],
]
/** Ticks on round local times, such as every 6 hours or the first of each month: at
 * most six across the span, and no more than fit, so their steps stay even. */
function timeTicks(
  min: number,
  max: number,
  fits: (unit: TimeUnit, ms: number) => boolean = () => true,
) {
  const [unit, count] =
    timeSteps.find(
      ([stepUnit, , ms]) => (max - min) / ms <= 6 && fits(stepUnit, ms),
    ) ?? timeSteps[timeSteps.length - 1]
  const date = new Date(min)
  date.setSeconds(0, 0)
  if (unit === 'minute')
    date.setMinutes(Math.floor(date.getMinutes() / count) * count)
  else date.setMinutes(0)
  if (unit === 'hour')
    date.setHours(Math.floor(date.getHours() / count) * count)
  else if (unit !== 'minute') date.setHours(0)
  if (unit === 'month')
    date.setMonth(Math.floor(date.getMonth() / count) * count, 1)
  if (unit === 'year') date.setMonth(0, 1)
  const ticks: number[] = []
  while (date.getTime() <= max && ticks.length < 100) {
    if (date.getTime() >= min) ticks.push(date.getTime())
    if (unit === 'minute') date.setMinutes(date.getMinutes() + count)
    else if (unit === 'hour') date.setHours(date.getHours() + count)
    else if (unit === 'day') date.setDate(date.getDate() + count)
    else if (unit === 'month') date.setMonth(date.getMonth() + count)
    else date.setFullYear(date.getFullYear() + count)
  }
  return { ticks, unit }
}
/** Powers of ten that span low to high, with 2 and 5 between them across one decade. */
function logTicks(low: number, high: number) {
  const bottom = Math.floor(Math.log10(low)),
    top = Math.max(Math.ceil(Math.log10(high)), bottom + 1)
  const ticks: number[] = []
  for (let power = bottom; power <= top; power++)
    for (const factor of top - bottom === 1 ? [1, 2, 5] : [1])
      if (power < top || factor === 1)
        ticks.push(Number((factor * 10 ** power).toPrecision(12)))
  return ticks
}
/** An element's content width, kept current as it resizes; 0 before it is measured. */
function useWidth<Element extends HTMLElement>() {
  const [element, setElement] = React.useState<Element | null>(null)
  const [width, setWidth] = React.useState(0)
  React.useLayoutEffect(() => {
    if (!element) return
    setWidth(element.clientWidth)
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [element])
  return [setElement, width, element] as const
}
let measureCanvas: HTMLCanvasElement | undefined
/** How wide a tick label draws, in the font it draws in. */
function textWidth(text: string, font: string) {
  measureCanvas ??= document.createElement('canvas')
  const context = measureCanvas.getContext('2d')
  if (!context) return text.length * 7.5
  context.font = font
  return context.measureText(text).width
}
/** The gap Recharts keeps between tick labels. */
const TICK_GAP = 24
/** The value axis and the plot's right margin: what the plot gives up of the frame. */
const PLOT_INSET = 56 + 20
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
          stroke='var(--surf-canvas)'
          strokeWidth='1.5'
        />
      ) : index % 3 === 2 ? (
        <circle cx='4' cy='4' r='1.4' fill='var(--surf-canvas)' />
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
  dash,
}: {
  type: 'line' | 'bar' | 'area'
  index: number
  /** The line's dash; null draws it solid. Without one, the index sets it. */
  dash?: string | null
  color: string
  pattern: string
}) {
  return (
    <svg
      className='surf-chart-mark'
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
            strokeDasharray={
              dash === undefined
                ? lineDashes[index % lineDashes.length]
                : (dash ?? undefined)
            }
          />
          <Marker cx={16} cy={10} index={index} color={color} />
        </>
      )}
    </svg>
  )
}
/** Shades the gap between two series, in the trend-up color where the first is above
 * the second and trend-down where it is below. A linear gap turns color where the lines
 * cross; a step gap holds each row's side until the next. A missing value breaks it,
 * as it breaks the lines. */
function SeriesGap({
  points,
  step,
}: {
  points: readonly { x: unknown; a: number | null; b: number | null }[]
  step: boolean
}) {
  const xScale = useXAxisScale()
  const yScale = useYAxisScale()
  if (!xScale || !yScale) return null
  const shapes: { side: 'above' | 'below'; d: string }[] = []
  let run: { x: number; a: number; b: number }[] = []
  const flush = () => {
    if (run.length < 2) return (run = [])
    // Each piece walks along the first series and back along the second.
    const shape = (part: typeof run) => {
      const top = part.map((p) => `${p.x},${p.a}`)
      const bottom = part.map((p) => `${p.x},${p.b}`).reverse()
      return `M${[...top, ...bottom].join('L')}Z`
    }
    // Pixel y grows downward, so the first series is above where its y is smaller.
    const sideOf = (p: (typeof run)[number]) =>
      p.a <= p.b ? ('above' as const) : ('below' as const)
    if (step) {
      for (let index = 0; index < run.length - 1; index++) {
        const p = run[index],
          next = run[index + 1]
        shapes.push({
          side: sideOf(p),
          d: shape([p, { ...p, x: next.x }]),
        })
      }
    } else {
      let part = [run[0]]
      for (let index = 1; index < run.length; index++) {
        const p = run[index - 1],
          next = run[index]
        const from = p.b - p.a,
          to = next.b - next.a
        if (from * to < 0) {
          // The lines cross between the rows: close the piece where they meet.
          const t = from / (from - to)
          const cross = {
            x: p.x + t * (next.x - p.x),
            a: p.a + t * (next.a - p.a),
            b: p.a + t * (next.a - p.a),
          }
          shapes.push({ side: sideOf(p), d: shape([...part, cross]) })
          part = [cross]
        }
        part.push(next)
      }
      shapes.push({
        side: sideOf(part.find((p) => p.a !== p.b) ?? part[0]),
        d: shape(part),
      })
    }
    run = []
  }
  for (const point of points) {
    const x = point.a === null || point.b === null ? undefined : xScale(point.x)
    if (x === undefined || !isNumber(x)) {
      flush()
      continue
    }
    run.push({ x, a: yScale(point.a)!, b: yScale(point.b)! })
  }
  flush()
  return (
    <ZIndexLayer zIndex={DefaultZIndexes.area - 1}>
      <g className='surf-chart-gap' aria-hidden='true'>
        {shapes.map((shape, index) => (
          <path
            key={index}
            d={shape.d}
            data-side={shape.side}
            fill={trendColors[shape.side]}
            fillOpacity={0.16}
            stroke='none'
          />
        ))}
      </g>
    </ZIndexLayer>
  )
}
/** A side of a gap, as the legend and the floating values draw it. */
function GapMark({ side }: { side: 'above' | 'below' }) {
  return (
    <svg
      className='surf-chart-mark'
      viewBox='0 0 32 20'
      aria-hidden='true'
      focusable='false'
    >
      <rect
        x='4'
        y='4'
        width='24'
        height='12'
        rx='2'
        fill={trendColors[side]}
        fillOpacity='0.32'
      />
    </svg>
  )
}
function ReferenceMark({ reference }: { reference: ChartReference }) {
  const color = toneColors[reference.tone ?? 'neutral']
  return (
    <svg
      className='surf-chart-mark'
      viewBox='0 0 32 20'
      aria-hidden='true'
      focusable='false'
    >
      {'y' in reference ? (
        <path
          d='M1 10h30'
          stroke={color}
          strokeWidth='2'
          strokeDasharray='4 3'
        />
      ) : 'x' in reference ? (
        <path
          d='M16 1v18'
          stroke={color}
          strokeWidth='2'
          strokeDasharray='4 3'
        />
      ) : 'xFrom' in reference ? (
        <rect
          x='10'
          y='2'
          width='12'
          height='16'
          rx='2'
          fill={color}
          fillOpacity='0.2'
        />
      ) : (
        <rect
          x='4'
          y='4'
          width='24'
          height='12'
          rx='2'
          fill={color}
          fillOpacity='0.2'
        />
      )}
    </svg>
  )
}
export type ChartSeriesMarkProps = {
  type?: 'line' | 'bar' | 'area'
  /** The series' place in the chart's series, which sets its dash, marker and color. */
  index: number
  palette?: 'neutral' | 'categorical' | 'extended'
  color?: string
  /** The swatch of a plan (ChartSeries.planOf): index is the planned series'. */
  plan?: boolean
  /** false for a key beside a chart drawn with dashes={false}: a solid line. */
  dashes?: boolean
}
/** A series' swatch as Chart's legend draws it, for a legend or key of your own. */
export function ChartSeriesMark({
  type = 'line',
  index,
  palette = 'neutral',
  color,
  plan,
  dashes = true,
}: ChartSeriesMarkProps) {
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, '_')
  return (
    <SeriesMark
      type={type}
      index={cueAt(index)}
      color={seriesColor(index, palette, color)}
      pattern={`${id}-mark`}
      dash={plan ? planDash : dashes ? undefined : null}
    />
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
  render: (label: string) => React.ReactNode | null
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
  const content = shown ? render(String(label)) : null
  // A break in sampling has no values to show.
  if (!shown || !point || !plot || content === null) return null
  // The gap between the point and the box, in px: the --surf-space-3 step.
  const gap = 12
  const start = point.x > plot.x + plot.width / 2
  const left = Math.min(
    Math.max(start ? point.x - gap - width : point.x + gap, plot.x),
    plot.x + plot.width - width,
  )
  return createPortal(
    <div
      ref={box}
      className='surf-chart-tooltip'
      aria-hidden='true'
      style={{ left, top: plot.y, visibility: width ? undefined : 'hidden' }}
    >
      {content}
    </div>,
    host!,
  )
}

/** An extreme's label: above the highest point, below the lowest, turned inward near
 * either end of the plot so it never runs past it. Recharts passes the dot's box. */
function ExtremeLabel({
  viewBox,
  text,
  place,
  at,
  font,
}: {
  viewBox?: { x: number; y: number; width: number; height: number }
  text: string
  place: 'above' | 'below'
  at: number
  font?: string
}) {
  if (!viewBox) return null
  const x = viewBox.x + viewBox.width / 2
  const y = viewBox.y + viewBox.height / 2
  // The --surf-space-2 inset on each side, and the 20px box of a 12px line.
  const width = (font ? textWidth(text, font) : text.length * 7) + 16
  const height = 20
  const left = at < 0.3 ? x - 8 : at > 0.7 ? x - width + 8 : x - width / 2
  const top = place === 'above' ? y - height - 6 : y + 6
  return (
    <g>
      <rect
        x={left}
        y={top}
        width={width}
        height={height}
        rx={4}
        className='surf-chart-extreme-box'
      />
      <text
        x={left + width / 2}
        y={top + height / 2}
        dominantBaseline='central'
        textAnchor='middle'
        className='surf-chart-extreme-text'
      >
        {text}
      </text>
    </g>
  )
}

/** Cartesian trends with a persistent, keyboard-readable tooltip region and a
 * full data-table alternative. Missing values are gaps, never fabricated zeros. */
export const Chart = function Chart({
  title,
  description,
  data,
  series,
  unit,
  xLabel,
  yLabel,
  type = 'line',
  height,
  includeZero = true,
  palette = 'neutral',
  dashes = true,
  xScale = 'category',
  breakAfter,
  yScale = 'linear',
  curve = 'linear',
  stacked = false,
  references = [],
  difference,
  gap,
  density: ownDensity,
  minimal = false,
  extremes = false,
  legendPosition = 'top',
  legendLimit,
  locale,
  formatValue,
  labels,
  hiddenSeries,
  defaultHiddenSeries = [],
  onHiddenSeriesChange,
  className,
  ref,
  ...props
}: ChartProps & { ref?: React.Ref<HTMLElement> }) {
  const provided = useLabels<ChartLabels>('chart')
  const text: ChartLabels = { ...chartLabels, ...provided, ...labels }
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, '_')
  // A plan takes the color and marker of the series it plans, and the plan's dash;
  // the series it plans stays solid.
  const plannedIndex = (index: number) => {
    const key = series[index]?.planOf
    const planned = key ? series.findIndex((s) => s.key === key) : -1
    return planned >= 0 && planned !== index ? planned : index
  }
  const isPlan = (index: number) => plannedIndex(index) !== index
  // Where a place draws its dash, marker and fill pattern from: a palette repeats
  // its twelve hues every twelve series, and the cue steps once past each dozen so a
  // series never shares all its cues with the one a dozen before it.
  const cue = (index: number) => cueAt(index)
  // A plan keeps its dash even with dashes={false}: it marks what the line is (a
  // target beside its actual), while the cycled dashes only tell two series apart.
  const dashFor = (index: number): string | null =>
    isPlan(index)
      ? planDash
      : series.some((s) => s.planOf === series[index]?.key) || !dashes
        ? null
        : (lineDashes[cue(index) % lineDashes.length] ?? null)
  const colorFor = (index: number): string =>
    isPlan(index) && !series[index]?.color
      ? colorFor(plannedIndex(index))
      : seriesColor(
          index,
          palette,
          series[index]?.color ??
            (series[index]?.comparison ? 'var(--surf-ink-muted)' : undefined),
        )
  const timeScale = xScale === 'time'
  const logScale = yScale === 'log'
  const stacks = stacked && type !== 'line'
  const density = useComponentDensity(ownDensity)
  const compact = density === 'compact'
  const [internalHidden, setInternalHidden] =
    React.useState<readonly string[]>(defaultHiddenSeries)
  const hidden = new Set(hiddenSeries ?? internalHidden)
  const visible = series.filter((s) => !hidden.has(s.key))
  const [host, setHost] = React.useState<HTMLDivElement | null>(null)
  const fontsReady = useFontReady(host, data.map((d) => d.label).join(''))
  const [floatHost, setFloatHost] = React.useState<HTMLDivElement | null>(null)
  const [setFrame, frameWidth, frame] = useWidth<HTMLDivElement>()
  // legendLimit='auto': lay every entry out, series, references and the difference's
  // sides alike, count those on the first line, then fold the rest, keeping room for
  // the "+N" button. A new width lays them out again.
  const legendList = React.useRef<HTMLUListElement>(null)
  const [legendFit, setLegendFit] = React.useState<number>()
  React.useLayoutEffect(() => {
    if (legendLimit === 'auto') setLegendFit(undefined)
  }, [legendLimit, frameWidth, series.length, references.length])
  React.useLayoutEffect(() => {
    if (legendLimit !== 'auto' || legendFit !== undefined) return
    const items = Array.from(
      legendList.current?.querySelectorAll<HTMLElement>(
        ':scope > [data-entry]',
      ) ?? [],
    )
    if (!items.length) return
    const line = items.filter(
      (item) => item.offsetTop === items[0].offsetTop,
    ).length
    setLegendFit(line >= items.length ? items.length : Math.max(1, line - 1))
  })
  const [dismissed, setDismissed] = React.useState(false)
  // The table renders once it is first opened, so a page of charts stays light.
  const [tableOpened, setTableOpened] = React.useState(false)
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
  const compactNumber = React.useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        notation: 'compact',
        maximumFractionDigits: 1,
      }),
    [locale],
  )
  const formatNumber = (value: number | null | undefined) =>
    isNumber(value)
      ? formatValue
        ? formatValue(value)
        : number.format(value)
      : null
  // The readout names the unit after each value; the table names it once, in the header.
  const format = (value: number | null | undefined) => {
    const formatted = formatNumber(value)
    return formatted === null ? text.missing : `${formatted} ${unit}`
  }
  const rows = React.useMemo(() => {
    const ids = new Set<string>(),
      keys = new Set<string>()
    for (const s of series) {
      if (!s.key || keys.has(s.key))
        throw new Error('Chart series keys must be non-empty and unique')
      keys.add(s.key)
    }
    const result = data.map((row) => {
      if (!row.id || ids.has(row.id))
        throw new Error('Chart datum IDs must be non-empty and unique')
      ids.add(row.id)
      const time = row.time === undefined ? undefined : Number(row.time)
      if (timeScale && !isNumber(time))
        throw new Error('Chart rows need a time when xScale is "time"')
      return {
        ...row,
        time,
        values: Object.fromEntries(
          series.map((s) => [
            s.key,
            isNumber(row.values[s.key]) ? row.values[s.key] : null,
          ]),
        ) as Record<string, number | null>,
      }
    })
    return timeScale ? result.sort((a, b) => a.time! - b.time!) : result
  }, [data, series, timeScale])
  type Row = (typeof rows)[number]
  const byId = new Map(rows.map((row) => [row.id, row]))
  const byTime = new Map(rows.map((row) => [row.time, row]))
  const rowFor = (label: unknown) =>
    timeScale ? byTime.get(Number(label)) : byId.get(String(label))
  // An x reference's place: its time, or the index of the datum it names; null when
  // there is no such place, so it is left out.
  const indexOf = new Map(rows.map((row, index) => [row.id, index]))
  const axisAt = (position: ChartPosition) => {
    const at = timeScale ? Number(position) : indexOf.get(String(position))
    return isNumber(at) ? at : null
  }
  const plotAt = (position: ChartPosition) =>
    timeScale ? Number(position) : String(position)
  // Inspecting a row names the events nearest it and the periods around it.
  const referencesAt = new Map<string, ChartReference[]>()
  const rowAt = (row: Row, index: number) => (timeScale ? row.time! : index)
  for (const reference of references) {
    let hits: Row[] = []
    if ('x' in reference) {
      const at = axisAt(reference.x)
      if (at !== null && rows.length) {
        const first = rowAt(rows[0], 0),
          last = rowAt(rows[rows.length - 1], rows.length - 1)
        if (at >= first && at <= last) {
          let near = 0
          rows.forEach((row, index) => {
            if (
              Math.abs(rowAt(row, index) - at) <
              Math.abs(rowAt(rows[near], near) - at)
            )
              near = index
          })
          hits = [rows[near]]
        }
      }
    } else if ('xFrom' in reference) {
      const from = axisAt(reference.xFrom),
        to = axisAt(reference.xTo)
      if (from !== null && to !== null)
        hits = rows.filter((row, index) => {
          const at = rowAt(row, index)
          return at >= Math.min(from, to) && at <= Math.max(from, to)
        })
    }
    for (const row of hits)
      referencesAt.set(row.id, [...(referencesAt.get(row.id) ?? []), reference])
  }
  // On a time axis, a wait of more than twice the usual interval, or than
  // breakAfter, is a break in sampling: an empty row there keeps the line from
  // bridging it.
  const interval = React.useMemo(() => {
    if (!timeScale || rows.length < 3) return 0
    const steps = rows
      .slice(1)
      .map((row, index) => row.time! - rows[index].time!)
      .sort((a, b) => a - b)
    return steps[Math.floor(steps.length / 2)]
  }, [rows, timeScale])
  const plotRows = React.useMemo(() => {
    if (!interval) return rows
    const empty = Object.fromEntries(series.map((s) => [s.key, null]))
    return rows.flatMap((row, index) => {
      const next = rows[index + 1]
      return next && next.time! - row.time! > (breakAfter ?? interval * 2)
        ? [
            row,
            {
              ...row,
              id: `${row.id}-gap`,
              time: row.time! + interval,
              values: empty,
            },
          ]
        : [row]
    })
  }, [rows, series, interval, breakAfter])
  const valueOf = (row: Row, key: string) => {
    const value = row.values[key]
    return value === null || (logScale && value <= 0) ? null : value
  }
  // The value axis spans the visible values (their sums when stacked) and the
  // references, widened to round steps so its ticks read cleanly.
  const values = rows
    .flatMap((row) => visible.map((s) => valueOf(row, s.key)))
    .filter(isNumber)
  const sums = stacks
    ? rows.flatMap((row) => {
        const parts = visible.map((s) => valueOf(row, s.key)).filter(isNumber)
        return [
          parts.filter((v) => v > 0).reduce((a, b) => a + b, 0),
          parts.filter((v) => v < 0).reduce((a, b) => a + b, 0),
        ]
      })
    : values
  const referenceValues = references
    .flatMap((r) => ('y' in r ? [r.y] : 'from' in r ? [r.from, r.to] : []))
    .filter((v) => isNumber(v) && (!logScale || v > 0))
  const extent = [...sums, ...(values.length ? referenceValues : [])]
  // Bars grow from zero, so they always keep it on a linear axis.
  const keepZero = !logScale && (includeZero || type === 'bar')
  const start = keepZero ? 0 : (extent[0] ?? 0)
  const low = extent.reduce((a, b) => Math.min(a, b), start),
    high = extent.reduce((a, b) => Math.max(a, b), start)
  let min = low,
    max = high,
    ticks: number[] | undefined
  if (logScale) {
    ticks = logTicks(low > 0 ? low : 1, high > 0 ? high : 10)
    min = ticks[0]
    max = ticks[ticks.length - 1]
  } else {
    const step = axisStep(low, high)
    if (step) {
      min = Math.floor(low / step) * step
      max = Math.ceil(high / step) * step
      ticks = Array.from(
        { length: Math.round((max - min) / step) + 1 },
        // Rounded, so float steps never print as 0.30000000000000004.
        (_, index) => Number((min + index * step).toPrecision(12)),
      )
    }
  }
  const time = React.useMemo(() => {
    if (!timeScale || !rows.length) return undefined
    const first = rows[0].time!,
      last = rows[rows.length - 1].time!
    const formatFor = (unit: TimeUnit) =>
      new Intl.DateTimeFormat(
        locale,
        unit === 'minute' || unit === 'hour'
          ? { hour: 'numeric', minute: '2-digit' }
          : unit === 'day'
            ? { month: 'short', day: 'numeric' }
            : unit === 'month'
              ? { month: 'short', year: 'numeric' }
              : { year: 'numeric' },
      )
    // Pick the step from the plot's width and the width its labels draw at, so a
    // narrow chart steps every 2 or 3 hours instead of dropping uneven ticks.
    const plotWidth = frameWidth - PLOT_INSET
    const font =
      frame && fontsReady
        ? `12px ${getComputedStyle(frame).fontFamily}`
        : undefined
    const fits = (unit: TimeUnit, ms: number) => {
      if (plotWidth <= 0 || !font) return true
      const label = Math.max(
        textWidth(formatFor(unit).format(new Date(first)), font),
        textWidth(formatFor(unit).format(new Date(2026, 9, 24, 22, 30)), font),
      )
      const count = Math.floor((last - first) / ms) + 1
      return count * (label + TICK_GAP) - TICK_GAP <= plotWidth
    }
    const { ticks: timeAxisTicks, unit: timeUnit } = timeTicks(
      first,
      last,
      fits,
    )
    // Bars sit on their time, so half an interval on each side keeps the end ones whole.
    const pad = type === 'bar' ? (interval || DAY) / 2 : 0
    const subDay = timeUnit === 'minute' || timeUnit === 'hour'
    const tickFormat = formatFor(timeUnit)
    const dayFormat = new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
    })
    // A place on the axis, such as an x reference's, at the data's own precision
    // rather than the ticks': rows hours apart name the hour, and the day too when the
    // data spans more than one; rows days apart name the day; months apart, the month.
    // The year shows when the data crosses one.
    const step = interval || DAY
    const firstDate = new Date(first),
      lastDate = new Date(last)
    const oneDay = firstDate.toDateString() === lastDate.toDateString()
    const oneYear = firstDate.getFullYear() === lastDate.getFullYear()
    const placeFormat = new Intl.DateTimeFormat(
      locale,
      step < DAY
        ? oneDay
          ? { hour: 'numeric', minute: '2-digit' }
          : {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            }
        : step < 28 * DAY
          ? {
              month: 'short',
              day: 'numeric',
              year: oneYear ? undefined : 'numeric',
            }
          : { month: 'short', year: 'numeric' },
    )
    return {
      domain: [first - pad, last + pad] as [number, number],
      ticks: timeAxisTicks,
      // Within a day the ticks name hours; one at midnight names the day instead.
      format: (value: number) => {
        const date = new Date(value)
        return subDay && date.getHours() === 0 && date.getMinutes() === 0
          ? dayFormat.format(date)
          : tickFormat.format(date)
      },
      place: (value: number) => placeFormat.format(new Date(value)),
    }
  }, [rows, timeScale, type, interval, locale, frameWidth, frame, fontsReady])
  const hasValues = values.length > 0
  // The first shown series' highest and lowest values, where extremes labels them.
  const extremeRows = (() => {
    const key = visible[0]?.key
    if (!extremes || !key) return []
    let high: { row: Row; value: number; index: number } | undefined
    let low: typeof high
    rows.forEach((row, index) => {
      const value = row.values[key]
      if (!isNumber(value)) return
      if (!high || value > high.value) high = { row, value, index }
      if (!low || value < low.value) low = { row, value, index }
    })
    if (!high || !low) return []
    const share = (index: number) =>
      rows.length > 1 ? index / (rows.length - 1) : 0.5
    return [
      { ...high, kind: 'high' as const, at: share(high.index) },
      ...(low.row === high.row
        ? []
        : [{ ...low, kind: 'low' as const, at: share(low.index) }]),
    ]
  })()
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
  const fill = height === 'fill'
  const chartHeight =
    typeof height === 'number' && Number.isFinite(height)
      ? Math.max(compact ? 120 : 200, height)
      : compact
        ? 180
        : 280
  const total = (row: Row) =>
    visible
      .map((s) => row.values[s.key])
      .filter(isNumber)
      .reduce((a, b) => a + b, 0)
  // A difference shows on a line chart while both of its series do.
  const shaded = difference ?? gap
  const shownGap =
    shaded &&
    type === 'line' &&
    [shaded.series, shaded.against].every(
      (key) => series.some((s) => s.key === key) && !hidden.has(key),
    )
      ? shaded
      : undefined
  const gapAt = (row: Row) => {
    if (!shownGap) return null
    const a = valueOf(row, shownGap.series),
      b = valueOf(row, shownGap.against)
    if (a === null || b === null || a === b) return null
    return a > b
      ? { side: 'above' as const, label: shownGap.above, size: a - b }
      : { side: 'below' as const, label: shownGap.below, size: b - a }
  }
  const placeText = (position: ChartPosition) =>
    timeScale
      ? (time?.place(Number(position)) ?? String(position))
      : (byId.get(String(position))?.label ?? String(position))
  const referenceText = (r: ChartReference) =>
    'y' in r
      ? `${r.label} ${format(r.y)}`
      : 'from' in r
        ? `${r.label} ${formatNumber(r.from) ?? text.missing}–${format(r.to)}`
        : 'x' in r
          ? `${r.label} ${placeText(r.x)}`
          : `${r.label} ${placeText(r.xFrom)}–${placeText(r.xTo)}`
  const legendButton = (s: ChartSeries, index: number) => (
    <button
      ref={index === 0 ? firstLegend : undefined}
      type='button'
      className='surf-chart-legend-button'
      aria-label={text.series(s.label)}
      aria-pressed={!hidden.has(s.key)}
      onClick={() => toggle(s.key)}
    >
      <SeriesMark
        type={type}
        index={cue(plannedIndex(index))}
        color={colorFor(index)}
        pattern={`${id}-legend-${index}`}
        dash={dashFor(index)}
      />
      <span>{s.label}</span>
    </button>
  )
  // The legend's entries in order: series, then references, then the difference's
  // sides. A limit folds whatever is past it behind "+N".
  const entries: React.ReactNode[] = [
    ...series.map((s, index) => legendButton(s, index)),
    ...references.map((reference, index) => (
      <React.Fragment key={`reference-${index}`}>
        <ReferenceMark reference={reference} />
        <span>{referenceText(reference)}</span>
      </React.Fragment>
    )),
    ...(shownGap
      ? (['above', 'below'] as const).map((side) => (
          <React.Fragment key={side}>
            <GapMark side={side} />
            <span>{shownGap[side]}</span>
          </React.Fragment>
        ))
      : []),
  ]
  const kindOf = (index: number) =>
    index < series.length ? 'series' : 'reference'
  const limit = legendLimit === 'auto' ? legendFit : legendLimit
  const shownCount =
    limit !== undefined && limit < entries.length
      ? Math.max(0, limit)
      : entries.length
  const folded = entries.length - shownCount
  // Folded entries run to the end: they are only series when nothing follows them.
  const foldsSeriesOnly = entries.length === series.length
  const legend = (
    <ul
      ref={legendList}
      className='surf-chart-legend'
      aria-label={text.legend(title)}
    >
      {entries.slice(0, shownCount).map((entry, index) => (
        <li
          key={index}
          data-entry=''
          className={
            kindOf(index) === 'reference'
              ? 'surf-chart-legend-reference'
              : undefined
          }
        >
          {entry}
        </li>
      ))}
      {folded > 0 && (
        <li>
          <Popover.Root>
            <Popover.Trigger
              className='surf-chart-legend-button surf-chart-legend-more'
              aria-label={
                foldsSeriesOnly
                  ? text.moreSeries(folded)
                  : text.moreEntries(folded)
              }
            >
              +{folded}
            </Popover.Trigger>
            <Popover.Content size='small'>
              <ul className='surf-chart-legend-list'>
                {entries.slice(shownCount).map((entry, index) => (
                  <li
                    key={index}
                    className={
                      kindOf(shownCount + index) === 'reference'
                        ? 'surf-chart-legend-reference'
                        : undefined
                    }
                  >
                    {entry}
                  </li>
                ))}
              </ul>
            </Popover.Content>
          </Popover.Root>
        </li>
      )}
    </ul>
  )
  return (
    <figure
      {...props}
      ref={ref}
      data-density={density}
      data-height={fill ? 'fill' : undefined}
      data-minimal={minimal || undefined}
      style={
        fill
          ? ({
              '--surf-chart-plot-min': `${chartHeight}px`,
              ...props.style,
            } as React.CSSProperties)
          : props.style
      }
      className={cx('surf-chart', className)}
      aria-labelledby={`${id}-title`}
    >
      <figcaption className='surf-chart-caption'>
        <strong id={`${id}-title`}>{title}</strong>
        <p id={`${id}-summary`}>{description}</p>
      </figcaption>
      <div className='surf-chart-frame' ref={setFrame}>
        <div className='surf-chart-key'>
          <p className='surf-chart-axis-label'>
            {yLabel} ({unit})
          </p>
          {legendPosition === 'top' && !minimal && legend}
        </div>
        {hasValues ? (
          <>
            <div
              className='surf-chart-plot'
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
                height={fill ? '100%' : chartHeight}
                minWidth={0}
                minHeight={fill ? chartHeight : undefined}
                initialDimension={{ width: 320, height: chartHeight }}
              >
                <ComposedChart
                  data={plotRows}
                  accessibilityLayer
                  role='application'
                  aria-label={title}
                  aria-describedby={`${id}-summary ${id}-keys`}
                  margin={
                    minimal
                      ? // Room above and below for the extremes' labels.
                        extremes
                        ? { top: 28, right: 4, bottom: 28, left: 4 }
                        : { top: 4, right: 4, bottom: 4, left: 4 }
                      : { top: 16, right: 20, bottom: 8, left: 0 }
                  }
                  baseValue={logScale ? min : undefined}
                >
                  <defs>
                    {series.map((s, index) => (
                      <Pattern
                        key={s.key}
                        id={`${id}-pattern-${index}`}
                        index={cue(index)}
                        color={colorFor(index)}
                      />
                    ))}
                  </defs>
                  {!minimal && (
                    <CartesianGrid vertical={false} stroke='var(--surf-line)' />
                  )}
                  {references.map((reference, index) =>
                    'from' in reference ? (
                      <ReferenceArea
                        key={index}
                        y1={reference.from}
                        y2={reference.to}
                        fill={toneColors[reference.tone ?? 'neutral']}
                        fillOpacity={0.12}
                        stroke='none'
                      />
                    ) : 'xFrom' in reference &&
                      axisAt(reference.xFrom) !== null &&
                      axisAt(reference.xTo) !== null ? (
                      <ReferenceArea
                        key={index}
                        x1={plotAt(reference.xFrom)}
                        x2={plotAt(reference.xTo)}
                        fill={toneColors[reference.tone ?? 'neutral']}
                        fillOpacity={0.12}
                        stroke='none'
                      />
                    ) : null,
                  )}
                  {time ? (
                    <XAxis
                      hide={minimal}
                      dataKey='time'
                      type='number'
                      scale='time'
                      domain={time.domain}
                      ticks={time.ticks}
                      tickFormatter={(value) => time.format(Number(value))}
                      tick={
                        fontsReady && {
                          fill: 'var(--surf-ink-muted)',
                          fontSize: 12,
                        }
                      }
                      tickLine={false}
                      axisLine={{ stroke: 'var(--surf-line)' }}
                      minTickGap={24}
                      interval='preserveStartEnd'
                    />
                  ) : (
                    <XAxis
                      hide={minimal}
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
                      tick={
                        fontsReady && {
                          fill: 'var(--surf-ink-muted)',
                          fontSize: 12,
                        }
                      }
                      tickLine={false}
                      axisLine={{ stroke: 'var(--surf-line)' }}
                      minTickGap={24}
                      interval='preserveStartEnd'
                    />
                  )}
                  <YAxis
                    hide={minimal}
                    width={56}
                    scale={logScale ? 'log' : 'auto'}
                    tickFormatter={(value) =>
                      formatValue
                        ? formatValue(Number(value))
                        : compactNumber.format(Number(value))
                    }
                    tick={{ fill: 'var(--surf-ink-muted)', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    domain={[min, max === min ? max + 1 : max]}
                    ticks={ticks}
                    allowDataOverflow={logScale}
                  />
                  {!logScale && (
                    <ReferenceLine y={0} stroke='var(--surf-ink-muted)' />
                  )}
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
                              stroke: 'var(--surf-control-border)',
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
                            ? rowFor(tooltip.label)
                            : undefined
                        return (
                          <div
                            className='surf-chart-readout'
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
                                  {stacks && (
                                    <li>
                                      {text.total}: {format(total(row))}
                                    </li>
                                  )}
                                  {gapAt(row) && (
                                    <li>
                                      {gapAt(row)!.label}:{' '}
                                      {format(gapAt(row)!.size)}
                                    </li>
                                  )}
                                  {referencesAt
                                    .get(row.id)
                                    ?.map((reference, index) => (
                                      <li key={`reference-${index}`}>
                                        {reference.label}
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
                  {shownGap && (
                    <SeriesGap
                      step={curve === 'step'}
                      points={plotRows.map((row) => ({
                        x: timeScale ? row.time : row.id,
                        a: valueOf(row, shownGap.series),
                        b: valueOf(row, shownGap.against),
                      }))}
                    />
                  )}
                  {/* Comparison series and plans draw first, under the ones read against them. */}
                  {(stacks
                    ? series.map((s, index) => [s, index] as const)
                    : [
                        ...series
                          .map((s, index) => [s, index] as const)
                          .filter(([s, i]) => s.comparison || isPlan(i)),
                        ...series
                          .map((s, index) => [s, index] as const)
                          .filter(([s, i]) => !s.comparison && !isPlan(i)),
                      ]
                  ).map(([s, index]) => {
                    const quiet = Boolean(s.comparison) || isPlan(index)
                    // The weight is the stylesheet's, from --surf-chart-line-width and
                    // --surf-chart-line-quiet-ratio, so an app can set every line the
                    // same weight with one declaration.
                    const seriesClass = cx(
                      'surf-chart-series',
                      quiet && 'surf-chart-series-quiet',
                    )
                    const common = {
                      name: s.label,
                      dataKey: (row: Row) => valueOf(row, s.key),
                      hide: hidden.has(s.key),
                      isAnimationActive: false,
                      stroke: colorFor(index),
                      stackId: stacks ? 'total' : undefined,
                    }
                    // A minimal chart draws the line alone; the readout names each
                    // point. Past 40 points the markers go too, so they don't crowd.
                    // With the dashes off they are the only thing left telling two
                    // series apart without color, so a solid chart keeps them.
                    const dot =
                      (rows.length > 40 && dashes) || minimal
                        ? false
                        : (dot: Pick<DotProps, 'cx' | 'cy'>) => (
                            <Marker
                              cx={dot.cx}
                              cy={dot.cy}
                              color={colorFor(index)}
                              index={cue(plannedIndex(index))}
                            />
                          )
                    const shape = curve === 'step' ? 'stepAfter' : 'linear'
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
                        className={seriesClass}
                        type={shape}
                        strokeDasharray={dashFor(index) ?? undefined}
                        fill={`url(#${id}-pattern-${index})`}
                        fillOpacity={stacks ? 0.32 : 0.12}
                        connectNulls={false}
                        dot={dot}
                        activeDot={false}
                      />
                    ) : (
                      <Line
                        key={s.key}
                        {...common}
                        className={seriesClass}
                        type={shape}
                        strokeDasharray={dashFor(index) ?? undefined}
                        connectNulls={false}
                        dot={dot}
                        activeDot={false}
                      />
                    )
                  })}
                  {references.map((reference, index) =>
                    'y' in reference ? (
                      <ReferenceLine
                        key={index}
                        y={reference.y}
                        stroke={toneColors[reference.tone ?? 'neutral']}
                        strokeWidth={1.5}
                        strokeDasharray='4 3'
                      />
                    ) : 'x' in reference && axisAt(reference.x) !== null ? (
                      <ReferenceLine
                        key={index}
                        x={plotAt(reference.x)}
                        stroke={toneColors[reference.tone ?? 'neutral']}
                        strokeWidth={1.5}
                        strokeDasharray='4 3'
                      />
                    ) : null,
                  )}
                  {extremes &&
                    extremeRows.map(({ row, value, kind, at }) => (
                      <ReferenceDot
                        key={kind}
                        x={timeScale ? row.time : row.id}
                        y={value}
                        r={3.5}
                        fill='var(--surf-ink)'
                        stroke='none'
                        className='surf-chart-extreme-dot'
                        label={
                          <ExtremeLabel
                            text={`${kind === 'high' ? text.high : text.low} ${formatNumber(value)} · ${row.label}`}
                            place={kind === 'high' ? 'above' : 'below'}
                            at={at}
                            font={
                              frame && fontsReady
                                ? `12px ${getComputedStyle(frame).fontFamily}`
                                : undefined
                            }
                          />
                        }
                      />
                    ))}
                  <FloatingValues
                    host={floatHost}
                    hidden={dismissed}
                    render={(label) => {
                      const row = rowFor(label)
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
                                    index={cue(plannedIndex(index))}
                                    color={colorFor(index)}
                                    pattern={`${id}-float-${index}`}
                                    dash={dashFor(index)}
                                  />
                                  <span>{s.label}</span>
                                  <span className='surf-chart-tooltip-value'>
                                    {format(row.values[s.key])}
                                  </span>
                                </li>
                              ),
                            )}
                            {stacks && (
                              <li className='surf-chart-tooltip-total'>
                                <span>{text.total}</span>
                                <span className='surf-chart-tooltip-value'>
                                  {format(total(row))}
                                </span>
                              </li>
                            )}
                            {gapAt(row) && (
                              <li className='surf-chart-tooltip-gap'>
                                <GapMark side={gapAt(row)!.side} />
                                <span>{gapAt(row)!.label}</span>
                                <span className='surf-chart-tooltip-value'>
                                  {format(gapAt(row)!.size)}
                                </span>
                              </li>
                            )}
                            {referencesAt
                              .get(row.id)
                              ?.map((reference, index) => (
                                <li
                                  key={`reference-${index}`}
                                  className='surf-chart-tooltip-reference'
                                >
                                  <ReferenceMark reference={reference} />
                                  <span>{reference.label}</span>
                                </li>
                              ))}
                          </ul>
                        </>
                      )
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <div className='surf-chart-float' ref={setFloatHost} />
            </div>
            <p className='surf-chart-axis-label surf-chart-x-label'>{xLabel}</p>
          </>
        ) : (
          <div className='surf-chart-empty' role='status'>
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
        {legendPosition === 'bottom' && !minimal && (
          <div className='surf-chart-key' data-position='bottom'>
            {legend}
          </div>
        )}
      </div>
      {hasValues && (
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
        hidden={!hasValues}
      />
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
              <Table.Caption>{text.tableCaption(unit)}</Table.Caption>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell scope='col'>{xLabel}</Table.HeaderCell>
                  {series.map((s) => (
                    <Table.HeaderCell key={s.key} scope='col' numeric>
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
                        <Table.Cell key={s.key} numeric>
                          {formatNumber(row.values[s.key]) ?? text.missing}
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
        )}
      </details>
    </figure>
  )
}
