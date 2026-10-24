'use client'
import * as React from 'react'
import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import { part } from './parts.js'
export const Tabs = {
  ...BaseTabs,
  Root: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseTabs.Root>,
    React.ComponentPropsWithoutRef<typeof BaseTabs.Root>
  >(BaseTabs.Root, 'surf-tabs'),
  List: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseTabs.List>,
    React.ComponentPropsWithoutRef<typeof BaseTabs.List>
  >(BaseTabs.List, 'surf-tabs-list'),
  Tab: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseTabs.Tab>,
    React.ComponentPropsWithoutRef<typeof BaseTabs.Tab>
  >(BaseTabs.Tab, 'surf-tabs-tab'),
  Panel: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseTabs.Panel>,
    React.ComponentPropsWithoutRef<typeof BaseTabs.Panel>
  >(BaseTabs.Panel, 'surf-tabs-panel'),
  Indicator: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseTabs.Indicator>,
    React.ComponentPropsWithoutRef<typeof BaseTabs.Indicator>
  >(BaseTabs.Indicator, 'surf-tabs-indicator'),
}

// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Indicator: TabsIndicator,
  List: TabsList,
  Panel: TabsPanel,
  Root: TabsRoot,
  Tab: TabsTab,
} = Tabs
