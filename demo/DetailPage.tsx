import React from 'react'
import { Table, CodeBlock as SharedCodeBlock } from '@surflane/ui'
import {
  components,
  foundations,
  patterns,
  itemHref,
  type CatalogItem,
} from './catalog'
import { componentDocs } from './componentDocs'
import { ComponentSizePreview } from './ComponentSizePreview'
import { StageLabel } from './StageLabel'
import { Link } from './router'
function CodeBlock({
  code,
  language = 'tsx',
}: {
  code: string
  language?: string
}) {
  return (
    <SharedCodeBlock
      language={language}
      code={code}
      label='Example code'
      copyLabel='Copy example'
    />
  )
}
export function DetailPage({
  item,
  toggleTheme,
}: {
  item: CatalogItem
  toggleTheme: () => void
}) {
  const doc = componentDocs[item.id]
  const peers =
    item.kind === 'component'
      ? components
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
            Base UI reference
          </a>
        )}
      </div>
      {item.stage === 'available' && doc ? (
        <>
          <nav className='page-toc' aria-label='On this page'>
            {['preview', 'usage', 'keyboard', 'code', 'api', 'tokens'].map(
              (id) => (
                <a key={id} href={'#' + id}>
                  {id === 'api' ? 'API' : id[0].toUpperCase() + id.slice(1)}
                </a>
              ),
            )}
          </nav>
          <section id='preview'>
            <h2>Preview</h2>
            <p className='catalog-preview-note'>
              Local preview. It does not affect real accounts, environments or
              run data.
            </p>
            <ComponentSizePreview
              key={item.id}
              item={item}
              toggleTheme={toggleTheme}
            />
          </section>
          <section id='usage'>
            <h2>Usage</h2>
            <p>{doc.usage}</p>
            <p>{doc.avoid}</p>
            {item.kind === 'component' && (
              <p>
                Size: <code>SizeProvider size="small"</code> adjusts the whole
                composition. The default is Default, and the size also applies
                inside portals.{' '}
                <Link href='/foundations/layout#component-sizes'>
                  Size guidance and comparisons
                </Link>
              </p>
            )}
            <h3>Anatomy</h3>
            <p className='catalog-anatomy'>{doc.anatomy}</p>
          </section>
          <section id='keyboard'>
            <h2>Keyboard and accessibility</h2>
            <p>{doc.keyboard}</p>
            <p>
              Provide names that describe the purpose, connected error messages
              and state signals beyond color. Automated checks do not replace
              manual keyboard and assistive technology testing.
            </p>
          </section>
          <section id='code'>
            <h2>Example code</h2>
            <p>
              Shared components connect their styles through design tokens. Each
              example sets up its own composition and accessibility attributes;
              callbacks, refs and product data are defined by the calling
              screen.
            </p>
            <CodeBlock language='tsx' code={doc.code} />
          </section>
          <section id='api'>
            <h2>Key API</h2>
            <Table.Container
              className='catalog-table-wrap'
              label='Component API table'
              orientation='horizontal'
            >
              <Table.Root>
                <Table.Caption>
                  {item.name} — common wrapper props
                </Table.Caption>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell scope='col'>Prop</Table.HeaderCell>
                    <Table.HeaderCell scope='col'>Contract</Table.HeaderCell>
                    <Table.HeaderCell scope='col'>Default</Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {doc.props.map(([name, contract, value]) => (
                    <Table.Row key={name}>
                      <Table.HeaderCell scope='row'>
                        <code>{name}</code>
                      </Table.HeaderCell>
                      <Table.Cell>{contract}</Table.Cell>
                      <Table.Cell>{value}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.Container>
            <p>
              The package type declarations define the full types. The table
              above lists the main settings of the common wrapper.
            </p>
          </section>
          <section id='tokens'>
            <h2>Related tokens</h2>
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
              ? 'Primitive export; styling pending'
              : 'Implementation plan'}
          </h2>
          <p>
            {item.stage === 'primitive'
              ? 'This re-exports the original Base UI primitive. Until shared styles, examples and state testing are complete, do not treat it as a finished product component.'
              : 'A planned item tracked in coverage. The shared implementation or individual guidance and working behavior examples are still to be done.'}
          </p>
          <p>
            Wave {item.phase} / {item.group}
          </p>
          <h3>Acceptance checklist</h3>
          <ul>
            {item.criteria.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p>
            It moves to Available after it adds Preview / Usage / Keyboard /
            Code / API / Tokens to the same page structure and passes the common
            acceptance criteria above.
          </p>
          <Link href='/coverage'>Read the coverage and delivery plan</Link>
        </section>
      )}
      <nav className='component-pagination' aria-label='Related pages'>
        {prev ? (
          <Link href={itemHref(prev)}>Previous: {prev.name}</Link>
        ) : (
          <span />
        )}
        {next && <Link href={itemHref(next)}>Next: {next.name}</Link>}
      </nav>
    </>
  )
}
