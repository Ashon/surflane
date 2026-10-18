'use client'
import * as React from 'react'
import { useRender } from '@base-ui/react/use-render'
export function Slot({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return useRender({
    render: React.isValidElement(children) ? children : undefined,
    props: React.isValidElement(children) ? props : { ...props, children },
    defaultTagName: 'span',
  })
}
