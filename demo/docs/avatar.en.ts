import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Show a user image, with initials or an SVG as the fallback when the image is missing or fails. Set the alt text or Root name so a nearby name isn't announced twice. Status is a decorative badge, separate from the image. Expose the actual status through Root's aria-description or adjacent text.",
  avoid:
    "Don't make the Avatar span itself an account menu. Wrap it in a named button or Popover.Trigger instead.",
  keyboard:
    "A static Avatar isn't in the Tab order. Inside a button, the button provides focus and behavior.",
  anatomy:
    'Avatar.Root → Image + Fallback(initials or default SVG) + optional Status',
  tokens: [
    '--avatar-size-sm',
    '--avatar-size-md',
    '--avatar-size-lg',
    '--radius-full',
    '--line',
    '--surface',
  ],
  code: `import { Avatar } from '@surflane/ui'

<Avatar.Root role='img' aria-label='Preview user' size='md'>
  <Avatar.Image src='/profile.png' alt='' />
  <Avatar.Fallback aria-hidden='true'>CG</Avatar.Fallback>
</Avatar.Root>`,
  props: [
    [
      'Root.size',
      'small (24px) | default (36px) | large (48px); sm / md / lg aliases',
      'md',
    ],
    [
      'Image.onLoadingStatusChange',
      'idle | loading | loaded | error callback',
      '—',
    ],
    ['Fallback.delay', 'milliseconds before fallback', '0'],
    [
      'Status',
      'decorative corner marker; set aria-hidden on it and describe availability on Root or in adjacent text',
      'optional',
    ],
  ],
}
