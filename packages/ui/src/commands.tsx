'use client'
import * as React from 'react'
import { useComponentSize, type ComponentSizeAlias } from './sizing.js'
import { Toggle as BaseToggle } from '@base-ui/react/toggle'
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group'
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar'
import { Menubar as BaseMenubar } from '@base-ui/react/menubar'
import { sizeName, skin, part } from './parts.js'
export function Toggle<Value extends string>({
  className,
  size,
  ref,
  ...props
}: BaseToggle.Props<Value> & {
  size?: ComponentSizeAlias | 'icon'
  ref?: React.Ref<HTMLButtonElement>
}) {
  const scheme = useComponentSize(size === 'icon' ? undefined : size)
  return (
    <BaseToggle<Value>
      {...props}
      ref={ref}
      className={skin('pui-button pui-toggle', className)}
      data-size={sizeName(size)}
      data-ui-size={scheme}
    />
  )
}
export function ToggleGroup<Value extends string>({
  className,
  ref,
  ...props
}: BaseToggleGroup.Props<Value> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <BaseToggleGroup<Value>
      {...props}
      ref={ref}
      className={skin('pui-toggle-group', className)}
    />
  )
}
export const Toolbar = {
  ...BaseToolbar,
  Root: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseToolbar.Root>
  >(BaseToolbar.Root, 'pui-toolbar'),
  Group: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseToolbar.Group>
  >(BaseToolbar.Group, 'pui-toolbar-group'),
  Button: /* @__PURE__ */ part<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<typeof BaseToolbar.Button>
  >(BaseToolbar.Button, 'pui-button pui-toolbar-button'),
  Link: /* @__PURE__ */ part<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<typeof BaseToolbar.Link>
  >(BaseToolbar.Link, 'pui-button pui-toolbar-link'),
  Input: /* @__PURE__ */ part<
    HTMLInputElement,
    React.ComponentPropsWithoutRef<typeof BaseToolbar.Input>
  >(BaseToolbar.Input, 'pui-input pui-toolbar-input'),
  Separator: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseToolbar.Separator>
  >(BaseToolbar.Separator, 'pui-toolbar-separator'),
}
export const Menubar = /* @__PURE__ */ part<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenubar>
>(BaseMenubar, 'pui-menubar')

// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Button: ToolbarButton,
  Group: ToolbarGroup,
  Input: ToolbarInput,
  Link: ToolbarLink,
  Root: ToolbarRoot,
  Separator: ToolbarSeparator,
} = Toolbar
