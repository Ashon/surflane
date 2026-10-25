import * as React from 'react'
import { Surface } from './layout.js'
import { cx } from './class-names.js'
import { elementPart } from './element-part.js'
import { normalizeSize, type ComponentSize } from './size.js'
import { SizeScope } from './sizing.js'

const CardRoot = function CardRoot({
  className,
  padding,
  size,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof Surface> & {
  /** The card's padding, title and the controls inside, as a SizeProvider would set. */
  size?: ComponentSize
  ref?: React.Ref<HTMLDivElement>
}) {
  const scheme = normalizeSize(size)
  const card = (
    <Surface
      {...props}
      padding={padding}
      ref={ref}
      data-ui-size={scheme}
      className={cx('surf-card', className)}
    />
  )
  // Only an explicit size opens a client boundary, so popups inside keep it.
  return scheme ? <SizeScope size={scheme}>{card}</SizeScope> : card
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
