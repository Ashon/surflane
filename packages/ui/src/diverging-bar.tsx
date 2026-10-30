import * as React from 'react'
import { cx } from './class-names.js'

export type DivergingBarProps = Omit<
  React.ComponentPropsWithoutRef<'span'>,
  'children' | 'role' | 'aria-label'
> & {
  /** A signed value, such as a sector's return against the market. */
  value: number
  /** The size a half bar stands for, such as the largest gap in the list, so bars
   * side by side share one scale. Defaults to the value's own size. */
  max?: number
  /** What the bar shows, such as "Semiconductors, 4.2 points above the market". The
   * bar is an image; this is its name. */
  label: string
  /** auto colors a rise and a fall as Stat and Sparkline do; neutral draws both in
   * the brand mark, for a gap that is neither good nor bad. */
  trend?: 'auto' | 'neutral'
  /** For measures where a fall is good: the colors swap. */
  lowerIsBetter?: boolean
}

export type DivergingDirection = 'up' | 'down' | 'flat'
/** Where a signed value lands: its direction, the tone it reads in and the share of a
 * half bar it fills. */
export function diverging(
  value: number,
  max: number | undefined,
  trend: 'auto' | 'neutral',
  lowerIsBetter: boolean,
) {
  const finite = Number.isFinite(value) ? value : 0
  const direction: DivergingDirection =
    finite > 0 ? 'up' : finite < 0 ? 'down' : 'flat'
  const scale = max !== undefined && max > 0 ? max : Math.abs(finite)
  const share = scale > 0 ? Math.min(1, Math.abs(finite) / scale) : 0
  const tone =
    trend === 'neutral' || direction === 'flat'
      ? 'neutral'
      : lowerIsBetter
        ? direction === 'up'
          ? 'down'
          : 'up'
        : direction
  return { direction, tone, share }
}

/** The track and fill both DivergingBar and a diverging BarList draw. */
export function DivergingTrack({
  direction,
  tone,
  share,
  className,
  ref,
  ...props
}: ReturnType<typeof diverging> &
  React.ComponentPropsWithoutRef<'span'> & {
    ref?: React.Ref<HTMLSpanElement>
  }) {
  return (
    <span
      {...props}
      ref={ref}
      className={cx('surf-diverging', className)}
      data-direction={direction}
      data-tone={tone}
    >
      {direction !== 'flat' && (
        <span
          className='surf-diverging-fill'
          style={{ inlineSize: `${(share * 50).toFixed(3)}%` }}
        />
      )}
    </span>
  )
}

/** A signed value drawn from a center line: a rise toward the inline end, a fall
 * toward the start, such as a sector's gap against the market. Give bars side by
 * side one max so they share a scale. */
export const DivergingBar = function DivergingBar({
  value,
  max,
  label,
  trend = 'auto',
  lowerIsBetter = false,
  ref,
  ...props
}: DivergingBarProps & { ref?: React.Ref<HTMLSpanElement> }) {
  return (
    <DivergingTrack
      {...props}
      {...diverging(value, max, trend, lowerIsBetter)}
      ref={ref}
      role='img'
      aria-label={label}
    />
  )
}
