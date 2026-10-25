'use client'
import * as React from 'react'
import { type ComponentSize } from './sizing.js'

export const ChoiceResetPaint = /* @__PURE__ */ React.createContext(0)
/** Choice controls follow the surrounding size; `size` sets one control's scale. */
export type ChoiceSize = { size?: ComponentSize }
