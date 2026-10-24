'use client'
import * as React from 'react'
import { Slider as BaseSlider } from '@base-ui/react/slider'
import { part, skin } from './parts.js'
import { useResetValue, useRootRef } from './form-state.js'

function SliderRoot<Value extends number | readonly number[]>({
  value,
  defaultValue,
  onValueChange,
  ref,
  className,
  form,
  thumbAlignment = 'edge',
  ...props
}: BaseSlider.Root.Props<Value> & { ref?: React.Ref<HTMLDivElement> }) {
  const [element, attach] = useRootRef(ref)
  const [selected, setSelected] = useResetValue(
    value,
    (defaultValue ?? props.min ?? 0) as Value,
    element,
    form,
  )
  return (
    <BaseSlider.Root<Value>
      {...props}
      form={form}
      ref={attach}
      value={selected}
      thumbAlignment={thumbAlignment}
      className={skin('surf-slider', className)}
      onValueChange={(next, event) => {
        onValueChange?.(next, event)
        if (value === undefined && !event.isCanceled) setSelected(next as Value)
      }}
    />
  )
}
export const Slider = {
  ...BaseSlider,
  Root: SliderRoot,
  Label: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseSlider.Label>
  >(BaseSlider.Label, 'surf-slider-label'),
  Value: /* @__PURE__ */ part<
    HTMLOutputElement,
    React.ComponentPropsWithoutRef<typeof BaseSlider.Value>
  >(BaseSlider.Value, 'surf-slider-value'),
  Control: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseSlider.Control>
  >(BaseSlider.Control, 'surf-slider-control'),
  Track: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseSlider.Track>
  >(BaseSlider.Track, 'surf-slider-track'),
  Indicator: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseSlider.Indicator>
  >(BaseSlider.Indicator, 'surf-slider-indicator'),
  Thumb: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseSlider.Thumb>
  >(BaseSlider.Thumb, 'surf-slider-thumb'),
}
// Flat names for React Server Components, which cannot dot into client exports.
export { SliderRoot }
export const {
  Control: SliderControl,
  Indicator: SliderIndicator,
  Label: SliderLabel,
  Thumb: SliderThumb,
  Track: SliderTrack,
  Value: SliderValue,
} = Slider
