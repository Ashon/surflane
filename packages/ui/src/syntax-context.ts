'use client'
import * as React from 'react'
import type { SyntaxToken } from './syntax-engine.js'

export type SyntaxEngine = {
  highlightCode(code: string, language: string): Promise<SyntaxToken[][] | null>
}
/** Loads the highlighting engine. Without a provider, code renders as plain text. */
export const SyntaxEngineContext = /* @__PURE__ */ React.createContext<
  (() => Promise<SyntaxEngine>) | null
>(null)
