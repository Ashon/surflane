import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage: [
    "Write a key or a shortcut with Kbd, in running text, a tooltip or a hint line. Pass the keys pressed together; 'mod' is the command modifier, so ['mod', 'k'] reads ⌘K on Apple platforms and Ctrl+K elsewhere. Kbd puts modifiers in the platform's order and writes a single letter in capitals, as key caps print it.",
    'A key sits on the plane recessed one step from where it is, at 87.5% of the text around it, in the body face. In a tooltip it is plain text a step quieter, since the tooltip is already its own plane.',
    'Symbols such as ⌘, ⇧ and the arrows carry their names for screen readers in visually hidden text. Keyboards print the modifiers in English everywhere, so their names stay English; pass labels to translate the arrows.',
  ],
  avoid: [
    "Don't write ⌘ or Ctrl yourself: a Mac-only ⌘B is wrong for most readers. Use 'mod' and let Kbd decide.",
    "Don't make Kbd a button or the only way to learn a shortcut. Name the action in text, and set aria-keyshortcuts on the control the shortcut runs.",
    "Don't announce a key from aria-label on a kbd element; it has no role to carry a name.",
  ],
  keyboard: [
    "Kbd is text and isn't in the Tab order.",
    'The server and the first render write the Ctrl form, so hydration matches; an Apple page turns to ⌘ right after.',
  ],
  anatomy:
    'kbd.surf-kbd (the chord) → kbd per key (glyph + hidden spoken name for symbols), joined by + off Apple platforms',
  tokens: [
    '--surf-recessed',
    '--surf-ink',
    '--surf-font-body',
    '--surf-weight-medium',
    '--surf-radius-sm',
    '--surf-space-1',
  ],
  code: `import { Kbd, Tooltip } from '@surflane/ui'

<p>Press <Kbd keys={['mod', 'k']} /> to search.</p>
<p><Kbd keys='up' /> <Kbd keys='down' /> Choose · <Kbd keys='enter' /> Open</p>
<Tooltip label='Run the pipeline again' shortcut={['mod', 'shift', 'r']}>
  <Button variant='ghost' size='icon' aria-label='Run the pipeline again'>…</Button>
</Tooltip>`,
  props: [
    [
      'keys',
      'one key or the keys pressed together: mod, ctrl, alt, shift, enter, escape, up, down, left, right, or any key as written',
      'required',
    ],
    [
      'labels',
      '{ command, control, option, shift, up, down, left, right }: the names screen readers say for symbols',
      'Command, Control, Option, Shift, Up arrow…',
    ],
    [
      'platform',
      "'apple' or 'other', when the server knows the reader's platform; otherwise found in the browser",
      'detected',
    ],
    ['Tooltip.shortcut', 'keys as Kbd takes them, shown after the label', '—'],
  ],
}
