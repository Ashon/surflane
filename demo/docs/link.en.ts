import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Navigate to a destination with a real href. The underline and focus ring show that it navigates.',
  avoid:
    "Don't use a link without an href for an action. Use Button instead. When a link opens a new tab, say so in the text and set rel.",
  keyboard:
    'Tab to the link and press Enter to open it. Modifier-key clicks, new tabs, downloads, and hash navigation keep browser defaults.',
  anatomy: 'native anchor + shared link class',
  tokens: ['--ink', '--brand-ink', '--interaction-focus'],
  code: `import { Link } from '@surflane/ui'

<Link href='/components'>Browse components</Link>
<Link href='https://base-ui.com' target='_blank' rel='noreferrer'>
  Reference (opens in a new tab)
</Link>`,
  props: [
    [
      'href / target / rel / download',
      'native anchor props',
      'native defaults',
    ],
    ['ref', 'HTMLAnchorElement', '—'],
  ],
}
