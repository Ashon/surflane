'use client'
import * as React from 'react'
import { cx } from './parts.js'
import { useLabels } from './label-context.js'
import { SyntaxHighlighter } from './syntax-highlighter.js'
import { ScrollArea } from './scroll-area.js'
import { CopyButton, type CopyButtonLabels } from './copy-button.js'
export {
  CopyButton,
  type CopyButtonLabels,
  type CopyButtonProps,
} from './copy-button.js'

export type CodeBlockProps = Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'children' | 'onCopy'
> & {
  code: string
  label?: string
  language?: string
  wrap?: boolean
  /** The copy button's text: the action, then the result. */
  labels?: Partial<CodeBlockLabels>
  onCopy?: (code: string) => void | Promise<void>
}
export type CodeBlockLabels = CopyButtonLabels
export const CodeBlock = function CodeBlock({
  code,
  label: ownLabel,
  language,
  wrap = false,
  labels,
  onCopy,
  className,
  ref,
  ...props
}: CodeBlockProps & { ref?: React.Ref<HTMLDivElement> }) {
  const source = React.useRef<HTMLPreElement>(null)
  const text = useLabels<CodeBlockLabels & { label: string }>('codeBlock')
  const label = ownLabel ?? text.label ?? 'Code'
  return (
    <div
      {...props}
      ref={ref}
      data-wrap={wrap || undefined}
      className={cx('surf-code-block', className)}
    >
      <div className='surf-code-toolbar'>
        <span className='surf-code-label'>
          {label}
          {language && <span className='surf-code-language'>{language}</span>}
        </span>
        <CopyButton
          className='surf-code-copy'
          value={code}
          onCopy={onCopy}
          labels={{
            copy: labels?.copy ?? text.copy ?? 'Copy code',
            copied: labels?.copied ?? text.copied,
            copyError: labels?.copyError ?? text.copyError,
          }}
          // A failed copy selects the source, so the keyboard copy shortcut works next.
          onResult={(result) => {
            if (result === 'failed' && source.current)
              window.getSelection()?.selectAllChildren(source.current)
          }}
        />
      </div>
      <ScrollArea label={label} orientation='horizontal'>
        <pre ref={source} className='surf-code-text'>
          <SyntaxHighlighter code={code} language={language} inline />
        </pre>
      </ScrollArea>
    </div>
  )
}
