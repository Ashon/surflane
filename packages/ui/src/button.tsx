'use client'
import * as React from 'react'
import { Button as BaseButton } from '@base-ui/react/button'
import { useRender } from '@base-ui/react/use-render'
import { useComponentSize, type ComponentSize } from './sizing.js'
import { skin, cx } from './parts.js'
/** Visual priority. Without a variant a button is `primary`. */
export type ButtonVariant =
  'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
/** small, default and large set the size scheme; icon, icon-small and icon-large are
 * square icon buttons on the same scale. */
export type ButtonSize = ComponentSize | 'icon' | 'icon-small' | 'icon-large'
export type ButtonProps = Omit<
  React.ComponentProps<typeof BaseButton>,
  'ref'
> & {
  variant?: ButtonVariant
  size?: ButtonSize
  ref?: React.Ref<HTMLButtonElement>
}
/** The size scheme a button size implies: icon sizes follow the scale, and icon keeps
 * the surrounding scheme. */
function schemeOf(size?: ButtonSize) {
  return size === 'icon-small'
    ? 'small'
    : size === 'icon-large'
      ? 'large'
      : size === 'icon'
        ? undefined
        : size
}
export const Button = function Button({
  className,
  variant = 'primary',
  size,
  ref,
  ...props
}: ButtonProps) {
  const scheme = useComponentSize(schemeOf(size))
  return (
    <BaseButton
      ref={ref}
      {...props}
      className={skin('surf-button', className)}
      data-variant={variant}
      data-size={size}
      data-ui-size={scheme}
    />
  )
}

export type LinkButtonProps = Omit<useRender.ComponentProps<'a'>, 'ref'> & {
  variant?: ButtonVariant
  size?: ButtonSize
}
/** A link that looks like a Button. It navigates, so it stays a link for assistive
 * technology; pass a router's link element as `render` to keep client navigation. */
export const LinkButton = function LinkButton({
  render,
  className,
  variant = 'primary',
  size,
  ref,
  ...props
}: LinkButtonProps & { ref?: React.Ref<HTMLAnchorElement> }) {
  const scheme = useComponentSize(schemeOf(size))
  return useRender({
    defaultTagName: 'a',
    render,
    ref,
    props: {
      ...props,
      className: cx('surf-button', className),
      'data-variant': variant,
      'data-size': size,
      'data-ui-size': scheme,
    },
  })
}
