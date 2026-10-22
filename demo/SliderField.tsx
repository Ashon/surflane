import React from 'react'
import { Slider } from '@surflane/ui'

/** A labelled single-thumb slider that shows and announces its formatted value. */
export function SliderField({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (value: number) => string
  onChange: (value: number) => void
}) {
  return (
    <Slider.Root
      value={value}
      min={min}
      max={max}
      step={step}
      onValueChange={(next) => onChange(Array.isArray(next) ? next[0] : next)}
    >
      <Slider.Label>{label}</Slider.Label>
      <Slider.Value>{(_, values) => format(values[0])}</Slider.Value>
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb getAriaValueText={(_, next) => format(next)} />
      </Slider.Control>
    </Slider.Root>
  )
}
