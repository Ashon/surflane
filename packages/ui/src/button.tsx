'use client'
import * as React from 'react'
import { Button as BaseButton } from '@base-ui/react/button'
import { useRender } from '@base-ui/react/use-render'
import { useComponentSize, type ComponentSizeAlias } from './sizing.js'
import { sizeName, skin } from './parts.js'
/** Visual priority. `default` remains a compatibility alias of `primary`. */
export type ButtonVariant =
  | 'primary'
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link'
export type ButtonSize =
  ComponentSizeAlias | 'xs' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'
export type ButtonProps = React.ComponentProps<typeof BaseButton> & {
  variant?: ButtonVariant
  size?: ButtonSize
}
/** The size scheme a button size implies: icon sizes follow the scale, xs and icon
 * keep the surrounding scheme. */
function schemeOf(size?: ButtonSize) {
  return size === 'icon-sm' || size === 'icon-xs'
    ? 'small'
    : size === 'icon-lg'
      ? 'large'
      : size === 'xs' || size === 'icon'
        ? undefined
        : (size as ComponentSizeAlias | undefined)
}
export const Button = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function Button({ className, variant = 'default', size, ...props }, ref) {
  const scheme = useComponentSize(schemeOf(size))
  return (
    <BaseButton
      ref={ref}
      {...props}
      className={skin('pui-button', className)}
      data-variant={variant}
      data-size={sizeName(size)}
      data-ui-size={scheme}
    />
  )
})

export type LinkButtonProps = Omit<useRender.ComponentProps<'a'>, 'ref'> & {
  variant?: ButtonVariant
  size?: ButtonSize
}
/** A link that looks like a Button. It navigates, so it stays a link for assistive
 * technology; pass a router's link element as `render` to keep client navigation. */
export const LinkButton = /* @__PURE__ */ React.forwardRef<
  HTMLAnchorElement,
  LinkButtonProps
>(function LinkButton(
  { render, className, variant = 'default', size, ...props },
  ref,
) {
  const scheme = useComponentSize(schemeOf(size))
  return useRender({
    defaultTagName: 'a',
    render,
    ref,
    props: {
      ...props,
      className: ['pui-button', className].filter(Boolean).join(' '),
      'data-variant': variant,
      'data-size': sizeName(size),
      'data-ui-size': scheme,
    },
  })
})
