'use client'
import * as React from 'react'
import { Button as BaseButton } from '@base-ui/react/button'
import { useRender } from '@base-ui/react/use-render'
import { useComponentSize, type ComponentSizeAlias } from './sizing.js'
import { sizeName, skin, cx } from './parts.js'
/** Visual priority. `default` is deprecated: it is `primary` under its former name, and
 * is removed in a later minor. Without a variant a button is `primary`. */
export type ButtonVariant =
  | 'primary'
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link'
/**
 * small, default and large set the size scheme; icon, icon-small and icon-large are
 * square icon buttons. Deprecated, removed in a later minor: sm, md and lg (write the
 * full names), icon-sm, icon-xs and icon-lg (icon-small, icon-large) and xs, which is
 * off the scale and keeps 24px on touch screens.
 */
export type ButtonSize =
  | ComponentSizeAlias
  | 'icon'
  | 'icon-small'
  | 'icon-large'
  | 'xs'
  | 'icon-xs'
  | 'icon-sm'
  | 'icon-lg'
export type ButtonProps = Omit<
  React.ComponentProps<typeof BaseButton>,
  'ref'
> & {
  variant?: ButtonVariant
  size?: ButtonSize
  ref?: React.Ref<HTMLButtonElement>
}
/** The size scheme a button size implies: icon sizes follow the scale, xs and icon
 * keep the surrounding scheme. */
function schemeOf(size?: ButtonSize) {
  return size === 'icon-small' || size === 'icon-sm' || size === 'icon-xs'
    ? 'small'
    : size === 'icon-large' || size === 'icon-lg'
      ? 'large'
      : size === 'xs' || size === 'icon'
        ? undefined
        : (size as ComponentSizeAlias | undefined)
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
      data-size={sizeName(size)}
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
      'data-size': sizeName(size),
      'data-ui-size': scheme,
    },
  })
}
