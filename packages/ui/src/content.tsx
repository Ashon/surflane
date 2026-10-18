'use client'
import * as React from 'react'
import { Surface } from './foundations.js'
import { part } from './parts.js'
import { Button } from './button.js'
import { SyntaxHighlighter } from './syntax-highlighter.js'
import { ScrollArea } from './scroll-area.js'
const CardRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Surface>
>(function CardRoot({ className, padding, ...props }, ref) {
  return (
    <Surface
      {...props}
      padding={padding}
      ref={ref}
      className={['pui-card', className].filter(Boolean).join(' ')}
    />
  )
})
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<'h3'> & { level?: 2 | 3 | 4 | 5 | 6 }
>(function CardTitle({ level = 3, className, ...props }, ref) {
  return React.createElement(`h${level}`, {
    ...props,
    ref,
    className: ['pui-card-title', className].filter(Boolean).join(' '),
  })
})
export const Card = {
  Root: CardRoot,
  Header: part<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
    'div',
    'pui-card-header',
  ),
  Title: CardTitle,
  Description: part<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
    'p',
    'pui-card-description',
  ),
  Body: part<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
    'div',
    'pui-card-body',
  ),
  Footer: part<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
    'div',
    'pui-card-footer',
  ),
}
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
const copyIcons = {
  idle: (
    <>
      <rect x='8' y='8' width='12' height='12' rx='2' />
      <path d='M16 8V4H4v12h4' />
    </>
  ),
  copied: <path d='m5 12.5 4.5 4.5L19 7.5' />,
  failed: (
    <path d='M12 7v6m0 4v.01M4.5 12a7.5 7.5 0 1 0 15 0 7.5 7.5 0 0 0-15 0' />
  ),
}
// Feedback stays inside the copy button and returns to the action after this long.
const copyFeedbackDuration = 2000
export const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  function CodeBlock(
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
    // The button keeps its resting width, so the feedback never moves the toolbar.
    React.useLayoutEffect(() => {
      const element = button.current
      if (!element || state !== 'idle') return
      const measure = () => {
        element.style.minInlineSize = ''
        element.style.minInlineSize = `${element.getBoundingClientRect().width}px`
      }
      measure()
      document.fonts?.ready.then(() => {
        if (mounted.current) measure()
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
        className={['pui-code-block', className].filter(Boolean).join(' ')}
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
            size='sm'
            className='pui-code-copy'
            onClick={copy}
            disabled={state === 'busy'}
            aria-busy={state === 'busy' || undefined}
            data-copy-state={icon === 'idle' ? undefined : icon}
            data-copy-used={used || undefined}
          >
            <svg
              key={icon}
              className='pui-code-copy-icon'
              width='14'
              height='14'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.6'
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden='true'
            >
              {copyIcons[icon]}
            </svg>
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
  },
)

// Flat names for React Server Components, which cannot dot into client exports.
export { CardRoot, CardTitle }
export const {
  Header: CardHeader,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
} = Card
