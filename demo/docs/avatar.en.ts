import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage: [
    "Show a user image, with initials or an SVG as the fallback when the image is missing or fails. Set the alt text or Root name so a nearby name isn't announced twice. Status is a decorative badge, separate from the image. Expose the actual status through Root's aria-description or adjacent text.",
    'For things without a picture, such as projects, sessions or hosts, set category={categoryFor(name)}: the same name always gets the same of twelve category hues, as a tint behind initials in ink.',
    "Status.tone colors the marker as StatusBadge's tones do, and live pulses it while work runs, such as a session working now. Reduced motion keeps it still. Say the state in text too, such as a StatusBadge beside the name. Where there is no avatar, such as beside a group's count, StatusDot is the same dot on its own.",
  ],
  avoid: [
    "Don't make the Avatar span itself an account menu. Wrap it in a named button or Popover.Trigger instead.",
    "Don't pick a category hue by hand or by state. categoryFor keeps one name on one hue across screens; state belongs to Status and StatusBadge.",
  ],
  keyboard:
    "A static Avatar isn't in the Tab order. Inside a button, the button provides focus and behavior.",
  anatomy:
    'Avatar.Root → Image + Fallback(initials or default SVG) + optional Status',
  tokens: [
    '--surf-size-avatar-small',
    '--surf-size-avatar-default',
    '--surf-size-avatar-large',
    '--surf-radius-full',
    '--surf-line',
    '--surf-recessed',
    '--surf-chart-category-1',
    '--surf-status-success-fg',
  ],
  code: `import { Avatar, categoryFor } from '@surflane/ui'

<Avatar.Root role='img' aria-label='Preview user' size='default'>
  <Avatar.Image src='/profile.png' alt='' />
  <Avatar.Fallback aria-hidden='true'>CG</Avatar.Fallback>
</Avatar.Root>

// A project's mark: its hue from its name, and a pulse while it works.
<Avatar.Root category={categoryFor('platform-api')} aria-hidden='true'>
  <Avatar.Fallback>PA</Avatar.Fallback>
  <Avatar.Status tone='progress' live />
</Avatar.Root>`,
  props: [
    ['Root.size', 'small (24px) | default (36px) | large (48px)', 'default'],
    [
      'Root.category',
      '1–12: a category hue behind the fallback; categoryFor(name) picks one from a name',
      '—',
    ],
    [
      'Image.onLoadingStatusChange',
      'idle | loading | loaded | error callback',
      '—',
    ],
    ['Fallback.delay', 'milliseconds before fallback', '0'],
    [
      'Status',
      'decorative corner marker, hidden from assistive technology; describe the state on Root or in adjacent text',
      'optional',
    ],
    [
      'Status.tone',
      'neutral | info | success | danger | caution | progress',
      'success',
    ],
    ['Status.live', 'pulses the marker while work runs', 'false'],
  ],
}
