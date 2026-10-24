import React, { useEffect, useState } from 'react'
import catalog from '@surflane/design-tokens/catalog.json'
import { Input, Select, Button, Text } from '@surflane/ui'
import { codeText } from './codeText'
import { FoundationPage, FoundationSection } from './FoundationPage'
import { useLocale } from './i18n'
import { useLocation } from './router'
import { text } from './i18n/pages/TokenBrowser'
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
/** The token browser alone, as the foundation lab embeds it. */
export function TokenBrowser() {
  const t = text[useLocale().locale]
  return (
    <section aria-labelledby='tokens-title' id='tokens'>
      <h2 id='tokens-title'>{t.title}</h2>
      <Text color='secondary'>{t.intro(catalog.tokens.length)}</Text>
      <Browser initialQuery='' />
    </section>
  )
}
/** The /tokens foundation page, opened on the query from its URL. */
export function TokenPage() {
  const t = text[useLocale().locale]
  // A prerendered page has no query, so a ?q= link applies once the page is live.
  const initialQuery =
    new URL(useLocation(), 'http://catalog').searchParams.get('q') ?? ''
  return (
    <FoundationPage
      principles={t.principles}
      sections={t.sections}
      related={[
        '/foundations/themes',
        '/foundations/color',
        '/foundations/layout',
        '/foundations/typography',
      ]}
    >
      <FoundationSection id='reading'>
        {t.reading.map((paragraph) => (
          <p key={paragraph}>{codeText(paragraph)}</p>
        ))}
      </FoundationSection>
      <FoundationSection id='tokens'>
        <Text color='secondary'>{t.intro(catalog.tokens.length)}</Text>
        <Browser initialQuery={initialQuery} />
      </FoundationSection>
    </FoundationPage>
  )
}
function Browser({ initialQuery }: { initialQuery: string }) {
  const t = text[useLocale().locale]
  const [query, setQuery] = useState(initialQuery),
    [category, setCategory] = useState('all'),
    [limit, setLimit] = useState(24),
    // The copy result shows in the token's own button, then returns to the action.
    [copied, setCopied] = useState<{ name: string; ok: boolean } | null>(null),
    [used, setUsed] = useState(false)
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(null), 2000)
    return () => clearTimeout(timer)
  }, [copied])
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
    setCopied(null)
  }
  return (
    <>
      <div className='foundation-controls'>
        <label>
          {t.search}
          <Input
            aria-label={t.searchAriaLabel}
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(e) => changeQuery(e.target.value)}
          />
        </label>
        <label>
          {t.category}
          <Select
            aria-label={t.categoryAriaLabel}
            value={category}
            onValueChange={(value) => {
              setCategory(value)
              setLimit(24)
              setCopied(null)
            }}
            options={[
              { value: 'all', label: t.allCategories },
              ...catalog.categories.map((value) => ({ value, label: value })),
            ]}
          />
        </label>
      </div>
      <Text variant='caption' color='muted' aria-live='polite'>
        {t.count(tokens.length, Math.min(limit, tokens.length))}
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
                <summary>{t.sourceAndReferences}</summary>
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
              size='small'
              className='token-copy'
              data-copy-used={used || undefined}
              aria-label={t.copyLabel(token.name)}
              data-copy-state={
                copied?.name === token.name
                  ? copied.ok
                    ? 'copied'
                    : 'failed'
                  : undefined
              }
              onClick={async () => {
                let ok = true
                try {
                  await navigator.clipboard.writeText(`var(${token.name})`)
                } catch {
                  ok = false
                }
                setUsed(true)
                setCopied({ name: token.name, ok })
              }}
            >
              <span aria-live='polite'>
                <span
                  key={copied?.name === token.name ? String(copied.ok) : 'idle'}
                  className='surf-code-copy-label'
                >
                  {copied?.name !== token.name
                    ? t.copy
                    : copied.ok
                      ? t.copied
                      : t.unavailable}
                </span>
              </span>
            </Button>
          </article>
        ))}
      </div>
      {tokens.length === 0 && <Text color='secondary'>{t.noMatching}</Text>}
      {tokens.length > limit && (
        <Button variant='outline' onClick={() => setLimit(limit + 24)}>
          {t.showMore}
        </Button>
      )}
    </>
  )
}
