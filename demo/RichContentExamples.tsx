import React, { useState } from 'react'
import {
  Stack,
  Inline,
  SegmentedControl,
  Text,
  Button,
  Field,
  NativeSelect,
  ScrollArea,
  SyntaxHighlighter,
  Textarea,
  Toggle,
} from '@surflane/ui'
import { Markdown } from '@surflane/ui/markdown'
import { useLocale } from './i18n'
import { text } from './i18n/pages/RichContentExamples'
const examples: Record<string, string> = {
  tsx: `import { Button } from '@surflane/ui'

// Built from the same design tokens.
export function RunAction() {
  const count = 3
  return <Button disabled={count === 0}>Deploy service</Button>
}
`,
  css: '.workspace {\n  color: var(--surf-ink-body);\n  padding: 24px;\n  background: var(--surf-canvas);\n}\n',
  yaml: 'name: platform-api\nenvironment: staging\nretries: 3\nenabled: true\n# Keep credentials outside source control.\n',
  json: '{\n  "name": "Platform workspace",\n  "available": true,\n  "environments": ["staging", "production"]\n}\n',
  bash: '# Inspect the local example\nnpm run build:catalog\nprintf "%s\\n" "Build complete"\n',
  unsupported:
    '<script>Source text remains readable and never executes.</script>\n한글과 English stay selectable.\n',
}
export const markdownExampleSource = `# Deployment

Review **deployment results** in a shared design language. Jump to [Results](#results) or review the [design tokens](/tokens). The inline identifier is \`service_id\`.

> Never convey status with color alone; provide a label and context with it.

## Results

| Environment | Status | Runs |
| :--- | :--- | ---: |
| Staging | Passed | 12 |
| Production | Needs review | 3 |

- [x] Review the build logs
- [ ] Confirm the next action

### Example code

\`\`\`tsx
import { Button } from '@surflane/ui'

<Button onClick={inspect}>Inspect logs</Button>
\`\`\`

\`\`\`yaml
environment: staging
retries: 3
\`\`\`

~~Outdated guidance~~ is replaced by the current documentation.[^scope]

[^scope]: This is a local rendering example.
`
export function RichContentExample({ id }: { id: string }) {
  const t = text[useLocale().locale]
  const [language, setLanguage] = useState('tsx')
  const [code, setCode] = useState(examples.tsx)
  const [source, setSource] = useState(markdownExampleSource)
  const [wrap, setWrap] = useState(false)
  const [duplicate, setDuplicate] = useState(false)
  const [view, setView] = useState('split')
  if (id === 'markdown')
    return (
      <Stack gap={5}>
        <Inline justify='between' gap={3}>
          <SegmentedControl.Root
            aria-label={t.markdownView}
            value={view}
            onValueChange={setView}
          >
            {[
              ['split', t.sideBySide],
              ['source', t.source],
              ['preview', t.preview],
            ].map(([value, label]) => (
              <SegmentedControl.Item key={value} value={value}>
                {label}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
          <Text as='span' variant='caption' color='muted'>
            {t.editSourceToUpdatePreview}
          </Text>
        </Inline>
        <div className='markdown-workbench' data-view={view}>
          <div className='markdown-source-pane' hidden={view === 'preview'}>
            <div className='markdown-pane-heading'>
              <label htmlFor='markdown-source'>{t.markdownSource}</label>
              <Text as='span' variant='caption' color='muted'>
                {t.markdown}
              </Text>
            </div>
            <Textarea
              id='markdown-source'
              variant='embedded'
              mono
              className='rich-source-editor'
              value={source}
              spellCheck={false}
              onChange={(event) => setSource(event.target.value)}
            />
          </div>
          <div className='markdown-preview-pane' hidden={view === 'source'}>
            <div className='markdown-pane-heading'>
              <span>{t.renderedPreview}</span>
              <Text as='span' variant='caption' color='muted'>
                {t.live}
              </Text>
            </div>
            <ScrollArea
              orientation='vertical'
              label={t.renderedMarkdownExample}
              className='markdown-preview-scroll'
            >
              <div className='markdown-preview-body'>
                <Markdown
                  source={source}
                  label={t.markdownPreview}
                  codeWrap={wrap}
                  headingLevel={3}
                />
              </div>
              {duplicate && (
                <div className='markdown-second-preview'>
                  <Markdown
                    source={source}
                    label={t.secondMarkdownPreview}
                    codeWrap={wrap}
                    headingLevel={3}
                  />
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
        <Inline gap={3}>
          <Button
            variant='outline'
            onClick={() => setSource(markdownExampleSource)}
          >
            {t.restoreMarkdownExample}
          </Button>
          <Toggle pressed={wrap} onPressedChange={setWrap}>
            {t.wrapCodeLines}
          </Toggle>
          <Toggle pressed={duplicate} onPressedChange={setDuplicate}>
            {t.compareTwoInstances}
          </Toggle>
        </Inline>
      </Stack>
    )
  return (
    <Stack gap={5}>
      <div className='syntax-theme-intro'>
        <strong>{t.platformQuiet}</strong>
        <p>{t.introParagraph}</p>
        <ul className='syntax-theme-legend' aria-label={t.syntaxColorRoles}>
          {[
            ['keyword', t.keyword],
            ['string', t.string],
            ['function', t.functionType],
            ['number', t.number],
            ['comment', t.comment],
          ].map(([role, label]) => (
            <li key={role}>
              <code data-syntax={role}>{label}</code>
            </li>
          ))}
        </ul>
      </div>
      <Field.Root>
        <Field.Label htmlFor='syntax-language'>{t.sourceLanguage}</Field.Label>
        <NativeSelect
          id='syntax-language'
          value={language}
          onChange={(event) => {
            setLanguage(event.target.value)
            setCode(examples[event.target.value])
          }}
        >
          {Object.keys(examples).map((value) => (
            <option key={value} value={value}>
              {value === 'unsupported'
                ? t.unsupportedPlainFallback
                : value.toUpperCase()}
            </option>
          ))}
        </NativeSelect>
      </Field.Root>
      <Field.Root>
        <Field.Label htmlFor='syntax-source'>{t.sourceCode}</Field.Label>
        <Textarea
          id='syntax-source'
          mono
          className='rich-source-editor'
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />
      </Field.Root>
      <Inline gap={3}>
        <Toggle pressed={wrap} onPressedChange={setWrap}>
          {t.wrapSourceLines}
        </Toggle>
        <Button variant='outline' onClick={() => setCode(examples[language])}>
          {t.restoreSource}
        </Button>
      </Inline>
      <SyntaxHighlighter
        code={code}
        language={language}
        label={t.highlightedSourcePreview}
        wrap={wrap}
      />
    </Stack>
  )
}
