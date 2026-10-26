# Changelog

`@surflane/design-tokens`, `@surflane/css` and `@surflane/ui` are released together with the same version. During 0.x, a minor version may change public API or visual contracts; patch versions do not.

## Unreleased

### Added

- `Table.Root stickyColumn` keeps the first column, such as each row's name, in place while the Container scrolls sideways. The column sits on the surface behind the table, so stripes and selections still paint over it, and a line marks its edge once rows pass under it. Its Container stops fading that edge by itself; under a sticky header the header and the corner stay above the column.
- `AppShell.Root collapseBelow` takes a window width, such as 1280, below which the sidebar starts on its rail. The toggle still opens it there; above the width the shell returns to its own state, and only that state is remembered.
- `ScrollArea fade` (`both`, `start`, `end` or `none`) chooses which edges fade while they hide content, so an app no longer overrides the mask on internal classes.

### Fixed

- A fixed BottomNavigation no longer covers toasts or the end of an AppShell. Wherever it shows, the toast stack rises above it and the shell ends where it begins, so apps stop offsetting them by hand. Other scrolling content still pads by `--surf-size-bottom-navigation`.
- Containers that hold an app's own content no longer set `overflow-wrap: anywhere`: AppShell's content, Tabs panels, Card bodies, disclosure bodies, PreviewCard, NavigationMenu content and List content wrap with `break-word`. `anywhere` is inherited and lets grid and flex columns size below a word, so tickers and figures in a data screen broke mid-word. A word now breaks only when it cannot fit; titles, labels, descriptions and prose keep `anywhere`.

## 0.14.0

### Added

- `Kbd` writes a key or a shortcut the way the reader's platform does. `keys={['mod', 'k']}` reads ⌘K on Apple platforms and Ctrl+K elsewhere; modifiers take the platform's order (⇧⌘R, Ctrl+Shift+R), and ⌘, ⇧, ⌥, ⌃ and the arrows carry their names for screen readers in visually hidden text, which `labels` translates. A key sits on the recessed plane at 87.5% of the text around it. The server and the hydrating pass write the Ctrl form, so the markup matches; pass `platform` when the server knows the reader's. The `.surf-kbd` class is in `@surflane/css/presentation/kbd.css` too.
- `DescriptionList` (Root, Item, Term, Value) shows a resource's properties as terms and their values in a native `dl`. `layout='inline'` sets each value beside its term in a column of its own width and moves it under the term where the row is too narrow, or on a phone; `layout='stacked'` always does. `columns={2}` sets two columns where both fit. A row is at least as tall as the size's menu row, with its line centered, so a Badge or a copy action fits without growing it; compact density takes the small row. `Value truncate` keeps one line and the whole value in the text and the title; `Value copy` adds an icon-only CopyButton described by its term. An empty value reads "Not set" (`labels.empty`). The classes are in `@surflane/css/presentation/description-list.css` too.
- `Banner` (Root, Icon, Content, Title, Description, Actions) tells everyone about a state of the whole product, such as maintenance or an outage, in `tone` info, caution or danger. First in `AppShell.Root` it spans the shell edge to edge above the header, or above the sidebar and the content, and lines its icon up with the shell's inset. The title names the state in words; the tone colors the plane and the icon. It is a polite live region (`role='status'`). `onDismiss` adds a dismiss button (`dismissLabel`), and focus moves to the first control after the banner when it leaves. On a phone the description goes under the title and the actions under the text; compact density pads it 4px; forced colors keep a line under it. The classes are in `@surflane/css/presentation/banner.css` too.
- `Timeline` (Root, Item, Title, Time, Status, Description, Detail) shows events in time order, such as a deploy history, an audit log or a job's steps, as a named ordered list. Each Item is marked with its tone's icon (or `icon`, such as a Spinner) in a column of one width; Title ends with its `time` element, and Status names the state in the tone's ink, with Description after it. There is no connecting line: `current` puts the step where a sequence is now on the recessed plane with `aria-current='step'`. `Detail` holds logs or changes behind a Collapsible, its label in line with the title. Compact density pads events 4px; forced colors outline the current step. The classes are in `@surflane/css/presentation/timeline.css` too.
- `CopyButton labelHidden` shows the icon alone in a square button, for rows with no room for the text. The label stays the button's name and live result and shows as a tooltip; the icon and its color show the result.

### Changed

- `Tooltip`'s `shortcut` takes keys as Kbd does, such as `['mod', 'b']`, and renders a Kbd. A string you pass still shows as written. AppShell's sidebar toggle uses it, and its shortcut and the keydown handler read the platform from the same place.
- The copy button's rules moved from `@surflane/css/presentation/code.css` to `presentation/copy-button.css`; `presentation.css` and `@surflane/ui/code.css` include both. A page that imports `presentation/code.css` alone for a copy button adds `presentation/copy-button.css`.
- The Layout foundation explains density (what compact changes in each part, when to use it, and the 24px floor) and reading direction (`dir` and `DirectionProvider`, what mirrors and what stays physical), with a preview of the same parts in both directions, in English and Korean.
- `docs/component-checklist.md` gathers what a component must satisfy before it ships and which check or test enforces each rule; CONTRIBUTING links it.
- The catalog's content foundation lists its formatted values with DescriptionList, and the coverage page counts readiness with Stat.Group, instead of hand-built lists.

### Fixed

- Compact density no longer pads a workspace AppShell's content as well as its page. The inset doubled to 24px on a wide screen, and on a phone the page stood 12px off the screen's edges, 24px narrower.
- A compact Chart's "view table" line takes the caption role and 4px above and below, 26px, as compact as its table; it stayed at 38px.

## 0.13.0

### Added

- `SizeProvider density='compact'` (`ComponentDensity`) packs a dense screen, such as a monitoring dashboard, on a second axis beside size. Blocks sit `--surf-ui-density-gap` (12px) apart and keep `--surf-ui-density-inset` (8px) inside: Dashboard gaps, card padding and the gap inside a card, AppShell page and content padding, the PageHeader gap and FilterBar gaps. Card and Dashboard.Panel titles take the label role. Tables and charts inside turn compact unless they set `density='default'`, and a compact Chart's data table is compact too. On touch and narrow screens controls keep their size instead of growing to 44px, never under `--surf-control-target-size-min` (24px, WCAG 2.2 AA), and a phone puts two filters in a FilterBar row. `size` and `density` can each be left out to keep the surrounding one.
- Dashboard:
  - `Root.label` names the dashboard as a region, and `Root.columns` caps the columns a wide screen shows, so a row planned for that many keeps its proportions.
  - `Panel.state='stale'` keeps the last content under a caution that the refresh failed, with retry; `labels.stale` words it.
  - `Panel.placeholderHeight` sizes the loading placeholder, so the panels below don't move when the data arrives.
  - A panel title cut short shows in full on hover.
- `Stat.Group labelHidden` names a group without showing its label, where a panel title above already says it.
- Chart `legendLimit='auto'` keeps the legend on one line, folding what doesn't fit behind "+N", and the time axis picks its step from the chart's width and its labels, so ticks stay evenly spaced on a narrow chart.
- DatePicker, DateRangePicker and TimeField take the names every other field takes: `disabled`, `readOnly`, `required`, `invalid`, `open` on the pickers and `onValueChange`, and `size`, which sizes the field and its calendar.
- Select `onValueChange` passes Base UI's `eventDetails`, as RadioGroup and Combobox do; `eventDetails.cancel()` keeps the current value. A form reset reports details that can't be canceled.
- `Sheet.Content` and `Drawer.Content` take `focusBoundaryLabel`, which names their focus guards for VoiceOver as Dialog's are named.
- `Card.Root` takes `size`, as its parts do.
- `CopyButton` (from `@surflane/ui` and `@surflane/ui/code`) copies text and says what happened in its own label, the result in place of the action for 2 seconds as a polite live region. It takes `value` (text, or a function that returns it), `labels`, `onCopy` and `onResult`, and Button's `size` and `variant`. CodeBlock's copy button is a CopyButton.
- `PageHeader lead` sets the description as the page's lead, in the reading role at the reading measure, for a document that opens with it.
- Textarea `variant='embedded'` fills the pane it sits in, such as an editor beside a preview: no edge or corners of its own, focus as a 2px ring inside it, and an invalid value as an edge inside it.
- Heading and PageHeader take `variant` for the title's type role (display, title, page, section, subsection), as Text does; `size` keeps the scale meaning on every other component.
- Text `variant='compact'`: the 13/20px compact role, under the name the type scale uses.
- `NavigationMenu.LinkTitle` and `NavigationMenu.LinkDescription` (flat names `NavigationMenuLinkTitle`, `NavigationMenuLinkDescription`): a destination's name and a quieter line under it, inside a Link.
- Sheet and Drawer take two more custom properties beside `--surf-panel-width`: `--surf-panel-height` holds a top or bottom panel at one height, so it doesn't jump as a list inside changes, and `--surf-panel-inset` sets the side padding of the head, body and footer. `Sheet.Footer` and `Drawer.Footer` take `stacked`, which puts the actions one under the other at full width, as a phone's bottom sheet does.
- `InlineMessage.Icon` takes its Root's tone unless it sets one, as `Toast.Icon` does.
- Icon has view controls: `pin`, `list` and `grid`.
- `Table.Truncate measure` sets how wide it gets before the ellipsis, such as `44ch` for long image references; 32ch without it.
- Toolbar takes Home and End to its first and last item, as its keyboard notes said and as ToggleGroup, Tabs and Menubar do. Inside an input they still move the caret.
- `--surf-plane` and `--surf-recessed`: the plane a component sits on, and the area recessed one step from it. On the sheet they are the canvas and the surface. Card, Surface, the AppShell frame, the Sheet footer, an open Accordion item and the FileUpload drop zone set them for what they hold.
- `--surf-table-surface` names the sticky table header's background. Without it the header takes the plane it sits on.
- `--surf-motion-spin` and `--surf-motion-pulse` time Spinner, and Skeleton with indeterminate Progress.
- `--surf-size-label-leading-small`, `-default` and `-large` (18, 20 and 22px): button text inside a size scope.
- `Dialog.Title` and `Dialog.Description`, with `AlertDialog.Title` and `AlertDialog.Description`, carry the classes `surf-dialog-title` and `surf-dialog-description` (flat names `DialogTitle`, `DialogDescription`, `AlertDialogTitle`, `AlertDialogDescription`). A title rendered as another heading level keeps its style.

### Changed

These change what components look like, so they ship in a minor.

- Recessed areas follow their plane. Slider, Progress, Meter and BarList tracks, read-only and disabled fields, tab lists, Toolbar, Menubar, Avatar, Chart's empty state and inspector, an open Accordion item and the FileUpload drop zone take `--surf-recessed`. On the sheet nothing changes. Inside a Card, a Dashboard.Panel or the AppShell sidebar they turn to the canvas, where before they matched it at 1.00:1. Progress bars in a FileUpload list show now.
- Hover is one state layer, `--surf-interaction-hover-bg`, on menu, select, combobox and navigation items, fields, choices, calendar days, and list and table rows. In the dark theme menu items lighten on hover, as buttons do. The layer paints over a selected fill, so both show. Rows no longer take the hover fill while a control in them has keyboard focus.
- Dialogs lose their outer border: the backdrop and the shadow set them apart. Toasts gain a 1px `--surf-menu-border`, because nothing else sets them apart from the page. Dialog, Sheet and Drawer draw their edge in forced colors.
- A default SizeProvider renders exactly as no provider. Buttons and toggles keep 14/20px text, OTP digits keep the section role, Breadcrumbs and Link keep their text size, and the Slider keeps a 24px thumb on a 6px track. The Slider thumb steps 20, 24 and 28px by size. The NavigationMenu trigger takes the button padding.
- `--surf-selected-edge` mixes 65% of the focus color, up from 35%, so a selected row's edge reads 3:1 against its fill and the sheet.
- In light themes `--surf-brand-mark` caps lightness at 0.6 and chroma at 0.12. A range end reads 3:1 beside the in-range days, and every custom accent keeps 3:1 on a track.
- Chart categories 7 to 12 moved apart. Any two now differ by at least ΔE 0.087 on light and 0.092 on dark, and by 0.025 for dichromats.
- Badge padding is 6, 8 and 12px across, down from 7 and 9px at Small and Default.
- An icon in `EmptyState.Icon` is 32px, the one larger glyph that marks what the empty area is about.
- Outline buttons, toggles, icon buttons such as the dialog and sheet close buttons, and the AppShell edge toggle draw their edge with `--surf-control-border`, 3:1 against the sheet as fields are. Before they used the decorative `--surf-line`, about 1.2:1 on white.
- Dialog sits on planes, as Sheet and Drawer do: no line under the head or above the footer, and the footer is a surface plane. AlertDialog keeps its actions on the dialog's own plane.
- Chart formats numbers and dates in the runtime's locale when `locale` is left out, as the number helpers, BarList and Stat do; it used `en-US`. Pass `locale` when the server renders a chart, so its text matches the browser's.
- An inline Combobox list (`Combobox.Root inline`) leaves scrolling to the container it sits in, such as a ScrollArea; only a list in its popup scrolls itself, up to 280px.
- A Sheet or Drawer body keeps 16px of scroll padding at its top and bottom, so a control scrolled into view stays clear of the clipped edge.
- Every popup enters the same way: menus, selects, popovers, comboboxes, preview cards and navigation menus fade in and rise `--surf-motion-lift` (4px) in `--surf-duration-fast`, and close at once. Select, Menu and Popover had no entrance; the others rose 4, 6 or 12px over 120 to 200ms.
- AppShell links, Tree items and toggles, Accordion and Collapsible triggers, Chart legend buttons, Pagination links and the `@surflane/css` segments, icon buttons and theme actions take the same hover and pressed layer as everything else, over any fill they have.
- In forced colors a selected, current or pressed control fills with `Highlight` and writes its label in `HighlightText`: Toggle, ToggleGroup and Toolbar items, segments, the current AppShell, NavigationMenu, BottomNavigation and Pagination item, and a selected Tree item. Pressed toggles lose the inner outline they drew there, and the current AppShell link its outline. A highlighted Combobox option keeps its outline; a selected one shows its check, and a chosen value's chip keeps an edge.
- In forced colors a Card, a Dashboard.Panel, a Surface, a Toolbar and a Menubar draw a 1px `CanvasText` edge. Their planes flatten to Canvas there, so panels ran together.
- The date segment being typed into is marked like a selected row, a selected fill with its 3:1 `--surf-selected-edge`, instead of a 1px focus-colored outline.

### Deprecated

These keep working, and are removed in a later minor:

- DatePicker, DateRangePicker and TimeField `isDisabled`, `isReadOnly`, `isRequired`, `isInvalid`, `isOpen` and `onChange`: write `disabled`, `readOnly`, `required`, `invalid`, `open` and `onValueChange`.
- `--surf-menu-hover-background`, `--surf-control-hover-background` and `--surf-hover`: hover is `--surf-interaction-hover-bg`.
- `--surf-slider-track` and `--surf-control-disabled-background`: components read `--surf-recessed`.
- `--surf-ease-in` and `--surf-motion-exit`: no component uses them.
- `--surf-brand-tint`: selected text takes `--surf-selection-background`.
- `--table-surface`: write `--surf-table-surface`.
- `--surf-type-workspace-title-size`, `-leading`, `--surf-type-document-title-size`, `-leading` and `--surf-type-document-section-size`, the earlier page title roles: write the display and title roles.
- The type name `ComponentSizeAlias`, now `ComponentSize` under its former name: write `ComponentSize`.
- Text `variant='table'` and `--surf-type-table-size` and `-leading`: the compact role's earlier name. Tables set body text; write `compact` and `--surf-type-compact-*`.
- `--surf-menu-selected-background`: a selected item takes `--surf-selected`.
- Heading and PageHeader `size`: write `variant`. The values `workspace` and `document`, earlier names for `display`, go with it.
- The blueprint grid tokens `--surf-grid-minor`, `--surf-grid-major`, `--surf-guide`, `--surf-grid-cell`, `--surf-grid-major-cell`, `--surf-grid-base-opacity`, `--surf-grid-halo`, `--surf-veil-spread` and `--surf-veil-blur`: nothing draws that grid any more.

### Removed

Deprecated in earlier minors and announced for removal:

- The short size spellings `sm`, `md` and `lg` on every component (0.10).
- Button `xs`, `icon-xs`, `icon-sm` and `icon-lg`, and `variant='default'` (0.10).
- Icon `size` `sm`, `md` and `lg` (0.10).
- Tree `emptyLabel`, CodeBlock `copyLabel`, `copiedLabel` and `copyErrorLabel`, and Tooltip `enabled` (0.10).
- `positionerProps` on `Combobox.Content`, `ContextMenu.Content` and `PreviewCard.Content` (0.5).
- Surface and Card `tone`, and the `data-tone='canvas'` selector (0.5).
- `--app-shell-radius` (0.7).
- `--surf-icon-size-sm`, `-md` and `-lg`, and `--surf-avatar-size-sm`, `-md` and `-lg` (0.10).

### Fixed

- BarList writes a missing value as "—", as the number helpers do; it printed NaN.
- Combobox shows the keyboard position on a selected option.
- Hovering or pressing the selected tab keeps its selected fill.
- A disabled Slider fades its control only. Its label and value stay readable.
- Disabled NumberField, Combobox and DatePicker fade once, not twice.
- NumberField and date segments keep 16px text on touch screens, so iOS doesn't zoom.
- The first control in a Sheet or Drawer body shows its whole focus ring.
- Sheet and Drawer `side='left'` and `'right'` dock to that edge on right-to-left pages too.
- DatePicker's trigger, month buttons and days, OTP fields at Small and the AppShell edge toggle reach 44px on touch.
- Popups follow `DirectionProvider` inside a right-to-left region: Menu, ContextMenu, Select, Combobox, Autocomplete, Popover, PreviewCard, Tooltip, NavigationMenu, Toast, Dialog, AlertDialog, Sheet and Drawer set `dir='rtl'` on what they portal. Their text ran left to right, and an aligned popup took its start and end from the page instead.
- A keyboard-focused range start or end in the calendar rings in `--surf-on-brand`, 4.4:1 on its fill in light and 9.9:1 in dark. In dark the ring matched the fill. Other selected days keep the shared focus color.
- Right to left, a ScrollArea puts its vertical bar on the left, where the page's own bar sits, and fades the edge that actually hides content; the bar sat on the right and the fade on the opposite edge. Chart's legend moves to the inline end of its key; it stayed beside the title.
- A copy button is as wide as its longest label, so a longer result such as Copy unavailable no longer widens it and moves the toolbar.
- Dashboard.Panel moves focus to its title when Retry clears the error and takes its own button away; focus fell to the page.
- ScrollArea's scrollbar stops fading under reduced motion, as every other transition does.
- On touch and narrow screens a checkbox, radio or switch without a ChoiceLabel, such as a Table or List row's selection checkbox, and a Tree item's disclosure button keep their size but take a `--surf-control-target-size` press around them. They took 20 and 32px.
- `--surf-dialog-exit-duration` takes effect.
- Tailwind `dark:` follows the system setting when the page sets no `data-theme`, as the tokens do.
- The shadcn bridge maps `--chart-1` to `--chart-5` to the categorical palette, `--destructive` to a red that holds white text at 4.5:1, `--accent` to the hover layer and `--ring` to the focus color.
- The Tailwind theme types `--surf-selected-edge` and `--surf-slider-track` as colors, and no longer offers `--surf-control-focus-ring-size` as one.
- NavigationMenu's chevron turns in `--surf-duration-fast`, as other chevrons do.
- Hovering a selected Tree item, the current AppShell link or Pagination page, or the checked `@surflane/css` segment shows the hover layer over the selected fill; before, one hid the other.
- In forced colors a selected Tree item shows its label; the system's backplate painted it white on white.
- The current and checked `@surflane/css` segments show in forced colors; they showed nothing.

### Migration

- Sizes: write `small`, `default` and `large` for `sm`, `md` and `lg`. Button `icon-sm` and `icon-xs` become `icon-small`, `icon-lg` becomes `icon-large`, and `xs` has no replacement: use `small`. On Icon, `sm` becomes `default` (or leave the size out), `md` becomes `large`, and `lg` (24px) has no replacement.
- Button `variant='default'` becomes `primary`, or leave the variant out.
- Tree `emptyLabel` becomes `labels.empty`; CodeBlock `copyLabel`, `copiedLabel` and `copyErrorLabel` become `labels.copy`, `labels.copied` and `labels.copyError`; Tooltip `enabled={false}` becomes `disabled`.
- `positionerProps={{ side, align, sideOffset, collisionPadding }}` becomes the same props on the Content part.
- Surface and Card `tone` becomes `surface`.
- `--app-shell-radius` becomes `--surf-app-shell-page-radius`, set to the page's own radius.
- `--surf-icon-size-sm` and `-md` become `--surf-size-icon-default` and `-large`; `--surf-avatar-size-*` become `--surf-size-avatar-small`, `-default` and `-large`.
- A bare `<h2>` or `<p>` inside `Dialog.Header` is no longer styled as the title or description. Render `Dialog.Title` and `Dialog.Description`, as the examples do.

## 0.12.0

### Added

- Select `width='content'` fits the trigger to its longest option, as a native select does, and keeps that width when the value changes. It sits beside other controls in a header or toolbar; the default `fill` still takes the container's width.
- Select `multiple` (`SelectMultipleProps`, `SelectMultipleLabels`) chooses several values and sums them up on one line, for filters of projects, models or nodes. The trigger names one choice, counts several and reads `labels.all` when every option is chosen. Its first option chooses all or none, and a form receives only the chosen values. A long list to search, with chips, stays Combobox `multiple`.
- `Dashboard` lays out a monitoring screen's data panels. `Dashboard.Root` fits as many columns as panels of `--surf-dashboard-panel-min-width` (20rem) and shows one on a phone. `Dashboard.Panel` is a card named by its title, with a description behind an info button, header `actions` and the state of its data: `loading` shows a placeholder, `error` a message with retry, `empty` a sentence, and `refreshing` keeps the content and shows a spinner by the title. The content takes the room a stretched row gives it, and titles line up across a row. `span` widens a panel where columns fit. Types: `DashboardRootProps`, `DashboardPanelProps` and `DashboardPanelLabels`. Entry point `@surflane/ui/dashboard`.
- `TimeRangePicker` picks the span a monitoring screen shows back from now, how often it refreshes and when to refresh now: two content-width selects and a button in a named group. Range and interval are milliseconds; `timeRangeOptions` and `refreshIntervalOptions` hold the defaults to translate. The interval pauses while the page is hidden. Entry point `@surflane/ui/time-range-picker`.
- `BarList` ranks named values of one unit with bars in proportion to the largest, such as disk by directory: name and detail, bar and value in columns every row shares. `maxRows` bounds it in a named scroll region by whole rows. Entry point `@surflane/ui/bar-list`.
- BottomNavigation.Item `badgeTone` colors the badge by meaning with the status tones: `danger` (the default) for what needs action now, `caution` for what needs a look, `neutral` for news.
- `Stat.Status` (`StatStatus`, `StatStatusProps`) gives a value its state against a threshold, such as "Below 30 GiB": the tone's icon and text. A `caution` or `danger` status colors the value too.
- `Stat.Group` (`StatGroup`, `StatGroupProps`) puts values of one measure side by side under a shared `label`, such as GPU temperature per node.
- Icon has an infrastructure set: `server`, `database`, `disk`, `chip`, `memory`, `network`, `bolt`, `token` and `thermometer`, and a `refresh` arrow.
- Chart for monitoring:
  - `xScale='time'` places rows by `data[].time` (ms or a Date), puts ticks on round local times (every 6 hours, each day, each month) and breaks a line where sampling stopped for more than twice the usual interval.
  - `references` draws threshold lines (`{ y }`) and bands (`{ from, to }`) in a neutral, caution or danger tone. The legend names each with its value, and the value axis reaches it.
  - `stacked` stacks bar and area series; the readout and the floating values add their total.
  - `curve='step'` holds each value until the next, for values sampled when they change.
  - `yScale='log'` spans orders of magnitude, such as prefill and decode throughput. Zero and negative values stay off the plot and in the table.
  - `density='compact'` keeps the plot, legend and floating values for a dashboard card. The caption, keyboard help, readout and x-axis name stay for assistive technology.
  - `legendPosition='bottom'` puts the legend under the plot, and `legendLimit` folds the series past it behind a "+N" popover that still toggles them.
  - `ChartSeries.color` replaces the palette's color for one series, and `ChartSeriesMark` draws a series' swatch for a key of your own.
  - Types: `ChartReference`, `ChartTone` and `ChartSeriesMarkProps`; labels `moreSeries(count)` and `total`.
- The categorical chart palette has twelve colors, `--surf-chart-category-1` to `-12`: the six hues, then six more halfway between them at another lightness. Each reads 3:1 on the sheet and on a card in both themes.
- `AppShell.MenuTrigger` (`AppShellMenuTrigger`, `AppShellMenuTriggerProps`) is the phone's menu button. It shows only at 760px and narrower, where the sidebar hides, at the header's end. Render it into your `Sheet.Trigger`; `label` names it. Before, the caller hid and placed the button with its own CSS.

### Changed

These change layout and type inside a size scope, so they ship in a minor.

- Card, Sheet, Drawer and Dialog titles take the subsection role (16/24px) inside a Small size scope. Default and Large keep the section role (20/28px). Every other type role stays the same at every size.
- A FilterBar filter keeps its 12rem width and no longer grows. Only `width='search'` takes the room left in the row. A lone filter no longer fills the row, and the last field of a wrapped row no longer stretches. At 760px and narrower every field still fills its row.

### Fixed

- Chart renders its data table when it is first opened. Thirteen charts with 240 rows had put 15,000 table elements on the page up front.
- Chart's legend buttons follow the size scheme's control height. They were 36px at every size.
- Chart's data table names the unit once, in each series header, and its cells hold numbers aligned at the end, as the Table guidelines ask. Every cell repeated the unit.
- The heads of Dialog, AlertDialog, Sheet and Drawer follow the size's card padding above and below, as their sides and bodies already did: 16/12px at Small, 24/20px at Default and 32/28px at Large. Dialog's footer follows it too.

## 0.11.0

### Changed

These change how states look, so they ship in a minor. No API changed.

- A disabled DatePicker or TimeField fades its field, not its label or description, as every other field does. The reason beside a disabled control stays readable.
- A read-only field shows its value on the surface plane, without the field's border: Input, Textarea, OTPField, NumberField, Combobox, DatePicker and TimeField. Its text keeps full contrast, so it doesn't read as disabled, and focus still draws the field's edge and halo.
- Slider fills with `--surf-brand-mark` on a `--surf-surface` track, the pair Progress uses. In light themes the fill read 1.68:1 on the sheet and the empty track was darker than the fill. It now reads 3.3:1 on both the sheet and the track.
- `--surf-slider-track` is `--surf-surface` in both themes.
- OTPField's group separator is a short dash in `--surf-ink-muted`, as a code is written elsewhere (481-920). The 1px `--surf-line` rule read 1.2:1.

## 0.10.1

### Fixed

- Skeleton is visible on a light canvas. It painted `--surf-surface`, about 1.07:1 on white, and its pulse faded it further. It now paints `--surf-skeleton-base` and pulses to `--surf-skeleton-highlight`.
- A Fieldset's legend is closer to its own fields than to the group above. Base UI renders the legend as a flex item, so its margin added to the fieldset's gap: 32px under the legend, while a Form separates fieldsets by 24px. The gap alone spaces it now.
- Prose that opens with a heading has no space above it. The heading rule's top margin outweighed the first child's reset, which left 32px.
- A read-only NumberField's steppers fade like a disabled field's. They do nothing, but they looked clickable.
- FileUpload without `multiple` says "Choose file" and "or drop a file here". Its labels named several files. Custom `labels` still win.
- FileUpload's root carried the field class twice.

## 0.10.0

### Added

- `Table.Root` takes `variant`:
  - `plain`, the default, separates rows by space.
  - `lined` draws lines between rows, and `grid` between rows and columns. Both draw inside the table only: no line above the header, below the last row or at the sides.
  - `striped` tones every other body row with `--surf-surface`.
  - Lined, grid and striped rows meet edge to edge, square.
- Text you could not replace before is now in props:
  - Tree `labels`: `expand`, `collapse`, `scrollArea`, `empty`.
  - Chart `labels.legend` and `labels.series` name the legend.
  - Markdown `labels`: `code`, `table`, `task`, and the copy text of its code blocks.
  - CodeBlock `labels`: `copy`, `copied`, `copyError`.
  - Toaster `closeLabel`.
  - FileUpload `labels.size`, which formats a file size, and `labels.fileAction`, which names a file's buttons so a language can put the file name first.
  - `AppShell.SidebarToggle` `labels.shortcut`.
- Label types are exported: `PaginationLabels`, `CodeBlockLabels`, `AppShellSidebarToggleLabels`, `TreeLabels` and `MarkdownLabels`.
- Tooltip `disabled`.
- Button `icon-small` and `icon-large`.
- Icon `size`: `small`, `default` or `large` (14, 16 or 20px), like every component.
- Pills scale with the radius. Buttons, badges, chips, switches and segments draw their corners with the new `--surf-radius-pill`.
  - It is 22px, half the tallest control, so by default every one is still a pill.
  - Like the other corner tokens it scales with a radius preset or `createTheme`'s `radius`: a smaller scale rounds the larger parts' corners first, and `radius: 0` squares them.
  - A switch's thumb stays concentric with its track.
  - Circles and bars stay round: avatars, radios, slider knobs and progress bars.
- Tokens:
  - `--surf-selected-edge`: the focus color, faint, over `--surf-selected`.
  - `--surf-brand-mark`: brand as a mark on the sheet, darker in light themes.
  - `--surf-slider-track`.
  - `--surf-control-text-min-size`: the smallest text in a text field.
  - `--surf-scrollbar-indicator-size`: the thickness of ScrollArea's thumb.
- AppShell parts for what every app built by hand:
  - `AppShell.Brand`: the product's `mark`, `name` and optional `description`. In the sidebar it is the top row, its mark on the links' icon column and its name on their label line, hidden on the workspace rail where the toggle takes its place. In the header it sits on one line. A long name truncates and keeps its text in `title`. `render` makes it a link home.
  - `AppShell.Nav`: Links with even gaps, inset in the workspace sidebar so their icons sit on the rail. Its `label` shows over the links, keeps its row on the rail and names the navigation.
  - `AppShell.Link` takes `render`. A router's link keeps client navigation, and a `Menu.Trigger` makes the account row line up with the links.
  - Types: `AppShellBrandProps`, `AppShellNavProps` and `AppShellLinkProps`.
  - Shell variables: `--surf-app-shell-icon-column` (40px), `--surf-app-shell-brand-height` (80px) and `--surf-app-shell-mark-size` (24px).
- Chart's `formatValue` also writes the value axis ticks.
- `all.css` includes `motion.css`, so `transitionTheme` works with it alone.

### Changed

A 0.x minor may change names and packages, and this one does. Migration, below, lists each step.

- **Namespace.** Classes are `surf-*`, formerly `pui-*`.
  - Every custom property the packages declare is `--surf-*`: `--brand` is `--surf-brand`.
  - A host's own `--brand` can no longer override a Surflane token by accident.
  - Base UI's variables, such as `--anchor-width`, keep their names. So do the Tailwind utilities, such as `bg-canvas`.
- **`@surflane/css`.** The CSS-only classes left `@surflane/design-tokens` for this new package:
  - `controls.css`, `foundations.css`, `presentation.css` and `typography.css`, with their parts.
  - `@surflane/design-tokens` now holds only tokens, themes, theme motion and the Tailwind and shadcn bridges.
  - The three packages ship together with one version.
- **Base UI is a peer dependency**, `^1.9.0`, no longer a pinned dependency. Your app and Surflane share one copy.
- **Success is green**, Green 50, apart from the brand cyan. A success no longer reads as the main action.
- **`data-theme` takes `dark` or `light`.**
  - An element with another value keeps the theme around it.
  - On the root, another value follows the system preference.
- **Server components.** These modules no longer start with `'use client'`, so they render on the server without client JavaScript:
  - Card, EmptyState, List, Stat and Table.
  - FilterBar, PageHeader, Skeleton, Spinner, Icon, Sparkline and Breadcrumbs.
  - The layout primitives and the type components.
  - An explicit `size` adds a small client boundary, so popups inside keep the size.
- **No `forwardRef`.** Components take `ref` as a prop, as React 19 allows. Refs work as before.
- Button and LinkButton without a variant are `primary`.
- A selected Table row shows a faint `--surf-selected-edge` around it besides the selected tone, so a selection reads as held. Selected rows that meet in a lined, grid or striped table share one edge.
- Contrast:
  - Progress fills and DatePicker range ends use `--surf-brand-mark`. In light themes they meet 3:1 against the track and the sheet, where `--surf-brand` measured 1.6.
  - In dark themes, Slider's track is `--surf-slider-track`, 3:1 against the brand fill instead of 1.0.
  - `--surf-selection-background` is one step from `--surf-selected`, so text selected on a selected row, segment, toggle or calendar day stays visible. The two were equal.
  - A hovered calendar day uses `--surf-hover`, so it no longer looks selected.
  - `--surf-status-*-border` meet 3:1 against the sheet, with their hue kept. `--surf-status-neutral-border` is `--surf-control-border`.
- DatePicker writes the words a locale puts around a day number from `Intl`, so Japanese and Chinese calendars show 日 as Korean shows 일.
- Icon's sizes follow the component scale. Without a size it is still 16px.
- In a ScrollArea of set height, the content box is at least as tall as the viewport, so a child can stretch to its bottom. A ScrollArea sized by its content is unchanged.
- On touch screens, ScrollArea's thumb is 3px, as native mobile scrollbars are. It only shows the position there. With a pointer it stays 6px.
- Chart's value axis widens to round steps from zero too, so its top tick is a round value above the highest one, not the highest value. Without zero, the steps are the smallest round ones that fit five intervals: the latency example reads 140 to 240 instead of 125 to 250.

### Deprecated

These keep working, and are removed in a later minor:

- The short size spellings `sm`, `md` and `lg` on every component. Write `small`, `default` and `large`.
- On Button:
  - `icon-sm` and `icon-xs`: write `icon-small`.
  - `icon-lg`: write `icon-large`.
  - `xs`: off the scale, and it stays 24px on touch screens.
- On Icon:
  - `sm` (16px): write `default`, or leave the size out.
  - `md` (20px): write `large`.
  - `lg` (24px): off the scale.
- Tree `emptyLabel`: use `labels.empty`.
- CodeBlock `copyLabel`, `copiedLabel` and `copyErrorLabel`: use `labels`.
- Tooltip `enabled`: use `disabled`.
- Button and LinkButton `variant='default'`: write `primary`. It looks the same.
- Tokens:
  - `--surf-icon-size-sm` and `--surf-icon-size-md`: use `--surf-size-icon-default` and `--surf-size-icon-large`. `--surf-icon-size-lg` has no replacement.
  - `--surf-avatar-size-*`: use `--surf-size-avatar-*`.

### Removed

- Chart `missingLabel` and `emptyLabel`, deprecated since 0.5.0. Use `labels.missing` and `labels.empty`.

### Fixed

- Checkboxes, DatePicker's field segments and a Link's focus corners kept fixed corners under a radius preset or `createTheme`'s `radius`. They now follow `--surf-radius-sm`. A checkbox's corner stops at 3/8 of its side, so a rounder theme never makes it look like a radio.
- `preloadSyntaxHighlighting` tested line breaks with a pattern that could match `\r\n` two ways, which backtracks exponentially on a long input that fails. It now uses one that cannot.
- Accent presets (`themes/accent-*.css`) turned light accent text and focus rings into the light accent, under 3:1 on white. Their dark block also matched a light `:root`. Light now keeps `--surf-brand-ink` on the ink. `themeCss` also reverts, in light, any token a theme sets only for dark.
- Textarea is a block box, so no baseline gap opens under it.
- On narrow screens and touch, text fields keep their text at 16px or more, so iOS no longer zooms into a field when you tap it.
- The workspace AppShell needed rules that lived only in the catalog. The package now gives them:
  - The shell takes its container's height, so the sidebar stays put while the content scrolls.
  - A ScrollArea in the sidebar or the content fills its room.
  - SidebarToggle sits on the sidebar's edge, and centers in the rail when collapsed.
  - The install guide gives `html`, `body` and the app's root element the window's height, which the shell takes.
- A collapsed sidebar also hid every `AppShell.Label` outside it, such as a name in the phone header. Only the sidebar's labels collapse now.
- Chart's last category label could lose its last pixels at the right edge.
  - Recharts measured it in the fallback font when the chart rendered before the web font had loaded. Chart now draws the labels once their font has loaded.
  - The chart surface also shows the pixel an SVG label can round past that measure.
- Syntax highlighting could color only the start of a block on a slow device and keep that result. Shiki stopped at 500ms per line while its patterns were still compiling. Each line now gets 5 seconds.

### Migration

- **Namespace:**
  - Replace `pui-` with `surf-` in class names and selectors.
  - Prefix each Surflane custom property you read or set with `surf-`: `var(--ink)` becomes `var(--surf-ink)`.
  - Leave Base UI's variables and Tailwind utilities as they are.
- **Packages:** install `@surflane/css` and `@base-ui/react` next to `@surflane/ui` and `@surflane/design-tokens`.
- **Imports:** where you imported `controls.css`, `foundations.css`, `presentation.css` or `typography.css` from `@surflane/design-tokens`, import them from `@surflane/css`.
- **Themes:** a scope with a `data-theme` value other than `dark` or `light` now inherits. Write `dark` where you relied on the old fallback.
- In JSX, `size='sm'` becomes `size='small'`, `md` becomes `default` and `lg` becomes `large`, except on Icon:
  - Icon `sm` becomes `default`.
  - Icon `md` becomes `large`.
- Button `icon-sm` becomes `icon-small`.
- CSS that selects `[data-size='icon-sm']` on a Button now selects `[data-size='icon-small']`.

## 0.9.0

### Added

- `SyntaxHighlighting` takes `suspense`. Each code block waits for its tokens behind its own Suspense boundary, so a server render or a prerendered page writes highlighted HTML and hydration keeps it, with no plain-text first paint. In the browser, a block that appears or changes later shows plain text until its tokens arrive, as before; nothing around it suspends. `preloadSyntaxHighlighting(root)` reads the tokens of the server-rendered code under `root` back from its HTML, so hydration loads neither the engine nor a grammar. Await it before `hydrateRoot`, so no block is left waiting, where a context change above it would make React drop its HTML for the plain fallback.

## 0.8.0

### Changed

- FileUpload lists chosen files inside its drop zone, one row per file divided by lines, so the field reads as one plane rather than a stack of boxes, and a drop on the list adds files too. A file's actions end its row and wrap below only when the row is narrow. Rejection messages and the field error now follow the drop zone.

### Fixed

- FileUpload's announcements, such as "2 files selected.", were printed under the list: the class that should hide them didn't exist. They are now heard and not seen. `check:package` fails on any rendered class that no rule styles.
- With a light OS setting and no `data-theme`, code used the dark theme's syntax colors, at 1.6–2.4:1. The light syntax colors now apply there too, and the token build fails when the two ways to light differ.
- Hovering an invalid field no longer replaces its danger edge with the hover edge, in Input, Select, Textarea, DatePicker and checked Checkbox, Radio and Switch. Combobox and NumberField draw their invalid edge in `--status-danger-fg` like every other field.
- In forced colors, focused fields show an outline, and Select shows its highlighted option.
- A scroll area focused by keyboard, such as a wide Table or a CodeBlock, shows the shared focus ring around its edge instead of the browser's, which the edge fade cut off.
- Dragging a Slider no longer rings its thumb; keyboard focus still does.
- In link mode, Pagination's unavailable pages and arrows keep their names and read as unavailable links. They were spans whose names assistive technology ignored.
- CodeBlock's copy button keeps keyboard focus while a copy is pending, instead of dropping it to the page.

## 0.7.0

### Added

- `--app-shell-page-radius` sets the radius of AppShell's page surface, 8px by default.
- The install guide and the AppShell docs give a window-filling shell its document: `body { margin: 0; background: var(--chrome); }`, so the browser's default margin never shows around it.

### Changed

- AppShell's own edge is square. The shell fills the window, so its edge is the window's; a page that shows a shell inside a frame rounds and clips the frame instead. Only the page surface is rounded. `--app-shell-radius` still derives the page radius as `max(0, radius - inset)` and is deprecated: set `--app-shell-page-radius`.
- On a phone, 760px and narrower, AppShell's page meets the screen's edges: the shell drops its inset, and the page its margin and rounding, below the mobile header.

### Fixed

- A tap or click on a Chart no longer draws the browser's focus ring, around the plot or around the lines and points. The browser's SVG styles ring any focus, not just keyboard focus, and Recharts makes each layer of lines and points focusable. The plot now shows Surflane's ring for keyboard focus only, like every other control.

## 0.6.0

### Added

- Component stylesheets. Every component, pattern and foundation with styles has one at its entry point's path with `.css`, such as `@surflane/ui/button.css`: 69 in all. Each brings the tokens and the styles of everything its component renders, so an app can ship only the styles it uses. The published stylesheets are flat lists of rule files, each listed once, so a toolchain that keeps duplicate imports never repeats them; with Tailwind CSS, import `all.css`. One component's stylesheet is about 30 KB, 6 KB gzipped; `all.css` is 154 KB, 23 KB gzipped. See [Component stylesheets](https://github.com/Ashon/surflane/blob/main/docs/frameworks.md#component-stylesheets).
- `@surflane/design-tokens` splits `presentation.css` and `foundations.css` the same way, as `presentation/*.css` and `foundations/*.css`.
- `Stat` shows a key figure. `Label`, `Value`, `Change` and `Caption` render a description list. `Change` takes the change as a number, shows its sign and an arrow, and colors it by direction; `lowerIsBetter` swaps the colors for measures such as latency.
- `Sparkline` draws a small trend line for a card or a table cell, without recharts: 24, 32 or 48px tall, with an optional baseline and end marker. Missing values leave gaps, and `label` names the line for assistive technology.
- `formatNumber`, `formatCurrency` and `formatPercent` format numbers the same way on every screen: an explicit locale, `signed` for +/−, `compact` for 1.2M or 1.2만, `precision`, and a `missing` text for absent values. They also live at `@surflane/ui/format`.
- Chart takes `includeZero={false}` for values far from zero, such as prices: the value axis spans the data in round steps. Bars always start at zero. `palette="categorical"` colors series with six hues, for categories that color must tell apart.
- Chart shows the active point's values in a box beside it: the date, and each visible series with its legend mark and value. Pointer, touch and the arrow keys all bring it up. It opens to the side with more room, stays inside the plot, and closes with Escape. The readout below the plot still announces the same values, so the box stays out of the accessibility tree.
- An `info` status tone for Badge, StatusBadge, InlineMessage and Toast, in blue, apart from the cyan of success.
- `toast()` shows a toast from anywhere, inside React or out, with one `<Toaster />` in the app. `toast.success`, `error`, `warning`, `info` and `loading` pick the tone; `toast.promise` turns a loading toast into success or error; `toast.update` and `toast.dismiss` take the ID a call returns. `action: { label, onClick }` adds a button. `createToaster()` makes a helper with its own manager for a separate region.
- Tooltip's `label` takes any content, not only a string, and `shortcut` sets a keyboard shortcut apart after it, such as `⌘B`.
- AppShell keeps the sidebar's collapsed state unless you control it. `defaultCollapsed`, `onCollapsedChange` and `persist` (a localStorage key) manage it, and ⌘B or Ctrl+B toggles it outside text fields (`shortcut={false}` turns that off). `AppShell.SidebarToggle` is the button: it sets `aria-expanded` and `aria-controls`, and its tooltip names the shortcut. On the collapsed rail each `AppShell.Link` shows its name as a tooltip, and `--app-shell-rail-width` sets the rail's width.
- `BottomNavigation` puts a phone app's three to five main destinations along the bottom edge. `BottomNavigation.Item` is a link, with a router's link as `render`: an icon above a label, `current` for the page you're on, and a `badge` count (up to 99+) or dot with a spoken `badgeLabel`. It shows at 760px and narrower, where AppShell hides its sidebar, unless `visible="always"`; it stays fixed above the safe area unless `position="static"`.
- Icon gains `sidebar`.
- Tokens:
  - `--info` and `--status-info-*`.
  - `--trend-up`, `--trend-down` and the `--trend-up-*`, `--trend-down-*` and `--trend-flat-fg` roles. Markets that read red as a rise set `--trend-up` and `--trend-down` the other way round.
  - `--chart-category-1` to `-6`.
  - `--size-bottom-navigation`, BottomNavigation's height, to pad content by, and `--layer-chrome`, for fixed app chrome under every overlay.
  - Every new text color meets 4.5:1, and every category color 3:1, in both themes.

### Changed

- Tooltip with `enabled={false}` keeps its trigger mounted, so turning the tooltip on or off never moves focus.
- Chart's legend shares one row with the value axis name, right above the plot; the keyboard help moves below the plot. `labels` gains `inspectHint` and `noRows`, the last two strings the chart showed only in English.
- A fifth cascade layer, `surflane.sizes`, sits above `surflane.components`. It holds the size scheme and size variants: `SizeProvider`, a component's `size`, extra-small and icon buttons, and table density. They override a component's defaults in whatever order the stylesheets load. Every stylesheet's layer order statement names the new layer, and so does the theme builder's `layerOrder`.
- `styles.css`, `presentation.css` and `foundations.css` now import the per-component stylesheets. They bring the same rules with the same effect: the catalog renders the same at every size.
- Presentation classes defer to a Button they sit on. `.pui-pagination-control`, `.pui-table-sort` and a table header's button inset apply their box, type and colors only to elements that are not Buttons, and Icon pagination arrows mirror themselves.

## 0.5.0

### Added

- `ChoiceLabel` pairs a Checkbox, Radio or Switch with its label and an optional `description`. The label text alone names the control, the description is read as its description, and the control sits on the first line.
- `LinkButton` gives a link Button's `variant` and `size` and stays a link for assistive technology. `Link` and `LinkButton` take a router's link element as `render`, such as `<Link render={<NextLink href='/docs' />}>`.
- Dialog and AlertDialog `Content` take `size`: small, default and large are 420, 640 and 840px wide, and set the density inside. Popover `Content` takes `size` too (240, 320 and 480px), and `Popover.Title` and `Popover.Description` are styled. An overlay without `size` keeps its default width and the surrounding density. For a width alone, set `--dialog-width`, `--popover-width` or `--panel-width`.
- Sheet and Drawer `Content` take `flush`, which attaches the panel to its edge with square corners there, as a mobile bottom sheet sits.
- `Table.Container` takes `bleed`, which hangs the table by its cell inset so cell text lines up with the text around it.
- Select options can be groups, `{ label, options }`, shown under a heading. NativeSelect keeps optgroup labels the same way. Select forwards `ref` to its trigger.
- Checkbox, Radio and Switch take `size`. Without it they follow the surrounding size.
- Popover, Menu, ContextMenu, PreviewCard, Combobox and Autocomplete `Content` bring their own portal, as Dialog's does. A `Portal` around them keeps working without adding a second one.
- ContextMenu, PreviewCard, Combobox and Autocomplete `Content` take `side`, `align`, `sideOffset` and `collisionPadding` directly, as Popover and Menu do; `positionerProps` stays as a deprecated alias. Tooltip takes `side`, `align` and `sideOffset`.
- Surface and Card take `surface` (`subtle` or `canvas`) for their background. `tone` stays as a deprecated alias, so `tone` keeps one meaning, a status color.
- Chart takes `labels` for all of its text, replacing `missingLabel` and `emptyLabel`, which stay as deprecated aliases. FileUpload's `labels` gains `uploadError`, the message when an upload fails without one of its own.
- Every component, pattern and foundation module has its own entry point, named after its catalog page: `@surflane/ui/checkbox`, `@surflane/ui/sheet`, `@surflane/ui/app-shell`. There were 15 entry points; there are 68. The root entry exports the same names as before.
- Icon gains `minus`, `minus-circle`, `clock`, `chevron-back`, `arrow-up`, `arrow-down`, `sort`, `upload`, `calendar` and `user`.
- Overlay width tokens: `--size-dialog-*`, `--size-popover-*` and `--size-panel-*`.
- Focus and target tokens: `--focus-ring-width`, `--focus-ring-offset`, `--focus-ring-inset` and `--control-focus-ring-size`, and `--control-target-size` (44px).
- `--layout-reading-measure` (54ch) holds reading text to about 70 Latin or 50 Hangul characters per line. Paragraphs, lists and quotes in `Prose` and `Markdown` keep to it, while tables, code and images still use the full reading width. The catalog's manual copy uses the same measure with the reading role (16/28).

### Changed

- Type roles set tracking alongside size and leading, as `--type-<role>-tracking`. Neither Manrope nor Pretendard has an optical size axis, so the roles adjust tracking by size:
  - Headings tighten as they grow: display and title −0.02em; page, section and metric −0.01em.
  - Captions open by +0.01em.
  - Body, reading, label, compact and code stay at 0.
  - With Tailwind CSS v4, `text-<role>` utilities apply the tracking too.
- Korean text inside `pui-typography` wraps between words (`word-break: keep-all`). Its word spaces widen to Pretendard's width through `--type-hangul-word-spacing` (0.05em): Manrope leads the body stack, so Korean took Manrope's narrower space.
- `--type-label-leading` is 20px at 14px, down from 22px. Buttons and other single-line controls already used 20px.
- A `--type-compact-*` role, 13/20, covers dense secondary text. `--type-table-*` and `--type-code-*` now alias it.
- Display grows from 32 to 40px and title from 28 to 32px with the screen.
  - `--type-workspace-title-*` and `--type-document-title-*` alias display, and `--type-document-section-size` aliases title.
  - Heading and PageHeader `size="workspace"` and `size="document"` render the display role.
- Components take their type from the role tokens, so changing a role reaches them. This changes a few components:
  - Dialog and panel titles move from 22px to the section role (20/28).
  - Toast descriptions move from 13/18 to 13/20.
  - Avatar initials move from 10px to the 12px minimum.
  - Menu and combobox group labels, chips, list descriptions and file upload hints take their role's leading instead of the parent's.
- `check:package` fails on literal font sizes, line heights or weights in package CSS.
- Every component draws the same focus ring: 2px, outside with a 2px offset, or inside where a container would clip it.
  - Checkbox, radio, switch, link, tabs panel and slider thumb rings move from a 3px offset to 2px.
  - Text field halos use `--control-focus-ring`.
- Button, menu and combobox items, navigation links, the file trigger and app shell links reach the 44px target on touch screens of any width (`pointer: coarse`), not only below 760px.
- Select, Menu and Combobox items share one item style:
  - The row is the control height: 36px, or 44px on touch. Menu and combobox rows are 2px shorter.
  - The check column has a 36px indent. Select's check moves 2px and its text 4px.
  - The corners take the control radius.
- Dialog and panel chrome uses the spacing scale and one close button clearance: the control height plus 16px on each side. Dialog headers clear the close button by 68px instead of 72px, and close buttons sit at the inline end in right-to-left text.
- Switch derives its padding and thumb travel from the switch tokens.
- Textarea is a Field control: inside Field.Root it takes the label, description and error, as Input does. It also accepts the size aliases.
- A popover fits its content up to 320px, or its `size` width, instead of up to the viewport width.
- `check:package` fails when a component stylesheet selects a class that no component renders. It also caps the literal lengths left in package CSS at 129, so the count can only fall.
- Components draw their glyphs with Icon, so every glyph takes `--icon-stroke-width` (1.7) and round caps. Strokes of 1.5, 1.6 and 2 move to 1.7.
  - The Select check and the Tree toggle grow from 14 to 16px.
  - A Badge's status icon takes the badge's text size, 12px instead of 13px.
  - The Avatar fallback glyph is half the avatar's size: 18px at the default size, as before, and larger or smaller with the avatar.
  - Chevrons that point along the reading direction mirror themselves in right-to-left text, so components no longer turn them one by one.
  - The checkbox tick, the menu radio dot, the spinner and chart legend swatches stay their own marks.
- `check:package` fails when a public module has no entry point or an entry point has no catalog page, and when a component renders a class without the `pui-` prefix or draws a glyph outside Icon.

### Removed

- Unprefixed classes that components rendered beside their `pui-` classes, and that no stylesheet selected: `control-shell`, `select-control`, `form-control`, `select-chevron`, `control-icon` and `scroll-area`. An app's own `.form-control` or `.scroll-area` rules no longer reach Surflane parts.

## 0.4.0

### Added

- `@surflane/ui/all.css` imports every Surflane stylesheet in the recommended order: `tokens.css`, `controls.css`, `foundations.css`, `typography.css` and `styles.css`. One line replaces the five imports; with Tailwind CSS v4, import it with `layer(components)`.
- An [install guide](https://surflane.page/install) builds the commands and files for Next.js, Vite, React Router or Astro, with or without Tailwind CSS, brand fonts, a remembered theme and the optional components: it adds their libraries to the install command, shows their imports and wraps the app in `SyntaxHighlighting` when code highlighting is on. `npm run check:install-guide` builds what it shows into each framework's app and checks the result in Chromium.

### Changed

- Chart, DatePicker, Markdown, Tree and syntax highlighting moved to their own entry points, and their libraries became optional peer dependencies. Install a library only when you use its component. A fresh install of both packages drops from 186 packages and 164 MB to 14 packages and 32 MB, React included.
  - `Chart` imports from `@surflane/ui/chart` (needs `recharts`); `DatePicker`, `DateRangePicker`, `TimeField` and `DateLocaleProvider` from `@surflane/ui/date-picker` (`react-aria-components`); `Markdown` from `@surflane/ui/markdown` (`react-markdown`, `remark-gfm`); `Tree` from `@surflane/ui/tree` (`@headless-tree/core`, `@headless-tree/react`, `@tanstack/react-virtual`).
  - `CodeBlock` and `SyntaxHighlighter` stay in the root entry and render plain text by default. `SyntaxHighlighting` from `@surflane/ui/syntax-highlighting` turns highlighting on for everything inside it; it needs `shiki`.
  - `check:package` fails if the root entry reaches an optional peer, including through a dynamic import.
- Every stylesheet in both packages puts its rules in cascade layers, lowest first: `surflane.tokens`, `surflane.themes`, `surflane.base` and `surflane.components`. Each file starts with the same `@layer` order statement, so the order holds whichever file loads first. See [Cascade layers](https://github.com/Ashon/surflane/blob/main/docs/frameworks.md#cascade-layers).
  - Unlayered application CSS now overrides Surflane whatever its specificity. Before, a Surflane selector with higher specificity won.
  - Theme presets and `themeCss` output sit in `surflane.themes`, so they override the tokens in any import order.
  - Component styles override document typography (`.pui-typography`) and composition classes in any import order.
  - Surflane's few `!important` declarations, for motion during a theme switch and under reduced motion and for the native scrollbar that `ScrollArea` replaces, now hold against unlayered `!important` ones.
- `themeCss` output starts with the layer order statement and wraps its rules in `@layer surflane.themes`. `layerOrder` exports the statement.
- With Tailwind CSS v4, the docs import every Surflane stylesheet, including theme presets and `shadcn.css`, with `layer(components)`: above Preflight, below utilities. The `layer(theme)` imports from 0.3.0 keep working.
- Bundles carry only the components an app uses. Tabs, Accordion with Collapsible, and Avatar have their own modules, and component factories are marked pure, so a bundler drops what an app never renders. Importing Breadcrumbs alone bundles 1.4 KB instead of 54 KB. Exports and names are unchanged.
- Components write the full size name to `data-size`: `size="sm"` renders `data-size="small"`, and `md` and `lg` likewise.
- Toast `Close` and `Action` are small buttons, 32px, and 44px on touch screens. The close button was 36px, and the action stayed 32px on phones.

### Fixed

- Checkboxes, radios and switches in table cells center on the row. They rested on the text baseline, 2 to 3px above the middle, in every table and data table.
- The size aliases `sm`, `md` and `lg` render exactly like `small`, `default` and `large`. A `size="sm"` Button stayed 32px on touch screens instead of growing to the 44px target, and a `sm` Spinner was 16px against 14px for `small`. `pui-avatar` also accepts `data-size="small"` and `"large"` without React.
- Accordion and Collapsible triggers follow `SizeProvider`. Their size rules named classes the components do not render.
- Inside a `SizeProvider`, Sheet and Drawer headers keep the title clear of the close button, as they do outside one.
- Dialog, AlertDialog, Popover, Sheet and Drawer keep a function `className` on their content, close button, title and description. They dropped it.
- The CodeBlock copy button keeps its resting width when web fonts finish loading after a copy.

### Migration

- Import Chart, DatePicker, Markdown and Tree from their entry points, and install the libraries they need. Wrap the app in `<SyntaxHighlighting>` to keep highlighted code.
- Element rules in your global CSS, such as `button`, `a` or `body` rules from a starter template or a reset, now override Surflane components. Remove them, or move them into a layer declared before Surflane's: `@layer reset, surflane;` at the top of the stylesheet, then `@layer reset { … }`.
- CSS that selects `[data-size='sm']` or `[data-size='lg']` on a Surflane component now selects `[data-size='small']` or `[data-size='large']`.

## 0.3.0

0.2.1 was prepared but never published; its fix ships here.

### Added

- Themes. A theme changes three inputs: the neutral tint, the accent and the radius scale. Lightness never changes, so text keeps the contrast the default palette was measured for. Build one in the [theme builder](https://surflane.page/foundations/themes).
  - `@surflane/design-tokens/themes/*.css`: presets to load after `tokens.css`. Neutral, accent and radius files combine freely.
    - Neutral: `slate.css` (default), `neutral.css`, `zinc.css`, `stone.css`.
    - Accent: `accent-cyan.css` (default), `accent-blue.css`, `accent-violet.css`, `accent-green.css`, `accent-amber.css`, `accent-rose.css`.
    - Radius: `radius-none.css`, `radius-small.css`, `radius-default.css`, `radius-large.css`.
  - `@surflane/design-tokens/theme-builder`: `createTheme({ neutral, accent, radius })` and `themeCss(theme)` generate the same CSS for your own inputs. Accent chroma is clamped to the sRGB gamut. `contrastRatio` and `maxChroma` measure any color.
  - Theme files mirror the contexts in `tokens.css`, so `data-theme` and scoped theme regions keep working.
- `@surflane/design-tokens/shadcn.css` maps the shadcn/ui variables, such as `--background`, `--primary`, `--border` and `--radius`, plus the chart and sidebar variables, to Surflane tokens. shadcn components then follow Surflane themes. See [shadcn/ui](https://github.com/Ashon/surflane/blob/main/docs/frameworks.md#shadcnui).
- `--success`, the base for the success status colors. It equals the default accent, and accent themes leave it unchanged. Tailwind maps it to `success` utilities.
- Table parts for data-heavy screens. They are opt-in; existing tables render as before.
  - `Table.Root`: `density="compact"` sets 4px cell padding and 2px between rows. `stickyHeader` keeps the header in view inside a `Table.Container` with a bounded height and `orientation="both"`; `--table-surface` sets the header background.
  - `numeric` on `Table.HeaderCell` and `Table.Cell` aligns to the end with tabular figures.
  - `Table.SortHeader`: a column header with a sort button. Every sortable column shows its icon, and only the sorted column carries `aria-sort`. End-aligned columns put the icon before the label.
  - `Table.Truncate` keeps one line with an ellipsis; string content becomes the title. `Table.Message` is a full-width body row for loading, empty, error and permission messages, without hover.
  - `useTableSelection` keeps selection by row ID across pages, sorting and filters. It returns the page checkbox props (selectable rows on the current page only), each row's checkbox props and `hiddenCount` for selections on other pages.
  - Flat exports: `TableSortHeader`, `TableTruncate`, `TableMessage`.
  - `presentation.css` styles these through data attributes, so plain HTML tables can use them too.
- `Icon` name `more`, for row action menus.
- `AppShell.Page` (`AppShellPage`): the page surface inside a workspace `AppShell.Content`. It insets from the shell on every side but the sidebar's, with a radius concentric with the shell. Up to 760px, without the sidebar, it insets evenly and starts flush below a mobile `Header`. Before, callers wrote this surface themselves.

### Changed

- The success status colors (`--status-success-*`) derive from `--success` instead of `--brand`. Their default values are unchanged.
- `align` on `Table.HeaderCell` and `Table.Cell` takes `start`, `center` or `end`. It no longer passes through the obsolete HTML `align` attribute.

### Fixed

- `ScrollArea` scrollbars no longer take taps on touch-only screens (`(hover: none) and (pointer: coarse)`).
  - The 10px bar overlays the edge of its content and caught pointer events even while hidden. A tap on a link or control under it hit the bar instead.
  - The bar still shows while content scrolls, as native mobile scrollbars do. Content scrolls by swiping.
  - With a mouse or trackpad, the bar can still be dragged.

## 0.2.0

### Added

- `@surflane/design-tokens/tailwind.css`: a Tailwind CSS v4 theme that maps color roles, spacing, layout widths, radii, shadows, fonts, type steps, tracking and easing to utilities such as `bg-canvas`, `p-page` and `rounded-sheet`.
  - Utilities read the tokens through `var()`, so they follow `data-theme`, including scoped themes.
  - `dark:` follows the nearest `data-theme`, not the operating system.
  - The bridge never redefines a Surflane token.
  - See [Tailwind CSS v4](https://github.com/Ashon/surflane/blob/main/docs/frameworks.md#tailwind-css-v4) for the import order. Import Surflane styles into `layer(components)` so utilities can override them.
- Every theme block sets `color-scheme`, so native scrollbars, selects and date inputs render in the theme. Scoped `data-theme` regions get the same.

### Changed

- Hover is a state layer.
  - `--interaction-hover-bg` is now `--ink` at 8% alpha over whatever the item rests on, instead of `--surface`. Primary buttons use `--on-brand` at 8%.
  - Buttons add the layer over their own fill instead of a 3% brightness filter. This applies to every variant, toolbar buttons and menubar triggers. Link buttons thicken their underline.
  - Toolbar, menubar and app shell items now show hover on their own backgrounds. Before, the hover color matched those backgrounds.
- Pressed is the same layer, stronger. `--interaction-active-bg` is now `--ink` at 14% (`--on-brand` on primary buttons) instead of `--selected`.
  - Buttons, tabs, disclosure triggers, app shell links, tree toggles, chart legend buttons, segments, icon buttons, theme actions and pagination controls use it on `:active`. Buttons no longer use a brightness filter.
  - These controls set `-webkit-tap-highlight-color: transparent`. A tap shows their own layer in their own shape instead of the browser's rectangular highlight.
- `CodeBlock` shows the copy result inside its button and fades between labels. The status line below the block (`.pui-code-result`) is removed, so nothing below the block moves.
  - The default `copiedLabel` is now "Copied" and the default `copyErrorLabel` is now "Copy unavailable".
  - When copying fails, the source is selected.
- Dark theme contrast:
  - `--code-bg` steps below the chrome (Gray 95).
  - `--hover` rises to Gray 75.
  - `--status-danger-fg` keeps error text at 4.5:1 on `--selected`.
- Table cells use `overflow-wrap: break-word`, so columns size to whole words.
- Code text, including highlighted code, renders without ligatures.

### Fixed

- Horizontal scroll areas fade the edge that hides more content, so cut-off tables and code read as scrollable.
- Highlighted code keeps its background and corners while long lines scroll.
- Korean text (`lang="ko"`) in headings, text and prose wraps between words.
- The pagination summary stays on one line on narrow screens.
- Chart axis labels are cut at 24 characters instead of 14.
- In `catalog.json` and `theme.json`, token values no longer contain line breaks from source formatting.

## 0.1.0

First npm release.

- `@surflane/design-tokens`: OKLCH color roles, spacing, typography, sizing and motion tokens as CSS custom properties, the token catalog and `transitionTheme`.
- `@surflane/ui`: React 19 components built on Base UI, plus chart, date, tree, code highlighting and Markdown components. Root and subpath entry points are ESM with type declarations.
- React Server Components: every namespace part also has a flat export (`DialogRoot`, `DialogTrigger`, `TabsList`, ...), so Server Components can render compound components without dotting into a client module.
- Scoped themes: `data-theme` on any element re-themes its subtree, including alias tokens.
- Dual licensed under MIT or Apache-2.0.
