import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage: [
    'Build documentation from PageHeader, Prose, CodeBlock, InlineMessage, and native table-of-contents links.',
    'Body text keeps an explicit reading width. The secondary table of contents sits beside the body on wide screens and before it on narrow screens.',
    "Match each heading's stable ID to its table-of-contents href. Mark the current item from the shared document scroll position.",
    'Switching languages keeps the section IDs and changes article.lang, the notices, and the copy messages.',
  ],
  avoid: [
    "Don't nest cards for the whole document and again for each section.",
    "Don't apply the reading-width limit to general UI description text. Apply it only to Prose in the document body.",
    "Don't let horizontal code overflow scroll the whole page. Keep it in the shared ScrollArea.",
    "Don't convey a notice's meaning with color alone.",
    "Don't treat the example's dates and settings as real data. They're fixed local content, and the product owns the translation status of real docs, server document loading, permissions, URL locales, and version switching.",
  ],
  anatomy:
    'Language/length/wrap controls → desktop body + contents rail / mobile contents then body → article(lang) → PageHeader + date → Prose(sections, headings, lists, inline message, CodeBlock, related native links)',
  keyboard: [
    'Table-of-contents links are standard a href=#id links. The target heading can take focus with tabIndex=-1.',
    "Table-of-contents scroll tracking doesn't move focus. Changing the language or line wrapping keeps focus on the control in use.",
    'Horizontal code areas scroll by keyboard and pointer in the shared ScrollArea.',
    "The table of contents collapses with Collapsible's button and its aria-expanded state.",
    'Headings run page h1 → Preview h2 → document title h3 → body section h4. CodeBlock announces copy success or failure.',
  ],
  tokens: [
    '--surf-layout-reading',
    '--surf-type-reading-size',
    '--surf-type-reading-leading',
    '--surf-space-4',
    '--surf-space-8',
    '--surf-ink-body',
    '--surf-ink-muted',
    '--surf-selected',
    '--surf-control-focus',
  ],
  code: `import { PageHeader, Prose, CodeBlock, InlineMessage } from '@surflane/ui'

<nav aria-label='In this guide'>
  <a href='#guide-setup'>Setup</a>
</nav>
<article lang='en' aria-label='Getting started'>
  <PageHeader level={3} variant='display' title='Getting started' />
  <Prose>
    <section aria-labelledby='guide-setup'>
      <h4 id='guide-setup' tabIndex={-1}>
        Setup
      </h4>
      <p>Confirm the target before continuing.</p>
      <InlineMessage.Root tone='neutral'>
        <InlineMessage.Content>Read-only example.</InlineMessage.Content>
      </InlineMessage.Root>
      <CodeBlock code={sample} language='typescript' label='Configuration' />
    </section>
  </Prose>
</article>

// Keep heading IDs stable across translations and direct fragment loads.
// Use the actual scroll viewport for current-section tracking; never focus on scroll.
// Translate content, lang, control labels and announcements together in the product.`,
  props: [
    [
      'Prose',
      'explicit reading measure, typography, and wrapping for article content',
      '--surf-layout-reading',
    ],
    [
      'Heading IDs / TOC href',
      'stable semantic section IDs shared across translations',
      'caller-owned',
    ],
    [
      'Article.lang',
      'language of the localized article subtree',
      'en / ko in preview',
    ],
    [
      'CodeBlock.wrap',
      'horizontal code navigation or wrapped long lines',
      'false',
    ],
    [
      'TOC state',
      'Collapsible disclosure and aria-current=location for current section',
      'open / first section',
    ],
    [
      'Preview content',
      'localized title/body/messages; fixed sample date; optional long document',
      'local only',
    ],
  ],
}
