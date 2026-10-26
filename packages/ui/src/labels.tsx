'use client'
import * as React from 'react'
import { LabelsContext, type LabelGroups } from './label-context.js'
import type { ChartLabels } from './chart.js'
import type { CodeBlockLabels } from './code.js'
import type { CopyButtonLabels } from './copy-button.js'
import type { DashboardPanelLabels } from './dashboard.js'
import type { DataStateLabels } from './data-state.js'
import type { DescriptionListLabels } from './description-list.js'
import type { FileUploadLabels } from './file-upload.js'
import type { KbdLabels } from './kbd.js'
import type { MarkdownLabels } from './markdown.js'
import type { PaginationLabels } from './pagination.js'
import type { SelectMultipleLabels } from './select.js'
import type { TimeRangePickerLabels } from './time-range-picker.js'
import type { TreeLabels } from './tree.js'

/** Every text a client component writes, by group. Breadcrumbs and Spinner render on
 * the server, so they take their names as props. */
export type SurflaneLabels = {
  /** AppShell's SidebarToggle names and MenuTrigger name. */
  appShell: { collapse: string; expand: string; menu: string }
  banner: { dismiss: string }
  chart: ChartLabels
  /** CodeBlock's scroll region name and copy action. */
  codeBlock: CodeBlockLabels & { label: string }
  copyButton: CopyButtonLabels
  dashboardPanel: DashboardPanelLabels
  dataState: DataStateLabels
  descriptionList: DescriptionListLabels
  /** Dialog and AlertDialog. */
  dialog: { close: string; focusBoundary: string }
  fileUpload: FileUploadLabels
  kbd: KbdLabels
  markdown: MarkdownLabels & { label: string }
  pagination: PaginationLabels & { label: string }
  /** Sheet and Drawer. */
  panel: { close: string; focusBoundary: string }
  /** Select with multiple. */
  select: SelectMultipleLabels
  syntaxHighlighter: { label: string }
  timeRangePicker: TimeRangePickerLabels
  /** Toaster's region and each toast's dismiss button. */
  toast: { region: string; close: string }
  tree: TreeLabels
}
/** Some labels of some groups; the rest keep their defaults. */
export type LabelOverrides = {
  [Group in keyof SurflaneLabels]?: Partial<SurflaneLabels[Group]>
}
export type LabelsProviderProps = {
  /** Labels to change, by group, over the surrounding ones, such as koLabels from
   * @surflane/ui/labels-ko. A component's own props still win. */
  labels?: LabelOverrides
  children: React.ReactNode
}
/** Translates the components inside it once, instead of every instance: their
 * names, actions and announcements, by group. */
export function LabelsProvider({ labels, children }: LabelsProviderProps) {
  const parent = React.useContext(LabelsContext)
  const value = React.useMemo(() => {
    const merged: LabelGroups = { ...parent }
    if (labels)
      for (const [group, entries] of Object.entries(labels))
        merged[group] = { ...merged[group], ...entries }
    return merged
  }, [parent, labels])
  return (
    <LabelsContext.Provider value={value}>{children}</LabelsContext.Provider>
  )
}
