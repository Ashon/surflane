import type { ComponentDoc } from "./componentDocs";
export const documentationDocs: Record<string, ComponentDoc> = {
  documentation: {
    usage:
      "Builds documentation from PageHeader, Prose, CodeBlock, InlineMessage, and native table-of-contents links. Body text keeps an explicit reading width, and the secondary table of contents sits beside it on wide screens and before the body on narrow screens. Match each heading's stable ID to its table-of-contents href, and mark the current item from the shared document scroll position. Switching languages keeps the same section IDs and changes article.lang along with the notices and copy messages.",
    avoid:
      "Don't nest cards repeatedly for the whole document and each section. Don't force a reading-width limit on general UI description text; apply it only to Prose in the document body. Don't let horizontal code overflow scroll the whole page, and don't convey notice meaning with color alone. The product manages the translation status of real docs, server document loading, permissions, URL locales, and version switching. The dates and settings in the example are fixed local content.",
    anatomy:
      "Language/length/wrap controls → desktop body + contents rail / mobile contents then body → article(lang) → PageHeader + date → Prose(sections, headings, lists, inline message, CodeBlock, related native links)",
    keyboard:
      "Table-of-contents links use a standard a href=#id, and the target heading can receive focus with tabIndex=-1. The heading hierarchy stays page h1 → Preview h2 → document title h3 → body section h4. Collapsing the table of contents uses Collapsible's button and its aria-expanded relationship. Horizontal code areas are navigable with keyboard and pointer in the shared ScrollArea, and CodeBlock announces copy success or failure. Scroll tracking in the table of contents doesn't steal focus, and changing the language or line wrapping keeps focus on the control in use.",
    tokens: [
      "--layout-reading",
      "--type-reading-size",
      "--type-reading-leading",
      "--space-4",
      "--space-8",
      "--ink-body",
      "--ink-muted",
      "--selected",
      "--control-focus",
    ],
    code: `import {PageHeader, Prose, CodeBlock, InlineMessage} from "@surflane/ui";\n\n<nav aria-label="On this guide"><a href="#guide-setup">Setup</a></nav>\n<article lang="en" aria-label="Getting started">\n  <PageHeader level={3} size="document" title="Getting started" />\n  <Prose>\n    <section aria-labelledby="guide-setup">\n      <h4 id="guide-setup" tabIndex={-1}>Setup</h4>\n      <p>Confirm the target before continuing.</p>\n      <InlineMessage.Root tone="neutral">\n        <InlineMessage.Content>Read-only example.</InlineMessage.Content>\n      </InlineMessage.Root>\n      <CodeBlock code={sample} language="typescript" label="Configuration" />\n    </section>\n  </Prose>\n</article>\n\n// Keep heading IDs stable across translations and direct fragment loads.\n// Use the actual scroll viewport for current-section tracking; never focus on scroll.\n// Translate content, lang, control labels and announcements together in the product.`,
    props: [
      [
        "Prose",
        "explicit reading measure, typography and wrapping for article content",
        "--layout-reading",
      ],
      [
        "Heading IDs / TOC href",
        "stable semantic section IDs shared across translations",
        "caller-owned",
      ],
      [
        "Article.lang",
        "language of the localized article subtree",
        "en / ko in preview",
      ],
      [
        "CodeBlock.wrap",
        "horizontal code navigation or wrapped long lines",
        "false",
      ],
      [
        "TOC state",
        "Collapsible disclosure and aria-current=location for current section",
        "open / first section",
      ],
      [
        "Preview content",
        "localized title/body/messages; fixed sample date; optional long document",
        "local only",
      ],
    ],
  },
};
