import type { ComponentDoc } from './componentDocs'
export const commandDocs: Record<string, ComponentDoc> = {
  toggle: {
    usage:
      'Turn a command on or off with a button that holds its state. Keep the label the same in both states. aria-pressed conveys the state, and a full rounded surface shows it.',
    avoid:
      "Use Link or Button for navigation or one-off actions. When a form needs a checked value, use Checkbox or Switch. Don't assume FormData or form reset includes Toggle state.",
    anatomy: 'Toggle(button) → optional decorative SVG + stable action label',
    keyboard:
      "Tab to the toggle and press Enter or Space to change its state. Disabled toggles don't change. Control it with pressed and onPressedChange, or set defaultPressed. event.cancel() cancels a change.",
    tokens: [
      '--selected',
      '--control-border',
      '--radius-full',
      '--interaction-focus',
    ],
    code: `import { Toggle } from '@surflane/ui'

<Toggle pressed={pinned} onPressedChange={setPinned}>
  Pin logs
</Toggle>
<Toggle defaultPressed>Show timings</Toggle>
<Toggle size='icon' aria-label='Pin logs'>
  <PinIcon />
</Toggle>`,
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
      'Group related display modes or filters. At most one item is pressed, or several with multiple=true. The value is always an array, even in single mode.',
    avoid:
      'Use RadioGroup when a form requires exactly one choice. Let aria-pressed carry the pressed state, not aria-selected. Set orientation to match the visual layout.',
    anatomy: 'named ToggleGroup(role=group) → Toggle(value) items',
    keyboard:
      'The group is a single Tab stop. Arrow keys, Home, and End only move focus. Enter or Space selects the focused item. Disabled items are skipped. For RTL, set both DirectionProvider and the DOM dir.',
    tokens: [
      '--selected',
      '--control-border',
      '--space-1',
      '--radius-full',
      '--interaction-focus',
    ],
    code: `import { ToggleGroup, Toggle } from '@surflane/ui'

<ToggleGroup aria-label='Log source' value={source} onValueChange={setSource}>
  <Toggle value='live'>Live</Toggle>
  <Toggle value='simulation'>Simulation</Toggle>
</ToggleGroup>
<ToggleGroup
  multiple
  aria-label='Visible log details'
  defaultValue={['requests']}
>
  <Toggle value='requests'>Requests</Toggle>
  <Toggle value='errors'>Errors</Toggle>
</ToggleGroup>`,
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
      "Group a screen's related actions and display settings in one toolbar. Surfaces, not borders, separate the container from its controls. Inner corners use the outer radius minus the inner padding. Compose Button, Toggle, and Menu triggers through render so buttons don't nest.",
    avoid:
      "Don't add a Toolbar to every simple group of buttons. Use Inline instead. Let text inputs keep their editing keys. Use Toolbar.Link for navigation instead of disguising it as a command.",
    anatomy:
      'Root(role=toolbar) → Group(Button/Toggle) + Separator + Input + composed popup trigger + Link',
    keyboard:
      "The toolbar is a single Tab stop. Arrow keys along the orientation, Home, and End move focus. Editing keys inside inputs keep their behavior. Disabled Buttons stay focusable, since focusableWhenDisabled defaults to true, but they don't run. Links keep native navigation, and Root.disabled doesn't disable them.",
    tokens: [
      '--surface',
      '--space-2',
      '--control-height',
      '--radius-md',
      '--interaction-focus',
    ],
    code: `import { Toolbar, Toggle, Menu } from '@surflane/ui'

<Toolbar.Root aria-label='Run tools'>
  <Toolbar.Button onClick={refresh}>Refresh</Toolbar.Button>
  <Toolbar.Button
    render={<Toggle pressed={pinned} onPressedChange={setPinned} />}
  >
    Pin results
  </Toolbar.Button>
  <Toolbar.Input aria-label='Filter services' />
  <Menu.Root>
    <Toolbar.Button render={<Menu.Trigger />}>More actions</Toolbar.Button>
    <Menu.Portal>
      <Menu.Content>
        <Menu.Item onClick={exportLogs}>Export logs</Menu.Item>
      </Menu.Content>
    </Menu.Portal>
  </Menu.Root>
</Toolbar.Root>`,
    props: [
      [
        'Root.orientation / loopFocus',
        'horizontal | vertical / cyclic focus',
        'horizontal / true',
      ],
      [
        'Root.disabled / Group.disabled',
        'disable command controls; links still navigate natively',
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
        'native input or anchor props, plus toolbar focus handling',
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
      'Group application commands into menus such as Run, View, and Help. Each menu reuses the shared Menu parts: Item, CheckboxItem, RadioItem, submenus, and LinkItem.',
    avoid:
      "Use NavigationMenu or a native nav for a site's primary navigation or plain link lists. Don't nest other buttons inside a Menu.Trigger. Add those commands as Menu.Item instead.",
    anatomy:
      'Menubar(role=menubar) → Menu.Root(Trigger + Portal/Content(Item/CheckboxItem/RadioItem/Submenu))',
    keyboard: [
      'Arrow keys move between menu triggers.',
      'Enter or Space, or the arrow key toward the menu, opens a menu.',
      'Base UI handles moving between open menus, closing with Escape, returning focus to the trigger, and submenu arrow keys.',
      'Keep orientation consistent with DirectionProvider and the DOM dir.',
      'Base UI 1.9 stores the initial direction in the menu model. If the direction changes at runtime, give the Menubar an orientation-based key so it remounts.',
      'Control menu selection values from the parent.',
    ],
    tokens: [
      '--menu-background',
      '--menu-hover-background',
      '--menu-border',
      '--radius-md',
      '--layer-popup',
    ],
    code: `import { Menubar, Menu } from '@surflane/ui'

<Menubar aria-label='Deployment commands' modal={false}>
  <Menu.Root>
    <Menu.Trigger>Run</Menu.Trigger>
    <Menu.Portal>
      <Menu.Content align='start'>
        <Menu.Item onClick={preparePreview}>New preview</Menu.Item>
        <Menu.Item disabled>Delete runs</Menu.Item>
      </Menu.Content>
    </Menu.Portal>
  </Menu.Root>
</Menubar>`,
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
        'styled Positioner and Popup; wrap it in Menu.Portal',
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
