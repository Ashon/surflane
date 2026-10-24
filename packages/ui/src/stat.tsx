import * as React from 'react'
import { Icon } from './icon.js'
import { cx } from './class-names.js'
import { elementPart } from './element-part.js'
import { formatPercent } from './format.js'

export type StatDirection = 'up' | 'down' | 'flat'
export type StatChangeProps = Omit<
  React.ComponentPropsWithoutRef<'dd'>,
  'children'
> & {
  /** The change, such as 0.023 for 2.3%. Its sign sets the direction. */
  value: number
  /** Text for the change. Defaults to a signed percentage of `value`. */
  format?: (value: number) => React.ReactNode
  /** Overrides the direction the sign gives. */
  direction?: StatDirection
  /** For measures where a fall is good, such as latency: the colors swap, the arrow
   * still points the way the value moved. */
  lowerIsBetter?: boolean
}
const signed = (value: number) => formatPercent(value, { signed: true })
const arrows = { up: 'arrow-up', down: 'arrow-down', flat: 'minus' } as const

/** A change against an earlier value: an arrow, a signed figure and its direction's
 * color. The sign and the arrow carry the direction, so color is never alone. */
const ChangePart = function StatChange({
  value,
  format = signed,
  direction,
  lowerIsBetter,
  className,
  ref,
  ...props
}: StatChangeProps & { ref?: React.Ref<HTMLElement> }) {
  const way: StatDirection =
    direction ?? (value > 0 ? 'up' : value < 0 ? 'down' : 'flat')
  const tone =
    way === 'flat' || !lowerIsBetter ? way : way === 'up' ? 'down' : 'up'
  return (
    <dd
      {...props}
      ref={ref}
      data-direction={way}
      data-tone={tone}
      className={cx('surf-stat-change', className)}
    >
      <Icon name={arrows[way]} />
      {format(value)}
    </dd>
  )
}
/** A key figure: what it measures, its value, how it moved and what it covers. Renders
 * a description list, so the label names the value for assistive technology. */
export const Stat = {
  Root: /* @__PURE__ */ elementPart<
    HTMLDListElement,
    React.ComponentPropsWithoutRef<'dl'>
  >('dl', 'surf-stat'),
  Label: /* @__PURE__ */ elementPart<
    HTMLElement,
    React.ComponentPropsWithoutRef<'dt'>
  >('dt', 'surf-stat-label'),
  Value: /* @__PURE__ */ elementPart<
    HTMLElement,
    React.ComponentPropsWithoutRef<'dd'>
  >('dd', 'surf-stat-value'),
  Change: ChangePart,
  Caption: /* @__PURE__ */ elementPart<
    HTMLElement,
    React.ComponentPropsWithoutRef<'dd'>
  >('dd', 'surf-stat-caption'),
}

// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Root: StatRoot,
  Label: StatLabel,
  Value: StatValue,
  Change: StatChange,
  Caption: StatCaption,
} = Stat
