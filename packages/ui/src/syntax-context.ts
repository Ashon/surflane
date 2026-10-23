'use client'
import * as React from 'react'
import type { SyntaxToken } from './syntax-engine.js'

export type SyntaxEngine = {
  highlightCode(code: string, language: string): Promise<SyntaxToken[][] | null>
}
/**
 * Loads the highlighting engine, and says whether code waits for its tokens inside
 * Suspense. Without a provider, code renders as plain text.
 */
export const SyntaxEngineContext = /* @__PURE__ */ React.createContext<{
  load: () => Promise<SyntaxEngine>
  suspense: boolean
} | null>(null)
// One request per language and code, so a render that suspended finds its tokens again.
// A settled request carries React's status and value, so use() reads it at once.
const requests = new Map<string, Promise<SyntaxToken[][] | null>>()
export function requestTokens(
  load: () => Promise<SyntaxEngine>,
  code: string,
  language: string,
) {
  const key = `${language}\n${code}`
  let pending = requests.get(key)
  if (!pending) {
    const request = load()
      .then((engine) => engine.highlightCode(code, language))
      .catch(() => null)
    void request.then((tokens) =>
      Object.assign(request, { status: 'fulfilled', value: tokens }),
    )
    pending = request
    requests.set(key, pending)
    if (requests.size > 500) requests.delete(requests.keys().next().value!)
  }
  return pending
}
