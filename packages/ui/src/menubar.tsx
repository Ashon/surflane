'use client'
import * as React from 'react'
import { Menubar as BaseMenubar } from '@base-ui/react/menubar'
import { part } from './parts.js'

export const Menubar = /* @__PURE__ */ part<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenubar>
>(BaseMenubar, 'surf-menubar')
