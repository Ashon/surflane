'use client'
import * as React from 'react'
import { Meter as BaseMeter } from '@base-ui/react/meter'
import { part } from './parts.js'

export const Meter = {
  ...BaseMeter,
  Root: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseMeter.Root>
  >(BaseMeter.Root, 'surf-gauge surf-meter'),
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
}
// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Indicator: MeterIndicator,
  Label: MeterLabel,
  Root: MeterRoot,
  Track: MeterTrack,
  Value: MeterValue,
} = Meter
