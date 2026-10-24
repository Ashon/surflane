'use client'
import * as React from 'react'
import { useRender } from '@base-ui/react/use-render'
import { cx } from './parts.js'

export type LinkProps = Omit<useRender.ComponentProps<'a'>, 'ref'>
/** A text link. Pass a router's link element as `render`, such as
 * `<Link render={<NextLink href='/docs' />}>Docs</Link>`, to keep client navigation. */
export const Link = function Link({
  render,
  className,
  ref,
  ...props
}: LinkProps & { ref?: React.Ref<HTMLAnchorElement> }) {
  return useRender({
    defaultTagName: 'a',
    render,
    ref,
    props: {
      ...props,
      className: cx('surf-link', className),
    },
  })
}
