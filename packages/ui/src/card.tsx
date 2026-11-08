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
  lines,
  className,
  style,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'h3'> & {
  level?: 2 | 3 | 4 | 5 | 6
  /** Shows at most this many lines and ends the last with an ellipsis, its action's
   * included, so every card in a collection keeps one title height. */
  lines?: number
} & {
  ref?: React.Ref<HTMLHeadingElement>
}) {
  return React.createElement(`h${level}`, {
    ...props,
    ref,
    className: cx('surf-card-title', className),
    'data-lines': lines,
    style:
      lines === undefined
        ? style
        : ({ '--surf-text-lines': lines, ...style } as React.CSSProperties),
  })
}
export type CardActionProps =
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
  | (React.ComponentPropsWithoutRef<'a'> & { href: string })
/** What the whole card opens, such as an item's details: the title's button, or its
 * link with href, stretched over the card. Hover, press and focus show on the card;
 * the other controls on it stay on top and keep their own actions. As the render of
 * a trigger, such as a Sheet's, it opens that. */
const CardAction = function CardAction(
  props: CardActionProps & {
    ref?: React.Ref<HTMLButtonElement & HTMLAnchorElement>
  },
) {
  if (props.href !== undefined) {
    const { className, ref, ...anchor } = props
    return (
      <a {...anchor} ref={ref} className={cx('surf-card-action', className)} />
    )
  }
  const { className, ref, type = 'button', ...button } = props
  return (
    <button
      {...button}
      ref={ref}
      type={type}
      className={cx('surf-card-action', className)}
    />
  )
}
export const Card = {
  Root: CardRoot,
  Header: /* @__PURE__ */ elementPart<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'surf-card-header'),
  Title: CardTitle,
  Action: CardAction,
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
export { CardRoot, CardTitle, CardAction }
export const {
  Header: CardHeader,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
} = Card
