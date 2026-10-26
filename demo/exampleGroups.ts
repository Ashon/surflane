/** Plain route metadata: importing this file must never load UI examples. */
export const formExampleIds = [
  'field',
  'fieldset',
  'form',
  'textarea',
  'checkbox',
  'checkbox-group',
  'radio-group',
  'switch',
]
export const navigationExampleIds = [
  'tabs',
  'accordion',
  'collapsible',
  'avatar',
  'badge',
  'kbd',
  'separator',
  'link',
  'breadcrumbs',
]
export const feedbackExampleIds = [
  'progress',
  'meter',
  'spinner',
  'skeleton',
  'data-state',
]
export const dataExampleIds = [
  'table',
  'list',
  'stat',
  'description-list',
  'timeline',
  'sparkline',
  'bar-list',
  'inline-message',
  'banner',
  'empty-state',
]
export const contentExampleIds = ['card', 'code', 'pagination']
export const advancedFormExampleIds = ['combobox', 'number-field']
export const inputExtensionExampleIds = ['autocomplete', 'slider']
export const commandExampleIds = [
  'toggle',
  'toggle-group',
  'segmented-control',
  'toolbar',
  'menubar',
]
export const contextOverlayExampleIds = ['context-menu', 'preview-card']
export const basicExampleIds = [
  'button',
  'input',
  'select',
  'native-select',
  'popover',
  'menu',
  'tooltip',
  'dialog',
  'alert-dialog',
  'inline-confirmation',
  'sheet',
  'drawer',
  'scroll-area',
]
export const exampleGroups = {
  richContent: ['syntax-highlighter', 'markdown'],
  chart: ['chart'],
  datePicker: ['date-picker'],
  tree: ['tree'],
  commandSearch: ['command-search'],
  asyncJob: ['async-job'],
  errorRecovery: ['error-recovery'],
  documentation: ['documentation'],
  dataTable: ['data-table'],
  appShell: ['app-shell', 'responsive-navigation'],
  basic: basicExampleIds,
  forms: formExampleIds,
  navigation: navigationExampleIds,
  feedback: feedbackExampleIds,
  data: dataExampleIds,
  content: contentExampleIds,
  advancedForms: advancedFormExampleIds,
  inputExtensions: inputExtensionExampleIds,
  commands: commandExampleIds,
  contextOverlays: contextOverlayExampleIds,
  fileUpload: ['file-upload'],
  toast: ['toast'],
  otp: ['otp-field'],
  timeRange: ['time-range-picker'],
  navigationMenu: ['navigation-menu'],
  bottomNavigation: ['bottom-navigation'],
  pageHeader: ['page-header'],
  filterBar: ['filter-bar'],
  dashboard: ['dashboard'],
  resourceList: ['resource-list'],
  formWorkflow: ['form-workflow'],
}
export type ExampleGroup = keyof typeof exampleGroups
export function exampleGroupFor(id: string): ExampleGroup | undefined {
  for (const [group, ids] of Object.entries(exampleGroups))
    if (ids.includes(id)) return group as ExampleGroup
}

/** These compositions place preview controls outside their own screen frame. */
export function exampleOwnsFrame(id: string) {
  return ['app-shell', 'responsive-navigation', 'page-header'].includes(id)
}
