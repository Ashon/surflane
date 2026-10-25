'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { cx, skin } from './parts.js'
import { Button } from './button.js'
import { SyntaxHighlighter } from './syntax-highlighter.js'
import { ScrollArea } from './scroll-area.js'

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
export type CodeBlockLabels = {
  copy: string
  copied: string
  copyError: string
}
export type CopyButtonLabels = CodeBlockLabels
export type CopyButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  'children' | 'onClick' | 'onCopy' | 'value'
> & {
  /** What to copy: the text, or a function that returns it when pressed. */
  value: string | (() => string | Promise<string>)
  /** The button's text: the action, then the result. */
  labels?: Partial<CopyButtonLabels>
  /** Copies instead of the clipboard write; throw to report a failure. */
  onCopy?: (text: string) => void | Promise<void>
  /** Hears each outcome, such as to select the source after a failure. */
  onResult?: (result: 'copied' | 'failed') => void
}
const copyIcons = { idle: 'copy', copied: 'check', failed: 'alert' } as const
// Feedback stays inside the button and returns to the action after this long.
const copyFeedbackDuration = 2000
/** Copies text and says what happened in its own label: the result replaces the
 * action in place, as a polite live region, then the action returns after 2s.
 * The button is as wide as its longest label, so nothing around it moves. */
export const CopyButton = function CopyButton({
  value,
  labels,
  onCopy,
  onResult,
  variant = 'outline',
  size = 'small',
  className,
  ref,
  ...props
}: CopyButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const copyLabel = labels?.copy ?? 'Copy'
  const copiedLabel = labels?.copied ?? 'Copied'
  const copyErrorLabel = labels?.copyError ?? 'Copy unavailable'
  const [state, setState] = React.useState<
    'idle' | 'busy' | 'copied' | 'failed'
  >('idle')
  // After the first copy, each change of label fades in; the first render does not.
  const [used, setUsed] = React.useState(false)
  const revision = React.useRef(0),
    mounted = React.useRef(false),
    timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      revision.current++
      clearTimeout(timer.current)
    }
  }, [])
  // New text clears a result, and a late answer for the old text is dropped.
  const source = typeof value === 'string' ? value : null
  React.useEffect(() => {
    revision.current++
    clearTimeout(timer.current)
    setState('idle')
  }, [source])
  async function copy() {
    const request = ++revision.current
    clearTimeout(timer.current)
    setUsed(true)
    setState('busy')
    let outcome: 'copied' | 'failed'
    try {
      const text = typeof value === 'string' ? value : await value()
      if (onCopy) await onCopy(text)
      else await navigator.clipboard.writeText(text)
      outcome = 'copied'
    } catch {
      outcome = 'failed'
    }
    if (!mounted.current || request !== revision.current) return
    setState(outcome)
    onResult?.(outcome)
    timer.current = setTimeout(() => {
      if (mounted.current && request === revision.current) setState('idle')
    }, copyFeedbackDuration)
  }
  const icon = state === 'copied' || state === 'failed' ? state : 'idle'
  return (
    <Button
      {...props}
      ref={ref}
      type='button'
      variant={variant}
      size={size}
      className={skin('surf-copy-button', className)}
      onClick={copy}
      // A pending copy blocks a second start but keeps focus on the button.
      disabled={state === 'busy'}
      focusableWhenDisabled
      aria-busy={state === 'busy' || undefined}
      data-copy-state={icon === 'idle' ? undefined : icon}
      data-copy-used={used || undefined}
    >
      <Icon key={icon} name={copyIcons[icon]} className='surf-copy-icon' />
      {/* Every label holds the same cell, so the button is as wide as the longest;
          only the current one shows. It is the result: screen readers hear it
          change in place. */}
      <span className='surf-copy-text'>
        <span aria-live='polite'>
          <span key={icon} className='surf-copy-label'>
            {state === 'copied'
              ? copiedLabel
              : state === 'failed'
                ? copyErrorLabel
                : copyLabel}
          </span>
        </span>
        {/* Drawn as generated content, so the room adds no text to the button. */}
        {[copyLabel, copiedLabel, copyErrorLabel].map((label, index) => (
          <span
            key={index}
            className='surf-copy-room'
            data-label={label}
            aria-hidden='true'
          />
        ))}
      </span>
    </Button>
  )
}
export const CodeBlock = function CodeBlock({
  code,
  label = 'Code',
  language,
  wrap = false,
  labels,
  onCopy,
  className,
  ref,
  ...props
}: CodeBlockProps & { ref?: React.Ref<HTMLDivElement> }) {
  const source = React.useRef<HTMLPreElement>(null)
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
          labels={{ ...labels, copy: labels?.copy ?? 'Copy code' }}
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
