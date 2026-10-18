import React, { useEffect, useState } from 'react'
import catalog from '@surflane/design-tokens/catalog.json'
import { Input, Select, Button, Text } from '@surflane/ui'
function useResolvedTokens() {
  const [values, setValues] = useState<Record<string, string>>({})
  useEffect(() => {
    const update = () => {
      const css = getComputedStyle(document.documentElement)
      setValues(
        Object.fromEntries(
          catalog.tokens.map((token) => [
            token.name,
            css.getPropertyValue(token.name).trim(),
          ]),
        ),
      )
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    window.addEventListener('resize', update)
    const media = matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
      media.removeEventListener('change', update)
    }
  }, [])
  return values
}
export function TokenBrowser({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery),
    [category, setCategory] = useState('all'),
    [limit, setLimit] = useState(24),
    [message, setMessage] = useState('')
  useEffect(() => {
    setQuery(initialQuery)
    setCategory('all')
    setLimit(24)
  }, [initialQuery])
  const values = useResolvedTokens()
  const tokens = catalog.tokens.filter(
    (token) =>
      (category === 'all' || token.category === category) &&
      [token.name, token.description, ...token.aliases]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase()),
  )
  const changeQuery = (value: string) => {
    setQuery(value)
    setLimit(24)
    setMessage('')
  }
  return (
    <section aria-labelledby='tokens-title' id='tokens'>
      <h2 id='tokens-title'>Design tokens</h2>
      <Text color='secondary'>
        {catalog.tokens.length} tokens generated from the CSS source. Search by
        name, role or reference, and see the computed value for the current
        theme and screen size.
      </Text>
      <div className='foundation-controls'>
        <label>
          Search
          <Input
            aria-label='Search design tokens'
            placeholder='e.g. --ink, typography, dialog'
            value={query}
            onChange={(e) => changeQuery(e.target.value)}
          />
        </label>
        <label>
          Category
          <Select
            aria-label='Token category'
            value={category}
            onValueChange={(value) => {
              setCategory(value)
              setLimit(24)
              setMessage('')
            }}
            options={[
              { value: 'all', label: 'All categories' },
              ...catalog.categories.map((value) => ({ value, label: value })),
            ]}
          />
        </label>
      </div>
      <Text variant='caption' color='muted' aria-live='polite'>
        {tokens.length} matching tokens / {Math.min(limit, tokens.length)} shown
      </Text>
      <div className='token-list'>
        {tokens.slice(0, limit).map((token) => (
          <article
            className='token-row'
            key={token.name}
            data-token={token.name}
          >
            <div className='token-identity'>
              <span
                className={'token-preview token-preview--' + token.type}
                aria-hidden='true'
                style={
                  token.type === 'color'
                    ? { background: `var(${token.name})` }
                    : token.type === 'shadow'
                      ? { boxShadow: `var(${token.name})` }
                      : undefined
                }
              >
                {token.type === 'typography'
                  ? 'Aa'
                  : token.type === 'duration'
                    ? 'ms'
                    : ''}
              </span>
              <div>
                <Text as='div' variant='mono'>
                  {token.name}
                </Text>
                <Text variant='caption' color='muted'>
                  {token.category}
                  {token.description ? ' / ' + token.description : ''}
                </Text>
              </div>
            </div>
            <div className='token-value'>
              <Text as='div' variant='mono' data-testid='resolved-value'>
                {values[token.name] || '…'}
              </Text>
              <details>
                <summary>Source and references</summary>
                {token.variants.map((v, i) => (
                  <div key={i}>
                    <Text variant='caption' color='muted'>
                      {v.context}
                    </Text>
                    <code>{v.value}</code>
                    <Text variant='caption' color='muted'>
                      {v.file}:{v.line}
                    </Text>
                  </div>
                ))}
                {token.aliases.length > 0 && (
                  <div className='token-aliases'>
                    {token.aliases.map((alias) => (
                      <button
                        type='button'
                        key={alias}
                        onClick={() => {
                          setCategory('all')
                          changeQuery(alias)
                        }}
                      >
                        {alias}
                      </button>
                    ))}
                  </div>
                )}
              </details>
            </div>
            <Button
              variant='outline'
              size='sm'
              aria-label={`Copy ${token.name}`}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(`var(${token.name})`)
                  setMessage(`Copied ${token.name}`)
                } catch {
                  setMessage(
                    `Clipboard unavailable. Copy this reference: var(${token.name})`,
                  )
                }
              }}
            >
              Copy
            </Button>
          </article>
        ))}
      </div>
      {tokens.length === 0 && (
        <Text color='secondary'>
          No matching tokens. Try a different search term or category.
        </Text>
      )}
      {tokens.length > limit && (
        <Button variant='outline' onClick={() => setLimit(limit + 24)}>
          Show more tokens
        </Button>
      )}
      <p className='token-feedback' role='status'>
        {message}
      </p>
      <Text variant='caption' color='muted'>
        Don't copy raw values into product code; reference them with{' '}
        <code>var(--token-name)</code>. Use semantic tokens for color and
        status, and scale tokens for size and spacing.
      </Text>
    </section>
  )
}
