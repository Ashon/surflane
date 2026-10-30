'use client'
import * as React from 'react'
import { Meter as BaseMeter } from '@base-ui/react/meter'
import { cx, part, skin } from './parts.js'

/** Where the value stands against its ranges, as the native meter element judges it:
 * optimum in the range optimum falls in, caution one range away, danger two. */
type MeterRanges = {
  min?: number
  max?: number
  low?: number
  high?: number
  optimum?: number
}
type MeterTone = 'optimum' | 'caution' | 'danger'
const clamp = (n: number, from: number, to: number) =>
  Math.min(Math.max(n, from), to)
/** The meter's ranges as the native meter element reads them: where the low range
 * ends, where the high one starts, and the tone a range takes against the best one. */
function meterRanges({ min = 0, max = 100, low, high, optimum }: MeterRanges) {
  if (low === undefined && high === undefined && optimum === undefined)
    return undefined
  const lowEnd = clamp(low ?? min, min, max)
  const highStart = clamp(high ?? max, lowEnd, max)
  const range = (n: number) => (n < lowEnd ? 0 : n > highStart ? 2 : 1)
  const best = range(clamp(optimum ?? (min + max) / 2, min, max))
  const tone = (n: number): MeterTone => {
    const away = Math.abs(range(clamp(n, min, max)) - best)
    return away === 0 ? 'optimum' : away === 1 ? 'caution' : 'danger'
  }
  return { lowEnd, highStart, best, tone }
}
function meterTone(value: number, ranges: MeterRanges) {
  return meterRanges(ranges)?.tone(value)
}

type MeterContextValue = {
  min: number
  max: number
  value: number
  ranges: MeterRanges
  /** A Target or a labeled Tick adds its text to the meter's description. */
  describe: (id: string) => () => void
}
const MeterContext = /* @__PURE__ */ React.createContext<MeterContextValue>({
  min: 0,
  max: 100,
  value: 0,
  ranges: {},
  describe: () => () => {},
})
/** Where a value sits along the track, as a share of it from the logical start. */
const share = (value: number, min: number, max: number) =>
  `${(Math.min(Math.max((value - min) / (max - min || 1), 0), 1) * 100).toFixed(3)}%`

export type MeterRootProps = React.ComponentPropsWithoutRef<
  typeof BaseMeter.Root
> & {
  /** Values below low are the low range, as on the native meter element. */
  low?: number
  /** Values above high are the high range. */
  high?: number
  /** The best value: its range is optimum, the next caution, the far one danger. The
   * fill takes the tone; say what it means in text too. */
  optimum?: number
}
const Root = function MeterRoot({
  low,
  high,
  optimum,
  min = 0,
  max = 100,
  value,
  className,
  children,
  'aria-describedby': describedBy,
  ref,
  ...props
}: MeterRootProps & { ref?: React.Ref<HTMLDivElement> }) {
  const [described, setDescribed] = React.useState<readonly string[]>([])
  const describe = React.useCallback((id: string) => {
    setDescribed((ids) => [...ids, id])
    return () => setDescribed((ids) => ids.filter((other) => other !== id))
  }, [])
  const context = React.useMemo(
    () => ({
      min,
      max,
      value,
      ranges: { min, max, low, high, optimum },
      describe,
    }),
    [min, max, value, low, high, optimum, describe],
  )
  const tone = meterTone(value, { min, max, low, high, optimum })
  return (
    <MeterContext.Provider value={context}>
      <BaseMeter.Root
        {...props}
        ref={ref}
        value={value}
        min={min}
        max={max}
        aria-describedby={
          [describedBy, ...described].filter(Boolean).join(' ') || undefined
        }
        data-tone={tone}
        className={skin('surf-gauge surf-meter', className)}
      >
        {children}
      </BaseMeter.Root>
    </MeterContext.Provider>
  )
}

/** Adds a mark's text to the meter's description while it is rendered. */
function useDescription(text: React.ReactNode) {
  const { describe } = React.useContext(MeterContext)
  const id = React.useId()
  const described = text !== undefined && text !== null && text !== ''
  React.useEffect(
    () => (described ? describe(id) : undefined),
    [described, describe, id],
  )
  return described ? id : undefined
}

export type MeterTargetProps = Omit<
  React.ComponentPropsWithoutRef<'span'>,
  'children'
> & {
  /** Where the target is, in the meter's own units. */
  value: number
  /** What assistive technology hears for it, such as "Target 40%". */
  label: string
}
/** A target on the track, such as a goal or an allocation to reach: a line across
 * the track at its value, named in the meter's description. */
const Target = function MeterTarget({
  value,
  label,
  className,
  style,
  ref,
  ...props
}: MeterTargetProps & { ref?: React.Ref<HTMLSpanElement> }) {
  const { min, max } = React.useContext(MeterContext)
  const id = useDescription(label)
  return (
    <span
      {...props}
      ref={ref}
      className={cx('surf-meter-target', className)}
      style={{ insetInlineStart: share(value, min, max), ...style }}
    >
      <span id={id} className='surf-visually-hidden'>
        {label}
      </span>
    </span>
  )
}

export type MeterTickProps = Omit<
  React.ComponentPropsWithoutRef<'span'>,
  'children'
> & {
  /** Where the tick is, in the meter's own units. */
  value: number
  /** Names a milestone for assistive technology, such as "Half the goal". A tick
   * without one only divides the track. */
  label?: string
}
/** A tick under the track, such as a milestone on the way to a goal. */
const Tick = function MeterTick({
  value,
  label,
  className,
  style,
  ref,
  ...props
}: MeterTickProps & { ref?: React.Ref<HTMLSpanElement> }) {
  const { min, max } = React.useContext(MeterContext)
  const id = useDescription(label)
  return (
    <span
      {...props}
      ref={ref}
      className={cx('surf-meter-tick', className)}
      style={{ insetInlineStart: share(value, min, max), ...style }}
    >
      {label && (
        <span id={id} className='surf-visually-hidden'>
          {label}
        </span>
      )}
    </span>
  )
}

// The arc's geometry, in its own units: a half circle under a 120 by 66 box.
const arc = { x: 60, y: 58, radius: 46, stroke: 8, gap: 3, needle: 34 }
/** A point on the arc: the minimum at the left end, the maximum at the right. */
const arcAngle = (value: number, min: number, max: number) =>
  Math.PI * (1 - (clamp(value, min, max) - min) / (max - min || 1))
const arcPoint = (angle: number, radius: number) =>
  [arc.x + radius * Math.cos(angle), arc.y - radius * Math.sin(angle)] as const
/** A zone's band: the arc between two values, a gap short of each neighbor and with
 * rounded ends inside the half circle. A zone too narrow for its rounded ends is a
 * dot at its middle, so a threshold never moves to make a band fit. */
function arcBand(
  from: number,
  to: number,
  {
    min,
    max,
    first,
    last,
  }: { min: number; max: number; first: boolean; last: boolean },
) {
  const cap = arc.stroke / 2 / arc.radius
  const gap = arc.gap / 2 / arc.radius
  const start = arcAngle(from, min, max) - (first ? 0 : gap)
  const end = arcAngle(to, min, max) + (last ? 0 : gap)
  let a = start - cap
  let b = end + cap
  if (a <= b) {
    const middle = (start + end) / 2
    a = middle + 0.005
    b = middle - 0.005
  }
  const [x1, y1] = arcPoint(a, arc.radius)
  const [x2, y2] = arcPoint(b, arc.radius)
  return `M${x1.toFixed(2)} ${y1.toFixed(2)}A${arc.radius} ${arc.radius} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

export type MeterArcProps = Omit<
  React.ComponentPropsWithoutRef<'svg'>,
  'children'
>
/** The meter drawn as a half circle with a needle at its value, such as a market
 * indicator on a card. With low, high and optimum, the arc splits into its ranges,
 * a small gap at each threshold, in the tone each range takes: optimum, caution or
 * danger. Use it in place of Track. */
const Arc = function MeterArc({
  className,
  ref,
  ...props
}: MeterArcProps & { ref?: React.Ref<SVGSVGElement> }) {
  const { min, max, value, ranges } = React.useContext(MeterContext)
  const judged = meterRanges(ranges)
  const bounds = judged
    ? [min, judged.lowEnd, judged.highStart, max].filter(
        (bound, index, all) => index === 0 || bound > all[index - 1],
      )
    : [min, max]
  const zones = bounds.slice(1).map((to, index) => ({
    from: bounds[index],
    to,
    tone: judged?.tone((bounds[index] + to) / 2),
  }))
  const [x, y] = arcPoint(arcAngle(value, min, max), arc.needle)
  return (
    <svg
      {...props}
      ref={ref}
      viewBox='0 0 120 66'
      aria-hidden='true'
      className={cx('surf-meter-arc', className)}
    >
      {zones.map((zone, index) => (
        <path
          key={zone.from}
          className='surf-meter-arc-zone'
          data-tone={zone.tone}
          d={arcBand(zone.from, zone.to, {
            min,
            max,
            first: index === 0,
            last: index === zones.length - 1,
          })}
          strokeWidth={arc.stroke}
        />
      ))}
      <line
        className='surf-meter-arc-needle'
        x1={arc.x}
        y1={arc.y}
        x2={x.toFixed(2)}
        y2={y.toFixed(2)}
      />
      <circle className='surf-meter-arc-hub' cx={arc.x} cy={arc.y} r={4} />
    </svg>
  )
}

export const Meter = {
  ...BaseMeter,
  Root,
  Label: /* @__PURE__ */ part<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<typeof BaseMeter.Label>
  >(BaseMeter.Label, 'surf-gauge-label'),
  Value: /* @__PURE__ */ part<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<typeof BaseMeter.Value>
  >(BaseMeter.Value, 'surf-gauge-value'),
  Track: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseMeter.Track>
  >(BaseMeter.Track, 'surf-gauge-track'),
  Indicator: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseMeter.Indicator>
  >(BaseMeter.Indicator, 'surf-gauge-indicator'),
  Target,
  Tick,
  Arc,
}
// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Arc: MeterArc,
  Indicator: MeterIndicator,
  Label: MeterLabel,
  Root: MeterRoot,
  Target: MeterTarget,
  Tick: MeterTick,
  Track: MeterTrack,
  Value: MeterValue,
} = Meter
