'use client'
import * as React from 'react'
import { Progress as BaseProgress } from '@base-ui/react/progress'
import { part } from './parts.js'

export const Progress = {
  ...BaseProgress,
  Root: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseProgress.Root>
  >(BaseProgress.Root, 'pui-gauge pui-progress'),
  Label: /* @__PURE__ */ part<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<typeof BaseProgress.Label>
  >(BaseProgress.Label, 'pui-gauge-label'),
  Value: /* @__PURE__ */ part<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<typeof BaseProgress.Value>
  >(BaseProgress.Value, 'pui-gauge-value'),
  Track: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseProgress.Track>
  >(BaseProgress.Track, 'pui-gauge-track'),
  Indicator: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseProgress.Indicator>
  >(BaseProgress.Indicator, 'pui-gauge-indicator'),
}
// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Indicator: ProgressIndicator,
  Label: ProgressLabel,
  Root: ProgressRoot,
  Track: ProgressTrack,
  Value: ProgressValue,
} = Progress
