import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Turn a command on or off with a button that holds its state. Keep the label the same in both states. aria-pressed conveys the state, and a full rounded surface shows it.',
  avoid:
    "Use Link or Button for navigation or one-off actions. When a form needs a checked value, use Checkbox or Switch. Don't assume FormData or form reset includes Toggle state.",
  anatomy: 'Toggle(button) → optional decorative SVG + stable action label',
  keyboard:
    "Tab to the toggle and press Enter or Space to change its state. Disabled toggles don't change. Control it with pressed and onPressedChange, or set defaultPressed. event.cancel() cancels a change.",
  tokens: [
    '--surf-selected',
    '--surf-control-border',
    '--surf-radius-pill',
    '--surf-interaction-focus',
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
      'small | default | large | icon; sm / md / lg are deprecated',
      'default',
    ],
    ['value', 'string identifier inside ToggleGroup', '—'],
    [
      'render / className',
      'Base UI composition and state-dependent styling',
      '—',
    ],
  ],
}
