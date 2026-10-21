'use client'
import * as React from 'react'
import { Button as BaseButton } from '@base-ui/react/button'
import { useComponentSize, type ComponentSizeAlias } from './sizing.js'
import { skin } from './parts.js'
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
export const Button = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function Button({ className, variant = 'default', size, ...props }, ref) {
  const scheme = useComponentSize(
    size === 'icon-sm' || size === 'icon-xs'
      ? 'small'
      : size === 'icon-lg'
        ? 'large'
        : size === 'xs' || size === 'icon'
          ? undefined
          : (size as ComponentSizeAlias | undefined),
  )
  return (
    <BaseButton
      ref={ref}
      {...props}
      className={skin('pui-button', className)}
      data-variant={variant}
      data-size={size}
      data-ui-size={scheme}
    />
  )
})
