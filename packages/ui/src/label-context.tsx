'use client'
import * as React from 'react'

/** Label overrides by component group, as LabelsProvider passes them down. It holds
 * no defaults: each component keeps its own English defaults, and this context only
 * replaces the ones an app translated. */
export type LabelGroups = Record<string, Record<string, unknown>>
export const LabelsContext = /* @__PURE__ */ React.createContext<LabelGroups>(
  {},
)
// One empty group for every component without one, so memoized labels stay put.
const none = {}
/** A component's labels from the nearest LabelsProvider, for its own props and
 * defaults to sit around: props win over these, and these over the defaults. */
export function useLabels<Labels extends object>(
  group: string,
): Partial<Labels> {
  return (React.useContext(LabelsContext)[group] ?? none) as Partial<Labels>
}
