import * as React from 'react'
import { Surface } from './layout.js'
import { cx } from './class-names.js'
import { elementPart } from './element-part.js'

const CardRoot = function CardRoot({
  className,
  padding,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof Surface> & {
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <Surface
      {...props}
      padding={padding}
      ref={ref}
      className={cx('surf-card', className)}
    />
  )
}
const CardTitle = function CardTitle({
  level = 3,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'h3'> & { level?: 2 | 3 | 4 | 5 | 6 } & {
  ref?: React.Ref<HTMLHeadingElement>
}) {
  return React.createElement(`h${level}`, {
    ...props,
    ref,
    className: cx('surf-card-title', className),
  })
}
export const Card = {
  Root: CardRoot,
  Header: /* @__PURE__ */ elementPart<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'surf-card-header'),
  Title: CardTitle,
  Description: /* @__PURE__ */ elementPart<
    HTMLParagraphElement,
    React.ComponentPropsWithoutRef<'p'>
  >('p', 'surf-card-description'),
  Body: /* @__PURE__ */ elementPart<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'surf-card-body'),
  Footer: /* @__PURE__ */ elementPart<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'surf-card-footer'),
}
// Flat names for React Server Components, which cannot dot into client exports.
export { CardRoot, CardTitle }
export const {
  Header: CardHeader,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
} = Card
