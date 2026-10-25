import type { ComponentDoc } from '../componentDocs'
const controls = [
  '--surf-control-height',
  '--surf-radius-pill',
  '--surf-interaction-focus',
  '--surf-control-background',
]
export const doc: ComponentDoc = {
  usage:
    "Set a button's emphasis apart from its meaning. primary marks the one key action per area, on the brand surface. secondary (a borderless neutral surface) and outline (the only bordered variant) mark supporting actions, and ghost marks low emphasis. destructive signals danger at any priority. Without a variant a button is primary. default, its former name, is deprecated.",
  avoid:
    "Don't use Button for page navigation. Use LinkButton, which looks like a button and stays a link. Don't mark destructive actions with color alone. Say what the action does in the label text.",
  keyboard:
    'Tab moves focus. Enter or Space activates the button. While an action is in progress, the button blocks duplicate runs and announces the result.',
  anatomy: 'Button → optional SVG icon + text that describes the action',
  tokens: ['--surf-brand', '--surf-danger', ...controls],
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
      'primary | secondary | outline | ghost | destructive | link; deprecated: default (primary)',
      'primary',
    ],
    [
      'size',
      'small | default | large | icon | icon-small | icon-large; deprecated: xs / sm / md / lg / icon-sm / icon-xs / icon-lg',
      'default',
    ],
    ['disabled', 'boolean', 'false'],
    [
      'LinkButton',
      "Button's variant and size on a link; render takes a router link",
      '—',
    ],
  ],
}
