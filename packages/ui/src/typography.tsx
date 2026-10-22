'use client'
import * as React from 'react'
import { cx } from './parts.js'

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
    <Tag {...props} className={cx('pui-heading', className)} data-size={size} />
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
      className={cx('pui-text', className)}
      data-variant={variant}
      data-color={color}
      data-weight={weight}
    />
  )
}
export const Prose = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(function Prose({ className, ...props }, ref) {
  return <div {...props} ref={ref} className={cx('pui-prose', className)} />
})
