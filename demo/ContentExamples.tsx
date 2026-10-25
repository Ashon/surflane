import React, { useState } from 'react'
import {
  Card,
  Pagination,
  Button,
  List,
  StatusBadge,
  Input,
  CopyButton,
} from '@surflane/ui'
import { CatalogCodeBlock as CodeBlock } from './CatalogCodeBlock'
import { useLocale, useMessages } from './i18n'
import { text } from './i18n/pages/ContentExamples'
export { contentExampleIds } from './exampleGroups'
const task = `# Local preview — no remote resources are created\nname: platform-api\nenvironment: demo-main\nchecks:\n  - access.identity-control\n  - access.env-allow\n  - access.env-deny\nlabels:\n  purpose: "한글과 공백을 보존하는 실행 예제"\n  reference: "https://demo.example.invalid/api/deployments/environments/staging/projects/demo-e2e-01/build-logs?include=identity,roles,permissions,service-endpoints"\n`
function PaginationExample() {
  const t = text[useLocale().locale]
  const messages = useMessages()
  const [page, setPage] = useState(1),
    [query, setQuery] = useState(''),
    [disabled, setDisabled] = useState(false)
  const [inspected, setInspected] = useState('')
  const runs = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    name: t.pipelineRunName(String(i + 1).padStart(2, '0')),
  }))
  const filtered = runs.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase()),
  )
  const pageCount = Math.ceil(filtered.length / 4),
    rows = filtered.slice((page - 1) * 4, page * 4)
  return (
    <div className='example-stack'>
      <label>
        {t.findRun}
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPage(1)
          }}
          placeholder={t.searchRunNames}
        />
      </label>
      <List.Root aria-label={t.pagedPipelineRuns}>
        {rows.map((row) => (
          <List.Item key={row.id}>
            <List.Content>
              <List.Title>{row.name}</List.Title>
              <List.Description>{t.localRecord(row.id)}</List.Description>
            </List.Content>
            <List.Actions>
              <Button
                size='small'
                variant='outline'
                onClick={() => setInspected(t.inspected(row.name))}
              >
                {t.inspectRun(row.id)}
              </Button>
            </List.Actions>
          </List.Item>
        ))}
      </List.Root>
      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        disabled={disabled}
        aria-label={t.pipelineRunPages}
        labels={messages.pagination}
      />
      <p role='status'>
        {filtered.length === 0
          ? t.noMatchingRuns
          : t.status(page, pageCount, filtered.length)}{' '}
        {inspected}
      </p>
      <div className='actions'>
        <Button variant='outline' onClick={() => setDisabled((v) => !v)}>
          {disabled ? t.enablePagination : t.disablePagination}
        </Button>
        <Button
          variant='outline'
          onClick={() => {
            setQuery('')
            setPage(10)
          }}
        >
          {t.goToLastPage}
        </Button>
      </div>
      <h3>{t.urlNavigation}</h3>
      <p>{t.urlNavigationParagraph}</p>
      <Pagination
        page={2}
        pageCount={5}
        getPageHref={(n) => `#pagination-page-${n}`}
        aria-label={t.documentationPages}
        labels={messages.pagination}
      />
    </div>
  )
}
export function ContentExample({ id }: { id: string }) {
  const t = text[useLocale().locale]
  const messages = useMessages()
  const [wrap, setWrap] = useState(false),
    [revision, setRevision] = useState(1),
    [notice, setNotice] = useState('')
  if (id === 'pagination') return <PaginationExample />
  if (id === 'card')
    return (
      <div className='example-stack'>
        <Card.Root aria-labelledby='card-environment-title'>
          <Card.Header>
            <Card.Title id='card-environment-title'>DEMO main</Card.Title>
            <Card.Description>{t.platformApiEnvironment}</Card.Description>
          </Card.Header>
          <Card.Body>
            <p>{t.cardBodyText}</p>
          </Card.Body>
          <Card.Footer>
            <StatusBadge tone='success'>{t.configured}</StatusBadge>
            <Button
              variant='outline'
              className={() => 'content-card-action'}
              onClick={() => setNotice(t.environmentPreviewOpened)}
            >
              {t.inspectEnvironment}
            </Button>
          </Card.Footer>
        </Card.Root>
        <p role='status' className='example-announcement'>
          {notice}
        </p>
        <p>{t.cardFooterText}</p>
      </div>
    )
  return (
    <div className='example-stack'>
      <div className='actions'>
        <Button variant='outline' onClick={() => setWrap((v) => !v)}>
          {wrap ? t.keepSourceLineBreaks : t.wrapLongLines}
        </Button>
        <Button variant='outline' onClick={() => setRevision((v) => v + 1)}>
          {t.changeSource}
        </Button>
      </div>
      <CodeBlock
        label={t.runnerTask}
        language='YAML'
        code={`${task}revision: ${revision}\n`}
        wrap={wrap}
      />
      <CodeBlock
        label={t.unavailableClipboardExample}
        language='Text'
        code={
          'The source stays selectable when clipboard permission is denied.\n<script>Example text is never executed.</script>'
        }
        onCopy={async (_source: string) => {
          throw new Error(t.deniedInLocalExample)
        }}
        labels={{ copy: t.tryUnavailableClipboard }}
      />
      {/* CopyButton on its own: the same action and result beside any value. */}
      <div className='actions'>
        <code>npm install @surflane/ui</code>
        <CopyButton
          value='npm install @surflane/ui'
          labels={{ ...messages.codeBlock, copy: t.copyInstallCommand }}
        />
      </div>
    </div>
  )
}
