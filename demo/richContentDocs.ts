import type { ComponentDoc } from './componentDocs'
export const richContentDocs: Record<string, ComponentDoc> = {
  'syntax-highlighter': {
    usage:
      'Highlight source code in Platform Quiet, a dedicated code theme with neutral surfaces and low-chroma OKLCH colors. Keywords are purple, strings sage, functions and types blue, and numbers amber. Properties and punctuation stay neutral, and comments stay readable, without italics or faded opacity. For a copy action, use CodeBlock, which shares this highlighter.',
    avoid: [
      "Don't present highlighting as code validation or an execution result. Report those separately instead.",
      "Don't inject HTML or execute the source. Pass it as a plain code string instead.",
      "Don't strip or auto-correct whitespace, line breaks, or Hangul text. Pass the original source unchanged instead.",
      "Don't expect every source to be highlighted. Unsupported languages, engine load failures, and sources over 50,000 characters stay plain text.",
    ],
    anatomy:
      'labeled ScrollArea → pre → code → semantic token spans; inline mode returns only code',
    keyboard:
      'The source keeps native text selection and copying. It scrolls horizontally in a ScrollArea. Setting wrap breaks lines visually without changing the source. Colors meet at least 4.5:1 in both themes and use the system text color in forced colors mode.',
    tokens: [
      '--code-bg',
      '--font-code',
      '--syntax-keyword',
      '--syntax-string',
      '--syntax-comment',
    ],
    code: `// Highlighting needs shiki: npm install shiki
import { SyntaxHighlighter, CodeBlock } from '@surflane/ui'
import { SyntaxHighlighting } from '@surflane/ui/syntax-highlighting'

<SyntaxHighlighting>
  <SyntaxHighlighter code={source} language='tsx' label='Source preview' />
  <CodeBlock code={source} language='tsx' label='Copyable example' />
</SyntaxHighlighting>`,
    props: [
      ['code', 'original source string', 'required'],
      [
        'language',
        'tsx / jsx / typescript / javascript / css / html / json / bash / yaml / python / sql / markdown / text; ts/js/sh/yml aliases',
        'text',
      ],
      [
        'inline',
        'render code only; caller owns the surrounding pre/scroll layout',
        'false',
      ],
      [
        'label / wrap',
        'scroll region name / visual wrapping',
        'Highlighted source / false',
      ],
      ['ref', 'underlying code HTMLElement', '—'],
      [
        'SyntaxHighlighting suspense',
        'each block waits for its tokens behind its own Suspense boundary, so a server render writes highlighted HTML',
        'false',
      ],
    ],
  },
  markdown: {
    usage:
      "Render CommonMark documents, plus GFM tables, task lists, strikethrough, and footnotes, in the shared reading style. Code fences reuse CodeBlock's highlighting, copy action, and horizontal scrolling.",
    avoid:
      "Don't render MDX or executable HTML. Pass CommonMark or GFM source instead. Don't use task lists as form inputs, since they're read-only. Use Checkbox instead. The calling screen decides remote document fetching, permissions, link destinations, and image visibility.",
    anatomy:
      'named article → scoped heading hierarchy and anchors → prose / links / lists / blockquote → Table.ScrollArea / highlighted CodeBlock / notes',
    keyboard:
      "Tab reaches links and copy buttons, and Enter activates them natively. Headings start at h2 by default. Each instance's internal links point to its own IDs. HTML is excluded, and the default URL policy blocks unsafe URLs. Long tables and code scroll independently instead of overflowing the document.",
    tokens: [
      '--type-reading-size',
      '--type-reading-leading',
      '--layout-reading',
      '--code-bg',
      '--syntax-keyword',
      '--ink-body',
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
      [
        'label',
        'article and nested code/table region names',
        'Markdown content',
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
  },
}
