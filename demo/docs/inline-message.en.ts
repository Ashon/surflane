import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Explain a notice, error, or warning about the current task, with its cause and next step. Static messages aren't live regions. Announce only asynchronous changes, with role=status, or role=alert when urgent.",
  avoid: [
    "Don't distinguish tones by color alone. State the status in Title and Description instead.",
    "Don't announce every message as an alert on page load. Leave static messages unannounced instead.",
    "Don't imply that retrying guarantees a real result. Say what the retry attempts instead.",
  ],
  anatomy: 'Root(tone) → Icon(tone) + Content(Title + Description + Actions)',
  keyboard:
    "The message doesn't take focus. Tab reaches the action buttons, and Enter or Space activates them. The Icon is decorative. Title and Description convey the status. The caller sets Root.role.",
  tokens: [
    '--status-danger-bg',
    '--status-danger-fg',
    '--status-caution-bg',
    '--status-success-bg',
    '--radius-md',
    '--space-4',
  ],
  code: `import { InlineMessage, Button } from '@surflane/ui'

<InlineMessage.Root tone='danger'>
  <InlineMessage.Icon tone='danger' />
  <InlineMessage.Content>
    <InlineMessage.Title>Discovery failed</InlineMessage.Title>
    <InlineMessage.Description>
      Check the connection and retry.
    </InlineMessage.Description>
    <InlineMessage.Actions>
      <Button onClick={retry}>Retry</Button>
    </InlineMessage.Actions>
  </InlineMessage.Content>
</InlineMessage.Root>`,
  props: [
    [
      'Root.tone / Icon.tone',
      'neutral | info | success | danger | caution | progress',
      'neutral',
    ],
    [
      'Root.role',
      'native role; choose live announcements deliberately',
      'none',
    ],
    ['Icon.children', 'custom decorative icon', 'semantic status SVG'],
    ['Title / Description / Actions', 'native strong / p / div props', '—'],
  ],
}
