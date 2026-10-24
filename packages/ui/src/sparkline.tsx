import * as React from 'react'
import { cx, sizeName } from './class-names.js'
import type { ComponentSizeAlias } from './size.js'

export type SparklineTrend = 'auto' | 'up' | 'down' | 'flat' | 'neutral'
export type SparklineProps = Omit<
  React.ComponentPropsWithoutRef<'svg'>,
  'children' | 'role' | 'aria-label'
> & {
  /** Values in order. A missing value leaves a gap. */
  data: readonly (number | null | undefined)[]
  /** What the line shows and how it moved, such as "KOSPI, 30 days, up 2.3%". The
   * line is an image; this is its name. */
  label: string
  /** 24, 32 or 48px tall. Set --surf-sparkline-height for another height. */
  size?: ComponentSizeAlias
  /** A reference line: a value, the first value, or none. */
  baseline?: number | 'first' | 'none'
  /** Marks the last value with a dot. */
  marker?: boolean
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
  trend = 'auto',
  lowerIsBetter = false,
  className,
  ref,
  ...props
}: SparklineProps & { ref?: React.Ref<SVGSVGElement> }) {
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
  let path = ''
  let pen = false
  data.forEach((value, index) => {
    if (!finite(value)) return void (pen = false)
    path += `${pen ? 'L' : 'M'}${x(index)} ${y(value)}`
    pen = true
  })
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
      data-size={sizeName(size)}
      data-tone={tone}
      viewBox='0 0 100 100'
      preserveAspectRatio='none'
      focusable='false'
    >
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
