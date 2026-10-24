import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
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
    '--surf-code-bg',
    '--surf-font-code',
    '--surf-syntax-keyword',
    '--surf-syntax-string',
    '--surf-syntax-comment',
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
}
