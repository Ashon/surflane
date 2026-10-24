import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Render CommonMark documents, plus GFM tables, task lists, strikethrough, and footnotes, in the shared reading style. Code fences reuse CodeBlock's highlighting, copy action, and horizontal scrolling.",
  avoid:
    "Don't render MDX or executable HTML. Pass CommonMark or GFM source instead. Don't use task lists as form inputs, since they're read-only. Use Checkbox instead. The calling screen decides remote document fetching, permissions, link destinations, and image visibility.",
  anatomy:
    'named article → scoped heading hierarchy and anchors → prose / links / lists / blockquote → Table.ScrollArea / highlighted CodeBlock / notes',
  keyboard:
    "Tab reaches links and copy buttons, and Enter activates them natively. Headings start at h2 by default. Each instance's internal links point to its own IDs. HTML is excluded, and the default URL policy blocks unsafe URLs. Long tables and code scroll independently instead of overflowing the document.",
  tokens: [
    '--surf-type-reading-size',
    '--surf-type-reading-leading',
    '--surf-layout-reading',
    '--surf-code-bg',
    '--surf-syntax-keyword',
    '--surf-ink-body',
  ],
  code: `// Needs react-markdown and remark-gfm: npm install react-markdown remark-gfm
import { Markdown } from '@surflane/ui/markdown'

<Markdown
  source={documentSource}
  label='Deployment guide'
  headingLevel={2}
  codeWrap={false}
/>`,
  props: [
    ['source', 'CommonMark + GitHub flavored Markdown string', 'required'],
    ['label', 'article and nested code/table region names', 'Markdown content'],
    [
      'labels',
      'code(label, line), table(label, line), task, and the copy, copied and copyError text of its code blocks',
      'English',
    ],
    [
      'headingLevel',
      'render Markdown h1 at this semantic level; deeper headings clamp to h6',
      '2',
    ],
    [
      'codeWrap',
      'visually wrap fenced code without changing copied text',
      'false',
    ],
    ['ref / className', 'root HTMLDivElement / additional class', '—'],
  ],
}
