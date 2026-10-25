'use client'
import * as React from 'react'

import {
  normalizeSize,
  type ComponentDensity,
  type ComponentSize,
  type ComponentSizeAlias,
} from './size.js'
export {
  normalizeSize,
  type ComponentDensity,
  type ComponentSize,
  type ComponentSizeAlias,
}
export const ComponentSizeContext = /* @__PURE__ */ React.createContext<
  ComponentSize | undefined
>(undefined)
/** Explicit sizes override the surrounding scheme; portals retain React context. */
export function useComponentSize(size?: ComponentSize) {
  const inherited = React.useContext(ComponentSizeContext)
  return normalizeSize(size) ?? inherited
}
export const ComponentDensityContext = /* @__PURE__ */ React.createContext<
  ComponentDensity | undefined
>(undefined)
/** A component's own density, else the surrounding one, else default. */
export function useComponentDensity(density?: ComponentDensity) {
  const inherited = React.useContext(ComponentDensityContext)
  return density ?? inherited ?? 'default'
}
/** No layout box: grid/flex items and semantic children retain their own layout.
 * For table internals, place the provider outside the table, never inside tbody.
 * Either prop may be left out to keep the surrounding size or density. */
export function SizeProvider({
  size,
  density,
  children,
}: {
  size?: ComponentSize
  /** compact tightens the gaps and insets of the blocks inside, and keeps controls
   * at their size on touch screens instead of growing them to 44px. */
  density?: ComponentDensity
  children: React.ReactNode
}) {
  const inheritedSize = React.useContext(ComponentSizeContext)
  const inheritedDensity = React.useContext(ComponentDensityContext)
  return (
    <ComponentSizeContext.Provider value={size ?? inheritedSize}>
      <ComponentDensityContext.Provider value={density ?? inheritedDensity}>
        <div
          className='surf-size-scope'
          data-ui-size={size}
          data-ui-density={density}
        >
          {children}
        </div>
      </ComponentDensityContext.Provider>
    </ComponentSizeContext.Provider>
  )
}
/** The size context for a part a server component renders with an explicit size, so
 * the popups it portals keep that size. */
export function SizeScope({
  size,
  children,
}: {
  size: ComponentSize
  children: React.ReactNode
}) {
  return (
    <ComponentSizeContext.Provider value={size}>
      {children}
    </ComponentSizeContext.Provider>
  )
}
