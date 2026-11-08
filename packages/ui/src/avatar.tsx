'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { Avatar as BaseAvatar } from '@base-ui/react/avatar'
import { useComponentSize, type ComponentSize } from './sizing.js'
import { cx, skin, part } from './parts.js'
import type { StatusTone } from './status.js'
import type { AvatarCategory } from './category.js'

const AvatarRoot = function AvatarRoot({
  size,
  category,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseAvatar.Root> & {
  size?: ComponentSize
  /** Tints the fallback with a categorical color, so the initials of different
   * projects or people tell apart at a glance. The initials keep the ink. */
  category?: AvatarCategory
} & { ref?: React.Ref<React.ComponentRef<typeof BaseAvatar.Root>> }) {
  const scheme = useComponentSize(size)
  return (
    <BaseAvatar.Root
      {...props}
      ref={ref}
      data-size={size}
      data-ui-size={scheme}
      data-category={category}
      className={skin('surf-avatar', className)}
    />
  )
}
export type AvatarStatusProps = React.ComponentPropsWithoutRef<'span'> & {
  /** The state the marker colors, as StatusBadge's tones do. */
  tone?: StatusTone
  /** Pulses while the state is under way, such as working; still when motion is
   * reduced. */
  live?: boolean
}
/** A decorative corner marker. Say the state in text nearby or on Root. */
const AvatarStatus = function AvatarStatus({
  tone = 'success',
  live = false,
  className,
  ref,
  ...props
}: AvatarStatusProps & { ref?: React.Ref<HTMLSpanElement> }) {
  return (
    <span
      aria-hidden='true'
      {...props}
      ref={ref}
      className={cx('surf-avatar-status', className)}
      data-tone={tone}
      data-live={live || undefined}
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
  Status: AvatarStatus,
  Fallback: AvatarFallback,
  Image: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseAvatar.Image>,
    React.ComponentPropsWithoutRef<typeof BaseAvatar.Image>
  >(BaseAvatar.Image, 'surf-avatar-image'),
}

// Flat names for React Server Components, which cannot dot into client exports.
export { AvatarFallback, AvatarRoot, AvatarStatus }
export const { Image: AvatarImage } = Avatar
