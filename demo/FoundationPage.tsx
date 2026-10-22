import React, { createContext, useContext } from 'react'
import { catalog, itemHref } from './catalog'
import { codeText } from './codeText'
import { useCatalogText } from './catalogText'
import { useMessages } from './i18n'
import { Link } from './router'

const sectionTitles = createContext<Record<string, string>>({})

/**
 * The shape every foundation page shares (docs/writing.md, Foundation pages):
 * the table of contents, the principles, the page's own sections, then related pages.
 * Sections take their headings from `sections`, so a heading and its contents link
 * always read the same.
 */
export function FoundationPage({
  principles,
  sections,
  related,
  children,
}: {
  /** Each principle as [a bold imperative, one sentence of reason], in codeText markup. */
  principles: readonly (readonly string[])[]
  /** Section headings by id, in page order. */
  sections: Record<string, string>
  /** Catalog paths of the pages that own the neighboring rules. */
  related: readonly string[]
  children: React.ReactNode
}) {
  const messages = useMessages()
  const text = useCatalogText()
  const { principles: principlesTitle, related: relatedTitle } =
    messages.foundationPage
  return (
    <sectionTitles.Provider value={sections}>
      <nav className='page-toc' aria-label={messages.onThisPage}>
        {[
          ['principles', principlesTitle],
          ...Object.entries(sections),
          ['related', relatedTitle],
        ].map(([id, label]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>
      <section id='principles'>
        <h2>{principlesTitle}</h2>
        <ul className='catalog-rules'>
          {principles.map(([rule, reason]) => (
            <li key={rule}>
              <strong>{codeText(rule)}</strong> {codeText(reason)}
            </li>
          ))}
        </ul>
      </section>
      {children}
      <section id='related'>
        <h2>{relatedTitle}</h2>
        <ul className='catalog-rules'>
          {related.map((href) => {
            const item = catalog.find((entry) => itemHref(entry) === href)
            if (!item) throw new Error(`No catalog page at ${href}`)
            return (
              <li key={href}>
                <Link href={href}>{text.name(item)}</Link>
                {' — '}
                {text.summary(item)}
              </li>
            )
          })}
        </ul>
      </section>
    </sectionTitles.Provider>
  )
}

/** A foundation section, headed by its title in the page's `sections`. */
export function FoundationSection({
  id,
  children,
  ...props
}: { id: string; children: React.ReactNode } & Omit<
  React.ComponentPropsWithoutRef<'section'>,
  'id' | 'children'
>) {
  const title = useContext(sectionTitles)[id]
  if (!title) throw new Error(`No section title for ${id}`)
  return (
    <section id={id} {...props}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}
