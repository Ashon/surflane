import {
  ComponentSizeContext,
  normalizeSize,
  useComponentSize,
  type ComponentSize,
  type ComponentSizeAlias,
} from './sizing.js'
import * as React from 'react'
/** Joins class names, skipping empty ones. */
export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
/** The data-size value: a short alias (sm, md, lg) renders as its full name, so both
 * spellings meet the same CSS; other values such as xs or icon pass through. */
export function sizeName<Size extends string>(size?: Size) {
  return size === 'sm' || size === 'md' || size === 'lg'
    ? normalizeSize(size as ComponentSizeAlias)
    : size
}
/** Preserve Base UI's state-dependent className contract when adding a skin. */
export function skin<State>(
  base: string,
  custom?: string | ((state: State) => string | undefined),
) {
  if (typeof custom === 'function')
    return (state: State) => cx(base, custom(state))
  return cx(base, custom)
}
/** A styled Base UI part or element. A portal part renders outside the tree that sets
 * data-ui-size, so it always carries the size scheme; other parts carry it only when
 * size is set. */
export function part<
  Element extends HTMLElement,
  Props extends { className?: unknown },
>(
  Component: React.ElementType,
  base: string,
  { portal = false }: { portal?: boolean } = {},
) {
  return React.forwardRef<
    Element,
    Omit<Props, 'size'> & { size?: ComponentSize }
  >(function ThemedPart(props, ref) {
    const { className, size, ...rest } = props as Omit<Props, 'size'> & {
      size?: ComponentSize
    }
    const scheme = useComponentSize(size)
    const classes =
      typeof className === 'function'
        ? (state: unknown) => cx(base, className(state))
        : cx(base, className as string | undefined)
    const element = (
      <Component
        {...rest}
        ref={ref}
        className={classes}
        data-ui-size={size ? scheme : portal ? scheme : undefined}
      />
    )
    // Keep the React subtree stable when size changes from omitted to explicit.
    return (
      <ComponentSizeContext.Provider value={scheme}>
        {element}
      </ComponentSizeContext.Provider>
    )
  })
}

/** True inside a namespace's own Portal, so a Content that brings its portal adds no
 * second one. Each Content resets it, so a nested popup portals itself. */
const PortalScope = /* @__PURE__ */ React.createContext(false)
/** A namespace Portal that marks its subtree as already portalled. */
export function scopedPortal<Portal extends React.ElementType>(
  BasePortal: Portal,
): Portal {
  const Scoped = React.forwardRef(function Portal(props: object, ref) {
    return (
      <PortalScope.Provider value={true}>
        {React.createElement(BasePortal, { ...props, ref })}
      </PortalScope.Provider>
    )
  })
  return Scoped as unknown as Portal
}
/** Renders a Content's positioner in its portal, unless a namespace Portal holds it. */
export function OwnPortal({
  portal: BasePortal,
  children,
}: {
  portal: React.ElementType
  children: React.ReactNode
}) {
  const inside = React.useContext(PortalScope)
  const content = (
    <PortalScope.Provider value={false}>{children}</PortalScope.Provider>
  )
  return inside ? content : <BasePortal>{content}</BasePortal>
}

/** Drops undefined entries, so explicit placement props override defaults only when set. */
export function defined<Props extends object>(props: Props): Partial<Props> {
  return Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== undefined),
  ) as Partial<Props>
}
/** The placement props a popup Content passes to its Positioner. */
export type Placement<Positioner extends React.ElementType> = Pick<
  React.ComponentPropsWithoutRef<Positioner>,
  'side' | 'align' | 'sideOffset' | 'collisionPadding'
>
