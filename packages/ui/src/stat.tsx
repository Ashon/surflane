import * as React from 'react'
import { Icon } from './icon.js'
import { cx } from './class-names.js'
import { elementPart } from './element-part.js'
import { formatPercent } from './format.js'
import { StatusIcon, type StatusTone } from './status.js'

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
export type StatStatusProps = React.ComponentPropsWithoutRef<'dd'> & {
  /** The value's state: caution for one to watch, danger for one past its limit. */
  tone: StatusTone
}
/** The value's state against a threshold, such as "Below 30 GiB": the tone's icon and
 * text in its color. A caution or danger status colors the value too, and the text
 * says why, so color is never alone. */
const StatusPart = function StatStatus({
  tone,
  className,
  children,
  ref,
  ...props
}: StatStatusProps & { ref?: React.Ref<HTMLElement> }) {
  return (
    <dd
      {...props}
      ref={ref}
      data-tone={tone}
      className={cx('surf-stat-status', className)}
    >
      <StatusIcon tone={tone} />
      {children}
    </dd>
  )
}
export type StatGroupProps = React.ComponentPropsWithoutRef<'div'> & {
  /** What every value in the group measures, such as "GPU temperature". It shows
   * above them and names the group. */
  label: string
}
/** Several values of one measure side by side, such as one per node: a shared label
 * over Stat.Roots whose own labels name each. */
const GroupPart = function StatGroup({
  label,
  className,
  children,
  ref,
  ...props
}: StatGroupProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      role='group'
      aria-label={label}
      {...props}
      ref={ref}
      className={cx('surf-stat-group', className)}
    >
      <span className='surf-stat-group-label' aria-hidden='true'>
        {label}
      </span>
      <div className='surf-stat-group-items'>{children}</div>
    </div>
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
  Status: StatusPart,
  Caption: /* @__PURE__ */ elementPart<
    HTMLElement,
    React.ComponentPropsWithoutRef<'dd'>
  >('dd', 'surf-stat-caption'),
  Group: GroupPart,
}

// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Root: StatRoot,
  Label: StatLabel,
  Value: StatValue,
  Change: StatChange,
  Status: StatStatus,
  Caption: StatCaption,
  Group: StatGroup,
} = Stat
