'use client'
import * as React from 'react'

import {
  normalizeSize,
  type ComponentSize,
  type ComponentSizeAlias,
} from './size.js'
export { normalizeSize, type ComponentSize, type ComponentSizeAlias }
export const ComponentSizeContext = /* @__PURE__ */ React.createContext<
  ComponentSize | undefined
>(undefined)
/** Explicit sizes override the surrounding scheme; portals retain React context. */
export function useComponentSize(size?: ComponentSizeAlias) {
  const inherited = React.useContext(ComponentSizeContext)
  return normalizeSize(size) ?? inherited
}
/** No layout box: grid/flex items and semantic children retain their own layout.
 * For table internals, place the provider outside the table, never inside tbody. */
export function SizeProvider({
  size,
  children,
}: {
  size: ComponentSize
  children: React.ReactNode
}) {
  return (
    <ComponentSizeContext.Provider value={size}>
      <div className='surf-size-scope' data-ui-size={size}>
        {children}
      </div>
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
