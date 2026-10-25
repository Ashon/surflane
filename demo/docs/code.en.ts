import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Show code, configuration, and long identifiers with whitespace and line breaks preserved, ready to select and copy. The copy button shows its result in place: Copied, or Copy unavailable. Content scrolls horizontally by default. In documentation, set wrap so only long lines break.',
  avoid: [
    "Don't let syntax highlighting pass for syntax validation or an execution result. Report those separately instead.",
    "Don't inject code as HTML or execute it. Pass a plain source string to code instead.",
    "Don't treat a rejected clipboard write as success. Let a custom onCopy throw or reject on failure, so the button shows Copy unavailable.",
  ],
  anatomy:
    'Root → toolbar(label + language + CopyButton, which also shows the result) + labeled ScrollArea(pre/code). CopyButton also stands alone beside any value.',
  keyboard: [
    'Tab reaches the copy button and the scroll area.',
    'Enter or Space copies. The result replaces the button label in place, so nothing else moves: Copied on success, Copy unavailable on failure.',
    'On failure, the source is selected for the keyboard copy shortcut.',
    "Changing the source clears the result, and late responses don't overwrite the new source's state.",
    'The label is a polite live region and returns to the action after 2 seconds.',
  ],
  tokens: [
    '--surf-code-bg',
    '--surf-font-code',
    '--surf-space-4',
    '--surf-radius-md',
    '--surf-ink-body',
  ],
  code: `import { CodeBlock } from '@surflane/ui'

<CodeBlock
  label='Runner task'
  language='YAML'
  code={'name: platform-api\\n  environment: staging\\n'}
/>
<CodeBlock label='Wrapped source' code={source} wrap />`,
  props: [
    ['code', 'plain source string', 'required'],
    [
      'label / language',
      'scroll region name / Shiki grammar and visible language hint; unknown languages render plain',
      'Code / —',
    ],
    ['wrap', 'wrap long source lines visually', 'false'],
    [
      'onCopy',
      'optional clipboard writer (text) => void | Promise<void>',
      'navigator.clipboard.writeText',
    ],
    [
      'labels',
      '{ copy, copied, copyError }: the localized action and short in-button results',
      'Copy code / Copied / Copy unavailable',
    ],
    [
      'CopyButton.value',
      'the text to copy, or a function that returns it, or a promise of it, when pressed',
      'required',
    ],
    [
      'CopyButton.labels / onCopy',
      'as on CodeBlock; the action defaults to Copy',
      'Copy / Copied / Copy unavailable',
    ],
    [
      'CopyButton.onResult',
      "hears 'copied' or 'failed' after each press, such as to select the source after a failure",
      '—',
    ],
  ],
}
