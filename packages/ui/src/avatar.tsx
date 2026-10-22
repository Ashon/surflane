'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { Avatar as BaseAvatar } from '@base-ui/react/avatar'
import { useComponentSize, type ComponentSizeAlias } from './sizing.js'
import { sizeName, skin, part } from './parts.js'
const AvatarRoot = /* @__PURE__ */ React.forwardRef<
  React.ComponentRef<typeof BaseAvatar.Root>,
  React.ComponentPropsWithoutRef<typeof BaseAvatar.Root> & {
    size?: ComponentSizeAlias
  }
>(function AvatarRoot({ size, className, ...props }, ref) {
  const scheme = useComponentSize(size)
  return (
    <BaseAvatar.Root
      {...props}
      ref={ref}
      data-size={sizeName(size)}
      data-ui-size={scheme}
      className={skin('pui-avatar', className)}
    />
  )
})
const AvatarFallback = /* @__PURE__ */ React.forwardRef<
  React.ComponentRef<typeof BaseAvatar.Fallback>,
  React.ComponentPropsWithoutRef<typeof BaseAvatar.Fallback>
>(function AvatarFallback({ children, className, ...props }, ref) {
  return (
    <BaseAvatar.Fallback
      {...props}
      ref={ref}
      className={skin('pui-avatar-fallback', className)}
    >
      {children ?? <Icon name='user' />}
    </BaseAvatar.Fallback>
  )
})
export const Avatar = {
  ...BaseAvatar,
  Root: AvatarRoot,
  Status: /* @__PURE__ */ part<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<'span'>
  >('span', 'pui-avatar-status'),
  Fallback: AvatarFallback,
  Image: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseAvatar.Image>,
    React.ComponentPropsWithoutRef<typeof BaseAvatar.Image>
  >(BaseAvatar.Image, 'pui-avatar-image'),
}

// Flat names for React Server Components, which cannot dot into client exports.
export { AvatarFallback, AvatarRoot }
export const { Image: AvatarImage, Status: AvatarStatus } = Avatar
