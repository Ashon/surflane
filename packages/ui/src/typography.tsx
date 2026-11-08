import * as React from 'react'
import { cx } from './class-names.js'

export type HeadingVariant =
  'display' | 'title' | 'page' | 'section' | 'subsection'
export function Heading({
  level = 2,
  variant,
  size,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  /** The type role, as Text's variant is: display, title, page, section or
   * subsection. */
  variant?: HeadingVariant
  /** @deprecated The earlier name for `variant`. `workspace` and `document` are
   * earlier names for `display`. */
  size?: HeadingVariant | 'workspace' | 'document'
}) {
  const Tag = `h${level}` as 'h1'
  // The role stays in data-size, which @surflane/css's heading classes read.
  return (
    <Tag
      {...props}
      className={cx('surf-heading', className)}
      data-size={variant ?? size ?? 'section'}
    />
  )
}
export function Text({
  as: Tag = 'p',
  variant = 'body',
  color = 'primary',
  weight = 'regular',
  lines,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  as?: 'p' | 'span' | 'div'
  /** `table` is the earlier name for `compact`, deprecated: it renders the same. */
  variant?:
    | 'body'
    | 'reading'
    | 'compact'
    | 'table'
    | 'caption'
    | 'label'
    | 'mono'
    | 'metric'
  color?: 'primary' | 'secondary' | 'muted'
  weight?: 'regular' | 'medium'
  /** Shows at most this many lines and ends the last with an ellipsis, so text of
   * any length takes the same height, such as an item's last message on a card.
   * Keep the whole text where the item opens. */
  lines?: number
}) {
  return (
    <Tag
      {...props}
      className={cx('surf-text', className)}
      data-variant={variant === 'table' ? 'compact' : variant}
      data-color={color}
      data-weight={weight}
      data-lines={lines}
      style={
        lines === undefined
          ? style
          : ({ '--surf-text-lines': lines, ...style } as React.CSSProperties)
      }
    />
  )
}
export const Prose = function Prose({
  className,
  ref,
  ...props
}: React.ComponentProps<'div'> & { ref?: React.Ref<HTMLDivElement> }) {
  return <div {...props} ref={ref} className={cx('surf-prose', className)} />
}
/** Text for assistive technology only, such as a column's name over checkboxes or a
 * live status that has no place on screen. It keeps its place in the reading order
 * and takes no space. */
export function VisuallyHidden({
  as: Tag = 'span',
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & { as?: 'span' | 'div' | 'p' }) {
  return <Tag {...props} className={cx('surf-visually-hidden', className)} />
}
