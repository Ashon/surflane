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
export type GridColumns =
  | {
      /** A fixed count that steps down at the viewport breakpoints, or the 12 / 6 / 4
       * track layout grid. */
      columns?: 1 | 2 | 3 | 4 | 'layout'
      min?: never
    }
  | {
      /** As many columns as the grid's own width fits, each at least min wide, so
       * the grid reflows by the room it has, not by the window. */
      columns: 'auto'
      /** The narrowest column, by what it holds: a figure (tile, 10rem), a card or
       * a panel (card, 20rem), or a chart or a table of a few columns (wide, 30rem). */
      min?: 'tile' | 'card' | 'wide'
    }
export type GridProps = React.ComponentProps<'div'> & {
  gap?: Space
  /** Extend inline edges by the matching child content inset (card padding or table cell inset). The parent
   * must reserve this space for the card surface and focus outline. */
  bleed?: Space
} & GridColumns
export const Grid = function Grid({
  gap,
  bleed = 0,
  columns = 3,
  min,
  className,
  style,
  ref,
  ...props
}: GridProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('surf-grid', className)}
      data-columns={columns}
      data-min={columns === 'auto' ? (min ?? 'card') : undefined}
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
  padding,
  className,
  style,
  ref,
  ...props
}: React.ComponentProps<'div'> & {
  /** The background: subtle sits on the sheet, canvas matches it. */
  surface?: SurfaceKind
  padding?: Space
} & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('surf-surface', className)}
      data-surface={surface ?? 'subtle'}
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
