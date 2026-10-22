'use client'
import * as React from 'react'
import { Surface } from './layout.js'
import { part, cx } from './parts.js'

const CardRoot = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Surface>
>(function CardRoot({ className, padding, ...props }, ref) {
  return (
    <Surface
      {...props}
      padding={padding}
      ref={ref}
      className={cx('pui-card', className)}
    />
  )
})
const CardTitle = /* @__PURE__ */ React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<'h3'> & { level?: 2 | 3 | 4 | 5 | 6 }
>(function CardTitle({ level = 3, className, ...props }, ref) {
  return React.createElement(`h${level}`, {
    ...props,
    ref,
    className: cx('pui-card-title', className),
  })
})
export const Card = {
  Root: CardRoot,
  Header: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'pui-card-header'),
  Title: CardTitle,
  Description: /* @__PURE__ */ part<
    HTMLParagraphElement,
    React.ComponentPropsWithoutRef<'p'>
  >('p', 'pui-card-description'),
  Body: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'pui-card-body'),
  Footer: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'pui-card-footer'),
}
// Flat names for React Server Components, which cannot dot into client exports.
export { CardRoot, CardTitle }
export const {
  Header: CardHeader,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
} = Card
