'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { cx } from './parts.js'
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
  copyLabel?: string
  copiedLabel?: string
  copyErrorLabel?: string
  onCopy?: (code: string) => void | Promise<void>
}
const copyIcons = { idle: 'copy', copied: 'check', failed: 'alert' } as const
// Feedback stays inside the copy button and returns to the action after this long.
const copyFeedbackDuration = 2000
export const CodeBlock = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  CodeBlockProps
>(function CodeBlock(
  {
    code,
    label = 'Code',
    language,
    wrap = false,
    copyLabel = 'Copy code',
    copiedLabel = 'Copied',
    copyErrorLabel = 'Copy unavailable',
    onCopy,
    className,
    ...props
  },
  ref,
) {
  const [state, setState] = React.useState<
    'idle' | 'busy' | 'copied' | 'failed'
  >('idle')
  // After the first copy, each change of label fades in; the first render does not.
  const [used, setUsed] = React.useState(false)
  const revision = React.useRef(0),
    mounted = React.useRef(false),
    timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const button = React.useRef<HTMLButtonElement>(null),
    source = React.useRef<HTMLPreElement>(null)
  React.useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      revision.current++
      clearTimeout(timer.current)
    }
  }, [])
  React.useEffect(() => {
    revision.current++
    clearTimeout(timer.current)
    setState('idle')
  }, [code])
  const resting = React.useRef(true)
  resting.current = state === 'idle'
  // The button keeps its resting width, so the feedback never moves the toolbar.
  React.useLayoutEffect(() => {
    const element = button.current
    if (!element || state !== 'idle') return
    const measure = () => {
      element.style.minInlineSize = ''
      element.style.minInlineSize = `${element.getBoundingClientRect().width}px`
    }
    measure()
    // Fonts can finish loading after a copy; the result label must not set the width.
    document.fonts?.ready.then(() => {
      if (mounted.current && resting.current) measure()
    })
  }, [copyLabel, state])
  async function copy() {
    const request = ++revision.current
    clearTimeout(timer.current)
    setUsed(true)
    setState('busy')
    let outcome: 'copied' | 'failed'
    try {
      if (onCopy) await onCopy(code)
      else await navigator.clipboard.writeText(code)
      outcome = 'copied'
    } catch {
      outcome = 'failed'
    }
    if (!mounted.current || request !== revision.current) return
    setState(outcome)
    // A failed copy selects the source, so the keyboard copy shortcut works next.
    if (outcome === 'failed' && source.current)
      window.getSelection()?.selectAllChildren(source.current)
    timer.current = setTimeout(() => {
      if (mounted.current && request === revision.current) setState('idle')
    }, copyFeedbackDuration)
  }
  const icon = state === 'copied' || state === 'failed' ? state : 'idle'
  return (
    <div
      {...props}
      ref={ref}
      data-wrap={wrap || undefined}
      className={cx('pui-code-block', className)}
    >
      <div className='pui-code-toolbar'>
        <span className='pui-code-label'>
          {label}
          {language && <span className='pui-code-language'>{language}</span>}
        </span>
        <Button
          ref={button}
          type='button'
          variant='outline'
          size='small'
          className='pui-code-copy'
          onClick={copy}
          // A pending copy blocks a second start but keeps focus on the button.
          disabled={state === 'busy'}
          focusableWhenDisabled
          aria-busy={state === 'busy' || undefined}
          data-copy-state={icon === 'idle' ? undefined : icon}
          data-copy-used={used || undefined}
        >
          <Icon
            key={icon}
            name={copyIcons[icon]}
            className='pui-code-copy-icon'
          />
          {/* The label is the result: screen readers hear it change in place. */}
          <span aria-live='polite'>
            <span key={icon} className='pui-code-copy-label'>
              {state === 'copied'
                ? copiedLabel
                : state === 'failed'
                  ? copyErrorLabel
                  : copyLabel}
            </span>
          </span>
        </Button>
      </div>
      <ScrollArea label={label} orientation='horizontal'>
        <pre ref={source} className='pui-code-text'>
          <SyntaxHighlighter code={code} language={language} inline />
        </pre>
      </ScrollArea>
    </div>
  )
})
