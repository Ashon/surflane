'use client'
import * as React from 'react'
import {
  SyntaxEngineContext,
  provideTokens,
  requestTokens,
} from './syntax-context.js'
import type { SyntaxToken } from './syntax-engine.js'

// The engine and each grammar load on first use, in their own chunks.
const load = () => import('./syntax-engine.js')
const sources = {
  plain: { load, suspense: false },
  suspense: { load, suspense: true },
}

/**
 * Turns on syntax highlighting for CodeBlock, SyntaxHighlighter and Markdown inside it.
 * Requires the optional `shiki` package; without this provider, code renders as plain text.
 * Code shows as plain text until its tokens arrive. With `suspense`, each block waits
 * for them behind its own Suspense boundary instead, so a server render writes it
 * highlighted and hydration keeps that HTML. Nothing around a block suspends.
 */
export function SyntaxHighlighting({
  children,
  suspense = false,
}: {
  children?: React.ReactNode
  suspense?: boolean
}) {
  return (
    <SyntaxEngineContext.Provider
      value={suspense ? sources.suspense : sources.plain}
    >
      {children}
    </SyntaxEngineContext.Provider>
  )
}

/**
 * Reads the tokens of the server-rendered code under `root` from its HTML, so
 * hydration needs neither the engine nor a grammar. With `suspense`, await it before
 * `hydrateRoot`: every block then hydrates at once, so no boundary is left waiting for
 * its tokens, where a context change above it would make React drop the highlighted
 * HTML for the plain fallback. A block whose HTML doesn't read back as its code is
 * highlighted again.
 */
export function preloadSyntaxHighlighting(root: ParentNode = document) {
  return Promise.all(
    Array.from(
      root.querySelectorAll<HTMLElement>(
        'code.pui-syntax[data-highlighted="true"]',
      ),
      (code) => {
        const text = code.textContent ?? ''
        const language = code.dataset.language!
        const tokens = readTokens(code, text)
        if (tokens) provideTokens(text, language, tokens)
        else return requestTokens(load, text, language)
      },
    ),
  ).then(() => undefined)
}
// SyntaxHighlighter writes a line's tokens as spans and ends it with its line break.
function readTokens(code: HTMLElement, text: string) {
  const lines: SyntaxToken[][] = [[]]
  let read = ''
  for (const node of code.childNodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const content = node.textContent ?? ''
      lines[lines.length - 1]!.push({
        content,
        role: (node as HTMLElement).dataset.syntax ?? '',
      })
      read += content
    } else if (node.nodeType === Node.TEXT_NODE) {
      const breaks = node.textContent ?? ''
      if (!/^(\r\n|\n|\r)*$/.test(breaks)) return null
      const count = breaks.match(/\r\n|\n|\r/g)?.length ?? 0
      for (let line = 0; line < count; line++) lines.push([])
      read += breaks
    }
  }
  return read === text ? lines : null
}
