import { richContentDocs } from './richContentDocs'
import { chartDocs } from './chartDocs'
import { datePickerDocs } from './datePickerDocs'
import { treeDocs } from './treeDocs'
import { commandSearchDocs } from './commandSearchDocs'
import { asyncJobDocs } from './asyncJobDocs'
import { errorRecoveryDocs } from './errorRecoveryDocs'
import { documentationDocs } from './documentationDocs'
import { responsiveNavigationDocs } from './responsiveNavigationDocs'
import { dataTableDocs } from './dataTableDocs'
import { appShellDocs } from './appShellDocs'
import { formWorkflowDocs } from './formWorkflowDocs'
import { resourceListDocs } from './resourceListDocs'
import { filterBarDocs } from './filterBarDocs'
import { pageHeaderDocs } from './pageHeaderDocs'
import { fileUploadDocs } from './fileUploadDocs'
import { toastDocs } from './toastDocs'
import { otpFieldDocs } from './otpFieldDocs'
import { navigationMenuDocs } from './navigationMenuDocs'
import { contextOverlayDocs } from './contextOverlayDocs'
import { commandDocs } from './commandDocs'
import { inputExtensionDocs } from './inputExtensionDocs'
import { advancedFormDocs } from './advancedFormDocs'
import { contentDocs } from './contentDocs'
import { dataDocs } from './dataDocs'
import { feedbackDocs } from './feedbackDocs'
import { navigationDocs } from './navigationDocs'
import { formDocs } from './formDocs'
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
const controls = [
  '--control-height',
  '--control-radius',
  '--interaction-focus',
  '--control-background',
]
const overlays = [
  '--radius-sheet',
  '--shadow-float',
  '--chrome',
  '--dialog-enter-duration',
]
export const componentDocs: Record<string, ComponentDoc> = {
  ...richContentDocs,
  ...chartDocs,
  ...datePickerDocs,
  ...treeDocs,
  ...commandSearchDocs,
  ...asyncJobDocs,
  ...errorRecoveryDocs,
  ...documentationDocs,
  ...responsiveNavigationDocs,
  ...dataTableDocs,
  ...appShellDocs,
  ...formWorkflowDocs,
  ...resourceListDocs,
  ...filterBarDocs,
  ...pageHeaderDocs,
  ...fileUploadDocs,
  ...toastDocs,
  ...otpFieldDocs,
  ...navigationMenuDocs,
  ...contextOverlayDocs,
  ...commandDocs,
  ...inputExtensionDocs,
  ...advancedFormDocs,
  ...contentDocs,
  ...dataDocs,
  ...feedbackDocs,
  ...formDocs,
  ...navigationDocs,
  button: {
    usage:
      "Set a button's emphasis apart from its meaning. primary marks the one key action per area, on the brand surface. secondary (a borderless neutral surface) and outline (the only bordered variant) mark supporting actions, and ghost marks low emphasis. destructive signals danger at any priority. default is a backward-compatible alias styled like primary.",
    avoid:
      "Don't use Button for page navigation. Use LinkButton, which looks like a button and stays a link. Don't mark destructive actions with color alone. Say what the action does in the label text.",
    keyboard:
      'Tab moves focus. Enter or Space activates the button. While an action is in progress, the button blocks duplicate runs and announces the result.',
    anatomy: 'Button → optional SVG icon + text that describes the action',
    tokens: ['--brand', '--danger', ...controls],
    code: `import { Button, LinkButton } from '@surflane/ui'
import NextLink from 'next/link'

<Button onClick={runPreview}>Run preview</Button>
<Button variant='outline'>Inspect details</Button>
<Button disabled>Unavailable</Button>

// Navigation that looks like a button stays a link.
<LinkButton variant='outline' render={<NextLink href='/runs' />}>
  View runs
</LinkButton>`,
    props: [
      [
        'variant',
        'primary | default (primary alias) | secondary | outline | ghost | destructive | link',
        'default',
      ],
      [
        'size',
        'small | default | large | icon; legacy xs / sm / md / lg / icon-sm / icon-lg',
        'default',
      ],
      ['disabled', 'boolean', 'false'],
      [
        'LinkButton',
        "Button's variant and size on a link; render takes a router link",
        '—',
      ],
    ],
  },
  input: {
    usage:
      'Enter short, single-line text. Keep the label visible after the user types.',
    avoid:
      "Don't use the placeholder as the only label. Add a visible label instead. Describe errors in text associated with the input.",
    keyboard:
      'Tab moves focus. Native text editing and Korean IME input keep working.',
    anatomy:
      'label → Input wrapper → leadingIcon(optional) + input, help text / error',
    tokens: controls,
    code: `import { Input } from '@surflane/ui'

<label>
  Project name
  <Input name='project' placeholder='Enter a name' />
</label>
<Input
  aria-label='Project ID'
  aria-invalid='true'
  aria-describedby='project-error'
/>`,
    props: [
      ['leadingIcon', 'ReactNode', '—'],
      ['wrapperClassName', 'string', '—'],
      ['name / required / readOnly / disabled', 'native input props', '—'],
    ],
  },
  select: {
    usage:
      'Pick one option from a fixed list. If the list is long enough to need search, use Combobox.',
    avoid:
      "Don't use Select to run actions. Use Menu instead. Check the selected result and the submitted value together.",
    keyboard:
      'Enter, Space, or an arrow key opens the listbox. Arrow keys and typing move between items. Escape closes only the listbox and returns focus.',
    anatomy:
      'Select → Trigger / Value / SVG chevron → Portal / Positioner / List / Item / Indicator',
    tokens: [...controls, '--menu-border', '--shadow-float'],
    code: `import { Select } from '@surflane/ui'

<Select
  name='environment'
  aria-label='Environment'
  defaultValue='staging'
  options={[
    { value: 'staging', label: 'Staging' },
    { value: 'production', label: 'Production' },
  ]}
/>`,
    props: [
      [
        'options',
        '{ value, label, disabled? }[], or groups { label, options }',
        'required',
      ],
      ['value / onValueChange', 'controlled value + callback', '—'],
      [
        'defaultValue / name / required / disabled',
        'selection and form props',
        '—',
      ],
      ['ref', 'the trigger button, as triggerRef', '—'],
    ],
  },
  'native-select': {
    usage:
      'Migrate existing option and optgroup markup incrementally with this compatibility adapter. Use Select for new screens.',
    avoid:
      "Don't assume the DOM API of the browser's native select popup. Use the value and onChange adapter instead.",
    keyboard:
      'Keys work as in the shared Select. A hidden input submits the value with the form.',
    anatomy: 'HTML option children → adapter → shared Select',
    tokens: controls,
    code: `import { NativeSelect } from '@surflane/ui'

<NativeSelect aria-label='Environment' name='environment'>
  <option value='staging'>Staging</option>
  <option value='production'>Production</option>
</NativeSelect>`,
    props: [
      ['children', 'option / optgroup elements', '—'],
      ['value / onChange', 'native-style change adapter', '—'],
    ],
  },
  popover: {
    usage:
      'Show brief details or a secondary task next to a button. Group Title and Description with Stack gap={1}. Group inputs and action buttons with Stack gap={4}. Lay out the button row with Inline gap={2}. Remove default child margins so the parent gap owns the spacing.',
    avoid:
      "Don't use Popover for required responses or data-loss confirmation. Use AlertDialog instead. Don't put inputs in a Tooltip. Use a Popover instead.",
    keyboard:
      'The Trigger opens the popover and moves focus inside. Escape or an outside click closes it and returns focus to the Trigger.',
    anatomy:
      'Root → Trigger + Portal → Content(Positioner + Popup) → Title / Description / Close',
    tokens: [
      '--menu-border',
      '--shadow-float',
      '--control-radius',
      '--space-1',
      '--space-2',
      '--space-4',
    ],
    code: `import { Popover, Button } from '@surflane/ui'

<Popover.Root>
  <Popover.Trigger render={<Button />}>Inspect</Popover.Trigger>
  <Popover.Portal>
    <Popover.Content>
      <Popover.Title>Account</Popover.Title>
      <Popover.Description>Preview details.</Popover.Description>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>`,
    props: [
      [
        'Content.side / align / sideOffset',
        'Base UI positioner props',
        'bottom / start / 8',
      ],
      [
        'Content.size',
        'small | default | large: width up to 240 / 320 / 480px, and density',
        'default width, surrounding density',
      ],
      [
        '--popover-width',
        'custom property: a width that keeps the surrounding density',
        'the size width',
      ],
      ['Title / Description', 'styled heading and description', '—'],
      ['Root.open / onOpenChange', 'controlled popup state', '—'],
    ],
  },
  menu: {
    usage:
      'List the actions available from the current location. Selecting an item runs its action.',
    avoid: "Don't use Menu to choose a form value. Use Select instead.",
    keyboard:
      'Arrow keys, Home, End, and typing move between items. Enter or Space activates an item. Escape closes the menu.',
    anatomy: 'Root → Trigger + Portal → Content → Item / Group / Separator',
    tokens: ['--menu-border', '--shadow-float', '--selected'],
    code: `import { Menu, Button } from '@surflane/ui'

<Menu.Root>
  <Menu.Trigger render={<Button />}>Actions</Menu.Trigger>
  <Menu.Portal>
    <Menu.Content>
      <Menu.Item className='pui-select-item' onClick={inspect}>
        Inspect
      </Menu.Item>
    </Menu.Content>
  </Menu.Portal>
</Menu.Root>`,
    props: [
      ['Content.align / sideOffset', 'Base UI positioner props', 'end / 6'],
      ['Item.disabled / onClick', 'availability and action', '—'],
    ],
  },
  tooltip: {
    usage:
      'Show a short supplementary description on hover and keyboard focus. Wrap a single focusable trigger.',
    avoid:
      "In Base UI 1.9, a tooltip is a visual, supplementary label. Don't rely on it for the accessible name. Name the trigger itself. Don't put essential descriptions or interactive elements in it. Use the page content or a Popover instead.",
    keyboard:
      'Focusing the trigger shows the tooltip. Escape closes it. The tooltip never receives focus.',
    anatomy: 'TooltipProvider → Tooltip(label) → single focusable trigger',
    tokens: [
      '--tooltip-background',
      '--tooltip-foreground',
      '--control-radius',
    ],
    code: `import { TooltipProvider, Tooltip, Button } from '@surflane/ui'

<TooltipProvider>
  <Tooltip label='Inspect the build logs'>
    <Button variant='outline'>Logs</Button>
  </Tooltip>
</TooltipProvider>`,
    props: [
      ['label', 'string', 'required'],
      ['enabled', 'boolean', 'true'],
      ['children', 'single ReactElement', 'required'],
    ],
  },
  dialog: {
    usage:
      "Run a task that needs the user's full attention. Include a Title, a Description, and an explicit way to close.",
    avoid:
      "Don't repeatedly block the flow for simple notices. Use a Toast instead. Don't confirm data loss in a Dialog. Use a separate AlertDialog.",
    keyboard:
      'Tab keeps focus inside the dialog. Escape or the close button closes it. A nested Select closes first, then the parent Dialog.',
    anatomy:
      'Root → Trigger → Content → Header(Title / Description / X) + Body + Footer',
    tokens: overlays,
    code: `import { Dialog, Button } from '@surflane/ui'

<Dialog.Root>
  <Dialog.Trigger render={<Button />}>Open plan</Dialog.Trigger>
  <Dialog.Content closeLabel='Close plan'>
    <Dialog.Header>
      <Dialog.Title>Deployment plan</Dialog.Title>
      <Dialog.Description>Preview only.</Dialog.Description>
    </Dialog.Header>
    <Dialog.Body>Plan details</Dialog.Body>
    <Dialog.Footer>
      <Dialog.Close render={<Button />}>Done</Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>`,
    props: [
      [
        'Content.closeLabel',
        'accessible X label; false hides X',
        'Close dialog',
      ],
      [
        'Content.initialFocus',
        'ref / focus callback (Base UI)',
        'Base UI default',
      ],
      [
        'Content.size',
        'small | default | large: 420 / 640 / 840px wide, and density',
        'default width, surrounding density',
      ],
      [
        '--dialog-width',
        'custom property: a width that keeps the surrounding density',
        'the size width',
      ],
      ['Root.open / onOpenChange', 'controlled dialog state', '—'],
    ],
  },
  'alert-dialog': {
    usage:
      "Confirm an action that's hard to undo, such as deleting or discarding. Point Content.initialFocus at the safe cancel button.",
    avoid:
      "Don't label the action with a neutral OK or Yes. Name the specific action instead. Don't treat an outside click as a response. Wait for an explicit choice.",
    keyboard:
      'Focus starts on the safe cancel action and stays inside the dialog. Escape acts as cancel.',
    anatomy:
      'Root → Trigger → Content → Header(Title / Description) + Footer(Cancel / Action)',
    tokens: overlays,
    code: `import { AlertDialog, Button } from '@surflane/ui'

<AlertDialog.Root open={open} onOpenChange={setOpen}>
  <AlertDialog.Trigger render={<Button />}>Discard</AlertDialog.Trigger>
  <AlertDialog.Content initialFocus={cancelRef}>
    <AlertDialog.Header>
      <AlertDialog.Title>Discard draft?</AlertDialog.Title>
      <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Close ref={cancelRef} render={<Button />}>
        Keep draft
      </AlertDialog.Close>
      <Button variant='destructive' onClick={discard}>
        Discard draft
      </Button>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>`,
    props: [
      ['Root.open / onOpenChange', 'controlled state', '—'],
      ['Content.initialFocus', 'safe cancel button ref', '—'],
      ['Content.size', "Dialog's scale", 'small'],
    ],
  },
  sheet: {
    usage:
      'Inspect resource details or settings without leaving the current list. Put long content in Body, which scrolls independently.',
    avoid:
      "Don't repeat the same content across stacked panels. Keep each detail in one panel.",
    keyboard:
      'Focus trapping, Escape, and focus restoration work as in Dialog. A Select inside the panel closes first.',
    anatomy: 'Root(side) → Trigger → Content → Header / Body / Footer',
    tokens: overlays,
    code: `import { Sheet, Button } from '@surflane/ui'

<Sheet.Root side='right'>
  <Sheet.Trigger render={<Button />}>Details</Sheet.Trigger>
  <Sheet.Content closeLabel='Close details'>
    <Sheet.Header>
      <Sheet.Title>Environment</Sheet.Title>
      <Sheet.Description>Preview details.</Sheet.Description>
    </Sheet.Header>
    <Sheet.Body>Resource details</Sheet.Body>
    <Sheet.Footer>
      <Sheet.Close render={<Button />}>Done</Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>`,
    props: [
      ['Root.side', 'left | right | top | bottom', 'right'],
      [
        'Content.size',
        'small | default | large: 320 / 440 / 640px, and density',
        'default',
      ],
      [
        'Content.flush',
        'attaches the panel to its edge, square corners there',
        'false',
      ],
      [
        '--panel-width',
        'custom property: a width that keeps the surrounding density',
        'the size width',
      ],
      ['Content.closeLabel', 'accessible X label', 'Close panel'],
    ],
  },
  drawer: {
    usage:
      'Show a task panel that closes with a swipe on mobile. Also provide keyboard support and a close button.',
    avoid:
      "Don't treat the close gesture as done or save. Put those on an explicit button in the Footer. Don't build UI that works only by dragging. Offer a keyboard and button path too.",
    keyboard:
      'Focus stays inside the panel. Escape or the close button closes it. After a swipe dismisses it, focus returns to the Trigger.',
    anatomy:
      'Root → Trigger → Content(handle / popup) → Header / Body / Footer',
    tokens: overlays,
    code: `import { Drawer, Button } from '@surflane/ui'

<Drawer.Root>
  <Drawer.Trigger render={<Button />}>Prepare run</Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Prepare deployment</Drawer.Title>
      <Drawer.Description>Preview only.</Drawer.Description>
    </Drawer.Header>
    <Drawer.Body>Run settings</Drawer.Body>
    <Drawer.Footer>
      <Drawer.Close render={<Button />}>Cancel</Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>`,
    props: [
      [
        'Root.side',
        'left | right | top | bottom; derives swipe direction',
        'bottom',
      ],
      [
        'Content.flush',
        'attaches the panel to its edge, square corners there',
        'false',
      ],
      [
        '--panel-width',
        'custom property: a width that keeps the surrounding density',
        'the size width',
      ],
      ['Content.closeLabel', 'accessible X label', 'Close panel'],
    ],
  },
  'scroll-area': {
    usage:
      'Fit long content, such as tables, diffs, or logs, into limited space. Scrollbars appear while scrolling or when the pointer comes within 24px of their edge. They stay operable during drag and keyboard scrolling.',
    avoid:
      "Don't split the page into needless nested scroll regions. Use a single scroll region instead. Give a label to any region whose content scrolls out of view.",
    keyboard:
      'Tab focuses the region. Arrow keys and Page Up or Page Down scroll it. Wheel and touch scrolling keep working. label gives the region its accessible name.',
    anatomy: 'ScrollArea(label) → Root / Viewport + Scrollbar / Thumb / Corner',
    tokens: ['--scrollbar-size', '--scrollbar-thumb', '--scrollbar-track'],
    code: `import { ScrollArea } from '@surflane/ui'

<ScrollArea label='Build logs' orientation='both' style={{ maxHeight: 240 }}>
  <table>...</table>
</ScrollArea>`,
    props: [
      ['label', 'accessible region name', '—'],
      [
        'orientation',
        'vertical | horizontal | both; limits native scrolling and visible bars to those axes',
        'horizontal',
      ],
      [
        'scrollChain',
        'auto passes wheel/touch to parent at an edge; contain isolates the enabled axes',
        'auto',
      ],
      ['style / className', 'viewport attributes', '—'],
      [
        'rootStyle / rootClassName',
        'outer sizing and flex/grid placement',
        '—',
      ],
      [
        'tabIndex',
        'override the named viewport default when required',
        '0 for named regions',
      ],
    ],
  },
  'inline-confirmation': {
    usage:
      "Confirm a lightweight action, such as resetting filters, before it runs. Compose it from Popover and Button. There's no standalone export.",
    avoid:
      "Don't use it for high-risk actions, such as deleting or changing permissions. Use AlertDialog instead.",
    keyboard: 'Focus, Escape, and focus restoration work as in Popover.',
    anatomy: 'Popover + description + cancel / confirm Button',
    tokens: ['--menu-border', '--shadow-float'],
    code: `import { Popover, Button } from '@surflane/ui'

// Compose Popover + Button; no standalone Confirm export.
<Popover.Root open={open} onOpenChange={setOpen}>
  <Popover.Trigger render={<Button />}>Reset filters</Popover.Trigger>
  <Popover.Portal>
    <Popover.Content>
      <Popover.Title>Reset filters?</Popover.Title>
      <Popover.Description>Restore default filters.</Popover.Description>
      <Popover.Close render={<Button />}>Keep filters</Popover.Close>
      <Button onClick={reset}>Reset filters</Button>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>`,
    props: [['Composition', 'Popover + Button', 'no standalone export']],
  },
}
