'use client'
import * as React from 'react'
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
function Person() {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      aria-hidden='true'
    >
      <circle cx='12' cy='8' r='4' />
      <path d='M4 21v-2a8 8 0 0 1 16 0v2' />
    </svg>
  )
}
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
      {children ?? <Person />}
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
