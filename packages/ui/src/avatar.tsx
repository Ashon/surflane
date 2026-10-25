'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { Avatar as BaseAvatar } from '@base-ui/react/avatar'
import { useComponentSize, type ComponentSize } from './sizing.js'
import { skin, part } from './parts.js'
const AvatarRoot = function AvatarRoot({
  size,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseAvatar.Root> & {
  size?: ComponentSize
} & { ref?: React.Ref<React.ComponentRef<typeof BaseAvatar.Root>> }) {
  const scheme = useComponentSize(size)
  return (
    <BaseAvatar.Root
      {...props}
      ref={ref}
      data-size={size}
      data-ui-size={scheme}
      className={skin('surf-avatar', className)}
    />
  )
}
const AvatarFallback = function AvatarFallback({
  children,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseAvatar.Fallback> & {
  ref?: React.Ref<React.ComponentRef<typeof BaseAvatar.Fallback>>
}) {
  return (
    <BaseAvatar.Fallback
      {...props}
      ref={ref}
      className={skin('surf-avatar-fallback', className)}
    >
      {children ?? <Icon name='user' />}
    </BaseAvatar.Fallback>
  )
}
export const Avatar = {
  ...BaseAvatar,
  Root: AvatarRoot,
  Status: /* @__PURE__ */ part<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<'span'>
  >('span', 'surf-avatar-status'),
  Fallback: AvatarFallback,
  Image: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseAvatar.Image>,
    React.ComponentPropsWithoutRef<typeof BaseAvatar.Image>
  >(BaseAvatar.Image, 'surf-avatar-image'),
}

// Flat names for React Server Components, which cannot dot into client exports.
export { AvatarFallback, AvatarRoot }
export const { Image: AvatarImage, Status: AvatarStatus } = Avatar
