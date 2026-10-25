import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Group related information and actions on one surface. The default 24px padding balances all four sides, and spacing sets the hierarchy of title, description, body, and actions. To align card grid text with the surrounding body text, set Grid.bleed and Card.Root.padding to the same token step. Do this only when the outer container has room for the extended surface and the focus indicator.',
  avoid:
    "Don't wrap every page section in a card or stack cards inside cards. Separate sections with headings and spacing instead. A dashboard is the exception, where each data panel is a plane: use Dashboard.Panel. Don't turn the whole card into a fake button. Put purposeful links and buttons inside it instead.",
  anatomy: 'Root(Surface) → Header(Title + Description) + Body + Footer',
  keyboard:
    'Only the actions enter the Tab order. Root is a plain div with no focus or click behavior. Set Title.level to match the surrounding heading hierarchy. When the card needs a group name, connect it with aria-labelledby.',
  tokens: [
    '--surf-surface',
    '--surf-canvas',
    '--surf-space-6',
    '--surf-space-4',
    '--surf-radius-lg',
  ],
  code: `import { Card, Button } from '@surflane/ui'

<Card.Root aria-labelledby='environment-title'>
  <Card.Header>
    <Card.Title id='environment-title' level={3}>
      DEMO main
    </Card.Title>
    <Card.Description>Platform API environment</Card.Description>
  </Card.Header>
  <Card.Body>Three services are ready to deploy.</Card.Body>
  <Card.Footer>
    <Button onClick={inspect}>Inspect environment</Button>
  </Card.Footer>
</Card.Root>`,
  props: [
    ['Root.surface', 'subtle | canvas', 'subtle'],
    ['Root.padding', 'shared Space token step', '6 (24px)'],
    [
      'Root.size',
      'small | default | large: padding, title and the controls inside, as SizeProvider sets them',
      'surrounding size',
    ],
    ['Title.level', '2 | 3 | 4 | 5 | 6', '3'],
    [
      'Header / Body / Footer / Description',
      'native div or p props, and size',
      '—',
    ],
  ],
}
