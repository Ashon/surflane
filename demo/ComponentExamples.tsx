import React, { lazy, type ComponentType } from 'react'
import { exampleGroupFor, type ExampleGroup } from './exampleGroups'
import { DeferredContent } from './DeferredContent'
import { useLocale } from './i18n'
import { text } from './i18n/pages/ComponentExamples'
type ExampleProps = { id: string; toggleTheme: () => void }
const views: Record<ExampleGroup, ComponentType<ExampleProps>> = {
  richContent: lazy(() =>
    import('./RichContentExamples').then((module) => ({
      default: module.RichContentExample,
    })),
  ),
  chart: lazy(() =>
    import('./ChartExample').then((module) => ({
      default: module.ChartExample,
    })),
  ),
  datePicker: lazy(() =>
    import('./DatePickerExample').then((module) => ({
      default: module.DatePickerExample,
    })),
  ),
  tree: lazy(() =>
    import('./TreeExample').then((module) => ({ default: module.TreeExample })),
  ),
  commandSearch: lazy(() =>
    import('./CommandSearchExample').then((module) => ({
      default: module.CommandSearchExample,
    })),
  ),
  asyncJob: lazy(() =>
    import('./AsyncJobExample').then((module) => ({
      default: module.AsyncJobExample,
    })),
  ),
  errorRecovery: lazy(() =>
    import('./ErrorRecoveryExample').then((module) => ({
      default: module.ErrorRecoveryExample,
    })),
  ),
  documentation: lazy(() =>
    import('./DocumentationExample').then((module) => ({
      default: module.DocumentationExample,
    })),
  ),
  dataTable: lazy(() =>
    import('./DataTableExample').then((module) => ({
      default: module.DataTableExample,
    })),
  ),
  appShell: lazy(() =>
    import('./AppShellExample').then((module) => ({
      default: module.AppShellExample,
    })),
  ),
  formWorkflow: lazy(() =>
    import('./FormWorkflowExample').then((module) => ({
      default: module.FormWorkflowExample,
    })),
  ),
  resourceList: lazy(() =>
    import('./ResourceListExample').then((module) => ({
      default: module.ResourceListExample,
    })),
  ),
  filterBar: lazy(() =>
    import('./FilterBarExample').then((module) => ({
      default: module.FilterBarExample,
    })),
  ),
  pageHeader: lazy(() =>
    import('./PageHeaderExample').then((module) => ({
      default: module.PageHeaderExample,
    })),
  ),
  basic: lazy(() =>
    import('./BasicExamples').then((module) => ({
      default: module.BasicExample,
    })),
  ),
  forms: lazy(() =>
    import('./FormExamples').then((module) => ({
      default: module.FormExample,
    })),
  ),
  navigation: lazy(() =>
    import('./NavigationExamples').then((module) => ({
      default: module.NavigationExample,
    })),
  ),
  feedback: lazy(() =>
    import('./FeedbackExamples').then((module) => ({
      default: module.FeedbackExample,
    })),
  ),
  data: lazy(() =>
    import('./DataExamples').then((module) => ({
      default: module.DataExample,
    })),
  ),
  content: lazy(() =>
    import('./ContentExamples').then((module) => ({
      default: module.ContentExample,
    })),
  ),
  advancedForms: lazy(() =>
    import('./AdvancedFormExamples').then((module) => ({
      default: module.AdvancedFormExample,
    })),
  ),
  inputExtensions: lazy(() =>
    import('./InputExtensionExamples').then((module) => ({
      default: module.InputExtensionExample,
    })),
  ),
  commands: lazy(() =>
    import('./CommandExamples').then((module) => ({
      default: module.CommandExample,
    })),
  ),
  contextOverlays: lazy(() =>
    import('./ContextOverlayExamples').then((module) => ({
      default: module.ContextOverlayExample,
    })),
  ),
  fileUpload: lazy(() =>
    import('./FileUploadExample').then((module) => ({
      default: module.FileUploadExample,
    })),
  ),
  toast: lazy(() =>
    import('./ToastExample').then((module) => ({
      default: module.ToastExample,
    })),
  ),
  otp: lazy(() =>
    import('./OTPFieldExample').then((module) => ({
      default: module.OTPFieldExample,
    })),
  ),
  navigationMenu: lazy(() =>
    import('./NavigationMenuExample').then((module) => ({
      default: module.NavigationMenuExample,
    })),
  ),
}
export function ComponentExample(props: ExampleProps) {
  const group = exampleGroupFor(props.id)
  const t = text[useLocale().locale]
  if (!group) return <p role='alert'>{t.noExampleRegistered}</p>
  const View = views[group]
  return (
    <DeferredContent key={props.id} scope='preview'>
      <View {...props} />
    </DeferredContent>
  )
}
