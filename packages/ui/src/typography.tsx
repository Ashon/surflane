import * as React from 'react'
import { cx } from './class-names.js'

export function Heading({
  level = 2,
  size = 'section',
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  size?:
    | 'display'
    | 'title'
    | 'page'
    | 'section'
    | 'subsection'
    | 'workspace'
    | 'document'
}) {
  const Tag = `h${level}` as 'h1'
  return (
    <Tag
      {...props}
      className={cx('surf-heading', className)}
      data-size={size}
    />
  )
}
export function Text({
  as: Tag = 'p',
  variant = 'body',
  color = 'primary',
  weight = 'regular',
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  as?: 'p' | 'span' | 'div'
  variant?:
    'body' | 'reading' | 'table' | 'caption' | 'label' | 'mono' | 'metric'
  color?: 'primary' | 'secondary' | 'muted'
  weight?: 'regular' | 'medium'
}) {
  return (
    <Tag
      {...props}
      className={cx('surf-text', className)}
      data-variant={variant}
      data-color={color}
      data-weight={weight}
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
