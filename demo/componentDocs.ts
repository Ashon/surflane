import { richContentDocs } from "./richContentDocs";
import { chartDocs } from "./chartDocs";
import { datePickerDocs } from "./datePickerDocs";
import { treeDocs } from "./treeDocs";
import { commandSearchDocs } from "./commandSearchDocs";
import { asyncJobDocs } from "./asyncJobDocs";
import { errorRecoveryDocs } from "./errorRecoveryDocs";
import { documentationDocs } from "./documentationDocs";
import { responsiveNavigationDocs } from "./responsiveNavigationDocs";
import { dataTableDocs } from "./dataTableDocs";
import { appShellDocs } from "./appShellDocs";
import { formWorkflowDocs } from "./formWorkflowDocs";
import { resourceListDocs } from "./resourceListDocs";
import { filterBarDocs } from "./filterBarDocs";
import { pageHeaderDocs } from "./pageHeaderDocs";
import { fileUploadDocs } from "./fileUploadDocs";
import { toastDocs } from "./toastDocs";
import { otpFieldDocs } from "./otpFieldDocs";
import { navigationMenuDocs } from "./navigationMenuDocs";
import { contextOverlayDocs } from "./contextOverlayDocs";
import { commandDocs } from "./commandDocs";
import { inputExtensionDocs } from "./inputExtensionDocs";
import { advancedFormDocs } from "./advancedFormDocs";
import { contentDocs } from "./contentDocs";
import { dataDocs } from "./dataDocs";
import { feedbackDocs } from "./feedbackDocs";
import { navigationDocs } from "./navigationDocs";
import { formDocs } from "./formDocs";
export type ComponentDoc = {
  usage: string;
  avoid: string;
  keyboard: string;
  anatomy: string;
  tokens: string[];
  code: string;
  props: [string, string, string][];
};
const controls = [
  "--control-height",
  "--control-radius",
  "--interaction-focus",
  "--control-background",
];
const overlays = [
  "--radius-sheet",
  "--shadow-float",
  "--chrome",
  "--dialog-enter-duration",
];
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
      "Keep an action's emphasis separate from its meaning. primary uses the brand surface for the key action, secondary uses a borderless neutral surface for supporting actions, outline is the only bordered variant for supporting actions, and ghost expresses low emphasis. destructive signals danger and is independent of priority. default is styled the same as primary for backward compatibility. Emphasize only one primary action per area.",
    avoid:
      "Use a link for page navigation, and don't rely on color alone to mark destructive actions.",
    keyboard:
      "Tab moves focus and Enter / Space activates. While in progress, it prevents duplicate runs and announces the result.",
    anatomy: "Button → optional SVG icon + text that describes the action",
    tokens: ["--brand", "--danger", ...controls],
    code: 'import { Button } from "@surflane/ui";\n\n<Button onClick={runPreview}>Run preview</Button>\n<Button variant="outline">Inspect details</Button>\n<Button disabled>Unavailable</Button>',
    props: [
      [
        "variant",
        "primary | default (primary alias) | secondary | outline | ghost | destructive | link",
        "default",
      ],
      [
        "size",
        "small | default | large | icon; legacy xs / sm / md / lg / icon-sm / icon-lg",
        "default",
      ],
      ["disabled", "boolean", "false"],
    ],
  },
  input: {
    usage:
      "Use for short, single-line input. Keep the label visible after the user types.",
    avoid:
      "Don't use the placeholder as the only label. Describe errors in text associated with the input.",
    keyboard:
      "Tab moves focus. Standard text editing and Hangul IME input keep working.",
    anatomy:
      "label → Input wrapper → leadingIcon(optional) + input, help text / error",
    tokens: controls,
    code: 'import { Input } from "@surflane/ui";\n\n<label>Project name\n  <Input name="project" placeholder="Enter a name" />\n</label>\n<Input aria-label="Project ID" aria-invalid="true"\n  aria-describedby="project-error" />',
    props: [
      ["leadingIcon", "ReactNode", "—"],
      ["wrapperClassName", "string", "—"],
      ["name / required / readOnly / disabled", "native input props", "—"],
    ],
  },
  select: {
    usage:
      "Use to pick one option from a fixed list. If the list is long enough to need search, consider Combobox.",
    avoid:
      "Don't use it as a widget for running menu actions. Check the selected result and the submitted value together.",
    keyboard:
      "Open with Enter / Space or the arrow keys, then navigate with the arrow keys or by typing. Escape closes only the listbox and returns focus.",
    anatomy:
      "Select → Trigger / Value / SVG chevron → Portal / Positioner / List / Item / Indicator",
    tokens: [...controls, "--menu-border", "--shadow-float"],
    code: 'import { Select } from "@surflane/ui";\n\n<Select name="environment" aria-label="Environment" defaultValue="staging"\n  options={[{ value: "staging", label: "Staging" },\n            { value: "production", label: "Production" }]} />',
    props: [
      ["options", "{ value, label, disabled? }[]", "required"],
      ["value / onValueChange", "controlled value + callback", "—"],
      [
        "defaultValue / name / required / disabled",
        "selection and form props",
        "—",
      ],
    ],
  },
  "native-select": {
    usage:
      "A compatibility adapter for incrementally migrating existing option / optgroup markup. Prefer Select for new screens.",
    avoid:
      "Don't assume the same DOM API as the browser's native select popup.",
    keyboard:
      "Uses the same keyboard flow as the shared Select and submits the value to forms through a hidden input.",
    anatomy: "HTML option children → adapter → shared Select",
    tokens: controls,
    code: 'import { NativeSelect } from "@surflane/ui";\n\n<NativeSelect aria-label="Environment" name="environment">\n  <option value="staging">Staging</option>\n  <option value="production">Production</option>\n</NativeSelect>',
    props: [
      ["children", "option / optgroup elements", "—"],
      ["value / onChange", "native-style change adapter", "—"],
    ],
  },
  popover: {
    usage:
      "Provides brief details or secondary tasks next to a button. Group the title and description with Stack gap={1} and inputs and action buttons with Stack gap={4}, and lay out the button row with Inline gap={2}. Remove default child margins so the parent gap owns the spacing.",
    avoid:
      "Use AlertDialog for required responses or confirming data loss. Don't put inputs in a Tooltip.",
    keyboard:
      "Opens from the trigger and moves to the tasks inside. Closing with Escape / an outside click returns focus to the trigger.",
    anatomy:
      "Root → Trigger + Portal → Content(Positioner + Popup) → Title / Description / Close",
    tokens: [
      "--menu-border",
      "--shadow-float",
      "--control-radius",
      "--space-1",
      "--space-2",
      "--space-4",
    ],
    code: 'import { Popover, Button } from "@surflane/ui";\n\n<Popover.Root>\n  <Popover.Trigger render={<Button />}>Inspect</Popover.Trigger>\n  <Popover.Portal><Popover.Content>\n    <Popover.Title>Account</Popover.Title>\n    <Popover.Description>Preview details.</Popover.Description>\n  </Popover.Content></Popover.Portal>\n</Popover.Root>',
    props: [
      [
        "Content.side / align / sideOffset",
        "Base UI positioner props",
        "bottom / start / 8",
      ],
      ["Root.open / onOpenChange", "controlled popup state", "—"],
    ],
  },
  menu: {
    usage:
      "Lists the actions available from the current location. Selecting an item runs an action.",
    avoid: "Use Select for form inputs that choose a current value.",
    keyboard:
      "Navigate with the arrow keys, Home / End or by typing, and activate with Enter / Space. Escape closes the menu.",
    anatomy: "Root → Trigger + Portal → Content → Item / Group / Separator",
    tokens: ["--menu-border", "--shadow-float", "--selected"],
    code: 'import { Menu, Button } from "@surflane/ui";\n\n<Menu.Root>\n  <Menu.Trigger render={<Button />}>Actions</Menu.Trigger>\n  <Menu.Portal><Menu.Content>\n    <Menu.Item className="pui-select-item" onClick={inspect}>\n      Inspect\n    </Menu.Item>\n  </Menu.Content></Menu.Portal>\n</Menu.Root>',
    props: [
      ["Content.align / sideOffset", "Base UI positioner props", "end / 6"],
      ["Item.disabled / onClick", "availability and action", "—"],
    ],
  },
  tooltip: {
    usage:
      "Provides a short supplementary description on both hover and keyboard focus.",
    avoid:
      "In Base UI 1.9 a tooltip is a visual supplementary label. Give the trigger itself an accessible name, and put essential descriptions or interactive elements in the page content or a Popover.",
    keyboard:
      "Appears when the trigger receives focus and closes with Escape. The popup never receives focus itself.",
    anatomy: "TooltipProvider → Tooltip(label) → single focusable trigger",
    tokens: [
      "--tooltip-background",
      "--tooltip-foreground",
      "--control-radius",
    ],
    code: 'import { TooltipProvider, Tooltip, Button } from "@surflane/ui";\n\n<TooltipProvider>\n  <Tooltip label="Inspect the build logs">\n    <Button variant="outline">Logs</Button>\n  </Tooltip>\n</TooltipProvider>',
    props: [
      ["label", "string", "required"],
      ["enabled", "boolean", "true"],
      ["children", "single ReactElement", "required"],
    ],
  },
  dialog: {
    usage:
      "Use for tasks that need the user's full attention. Provide a title, a description and an explicit way to close.",
    avoid:
      "Don't repeatedly block the flow for simple notices. Use a separate AlertDialog to confirm data loss.",
    keyboard:
      "Tab focus stays inside; exit with Escape / the close button. A nested Select closes first, then the parent Dialog.",
    anatomy:
      "Root → Trigger → Content → Header(Title / Description / X) + Body + Footer",
    tokens: overlays,
    code: 'import { Dialog, Button } from "@surflane/ui";\n\n<Dialog.Root>\n  <Dialog.Trigger render={<Button />}>Open plan</Dialog.Trigger>\n  <Dialog.Content closeLabel="Close plan">\n    <Dialog.Header>\n      <Dialog.Title>Deployment plan</Dialog.Title>\n      <Dialog.Description>Preview only.</Dialog.Description>\n    </Dialog.Header>\n    <Dialog.Body>Plan details</Dialog.Body>\n    <Dialog.Footer><Dialog.Close render={<Button />}>Done</Dialog.Close></Dialog.Footer>\n  </Dialog.Content>\n</Dialog.Root>',
    props: [
      [
        "Content.closeLabel",
        "accessible X label; false hides X",
        "Close dialog",
      ],
      [
        "Content.initialFocus",
        "ref / focus callback (Base UI)",
        "Base UI default",
      ],
      ["Root.open / onOpenChange", "controlled dialog state", "—"],
    ],
  },
  "alert-dialog": {
    usage:
      "Gets confirmation for actions that are hard to undo, such as deleting or discarding.",
    avoid:
      "Use a specific action name instead of a neutral OK / Yes. Don't treat an outside click as a response.",
    keyboard:
      "Initial focus goes to the safe cancel action. Focus stays inside, and Escape acts as cancel.",
    anatomy:
      "Root → Trigger → Content → Header(Title / Description) + Footer(Cancel / Action)",
    tokens: overlays,
    code: 'import { AlertDialog, Button } from "@surflane/ui";\n\n<AlertDialog.Root open={open} onOpenChange={setOpen}>\n  <AlertDialog.Trigger render={<Button />}>Discard</AlertDialog.Trigger>\n  <AlertDialog.Content initialFocus={cancelRef}>\n    <AlertDialog.Header>\n      <AlertDialog.Title>Discard draft?</AlertDialog.Title>\n      <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>\n    </AlertDialog.Header>\n    <AlertDialog.Footer>\n      <AlertDialog.Close ref={cancelRef} render={<Button />}>Keep draft</AlertDialog.Close>\n      <Button variant="destructive" onClick={discard}>Discard draft</Button>\n    </AlertDialog.Footer>\n  </AlertDialog.Content>\n</AlertDialog.Root>',
    props: [
      ["Root.open / onOpenChange", "controlled state", "—"],
      ["Content.initialFocus", "safe cancel button ref", "—"],
    ],
  },
  sheet: {
    usage:
      "Inspect resource details or settings without leaving the current list.",
    avoid:
      "Don't repeat the same content across stacked panels. Handle long content with independent scrolling in Body.",
    keyboard:
      "Follows Dialog's focus trap, Escape and focus restoration. A select menu inside the panel closes first.",
    anatomy: "Root(side) → Trigger → Content → Header / Body / Footer",
    tokens: overlays,
    code: 'import { Sheet, Button } from "@surflane/ui";\n\n<Sheet.Root side="right">\n  <Sheet.Trigger render={<Button />}>Details</Sheet.Trigger>\n  <Sheet.Content closeLabel="Close details">\n    <Sheet.Header>\n      <Sheet.Title>Environment</Sheet.Title>\n      <Sheet.Description>Preview details.</Sheet.Description>\n    </Sheet.Header>\n    <Sheet.Body>Resource details</Sheet.Body>\n    <Sheet.Footer><Sheet.Close render={<Button />}>Done</Sheet.Close></Sheet.Footer>\n  </Sheet.Content>\n</Sheet.Root>',
    props: [
      ["Root.side", "left | right | top | bottom", "right"],
      ["Content.size", "small | default | large (sm / md / lg aliases)", "md"],
      ["Content.closeLabel", "accessible X label", "Close panel"],
    ],
  },
  drawer: {
    usage:
      "Use for task panels that close with a swipe on mobile. Also provide keyboard support and a close button.",
    avoid:
      "Don't use the close gesture to mean done or save. Don't build UI that works only by dragging.",
    keyboard:
      "Focus stays inside the panel; exit with Escape / the close button. After a swipe dismiss, focus returns to the trigger.",
    anatomy:
      "Root → Trigger → Content(handle / popup) → Header / Body / Footer",
    tokens: overlays,
    code: 'import { Drawer, Button } from "@surflane/ui";\n\n<Drawer.Root>\n  <Drawer.Trigger render={<Button />}>Prepare run</Drawer.Trigger>\n  <Drawer.Content>\n    <Drawer.Header>\n      <Drawer.Title>Prepare deployment</Drawer.Title>\n      <Drawer.Description>Preview only.</Drawer.Description>\n    </Drawer.Header>\n    <Drawer.Body>Run settings</Drawer.Body>\n    <Drawer.Footer><Drawer.Close render={<Button />}>Cancel</Drawer.Close></Drawer.Footer>\n  </Drawer.Content>\n</Drawer.Root>',
    props: [
      [
        "Root.side",
        "left | right | top | bottom; derives swipe direction",
        "bottom",
      ],
      ["Content.closeLabel", "accessible X label", "Close panel"],
    ],
  },
  "scroll-area": {
    usage:
      "Use to review long content such as tables, diffs or logs in limited space. Scrollbars appear while scrolling or when the pointer comes within 24px of the matching edge, and stay operable during drag and keyboard scrolling.",
    avoid:
      "Don't split the page into unnecessary nested scroll regions. Give a name to any region whose content is hidden by scrolling.",
    keyboard:
      "Focus the region and navigate with the arrow keys and Page Up / Down. Wheel and touch scrolling keep working.",
    anatomy: "ScrollArea(label) → Root / Viewport + Scrollbar / Thumb / Corner",
    tokens: ["--scrollbar-size", "--scrollbar-thumb", "--scrollbar-track"],
    code: 'import { ScrollArea } from "@surflane/ui";\n\n<ScrollArea label="Build logs" orientation="both"\n  style={{ maxHeight: 240 }}>\n  <table>...</table>\n</ScrollArea>',
    props: [
      ["label", "accessible region name", "—"],
      [
        "orientation",
        "vertical | horizontal | both; limits native scrolling and visible bars to those axes",
        "horizontal",
      ],
      [
        "scrollChain",
        "auto passes wheel/touch to parent at an edge; contain isolates the enabled axes",
        "auto",
      ],
      ["style / className", "viewport attributes", "—"],
      [
        "rootStyle / rootClassName",
        "outer sizing and flex/grid placement",
        "—",
      ],
      [
        "tabIndex",
        "override the named viewport default when required",
        "0 for named regions",
      ],
    ],
  },
  "inline-confirmation": {
    usage:
      "Confirms a lightweight action, such as resetting filters, before it runs.",
    avoid:
      "Use AlertDialog to confirm high-risk actions such as deleting or changing permissions.",
    keyboard: "Follows Popover's focus, Escape and restoration behavior.",
    anatomy: "Popover + description + cancel / confirm Button",
    tokens: ["--menu-border", "--shadow-float"],
    code: 'import { Popover, Button } from "@surflane/ui";\n\n// Compose Popover + Button; no standalone Confirm export.\n<Popover.Root open={open} onOpenChange={setOpen}>\n  <Popover.Trigger render={<Button />}>Reset filters</Popover.Trigger>\n  <Popover.Portal><Popover.Content>\n    <Popover.Title>Reset filters?</Popover.Title>\n    <Popover.Description>Restore default filters.</Popover.Description>\n    <Popover.Close render={<Button />}>Keep filters</Popover.Close>\n    <Button onClick={reset}>Reset filters</Button>\n  </Popover.Content></Popover.Portal>\n</Popover.Root>',
    props: [["Composition", "Popover + Button", "no standalone export"]],
  },
};
