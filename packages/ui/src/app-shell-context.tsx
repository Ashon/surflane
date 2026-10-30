'use client'
import * as React from 'react'

// The shell's state and whether a part sits in its sidebar, for parts of other
// modules that adapt to the sidebar, such as ThemeSwitch, so the shell never
// imports them.
export type Shell = {
  collapsed: boolean
  setCollapsed: (next: boolean) => void
  sidebarId: string
  shortcut: boolean
}
export const ShellContext = /* @__PURE__ */ React.createContext<Shell | null>(
  null,
)
export const SidebarContext = /* @__PURE__ */ React.createContext(false)
