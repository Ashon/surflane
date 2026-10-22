'use client'
import * as React from 'react'
import { SyntaxEngineContext } from './syntax-context.js'

// The engine and each grammar load on first use, in their own chunks.
const load = () => import('./syntax-engine.js')

/**
 * Turns on syntax highlighting for CodeBlock, SyntaxHighlighter and Markdown inside it.
 * Requires the optional `shiki` package; without this provider, code renders as plain text.
 */
export function SyntaxHighlighting({
  children,
}: {
  children?: React.ReactNode
}) {
  return (
    <SyntaxEngineContext.Provider value={load}>
      {children}
    </SyntaxEngineContext.Provider>
  )
}
