'use client'
import * as React from 'react'
import { Meter as BaseMeter } from '@base-ui/react/meter'
import { cx, part, skin } from './parts.js'

/** Where the value stands against its ranges, as the native meter element judges it:
 * optimum in the range optimum falls in, caution one range away, danger two. */
function meterTone(
  value: number,
  {
    min = 0,
    max = 100,
    low,
    high,
    optimum,
  }: {
    min?: number
    max?: number
    low?: number
    high?: number
    optimum?: number
  },
) {
  if (low === undefined && high === undefined && optimum === undefined)
    return undefined
  const clamp = (n: number, from: number, to: number) =>
    Math.min(Math.max(n, from), to)
  const lowEnd = clamp(low ?? min, min, max)
  const highStart = clamp(high ?? max, lowEnd, max)
  const range = (n: number) => (n < lowEnd ? 0 : n > highStart ? 2 : 1)
  const best = range(clamp(optimum ?? (min + max) / 2, min, max))
  const away = Math.abs(range(clamp(value, min, max)) - best)
  return away === 0 ? 'optimum' : away === 1 ? 'caution' : 'danger'
}

type MeterContextValue = {
  min: number
  max: number
  /** A Target or a labeled Tick adds its text to the meter's description. */
  describe: (id: string) => () => void
}
const MeterContext = /* @__PURE__ */ React.createContext<MeterContextValue>({
  min: 0,
  max: 100,
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
    () => ({ min, max, describe }),
    [min, max, describe],
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
}
// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Indicator: MeterIndicator,
  Label: MeterLabel,
  Root: MeterRoot,
  Target: MeterTarget,
  Tick: MeterTick,
  Track: MeterTrack,
  Value: MeterValue,
} = Meter
