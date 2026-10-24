'use client'
import * as React from 'react'
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar'
import { part } from './parts.js'

export const Toolbar = {
  ...BaseToolbar,
  Root: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseToolbar.Root>
  >(BaseToolbar.Root, 'surf-toolbar'),
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
