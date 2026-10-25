'use client'
import * as React from 'react'
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar'
import { part } from './parts.js'

const RootPart = /* @__PURE__ */ part<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseToolbar.Root>
>(BaseToolbar.Root, 'surf-toolbar')
/** Home and End reach the first and last item, as they do in ToggleGroup, Tabs and
 * Menubar; Base UI's toolbar leaves them out. Inside an input they move the caret. */
function Root({ onKeyDown, ...props }: React.ComponentProps<typeof RootPart>) {
  return (
    <RootPart
      {...props}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event as Parameters<NonNullable<typeof onKeyDown>>[0])
        const toolbar = event.currentTarget
        if (
          event.defaultPrevented ||
          (event.key !== 'Home' && event.key !== 'End') ||
          (event.target as Element).matches('input, textarea')
        )
          return
        const items = [
          ...toolbar.querySelectorAll<HTMLElement>('[tabindex]'),
        ].filter((item) => item.closest('[role="toolbar"]') === toolbar)
        const item = event.key === 'Home' ? items[0] : items.at(-1)
        if (!item) return
        event.preventDefault()
        item.focus()
      }}
    />
  )
}

export const Toolbar = {
  ...BaseToolbar,
  Root,
  Group: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseToolbar.Group>
  >(BaseToolbar.Group, 'surf-toolbar-group'),
  Button: /* @__PURE__ */ part<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<typeof BaseToolbar.Button>
  >(BaseToolbar.Button, 'surf-button surf-toolbar-button'),
  Link: /* @__PURE__ */ part<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<typeof BaseToolbar.Link>
  >(BaseToolbar.Link, 'surf-button surf-toolbar-link'),
  Input: /* @__PURE__ */ part<
    HTMLInputElement,
    React.ComponentPropsWithoutRef<typeof BaseToolbar.Input>
  >(BaseToolbar.Input, 'surf-input surf-toolbar-input'),
  Separator: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseToolbar.Separator>
  >(BaseToolbar.Separator, 'surf-toolbar-separator'),
}
// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Button: ToolbarButton,
  Group: ToolbarGroup,
  Input: ToolbarInput,
  Link: ToolbarLink,
  Root: ToolbarRoot,
  Separator: ToolbarSeparator,
} = Toolbar
