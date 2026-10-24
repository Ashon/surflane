import * as React from 'react'
import { cx } from './class-names.js'

export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20
const gapStyle = (
  gap: Space | undefined,
  style: React.CSSProperties | undefined,
) =>
  ({
    ...(gap === undefined
      ? {}
      : { '--surf-layout-gap': `var(--surf-space-${gap})` }),
    ...style,
  }) as React.CSSProperties
export const Container = function Container({
  width = 'workspace',
  className,
  ref,
  ...props
}: React.ComponentProps<'div'> & {
  width?: 'workspace' | 'reading' | 'wide' | 'full'
} & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('surf-container', className)}
      data-width={width}
    />
  )
}
export const Stack = function Stack({
  gap,
  className,
  style,
  ref,
  ...props
}: React.ComponentProps<'div'> & { gap?: Space } & {
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('surf-stack', className)}
      style={gapStyle(gap, style)}
    />
  )
}
export const Inline = function Inline({
  gap,
  justify = 'start',
  className,
  style,
  ref,
  ...props
}: React.ComponentProps<'div'> & {
  gap?: Space
  justify?: 'start' | 'between' | 'end'
} & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('surf-inline', className)}
      data-justify={justify}
      style={gapStyle(gap, style)}
    />
  )
}
export const Grid = function Grid({
  gap,
  bleed = 0,
  columns = 3,
  className,
  style,
  ref,
  ...props
}: React.ComponentProps<'div'> & {
  gap?: Space
  /** Extend inline edges by the matching child content inset (card padding or table cell inset). The parent
   * must reserve this space for the card surface and focus outline. */
  bleed?: Space
  columns?: 1 | 2 | 3 | 4 | 'layout'
} & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('surf-grid', className)}
      data-columns={columns}
      style={gapStyle(gap, {
        '--surf-grid-inline-bleed': `var(--surf-space-${bleed})`,
        ...style,
      } as React.CSSProperties)}
    />
  )
}
/** Spans are explicit at each viewport breakpoint; placement follows DOM order. */
export const GridItem = function GridItem({
  span,
  mediumSpan,
  smallSpan,
  className,
  style,
  ref,
  ...props
}: React.ComponentProps<'div'> & {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  mediumSpan?: 1 | 2 | 3 | 4 | 5 | 6
  smallSpan?: 1 | 2 | 3 | 4
} & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('surf-grid-item', className)}
      style={
        {
          '--surf-grid-item-span': span,
          '--surf-grid-item-span-medium': mediumSpan,
          '--surf-grid-item-span-small': smallSpan,
          ...style,
        } as React.CSSProperties
      }
    />
  )
}
export type SurfaceKind = 'canvas' | 'subtle'
export const Surface = function Surface({
  surface,
  tone,
  padding,
  className,
  style,
  ref,
  ...props
}: React.ComponentProps<'div'> & {
  /** The background: subtle sits on the sheet, canvas matches it. */
  surface?: SurfaceKind
  /** @deprecated Use surface; tone names a status color elsewhere. */
  tone?: SurfaceKind
  padding?: Space
} & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('surf-surface', className)}
      data-surface={surface ?? tone ?? 'subtle'}
      style={
        {
          ...(padding === undefined
            ? {}
            : { '--surf-surface-padding': `var(--surf-space-${padding})` }),
          ...style,
        } as React.CSSProperties
      }
    />
  )
}
