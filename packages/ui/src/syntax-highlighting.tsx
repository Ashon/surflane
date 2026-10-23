'use client'
import * as React from 'react'
import { SyntaxEngineContext, requestTokens } from './syntax-context.js'

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
 * Highlights the server-rendered code under `root` before the app hydrates. With
 * `suspense`, await it before `hydrateRoot`: every block then hydrates at once, so no
 * boundary is left waiting for its tokens, where a context change above it would make
 * React drop the highlighted HTML for the plain fallback.
 */
export function preloadSyntaxHighlighting(root: ParentNode = document) {
  return Promise.all(
    Array.from(
      root.querySelectorAll<HTMLElement>(
        'code.pui-syntax[data-highlighted="true"]',
      ),
      (code) =>
        requestTokens(load, code.textContent ?? '', code.dataset.language!),
    ),
  ).then(() => undefined)
}
