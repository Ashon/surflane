import { doc as accordion } from './docs/accordion.en'
import { doc as alertDialog } from './docs/alert-dialog.en'
import { doc as appShell } from './docs/app-shell.en'
import { doc as asyncJob } from './docs/async-job.en'
import { doc as autocomplete } from './docs/autocomplete.en'
import { doc as avatar } from './docs/avatar.en'
import { doc as badge } from './docs/badge.en'
import { doc as kbd } from './docs/kbd.en'
import { doc as descriptionList } from './docs/description-list.en'
import { doc as bottomNavigation } from './docs/bottom-navigation.en'
import { doc as breadcrumbs } from './docs/breadcrumbs.en'
import { doc as button } from './docs/button.en'
import { doc as card } from './docs/card.en'
import { doc as chart } from './docs/chart.en'
import { doc as checkbox } from './docs/checkbox.en'
import { doc as checkboxGroup } from './docs/checkbox-group.en'
import { doc as code } from './docs/code.en'
import { doc as collapsible } from './docs/collapsible.en'
import { doc as combobox } from './docs/combobox.en'
import { doc as commandSearch } from './docs/command-search.en'
import { doc as contextMenu } from './docs/context-menu.en'
import { doc as dataTable } from './docs/data-table.en'
import { doc as datePicker } from './docs/date-picker.en'
import { doc as timeRangePicker } from './docs/time-range-picker.en'
import { doc as dialog } from './docs/dialog.en'
import { doc as documentation } from './docs/documentation.en'
import { doc as drawer } from './docs/drawer.en'
import { doc as emptyState } from './docs/empty-state.en'
import { doc as errorRecovery } from './docs/error-recovery.en'
import { doc as field } from './docs/field.en'
import { doc as fieldset } from './docs/fieldset.en'
import { doc as fileUpload } from './docs/file-upload.en'
import { doc as filterBar } from './docs/filter-bar.en'
import { doc as dashboard } from './docs/dashboard.en'
import { doc as form } from './docs/form.en'
import { doc as formWorkflow } from './docs/form-workflow.en'
import { doc as inlineConfirmation } from './docs/inline-confirmation.en'
import { doc as inlineMessage } from './docs/inline-message.en'
import { doc as input } from './docs/input.en'
import { doc as link } from './docs/link.en'
import { doc as list } from './docs/list.en'
import { doc as markdown } from './docs/markdown.en'
import { doc as menu } from './docs/menu.en'
import { doc as menubar } from './docs/menubar.en'
import { doc as meter } from './docs/meter.en'
import { doc as nativeSelect } from './docs/native-select.en'
import { doc as navigationMenu } from './docs/navigation-menu.en'
import { doc as numberField } from './docs/number-field.en'
import { doc as otpField } from './docs/otp-field.en'
import { doc as pageHeader } from './docs/page-header.en'
import { doc as pagination } from './docs/pagination.en'
import { doc as popover } from './docs/popover.en'
import { doc as previewCard } from './docs/preview-card.en'
import { doc as progress } from './docs/progress.en'
import { doc as radioGroup } from './docs/radio-group.en'
import { doc as resourceList } from './docs/resource-list.en'
import { doc as responsiveNavigation } from './docs/responsive-navigation.en'
import { doc as scrollArea } from './docs/scroll-area.en'
import { doc as select } from './docs/select.en'
import { doc as separator } from './docs/separator.en'
import { doc as sheet } from './docs/sheet.en'
import { doc as skeleton } from './docs/skeleton.en'
import { doc as slider } from './docs/slider.en'
import { doc as sparkline } from './docs/sparkline.en'
import { doc as barList } from './docs/bar-list.en'
import { doc as spinner } from './docs/spinner.en'
import { doc as stat } from './docs/stat.en'
import { doc as switchDoc } from './docs/switch.en'
import { doc as syntaxHighlighter } from './docs/syntax-highlighter.en'
import { doc as table } from './docs/table.en'
import { doc as tabs } from './docs/tabs.en'
import { doc as textarea } from './docs/textarea.en'
import { doc as toast } from './docs/toast.en'
import { doc as toggle } from './docs/toggle.en'
import { doc as toggleGroup } from './docs/toggle-group.en'
import { doc as toolbar } from './docs/toolbar.en'
import { doc as tooltip } from './docs/tooltip.en'
import { doc as tree } from './docs/tree.en'
// A field with many rules reads as a list, one topic per item; a short one stays a paragraph.
export type DocText = string | string[]
export type ComponentDoc = {
  usage: DocText
  avoid: DocText
  keyboard: DocText
  anatomy: string
  tokens: string[]
  code: string
  props: [string, string, string][]
}
// Every page's docs, for the llms build and the specs. A page loads only its own
// (DetailPage.tsx).
export const componentDocs: Record<string, ComponentDoc> = {
  accordion,
  'alert-dialog': alertDialog,
  'app-shell': appShell,
  'async-job': asyncJob,
  autocomplete,
  avatar,
  badge,
  kbd,
  'description-list': descriptionList,
  'bottom-navigation': bottomNavigation,
  breadcrumbs,
  button,
  card,
  chart,
  checkbox,
  'checkbox-group': checkboxGroup,
  code,
  collapsible,
  combobox,
  'command-search': commandSearch,
  'context-menu': contextMenu,
  'data-table': dataTable,
  'date-picker': datePicker,
  'time-range-picker': timeRangePicker,
  dialog,
  documentation,
  drawer,
  'empty-state': emptyState,
  'error-recovery': errorRecovery,
  field,
  fieldset,
  'file-upload': fileUpload,
  'filter-bar': filterBar,
  dashboard,
  form,
  'form-workflow': formWorkflow,
  'inline-confirmation': inlineConfirmation,
  'inline-message': inlineMessage,
  input,
  link,
  list,
  markdown,
  menu,
  menubar,
  meter,
  'native-select': nativeSelect,
  'navigation-menu': navigationMenu,
  'number-field': numberField,
  'otp-field': otpField,
  'page-header': pageHeader,
  pagination,
  popover,
  'preview-card': previewCard,
  progress,
  'radio-group': radioGroup,
  'resource-list': resourceList,
  'responsive-navigation': responsiveNavigation,
  'scroll-area': scrollArea,
  select,
  separator,
  sheet,
  skeleton,
  slider,
  sparkline,
  'bar-list': barList,
  spinner,
  stat,
  switch: switchDoc,
  'syntax-highlighter': syntaxHighlighter,
  table,
  tabs,
  textarea,
  toast,
  toggle,
  'toggle-group': toggleGroup,
  toolbar,
  tooltip,
  tree,
}
