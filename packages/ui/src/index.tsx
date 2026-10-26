// One entry per catalog page: each module is also its own entry point, such as
// @surflane/ui/checkbox. Chart, DatePicker, Markdown, Tree and syntax highlighting
// need optional packages, so they live only on their own entry points:
// @surflane/ui/chart, /date-picker, /markdown, /tree and /syntax-highlighting.

// Actions
export {
  Button,
  type ButtonVariant,
  type ButtonSize,
  type ButtonProps,
  LinkButton,
  type LinkButtonProps,
} from './button.js'
export {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarRoot,
  ToolbarSeparator,
} from './toolbar.js'

// Forms
export { Input } from './input.js'
export {
  Select,
  type SelectOption,
  type SelectGroup,
  type SelectProps,
  type SelectMultipleProps,
  type SelectMultipleLabels,
} from './select.js'
export {
  NativeSelect,
  NativeSelectOption,
  NativeSelectOptGroup,
} from './native-select.js'
export {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldItem,
  FieldLabel,
  FieldRoot,
  FieldValidity,
} from './field.js'
export { Fieldset, FieldsetLegend, FieldsetRoot } from './fieldset.js'
export { Form } from './form.js'
export { Textarea } from './textarea.js'
export {
  Combobox,
  ComboboxArrow,
  ComboboxBackdrop,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxClear,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxIcon,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxPopup,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxRoot,
  ComboboxRow,
  ComboboxSeparator,
  ComboboxStatus,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxContent,
} from './combobox.js'
export {
  Autocomplete,
  AutocompleteArrow,
  AutocompleteBackdrop,
  AutocompleteClear,
  AutocompleteCollection,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteIcon,
  AutocompleteInput,
  AutocompleteInputGroup,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompletePortal,
  AutocompletePositioner,
  AutocompleteRoot,
  AutocompleteRow,
  AutocompleteSeparator,
  AutocompleteStatus,
  AutocompleteTrigger,
  AutocompleteValue,
  AutocompleteContent,
} from './autocomplete.js'
export {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot,
  NumberFieldScrubArea,
  NumberFieldScrubAreaCursor,
} from './number-field.js'
export {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from './slider.js'
export {
  OTPField,
  OTPFieldInput,
  OTPFieldRoot,
  OTPFieldSeparator,
  OTPFieldGroup,
} from './otp-field.js'
export {
  FileUpload,
  type FileUploadProps,
  type UploadTransport,
  type FileUploadLabels,
  type FileChangeDetails,
  type FileRejection,
  type UploadState,
} from './file-upload.js'

// Selection
export { Checkbox, CheckboxIndicator, CheckboxRoot } from './checkbox.js'
export { CheckboxGroup } from './checkbox-group.js'
export { Radio, RadioGroup, RadioIndicator, RadioRoot } from './radio-group.js'
export { Switch, SwitchRoot, SwitchThumb } from './switch.js'
export { Toggle } from './toggle.js'
export { ToggleGroup } from './toggle-group.js'
export { ChoiceLabel, type ChoiceLabelProps } from './choice-label.js'

// Overlays
export {
  Popover,
  PopoverArrow,
  PopoverBackdrop,
  PopoverClose,
  PopoverDescription,
  PopoverHandle,
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
  PopoverViewport,
  PopoverContent,
} from './popover.js'
export {
  Menu,
  MenuArrow,
  MenuBackdrop,
  MenuCheckboxItem,
  MenuCheckboxItemIndicator,
  MenuClear,
  MenuEmpty,
  MenuFilterProvider,
  MenuGroup,
  MenuGroupLabel,
  MenuHandle,
  MenuInput,
  MenuItem,
  MenuLinkItem,
  MenuList,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRadioItemIndicator,
  MenuRoot,
  MenuSeparator,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
  MenuTrigger,
  MenuViewport,
  MenuContent,
} from './menu.js'
export {
  ContextMenu,
  ContextMenuArrow,
  ContextMenuBackdrop,
  ContextMenuCheckboxItem,
  ContextMenuCheckboxItemIndicator,
  ContextMenuGroup,
  ContextMenuGroupLabel,
  ContextMenuItem,
  ContextMenuLinkItem,
  ContextMenuPopup,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuRadioItemIndicator,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuSubmenuRoot,
  ContextMenuSubmenuTrigger,
  ContextMenuTrigger,
  ContextMenuContent,
} from './context-menu.js'
export { Tooltip, TooltipProvider, type TooltipProps } from './tooltip.js'
export {
  PreviewCard,
  PreviewCardArrow,
  PreviewCardBackdrop,
  PreviewCardHandle,
  PreviewCardPopup,
  PreviewCardPortal,
  PreviewCardPositioner,
  PreviewCardRoot,
  PreviewCardTrigger,
  PreviewCardViewport,
  PreviewCardContent,
} from './preview-card.js'
export {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogHandle,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DialogViewport,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseButton,
} from './dialog.js'
export {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogHandle,
  AlertDialogPopup,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogViewport,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
} from './alert-dialog.js'
export {
  Sheet,
  SheetBackdrop,
  SheetClose,
  SheetDescription,
  SheetHandle,
  SheetPopup,
  SheetPortal,
  SheetRoot,
  SheetTitle,
  SheetTrigger,
  SheetViewport,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  type PanelSide,
} from './sheet.js'
export {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerIndent,
  DrawerIndentBackground,
  DrawerPopup,
  DrawerPortal,
  DrawerProvider,
  DrawerRoot,
  DrawerSwipeArea,
  DrawerTitle,
  DrawerTrigger,
  DrawerViewport,
  DrawerVirtualKeyboardProvider,
  DrawerPrimitiveContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from './drawer.js'

// Navigation
export {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
} from './tabs.js'
export {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
} from './accordion.js'
export {
  Collapsible,
  CollapsiblePanel,
  CollapsibleRoot,
  CollapsibleTrigger,
} from './collapsible.js'
export {
  NavigationMenu,
  NavigationMenuArrow,
  NavigationMenuBackdrop,
  NavigationMenuContent,
  NavigationMenuIcon,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPopup,
  NavigationMenuPortal,
  NavigationMenuPositioner,
  NavigationMenuRoot,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  NavigationMenuLinkTitle,
  NavigationMenuLinkDescription,
} from './navigation-menu.js'
export { Menubar } from './menubar.js'
export { Link, type LinkProps } from './link.js'
export {
  Breadcrumbs,
  BreadcrumbsRoot,
  BreadcrumbsList,
  BreadcrumbsItem,
  BreadcrumbsLink,
  BreadcrumbsSeparator,
  BreadcrumbsCurrent,
} from './breadcrumbs.js'
export {
  Pagination,
  type PaginationProps,
  type PaginationLabels,
} from './pagination.js'
export {
  BottomNavigation,
  BottomNavigationRoot,
  BottomNavigationItem,
  type BottomNavigationRootProps,
  type BottomNavigationItemProps,
} from './bottom-navigation.js'

// Data display
export {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
  AvatarStatus,
} from './avatar.js'
export {
  Badge,
  StatusBadge,
  type BadgeProps,
  type StatusTone,
} from './badge.js'
export {
  DescriptionList,
  DescriptionListRoot,
  DescriptionListItem,
  DescriptionListTerm,
  DescriptionListValue,
  type DescriptionListLabels,
  type DescriptionListRootProps,
  type DescriptionListValueProps,
} from './description-list.js'
export {
  Timeline,
  TimelineRoot,
  TimelineItem,
  TimelineTitle,
  TimelineTime,
  TimelineStatus,
  TimelineDescription,
  TimelineDetail,
  type TimelineRootProps,
  type TimelineItemProps,
  type TimelineTimeProps,
  type TimelineDetailProps,
} from './timeline.js'
export {
  SegmentedControl,
  SegmentedControlRoot,
  SegmentedControlItem,
  type SegmentedControlRootProps,
  type SegmentedControlItemProps,
} from './segmented-control.js'
export {
  Kbd,
  type KbdKey,
  type KbdLabels,
  type KbdNamedKey,
  type KbdProps,
} from './kbd.js'
export {
  Card,
  CardRoot,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from './card.js'
export {
  Table,
  TableContainer,
  TableRoot,
  TableCaption,
  TableHead,
  TableBody,
  TableFoot,
  TableRow,
  TableHeaderCell,
  TableSortHeader,
  TableCell,
  TableTruncate,
  TableMessage,
  type TableDensity,
  type TableVariant,
  type TableSort,
  useTableSelection,
  type TableSelectionOptions,
  type TableSelectionCheckbox,
} from './table.js'
export {
  CodeBlock,
  CopyButton,
  type CodeBlockProps,
  type CodeBlockLabels,
  type CopyButtonProps,
  type CopyButtonLabels,
} from './code.js'
export {
  SyntaxHighlighter,
  syntaxLanguages,
  type SyntaxHighlighterProps,
} from './syntax-highlighter.js'
export {
  List,
  ListRoot,
  ListItem,
  ListContent,
  ListTitle,
  ListDescription,
  ListActions,
} from './list.js'
export {
  Stat,
  StatRoot,
  StatLabel,
  StatValue,
  StatChange,
  StatCaption,
  StatStatus,
  StatGroup,
  type StatChangeProps,
  type StatStatusProps,
  type StatGroupProps,
  type StatDirection,
} from './stat.js'
export {
  Sparkline,
  type SparklineProps,
  type SparklineTrend,
} from './sparkline.js'
export { BarList, type BarListProps, type BarListItem } from './bar-list.js'
export {
  Dashboard,
  DashboardRoot,
  DashboardPanel,
  type DashboardRootProps,
  type DashboardPanelProps,
  type DashboardPanelLabels,
} from './dashboard.js'
export {
  TimeRangePicker,
  timeRangeOptions,
  refreshIntervalOptions,
  type TimeRangePickerProps,
  type TimeRangePickerLabels,
  type TimeRangeOption,
} from './time-range-picker.js'

// Structure
export { ScrollArea } from './scroll-area.js'
export { Separator } from './separator.js'

// Feedback
export {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressRoot,
  ProgressTrack,
  ProgressValue,
} from './progress.js'
export {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterRoot,
  MeterTrack,
  MeterValue,
} from './meter.js'
export {
  Toast,
  type ToastRootProps,
  type ToastViewportProps,
  ToastAction,
  ToastArrow,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastPositioner,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
  ToastIcon,
  ToastText,
  toast,
  createToaster,
  Toaster,
  type ToastOptions,
  type ToastStep,
  type ToastHelper,
  type ToasterProps,
} from './toast.js'
export {
  InlineMessage,
  InlineMessageRoot,
  InlineMessageIcon,
  InlineMessageContent,
  InlineMessageTitle,
  InlineMessageDescription,
  InlineMessageActions,
} from './inline-message.js'
export {
  Banner,
  BannerRoot,
  BannerIcon,
  BannerContent,
  BannerTitle,
  BannerDescription,
  BannerActions,
  type BannerRootProps,
  type BannerTone,
} from './banner.js'
export { Spinner, type SpinnerProps } from './spinner.js'
export { Skeleton, type SkeletonProps } from './skeleton.js'
export {
  EmptyState,
  EmptyStateRoot,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from './empty-state.js'

// Foundations
export {
  Container,
  Stack,
  Inline,
  Grid,
  GridItem,
  Surface,
  type SurfaceKind,
  type Space,
} from './layout.js'
export { Heading, Text, Prose } from './typography.js'
export {
  formatNumber,
  formatCurrency,
  formatPercent,
  missingValue,
  type NumberFormatOptions,
} from './format.js'
export { Icon, iconNames, type IconName, type IconProps } from './icon.js'
export {
  SizeProvider,
  type ComponentDensity,
  type ComponentSize,
  type ComponentSizeAlias,
} from './sizing.js'
export { DirectionProvider } from '@base-ui/react/direction-provider'
export { Slot } from './slot.js'

// Patterns
export {
  AppShell,
  AppShellRoot,
  AppShellHeader,
  AppShellSidebar,
  AppShellSidebarToggle,
  AppShellMenuTrigger,
  type AppShellRootProps,
  type AppShellSidebarToggleProps,
  type AppShellSidebarToggleLabels,
  type AppShellMenuTriggerProps,
  AppShellBrand,
  type AppShellBrandProps,
  AppShellNav,
  type AppShellNavProps,
  AppShellContent,
  AppShellPage,
  AppShellFooter,
  AppShellLabel,
  AppShellLink,
  type AppShellLinkProps,
} from './app-shell.js'
export { PageHeader } from './page-header.js'
export {
  FilterBar,
  FilterBarRoot,
  FilterBarControls,
  FilterBarField,
  FilterBarActions,
  FilterBarSummary,
} from './filter-bar.js'
