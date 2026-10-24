'use client'
import * as React from 'react'
import { ScrollArea } from './scroll-area.js'
import { SyntaxEngineContext, requestTokens } from './syntax-context.js'
import type { SyntaxToken } from './syntax-engine.js'
import { cx } from './parts.js'
export const syntaxLanguages = [
  'tsx',
  'jsx',
  'typescript',
  'javascript',
  'css',
  'html',
  'json',
  'bash',
  'yaml',
  'python',
  'sql',
  'markdown',
  'text',
] as const
const aliases: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  sh: 'bash',
  shell: 'bash',
  yml: 'yaml',
  py: 'python',
  md: 'markdown',
  xml: 'html',
  plaintext: 'text',
  txt: 'text',
}
function Highlighted({
  tokens,
  render,
}: {
  tokens: Promise<SyntaxToken[][] | null>
  render: (tokens: SyntaxToken[][] | null) => React.ReactNode
}) {
  return render(React.use(tokens))
}
export type SyntaxHighlighterProps = Omit<
  React.ComponentPropsWithoutRef<'code'>,
  'children'
> & {
  code: string
  language?: string
  inline?: boolean
  label?: string
  wrap?: boolean
}
/**
 * Rendering remains selectable React text; it never inserts executable HTML. Tokens are
 * colored inside a SyntaxHighlighting provider; without one, the code renders plain.
 */
export const SyntaxHighlighter = function SyntaxHighlighter({
  code,
  language = 'text',
  inline = false,
  label = 'Highlighted source',
  wrap = false,
  className,
  ref,
  ...props
}: SyntaxHighlighterProps & { ref?: React.Ref<HTMLElement> }) {
  const source = React.useContext(SyntaxEngineContext)
  const name = language.trim().toLowerCase()
  const lang = aliases[name] ?? name
  const highlightable =
    source !== null &&
    lang !== 'text' &&
    syntaxLanguages.includes(lang as (typeof syntaxLanguages)[number]) &&
    code.length <= 50000
  // Without suspense, code shows plain until an effect brings its tokens.
  const [result, setResult] = React.useState<{
    code: string
    language: string
    tokens: SyntaxToken[][] | null
  }>()
  // A block waits only for the code it mounted with. Code that changes later is
  // highlighted in place, so a boundary never hides shown code behind its fallback.
  const [first] = React.useState(() => ({ code, lang }))
  const suspense =
    highlightable &&
    source.suspense &&
    first.code === code &&
    first.lang === lang
  React.useEffect(() => {
    if (!highlightable || suspense) return
    let live = true
    void requestTokens(source.load, code, lang).then((tokens) => {
      if (live) setResult({ code, language: lang, tokens })
    })
    return () => {
      live = false
    }
  }, [code, lang, source, highlightable, suspense])
  const render = (tokens: SyntaxToken[][] | null) => {
    const eols = code.match(/\r\n|\n|\r/g) ?? []
    const valid = tokens && tokens.length === eols.length + 1
    return (
      <code
        {...props}
        ref={ref}
        className={cx('surf-syntax', className)}
        data-language={lang}
        data-highlighted={valid ? 'true' : 'false'}
      >
        {valid
          ? tokens.map((line, i) => (
              <React.Fragment key={i}>
                {line.map((token, j) => (
                  <span key={j} data-syntax={token.role}>
                    {token.content}
                  </span>
                ))}
                {eols[i] ?? ''}
              </React.Fragment>
            ))
          : code}
      </code>
    )
  }
  // With suspense, the block waits for its tokens behind its own boundary, plain
  // meanwhile: a server render writes it highlighted and hydration keeps that HTML,
  // while a block that appears later never suspends anything around it.
  const element = suspense ? (
    <React.Suspense fallback={render(null)}>
      <Highlighted
        tokens={requestTokens(source.load, code, lang)}
        render={render}
      />
    </React.Suspense>
  ) : (
    render(
      result?.code === code && result.language === lang ? result.tokens : null,
    )
  )
  return inline ? (
    element
  ) : (
    <ScrollArea
      label={label}
      orientation='horizontal'
      rootClassName='surf-syntax-scroll'
    >
      <pre className='surf-syntax-pre' data-wrap={wrap || undefined}>
        {element}
      </pre>
    </ScrollArea>
  )
}
