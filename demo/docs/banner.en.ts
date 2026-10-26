import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage: [
    'Tell everyone using the product about a state of the whole product, such as maintenance, degraded service or an outage. Put Banner.Root first in AppShell.Root: it spans the shell edge to edge above the header, or above the sidebar and the content, and lines its icon up with the shell.',
    'Name the state in Banner.Title, such as Scheduled maintenance; the tone colors the plane and the icon but never says it alone. Banner.Description adds when and what to do, in one line where it fits. Banner.Actions holds a link or button to the status page or the next step; on a phone the actions go under the text.',
    'The banner is a polite live region: a change to its text is announced without interrupting. onDismiss shows a dismiss button; remove the banner when it is called, and focus moves to the first control after it.',
  ],
  avoid: [
    "Don't use a banner for a message about one task or form; use InlineMessage there. Don't use it for an outcome the reader just caused; use Toast.",
    "Don't stack banners. Show the most severe state, and put the rest on the status page.",
    "Don't make a danger banner dismissible while the outage lasts, or bring a dismissed notice back on every page.",
  ],
  keyboard: [
    'The banner takes no focus. Tab reaches its actions and the dismiss button; Enter or Space presses them.',
    'After dismissing, focus moves to the first control that followed the banner.',
  ],
  anatomy:
    'Root(tone, role=status) → Icon + Content(Title + Description) + Actions + dismiss button',
  tokens: [
    '--surf-status-info-bg',
    '--surf-status-caution-bg',
    '--surf-status-danger-bg',
    '--surf-status-caution-fg',
    '--surf-space-2',
    '--surf-status-danger-fg',
  ],
  code: `import { AppShell, Banner, LinkButton } from '@surflane/ui'

<AppShell.Root layout='workspace'>
  {notice && (
    <Banner.Root tone='caution' onDismiss={() => setNotice(false)}>
      <Banner.Icon />
      <Banner.Content>
        <Banner.Title>Scheduled maintenance</Banner.Title>
        <Banner.Description>
          Deployments pause on Saturday, 02:00–04:00 UTC.
        </Banner.Description>
      </Banner.Content>
      <Banner.Actions>
        <LinkButton href='/status' variant='outline' size='small'>
          View status
        </LinkButton>
      </Banner.Actions>
    </Banner.Root>
  )}
  <AppShell.Sidebar>…</AppShell.Sidebar>
  <AppShell.Content>…</AppShell.Content>
</AppShell.Root>`,
  props: [
    ['Root.tone', 'info | caution | danger', 'info'],
    [
      'Root.onDismiss',
      'shows a dismiss button and is called when it is pressed',
      '—',
    ],
    ['Root.dismissLabel', "the dismiss button's name", 'Dismiss'],
    [
      'Root.role',
      'status: announced politely; a change to its text is read',
      'status',
    ],
    ['Icon', "the tone's icon; pass children for another", 'tone icon'],
  ],
}
