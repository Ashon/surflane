import React from 'react'
import { Link } from './router'

/**
 * Renders a sentence that stays whole for translation. `--token` becomes a link to
 * the token (a wildcard such as `--surf-layer-*` stays plain code), other `code` becomes
 * code, and [label](/path) becomes a catalog link.
 */
export function codeText(text: string) {
  return text.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\))/).map((part, index) => {
    if (part.startsWith('`')) {
      const code = part.slice(1, -1)
      return code.startsWith('--') && !code.includes('*') ? (
        <Link key={index} href={`/tokens?q=${encodeURIComponent(code)}`}>
          <code>{code}</code>
        </Link>
      ) : (
        <code key={index}>{code}</code>
      )
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    return link ? (
      <Link key={index} href={link[2]}>
        {link[1]}
      </Link>
    ) : (
      part
    )
  })
}
