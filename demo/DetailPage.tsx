import React, { Suspense } from 'react'
import { lazy, lazyModule } from './lazy'
import { Table, CodeBlock as SharedCodeBlock } from '@surflane/ui'
import {
  catalog,
  charts,
  componentPages,
  foundations,
  patterns,
  itemHref,
  type CatalogItem,
} from './catalog'
import type { ComponentDoc, DocText } from './componentDocs'
import { ComponentSizePreview } from './ComponentSizePreview'
import { StageLabel } from './StageLabel'
import { criteriaOf } from './catalogCriteria'
import { Link, onPreload, urlLocale } from './router'
import { useLocale, useMessages } from './i18n'
import { useCatalogText } from './catalogText'
import type { DocKo } from './i18n/docs/types'
// One module per page and language, so a page loads only its own docs.
function byId<T>(
  modules: Record<string, () => Promise<{ doc: T }>>,
  suffix: string,
) {
  return Object.fromEntries(
    Object.entries(modules).map(([path, load]) => [
      path.slice(path.lastIndexOf('/') + 1, -suffix.length),
      lazyModule(load),
    ]),
  )
}
const docs = byId(
  import.meta.glob<{ doc: ComponentDoc }>('./docs/*.en.ts'),
  '.en.ts',
)
const docsKo = byId(
  import.meta.glob<{ doc: DocKo }>('./i18n/docs/*.ko.ts'),
  '.ko.ts',
)
// A link to another page loads that page's docs ahead, so it opens whole.
const pages = new Map(catalog.map((item) => [itemHref(item), item.id]))
onPreload((path) => {
  const id = pages.get(path)
  if (!id) return
  const pending = [
    docs[id]?.preload(),
    urlLocale() === 'ko' ? docsKo[id]?.preload() : undefined,
  ].filter((request) => request !== undefined)
  return pending.length ? Promise.all(pending) : undefined
})
// Components with written guidelines and working designs, loaded with the page.
const guidelines: Partial<Record<string, React.ComponentType>> = {
  table: lazy(() => import('./TableGuidelines')),
}
function CodeBlock({
  code,
  language = 'tsx',
}: {
  code: string
  language?: string
}) {
  const messages = useMessages()
  return (
    <SharedCodeBlock
      language={language}
      code={code}
      label={messages.exampleCode}
      labels={{ ...messages.codeBlock, copy: messages.copyExample }}
    />
  )
}
function DocCopy({ text }: { text: DocText }) {
  return typeof text === 'string' ? (
    <p>{text}</p>
  ) : (
    <ul className='catalog-rules'>
      {text.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
export function DetailPage({
  item,
  toggleTheme,
}: {
  item: CatalogItem
  toggleTheme: () => void
}) {
  const messages = useMessages()
  const { locale } = useLocale()
  const text = useCatalogText()
  const doc = docs[item.id]?.read().doc
  const ko = locale === 'ko' ? docsKo[item.id]?.read().doc : undefined
  const Guidelines = guidelines[item.id]
  // Previous and next walk the pages of the reader's own section: a chart page
  // stays among the six charts, not in the middle of the component list.
  const peers =
    item.section === 'charts'
      ? charts
      : item.kind === 'component'
        ? componentPages
        : item.kind === 'pattern'
          ? patterns
          : foundations
  const current = peers.findIndex((i) => i.id === item.id),
    prev = peers[current - 1],
    next = peers[current + 1]
  return (
    <>
      <div className='component-meta'>
        <StageLabel item={item} />
        <span>{item.basis}</span>
        {item.upstream && (
          <a href={item.upstream} target='_blank' rel='noreferrer'>
            {messages.detail.baseUiReference}
          </a>
        )}
      </div>
      {item.stage === 'available' && doc ? (
        <>
          <nav className='page-toc' aria-label={messages.onThisPage}>
            {(
              [
                'preview',
                'usage',
                ...(Guidelines ? (['guidelines'] as const) : []),
                'keyboard',
                'code',
                'api',
                'tokens',
              ] as const
            ).map((id) => (
              <a key={id} href={'#' + id}>
                {messages.detail.toc[id]}
              </a>
            ))}
          </nav>
          <section id='preview'>
            <h2>{messages.detail.preview}</h2>
            <p className='catalog-preview-note'>
              {messages.detail.previewNote}
            </p>
            <ComponentSizePreview
              key={item.id}
              item={item}
              toggleTheme={toggleTheme}
            />
          </section>
          <section id='usage'>
            <h2>{messages.detail.usage}</h2>
            <DocCopy text={ko?.usage ?? doc.usage} />
            <DocCopy text={ko?.avoid ?? doc.avoid} />
            {item.kind === 'component' && (
              <p>
                {messages.detail.sizeLead}{' '}
                <code>SizeProvider size="small"</code>{' '}
                {messages.detail.sizeNote}{' '}
                <Link href='/foundations/layout#component-sizes'>
                  {messages.detail.sizeLink}
                </Link>
              </p>
            )}
            <h3>{messages.detail.anatomy}</h3>
            <p className='catalog-anatomy'>{doc.anatomy}</p>
          </section>
          {Guidelines && (
            <section id='guidelines'>
              <h2>{messages.detail.guidelines}</h2>
              <p className='catalog-preview-note'>
                {messages.detail.guidelinesNote}
              </p>
              <Suspense fallback={null}>
                <Guidelines />
              </Suspense>
            </section>
          )}
          <section id='keyboard'>
            <h2>{messages.detail.keyboard}</h2>
            <DocCopy text={ko?.keyboard ?? doc.keyboard} />
            <p>{messages.detail.accessibilityNote}</p>
          </section>
          <section id='code'>
            <h2>{messages.detail.code}</h2>
            <p>{messages.detail.codeNote}</p>
            <CodeBlock language='tsx' code={doc.code} />
          </section>
          <section id='api'>
            <h2>{messages.detail.api}</h2>
            <Table.Container
              bleed
              className='catalog-table-wrap'
              label={messages.detail.apiTable}
              orientation='horizontal'
            >
              <Table.Root>
                <Table.Caption>
                  {messages.detail.apiCaption(text.name(item))}
                </Table.Caption>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell scope='col'>
                      {messages.detail.prop}
                    </Table.HeaderCell>
                    <Table.HeaderCell scope='col'>
                      {messages.detail.contract}
                    </Table.HeaderCell>
                    <Table.HeaderCell scope='col'>
                      {messages.detail.default}
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {doc.props.map(([name, contract, value]) => (
                    <Table.Row key={name}>
                      <Table.HeaderCell scope='row'>
                        <code>{name}</code>
                      </Table.HeaderCell>
                      <Table.Cell>{ko?.props?.[name] ?? contract}</Table.Cell>
                      <Table.Cell>{value}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.Container>
            <p>{messages.detail.apiNote}</p>
          </section>
          <section id='tokens'>
            <h2>{messages.detail.tokens}</h2>
            <div className='token-reference-links'>
              {doc.tokens.map((token) => (
                <Link
                  href={'/tokens?q=' + encodeURIComponent(token)}
                  key={token}
                >
                  <code>{token}</code>
                </Link>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section>
          <h2>
            {item.stage === 'primitive'
              ? messages.detail.primitiveTitle
              : messages.detail.plannedTitle}
          </h2>
          <p>
            {item.stage === 'primitive'
              ? messages.detail.primitiveBody
              : messages.detail.plannedBody}
          </p>
          <p>{messages.detail.wave(item.phase, text.group(item.group))}</p>
          <h3>{messages.detail.checklist}</h3>
          <ul>
            {criteriaOf(item).map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p>{messages.detail.readyNote}</p>
          <Link href='/coverage'>{messages.detail.coverageLink}</Link>
        </section>
      )}
      <nav
        className='component-pagination'
        aria-label={messages.detail.related}
      >
        {prev ? (
          <Link href={itemHref(prev)}>
            {messages.detail.previous(text.name(prev))}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={itemHref(next)}>
            {messages.detail.next(text.name(next))}
          </Link>
        )}
      </nav>
    </>
  )
}
