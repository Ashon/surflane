'use client'
import * as React from 'react'
import { cx } from './parts.js'

export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20
const gapStyle = (
  gap: Space | undefined,
  style: React.CSSProperties | undefined,
) =>
  ({
    ...(gap === undefined ? {} : { '--layout-gap': `var(--space-${gap})` }),
    ...style,
  }) as React.CSSProperties
export const Container = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    width?: 'workspace' | 'reading' | 'wide' | 'full'
  }
>(function Container({ width = 'workspace', className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('pui-container', className)}
      data-width={width}
    />
  )
})
export const Stack = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & { gap?: Space }
>(function Stack({ gap, className, style, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('pui-stack', className)}
      style={gapStyle(gap, style)}
    />
  )
})
export const Inline = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    gap?: Space
    justify?: 'start' | 'between' | 'end'
  }
>(function Inline({ gap, justify = 'start', className, style, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('pui-inline', className)}
      data-justify={justify}
      style={gapStyle(gap, style)}
    />
  )
})
export const Grid = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    gap?: Space
    /** Extend inline edges by the matching child content inset (card padding or table cell inset). The parent
     * must reserve this space for the card surface and focus outline. */
    bleed?: Space
    columns?: 1 | 2 | 3 | 4 | 'layout'
  }
>(function Grid(
  { gap, bleed = 0, columns = 3, className, style, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('pui-grid', className)}
      data-columns={columns}
      style={gapStyle(gap, {
        '--grid-inline-bleed': `var(--space-${bleed})`,
        ...style,
      } as React.CSSProperties)}
    />
  )
})
/** Spans are explicit at each viewport breakpoint; placement follows DOM order. */
export const GridItem = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    mediumSpan?: 1 | 2 | 3 | 4 | 5 | 6
    smallSpan?: 1 | 2 | 3 | 4
  }
>(function GridItem(
  { span, mediumSpan, smallSpan, className, style, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('pui-grid-item', className)}
      style={
        {
          '--grid-item-span': span,
          '--grid-item-span-medium': mediumSpan,
          '--grid-item-span-small': smallSpan,
          ...style,
        } as React.CSSProperties
      }
    />
  )
})
export type SurfaceKind = 'canvas' | 'subtle'
export const Surface = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    /** The background: subtle sits on the sheet, canvas matches it. */
    surface?: SurfaceKind
    /** @deprecated Use surface; tone names a status color elsewhere. */
    tone?: SurfaceKind
    padding?: Space
  }
>(function Surface(
  { surface, tone, padding, className, style, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('pui-surface', className)}
      data-surface={surface ?? tone ?? 'subtle'}
      style={
        {
          ...(padding === undefined
            ? {}
            : { '--surface-padding': `var(--space-${padding})` }),
          ...style,
        } as React.CSSProperties
      }
    />
  )
})
