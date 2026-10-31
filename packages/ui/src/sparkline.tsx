import * as React from 'react'
import { cx } from './class-names.js'
import type { ComponentSize } from './size.js'

export type SparklineTrend = 'auto' | 'up' | 'down' | 'flat' | 'neutral'
export type SparklineProps = Omit<
  React.ComponentPropsWithoutRef<'svg'>,
  'children' | 'role' | 'aria-label' | 'fill'
> & {
  /** Values in order. A missing value leaves a gap. */
  data: readonly (number | null | undefined)[]
  /** What the line shows and how it moved, such as "KOSPI, 30 days, up 2.3%". The
   * line is an image; this is its name. */
  label: string
  /** 24, 32 or 48px tall. Set --surf-sparkline-height for another height. */
  size?: ComponentSize
  /** A reference line: a value, the first value, or none. */
  baseline?: number | 'first' | 'none'
  /** Marks the last value with a dot. */
  marker?: boolean
  /** Washes the area under the line in the line's own color, thinning to nothing at
   * the bottom of the box, so the shape reads at a glance in a card grid. It breaks
   * at a missing value as the line does. Set --surf-sparkline-fill-opacity for a
   * heavier or lighter wash. */
  fill?: boolean
  /** The line's color. auto compares the last value with the baseline, or with the
   * first value when there is none. */
  trend?: SparklineTrend
  /** For measures where a fall is good: the colors swap. */
  lowerIsBetter?: boolean
}

const finite = (value: number | null | undefined): value is number =>
  typeof value === 'number' && Number.isFinite(value)

/** A small trend line for cards and table cells: no axes, legend or tooltip. Use Chart
 * when people need to read values. */
export const Sparkline = function Sparkline({
  data,
  label,
  size,
  baseline = 'none',
  marker = true,
  fill = false,
  trend = 'auto',
  lowerIsBetter = false,
  className,
  ref,
  ...props
}: SparklineProps & { ref?: React.Ref<SVGSVGElement> }) {
  // The wash names its own gradient, so several sparklines in one card grid each
  // fade in their own color. Chart sanitizes its useId the same way: url(#…) reads
  // better with the characters React puts there stripped out.
  const fade = React.useId().replace(/[^a-zA-Z0-9_-]/g, '_')
  const values = data.filter(finite)
  const first = values[0]
  const last = values[values.length - 1]
  const reference =
    baseline === 'first' ? first : baseline === 'none' ? undefined : baseline
  const bounds = finite(reference) ? [...values, reference] : values
  const min = Math.min(...bounds)
  const max = Math.max(...bounds)
  const span = max - min || 1
  // The line keeps clear of the edges by a tenth of the height.
  const y = (value: number) => 95 - ((value - min) / span) * 90
  const x = (index: number) =>
    data.length > 1 ? (index / (data.length - 1)) * 100 : 50
  // One run per stretch of present values. A missing value breaks the line, and the
  // wash under it breaks with it instead of spanning the gap.
  const runs: { x: number; y: number }[][] = []
  let run: { x: number; y: number }[] = []
  data.forEach((value, index) => {
    if (!finite(value)) {
      if (run.length) runs.push(run)
      run = []
      return
    }
    run.push({ x: x(index), y: y(value) })
  })
  if (run.length) runs.push(run)
  const path = runs
    .map((points) =>
      points
        .map((point, i) => `${i ? 'L' : 'M'}${point.x} ${point.y}`)
        .join(''),
    )
    .join('')
  // Each run closes against the bottom of the box, so every stretch of the line
  // keeps its own island of color.
  const area = runs
    .map((points) => {
      const head = points[0],
        tail = points[points.length - 1]
      return `M${head.x} 100${points
        .map((point) => `L${point.x} ${point.y}`)
        .join('')}L${tail.x} 100Z`
    })
    .join('')
  const from = finite(reference) ? reference : first
  const way =
    trend !== 'auto'
      ? trend
      : !finite(last) || !finite(from)
        ? 'neutral'
        : last > from
          ? 'up'
          : last < from
            ? 'down'
            : 'flat'
  const tone =
    lowerIsBetter && way === 'up'
      ? 'down'
      : lowerIsBetter && way === 'down'
        ? 'up'
        : way
  let end = data.length - 1
  while (end >= 0 && !finite(data[end])) end--
  return (
    <svg
      {...props}
      ref={ref}
      role='img'
      aria-label={label}
      className={cx('surf-sparkline', className)}
      data-size={size}
      data-tone={tone}
      viewBox='0 0 100 100'
      preserveAspectRatio='none'
      focusable='false'
    >
      {fill && (
        // The gradient spans the wash's own box: full strength at the top of the
        // series, nothing at the bottom of the frame, so the line keeps its edge.
        <>
          <defs>
            <linearGradient id={fade} x1='0' y1='0' x2='0' y2='1'>
              <stop className='surf-sparkline-fill-top' offset='0' />
              <stop className='surf-sparkline-fill-bottom' offset='1' />
            </linearGradient>
          </defs>
          <path
            className='surf-sparkline-fill'
            d={area}
            fill={`url(#${fade})`}
          />
        </>
      )}
      {finite(reference) && (
        <path
          className='surf-sparkline-baseline'
          d={`M0 ${y(reference)}H100`}
          vectorEffect='non-scaling-stroke'
        />
      )}
      <path
        className='surf-sparkline-line'
        d={path}
        vectorEffect='non-scaling-stroke'
      />
      {marker && end >= 0 && (
        // A zero-length segment with a round cap stays a circle however the
        // line stretches.
        <path
          className='surf-sparkline-marker'
          d={`M${x(end)} ${y(data[end] as number)}h0`}
          vectorEffect='non-scaling-stroke'
        />
      )}
    </svg>
  )
}
