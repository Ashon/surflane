import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage: [
    'Group related information and actions on one surface. The default 24px padding balances all four sides, and spacing sets the hierarchy of title, description, body, and actions. To align card grid text with the surrounding body text, set Grid.bleed and Card.Root.padding to the same token step. Do this only when the outer container has room for the extended surface and the focus indicator.',
    'Stretched to a taller neighbor in a row, a card keeps its parts at the top and its Footer at the bottom, so the footers of a row line up. A bar, such as a Meter, takes a line of its own in the Footer.',
    "For a card that opens something, such as an item's details, put Card.Action in the Title: its button, or its link with href, stretches over the card, and hover, press and focus show on the whole card. Other controls on the card stay on top and keep their own actions.",
    "In a collection of like items, leave the padding to the card and its density: SizeProvider density='compact' around the grid tightens every card at once. See Collections in the Layout foundation for where each part goes.",
  ],
  avoid: [
    "Don't wrap every page section in a card or stack cards inside cards. Separate sections with headings and spacing instead. A dashboard is the exception, where each data panel is a plane: use Dashboard.Panel.",
    "Don't make the card itself a button or wrap it in a link. Card.Action keeps one named target in the title, and the other controls on the card still work.",
    "Don't color a card's band, border or plane to show its state. Say the state with a StatusBadge.",
  ],
  anatomy:
    'Root(Surface) → Header(Title(optional Action) + Description) + Body + Footer',
  keyboard:
    'Only the actions enter the Tab order. Root is a plain div with no focus or click behavior; with Card.Action, the action is the one stop for the card, and the focus ring draws around the whole card. Set Title.level to match the surrounding heading hierarchy. When the card needs a group name, connect it with aria-labelledby.',
  tokens: [
    '--surf-surface',
    '--surf-canvas',
    '--surf-space-6',
    '--surf-space-4',
    '--surf-radius-lg',
    '--surf-interaction-hover-bg',
    '--surf-interaction-focus',
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
</Card.Root>

// The whole card opens the item: the title's action stretches over it.
<Card.Root>
  <Card.Header>
    <Card.Title>
      <Card.Action onClick={() => open(service)}>{service.name}</Card.Action>
    </Card.Title>
  </Card.Header>
  <Card.Body>{service.summary}</Card.Body>
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
      'Action',
      "a button, or a link with href, stretched over the card; as a trigger's render, such as Sheet.Trigger render={<Card.Action />}, it opens that",
      '—',
    ],
    [
      'Header / Body / Footer / Description',
      'native div or p props, and size',
      '—',
    ],
  ],
}
