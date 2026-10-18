import type { ComponentDoc } from './componentDocs'
export const commandDocs: Record<string, ComponentDoc> = {
  toggle: {
    usage:
      'Use it for command buttons that stay on or off. The label stays the same as the state changes, and aria-pressed conveys the pressed state. The state is shown as a full rounded surface.',
    avoid:
      "Use Link/Button for navigation or one-off actions. When a form needs a checked value, use Checkbox/Switch; don't assume Toggle state is automatically included in FormData or reset values.",
    anatomy: 'Toggle(button) → optional decorative SVG + stable action label',
    keyboard:
      "Tab to the toggle and press Enter/Space to change its state. Disabled toggles don't run. Control it with pressed/onPressedChange or use defaultPressed; event.cancel() cancels a change.",
    tokens: [
      '--selected',
      '--control-border',
      '--radius-full',
      '--interaction-focus',
    ],
    code: 'import { Toggle } from "@surflane/ui";\n\n<Toggle pressed={pinned} onPressedChange={setPinned}>Pin logs</Toggle>\n<Toggle defaultPressed>Show timings</Toggle>\n<Toggle size="icon" aria-label="Pin logs"><PinIcon /></Toggle>',
    props: [
      [
        'pressed / defaultPressed',
        'controlled / uncontrolled boolean state',
        'false',
      ],
      [
        'onPressedChange',
        '(pressed, eventDetails) => void; supports cancel()',
        '—',
      ],
      ['disabled', 'block interaction', 'false'],
      [
        'size',
        'small | default | large | icon (sm / md / lg aliases)',
        'default',
      ],
      ['value', 'string identifier inside ToggleGroup', '—'],
      [
        'render / className',
        'Base UI composition and state-dependent styling',
        '—',
      ],
    ],
  },
  'toggle-group': {
    usage:
      'Groups related display modes or filters. Even in single mode, value is an array; the group allows at most one pressed item, or several with multiple=true.',
    avoid:
      "Use RadioGroup for forms that require exactly one choice. Don't override the pressed state with aria-selected, and don't let the keyboard orientation differ from the visual layout.",
    anatomy: 'named ToggleGroup(role=group) → Toggle(value) items',
    keyboard:
      'Provides a single Tab stop plus arrow-key and Home/End navigation. Arrow keys only move focus; Enter/Space selects. Disabled items are skipped. For RTL, set both DirectionProvider and the DOM dir.',
    tokens: [
      '--selected',
      '--control-border',
      '--space-1',
      '--radius-full',
      '--interaction-focus',
    ],
    code: 'import { ToggleGroup, Toggle } from "@surflane/ui";\n\n<ToggleGroup aria-label="Log source" value={source} onValueChange={setSource}>\n  <Toggle value="live">Live</Toggle>\n  <Toggle value="simulation">Simulation</Toggle>\n</ToggleGroup>\n<ToggleGroup multiple aria-label="Visible log details" defaultValue={["requests"]}>\n  <Toggle value="requests">Requests</Toggle>\n  <Toggle value="errors">Errors</Toggle>\n</ToggleGroup>',
    props: [
      [
        'value / defaultValue',
        'readonly string[]; generic value unions preserved',
        '[]',
      ],
      [
        'onValueChange',
        '(values, eventDetails) => void; supports cancel()',
        '—',
      ],
      ['multiple', 'allow multiple pressed items', 'false'],
      [
        'orientation / loopFocus',
        'horizontal | vertical / cyclic focus',
        'horizontal / true',
      ],
      ['disabled', 'disable all toggles', 'false'],
      [
        'aria-label / aria-labelledby',
        'name the related command group',
        'caller supplied',
      ],
    ],
  },
  toolbar: {
    usage:
      "Groups related actions and display settings for the same screen into one toolbar. The container and controls are separated by surfaces rather than borders, and inner corners use the outer radius minus the inner padding. Compose Button, Toggle, and Menu triggers through render so real buttons aren't nested.",
    avoid:
      "Don't add a Toolbar to every simple group of buttons. Don't arbitrarily intercept editing keys in text inputs or disguise link navigation as command execution.",
    anatomy:
      'Root(role=toolbar) → Group(Button/Toggle) + Separator + Input + composed popup trigger + Link',
    keyboard:
      "Provides a single Tab stop plus arrow keys along the orientation and Home/End navigation. Editing keys inside inputs keep their behavior. Disabled Buttons can still receive focus because focusableWhenDisabled=true by default, but they don't run. Links keep native navigation and aren't disabled by Root.disabled.",
    tokens: [
      '--surface',
      '--space-2',
      '--control-height',
      '--radius-md',
      '--interaction-focus',
    ],
    code: 'import { Toolbar, Toggle, Menu } from "@surflane/ui";\n\n<Toolbar.Root aria-label="Run tools">\n  <Toolbar.Button onClick={refresh}>Refresh</Toolbar.Button>\n  <Toolbar.Button render={<Toggle pressed={pinned} onPressedChange={setPinned} />}>\n    Pin results\n  </Toolbar.Button>\n  <Toolbar.Input aria-label="Filter services" />\n  <Menu.Root>\n    <Toolbar.Button render={<Menu.Trigger />}>More actions</Toolbar.Button>\n    <Menu.Portal><Menu.Content>\n      <Menu.Item onClick={exportLogs}>Export logs</Menu.Item>\n    </Menu.Content></Menu.Portal>\n  </Menu.Root>\n</Toolbar.Root>',
    props: [
      [
        'Root.orientation / loopFocus',
        'horizontal | vertical / cyclic focus',
        'horizontal / true',
      ],
      [
        'Root.disabled / Group.disabled',
        'disable command controls; links remain native navigation',
        'false',
      ],
      [
        'Button.focusableWhenDisabled',
        'keep disabled commands discoverable',
        'true',
      ],
      [
        'Button.render',
        'compose Toggle or popup trigger without nested buttons',
        'button',
      ],
      [
        'Input / Link',
        'native input/anchor props plus toolbar focus integration',
        '—',
      ],
      [
        'Separator.orientation',
        'visual/semantic separator direction',
        'opposite of toolbar',
      ],
    ],
  },
  menubar: {
    usage:
      "Groups application commands into menus such as Run, View, and Help. Reuses the shared Menu's items, checkbox items, radio items, submenus, and links.",
    avoid:
      "Use NavigationMenu or a native nav for a site's primary navigation or plain link lists. Don't nest other buttons inside a menu trigger.",
    anatomy:
      'Menubar(role=menubar) → Menu.Root(Trigger + Portal/Content(Item/CheckboxItem/RadioItem/Submenu))',
    keyboard:
      'Arrow keys move between menu triggers, and Enter/Space or the arrow key toward the menu opens one. Moving between open menus, closing with Escape, returning to the trigger, and submenu arrow keys are delegated to Base UI. Keep orientation consistent with DirectionProvider/DOM dir. Because Base UI 1.9 stores the initial direction in the menu model, give the Menubar an orientation-based key so it remounts when the direction changes at runtime, and control menu selection values from the parent.',
    tokens: [
      '--menu-background',
      '--menu-hover-background',
      '--menu-border',
      '--radius-md',
      '--layer-popup',
    ],
    code: 'import { Menubar, Menu } from "@surflane/ui";\n\n<Menubar aria-label="Deployment commands" modal={false}>\n  <Menu.Root>\n    <Menu.Trigger>Run</Menu.Trigger>\n    <Menu.Portal><Menu.Content align="start">\n      <Menu.Item onClick={preparePreview}>New preview</Menu.Item>\n      <Menu.Item disabled>Delete runs</Menu.Item>\n    </Menu.Content></Menu.Portal>\n  </Menu.Root>\n</Menubar>',
    props: [
      [
        'orientation / loopFocus',
        'horizontal | vertical / cyclic focus',
        'horizontal / true',
      ],
      [
        'modal',
        'limit outside interaction while a menu is open',
        'true (preview uses false)',
      ],
      ['disabled', 'disable all menu triggers', 'false'],
      [
        'Menu.Content',
        'styled popup/positioner; use Menu.Portal around it',
        'align=end, sideOffset=6',
      ],
      [
        'Menu.Item / CheckboxItem / RadioItem / LinkItem',
        'shared styled Base UI menu commands',
        '—',
      ],
      [
        'Menu.SubmenuTrigger.indicator',
        'custom ReactNode; false hides default SVG arrow',
        'SVG chevron',
      ],
    ],
  },
}
