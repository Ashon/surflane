import React, { useState } from 'react'
import {
  Card,
  CodeBlock,
  Pagination,
  Button,
  List,
  StatusBadge,
  Input,
} from '@surflane/ui'
export { contentExampleIds } from './exampleGroups'
const task = `# Local preview — no remote resources are created\nname: platform-api\nenvironment: demo-main\nchecks:\n  - access.identity-control\n  - access.env-allow\n  - access.env-deny\nlabels:\n  purpose: "한글과 공백을 보존하는 실행 예제"\n  reference: "https://demo.example.invalid/api/deployments/environments/staging/projects/demo-e2e-01/build-logs?include=identity,roles,permissions,service-endpoints"\n`
const runs = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: `Pipeline run ${String(i + 1).padStart(2, '0')}`,
}))
function PaginationExample() {
  const [page, setPage] = useState(1),
    [query, setQuery] = useState(''),
    [disabled, setDisabled] = useState(false)
  const [inspected, setInspected] = useState('')
  const filtered = runs.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase()),
  )
  const pageCount = Math.ceil(filtered.length / 4),
    rows = filtered.slice((page - 1) * 4, page * 4)
  return (
    <div className='example-stack'>
      <label>
        Find run
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPage(1)
          }}
          placeholder='Search run names'
        />
      </label>
      <List.Root aria-label='Paged pipeline runs'>
        {rows.map((row) => (
          <List.Item key={row.id}>
            <List.Content>
              <List.Title>{row.name}</List.Title>
              <List.Description>
                Local record / run-{String(row.id).padStart(2, '0')}
              </List.Description>
            </List.Content>
            <List.Actions>
              <Button
                size='sm'
                variant='outline'
                onClick={() => setInspected(`${row.name} inspected.`)}
              >
                Inspect run {row.id}
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
        aria-label='Pipeline run pages'
      />
      <p role='status'>
        {filtered.length === 0
          ? 'No matching runs.'
          : `Page ${page} of ${pageCount}. ${filtered.length} runs.`}{' '}
        {inspected}
      </p>
      <div className='actions'>
        <Button variant='outline' onClick={() => setDisabled((v) => !v)}>
          {disabled ? 'Enable pagination' : 'Disable pagination'}
        </Button>
        <Button
          variant='outline'
          onClick={() => {
            setQuery('')
            setPage(10)
          }}
        >
          Go to last page
        </Button>
      </div>
      <h3>URL navigation</h3>
      <p>
        These links keep native browser navigation. In this local example, the
        URL fragment holds the current page.
      </p>
      <Pagination
        page={2}
        pageCount={5}
        getPageHref={(n) => `#pagination-page-${n}`}
        aria-label='Documentation pages'
      />
    </div>
  )
}
export function ContentExample({ id }: { id: string }) {
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
            <Card.Description>Platform API environment</Card.Description>
          </Card.Header>
          <Card.Body>
            <p>
              Three services are ready to deploy. The environment administrator
              manages credentials.
            </p>
          </Card.Body>
          <Card.Footer>
            <StatusBadge tone='success'>Configured</StatusBadge>
            <Button
              variant='outline'
              className={() => 'content-card-action'}
              onClick={() =>
                setNotice('Environment preview opened. No remote action ran.')
              }
            >
              Inspect environment
            </Button>
          </Card.Footer>
        </Card.Root>
        <p role='status' className='example-announcement'>
          {notice}
        </p>
        <p>
          A single surface groups related information. Use a plain section for
          page structure, or List for repeated resources.
        </p>
      </div>
    )
  return (
    <div className='example-stack'>
      <div className='actions'>
        <Button variant='outline' onClick={() => setWrap((v) => !v)}>
          {wrap ? 'Keep source line breaks' : 'Wrap long lines'}
        </Button>
        <Button variant='outline' onClick={() => setRevision((v) => v + 1)}>
          Change source
        </Button>
      </div>
      <CodeBlock
        label='Runner task'
        language='YAML'
        code={`${task}revision: ${revision}\n`}
        wrap={wrap}
      />
      <CodeBlock
        label='Unavailable clipboard example'
        language='Text'
        code={
          'The source stays selectable when clipboard permission is denied.\n<script>Example text is never executed.</script>'
        }
        onCopy={async (_source: string) => {
          throw new Error('Denied in local example')
        }}
        copyLabel='Try unavailable clipboard'
      />
    </div>
  )
}
