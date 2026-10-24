'use client'
import * as React from 'react'
import { useComponentSize } from './sizing.js'
import { Switch as BaseSwitch } from '@base-ui/react/switch'
import { skin, part } from './parts.js'
import { useRootRef, useResetValue } from './form-state.js'
import { type ChoiceSize } from './choice.js'

const SwitchRoot = function SwitchRoot({
  size,
  checked,
  defaultChecked = false,
  onCheckedChange,
  className,
  form,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseSwitch.Root> &
  ChoiceSize & {
    ref?: React.Ref<React.ComponentRef<typeof BaseSwitch.Root>>
  }) {
  const scheme = useComponentSize(size)
  const [element, attach] = useRootRef<HTMLElement>(ref)
  const [selected, setSelected] = useResetValue(
    checked,
    defaultChecked,
    element,
    form,
  )
  return (
    <BaseSwitch.Root
      {...props}
      data-ui-size={size ? scheme : undefined}
      form={form}
      ref={attach}
      checked={selected}
      className={skin('surf-switch', className)}
      onCheckedChange={(next, event) => {
        onCheckedChange?.(next, event)
        if (checked === undefined && !event.isCanceled) setSelected(next)
      }}
    />
  )
}
export const Switch = {
  ...BaseSwitch,
  Root: SwitchRoot,
  Thumb: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseSwitch.Thumb>,
    React.ComponentPropsWithoutRef<typeof BaseSwitch.Thumb>
  >(BaseSwitch.Thumb, 'surf-switch-thumb'),
}
// Flat names for React Server Components, which cannot dot into client exports.
export { SwitchRoot }
export const { Thumb: SwitchThumb } = Switch
