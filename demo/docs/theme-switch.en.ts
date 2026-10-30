import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Let people choose light, dark or the device's setting with one button that steps through them, naming the theme now and the next in its label and tooltip. The switch sets data-theme on the page's root element, or on target for a scoped region, with the theme crossfade, keeps the choice in data-theme-mode, and remembers it under persist. System resolves to light or dark by the device and follows it as it changes. variant='group' shows the three side by side, for a settings page, and only their icons where the names don't fit; in an AppShell sidebar, the switch is a row like the links, such as \"Theme: System\", its name a tooltip on the collapsed rail, and a group there shows the three only while the sidebar is expanded.",
  avoid: [
    "Don't offer only light and dark where the device's setting matters; system is the default.",
    "Don't set data-theme elsewhere at the same time. Pass value and onValueChange to drive the switch from your own state, such as a cookie the server reads for the first paint.",
  ],
  keyboard: [
    'The button names the theme now and the one a press sets, and shows the same in a tooltip. Enter or Space steps to the next.',
    "variant='group' is a segmented control: Tab reaches it, arrow keys move between light, dark and system, and Enter or Space chooses. The chosen one is pressed; a name hidden for room stays for assistive technology.",
    'The theme crossfades, and changes at once under reduced motion.',
  ],
  anatomy:
    "div → Tooltip → Button(icon, aria-label) | variant='group': div → SegmentedControl(aria-label) → light, dark, system (icon + name)",
  tokens: ['--surf-control-height', '--surf-radius-md'],
  code: `import { ThemeSwitch, AppShell } from '@surflane/ui'

<ThemeSwitch />
<ThemeSwitch variant='group' />

// In a sidebar: a row like the links, an icon on the collapsed rail.
<AppShell.Footer>
  <ThemeSwitch />
</AppShell.Footer>`,
  props: [
    [
      'value / defaultValue / onValueChange',
      "light | dark | system; the remembered choice, then the page's data-theme-mode, win over defaultValue",
      'system',
    ],
    ['variant', 'cycle | group', 'cycle'],
    [
      'target',
      'a ref to the element the theme applies to, such as a preview',
      "the page's root element",
    ],
    [
      'persist',
      'the localStorage key that remembers an uncontrolled choice; false keeps it for the session. With value, your own state remembers it',
      "'surflane-theme'",
    ],
    ['labels', 'label, light, dark, system, next(current, next)', 'English'],
  ],
}
