'use client'
import * as React from 'react'
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group'
import { Toggle as BaseToggle } from '@base-ui/react/toggle'
import { skin } from './parts.js'
import { useComponentSize, type ComponentSize } from './sizing.js'

type SegmentedControlBase = Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'defaultValue' | 'onChange' | 'dir'
> & {
  /** content sizes the track to its segments; fill stretches it to its container
   * and shares the width among the segments. */
  width?: 'content' | 'fill'
  size?: ComponentSize
  disabled?: boolean
}
/** One value from a few, as a string, such as a period or a side of a trade. */
export type SegmentedControlRootProps<Value extends string> =
  SegmentedControlBase &
    (
      | {
          /** One segment is always chosen; pressing it again keeps it. */
          required?: true
          value?: Value
          defaultValue?: Value
          onValueChange?: (value: Value) => void
        }
      | {
          /** Pressing the chosen segment again clears the choice, as a filter does. */
          required: false
          value?: Value | null
          defaultValue?: Value | null
          onValueChange?: (value: Value | null) => void
        }
    )
/** A row of segments that chooses one value, or none when required is false. Name it
 * with aria-label or aria-labelledby. */
function Root<Value extends string>({
  value,
  defaultValue,
  onValueChange,
  required = true,
  width = 'content',
  size,
  disabled,
  className,
  ref,
  ...props
}: SegmentedControlRootProps<Value> & { ref?: React.Ref<HTMLDivElement> }) {
  const scheme = useComponentSize(size)
  const [own, setOwn] = React.useState<Value | null>(defaultValue ?? null)
  const current = value === undefined ? own : value
  return (
    <BaseToggleGroup<Value>
      {...props}
      ref={ref}
      disabled={disabled}
      value={current == null ? [] : [current]}
      onValueChange={(values, eventDetails) => {
        const next = values[0] ?? null
        // A required control keeps its segment when the reader presses it again.
        if (next === null && required) {
          eventDetails.cancel()
          return
        }
        if (value === undefined) setOwn(next)
        ;(onValueChange as ((value: Value | null) => void) | undefined)?.(next)
      }}
      className={skin('surf-control-group surf-segmented', className)}
      data-width={width === 'fill' ? 'fill' : undefined}
      data-ui-size={scheme}
    />
  )
}
export type SegmentedControlItemProps = Omit<
  React.ComponentPropsWithoutRef<typeof BaseToggle>,
  'value'
> & {
  value: string
}
/** One segment: a button that shows whether it is the chosen one. */
const Item = function SegmentedControlItem({
  className,
  ref,
  ...props
}: SegmentedControlItemProps & { ref?: React.Ref<HTMLButtonElement> }) {
  return (
    <BaseToggle
      {...props}
      ref={ref}
      className={skin('surf-segment', className)}
    />
  )
}

export const SegmentedControl = { Root, Item }
// Flat names for React Server Components, which cannot dot into client exports.
export { Root as SegmentedControlRoot, Item as SegmentedControlItem }
