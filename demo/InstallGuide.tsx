import React, { useEffect, useState } from 'react'
import {
  Button,
  ChoiceLabel,
  CodeBlock,
  Collapsible,
  Switch,
  Table,
  Tabs,
  Toggle,
  ToggleGroup,
} from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/InstallGuide'
import {
  createCommand,
  defaults,
  extraImports,
  extras,
  flags,
  frameworks,
  guideFiles,
  installCommand,
  managers,
  resetExample,
  type Extra,
  type Framework,
  type Manager,
  type Setup,
} from './installRecipes'
import { Link } from './router'

type Copy = (typeof text)['en']

// The setup lives in the query string, so a copied link opens the same choices.
function readSetup(): Setup {
  const query = new URLSearchParams(window.location.search)
  const pick = <T extends string>(
    value: string | null,
    values: T[],
    fallback: T,
  ) => (values.includes(value as T) ? (value as T) : fallback)
  const setup = {
    ...defaults,
    framework: pick(
      query.get('framework'),
      frameworks.map(([id]) => id),
      defaults.framework,
    ),
    manager: pick(query.get('manager'), managers, defaults.manager),
  }
  for (const flag of flags) {
    const value = query.get(flag)
    if (value === '1' || value === '0') setup[flag] = value === '1'
  }
  const chosen = query.get('extras')?.split(',') ?? []
  setup.extras = extras.map(({ id }) => id).filter((id) => chosen.includes(id))
  return setup
}
function writeSetup(setup: Setup) {
  const query = new URLSearchParams()
  if (setup.framework !== defaults.framework)
    query.set('framework', setup.framework)
  if (setup.manager !== defaults.manager) query.set('manager', setup.manager)
  for (const flag of flags)
    if (setup[flag] !== defaults[flag]) query.set(flag, setup[flag] ? '1' : '0')
  if (setup.extras.length) query.set('extras', setup.extras.join(','))
  const search = query.size ? `?${query}` : ''
  history.replaceState(
    history.state,
    '',
    `${window.location.pathname}${search}${window.location.hash}`,
  )
}

// Backticks in the copy mark inline code.
function Prose({ children }: { children: string }) {
  return (
    <>
      {children
        .split('`')
        .map((part, index) =>
          index % 2 ? <code key={index}>{part}</code> : part,
        )}
    </>
  )
}
function Code({
  file,
  language,
  code,
  t,
  wrap,
}: {
  file: string
  language: string
  code: string
  t: Copy
  wrap?: boolean
}) {
  return (
    <CodeBlock
      label={file}
      language={language}
      code={code}
      wrap={wrap}
      copyLabel={t.copyLabel}
      copiedLabel={t.copiedLabel}
    />
  )
}
function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: [T, string][]
  onChange: (value: T) => void
}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <ToggleGroup
        aria-label={label}
        value={[value]}
        onValueChange={(next) => {
          if (next[0]) onChange(next[0] as T)
        }}
      >
        {options.map(([id, name]) => (
          <Toggle key={id} value={id}>
            {name}
          </Toggle>
        ))}
      </ToggleGroup>
    </fieldset>
  )
}
function Options({
  setup,
  update,
  t,
}: {
  setup: Setup
  update: (change: Partial<Setup>) => void
  t: Copy
}) {
  return (
    <fieldset>
      <legend>{t.options}</legend>
      <div className='install-options'>
        {flags.map((flag) => (
          <ChoiceLabel
            key={flag}
            description={t[`${flag}Hint`]}
            control={
              <Switch.Root
                checked={setup[flag]}
                onCheckedChange={(checked) => update({ [flag]: checked })}
              >
                <Switch.Thumb />
              </Switch.Root>
            }
          >
            {t[flag]}
          </ChoiceLabel>
        ))}
      </div>
    </fieldset>
  )
}

export default function InstallGuide() {
  const t = text[useLocale().locale]
  const [setup, setSetup] = useState(readSetup)
  useEffect(() => writeSetup(setup), [setup])
  const update = (change: Partial<Setup>) =>
    setSetup((old) => ({ ...old, ...change }))
  const { framework, manager, tailwind, remember } = setup
  const files = guideFiles(setup)
  // A file tab stays selected while it exists; otherwise the first file shows.
  const [tab, setTab] = useState(files[0].file)
  const current = files.some((file) => file.file === tab) ? tab : files[0].file
  const note = t.newAppNote(framework, tailwind)
  const imports = extraImports(setup)
  // The file that holds the SyntaxHighlighting provider, when highlighting is chosen.
  const providerKind = setup.extras.includes('highlighting')
    ? framework === 'vite'
      ? 'entry'
      : framework === 'astro'
        ? 'page'
        : 'document'
    : undefined
  return (
    <>
      <section id='install-setup'>
        <h2>{t.setupTitle}</h2>
        <p>{t.setupIntro}</p>
        <div className='install-choices'>
          <Choice
            label={t.framework}
            value={framework}
            options={frameworks}
            onChange={(next: Framework) => update({ framework: next })}
          />
          <Choice
            label={t.manager}
            value={manager}
            options={managers.map((id) => [id, id])}
            onChange={(next: Manager) => update({ manager: next })}
          />
          <fieldset>
            <legend>{t.extrasLabel}</legend>
            <ToggleGroup
              multiple
              aria-label={t.extrasLabel}
              value={setup.extras}
              onValueChange={(next) =>
                // Keep the guide's order, whatever order the reader picks in.
                update({
                  extras: extras
                    .map(({ id }) => id)
                    .filter((id) => next.includes(id)),
                })
              }
            >
              {extras.map(({ id }) => (
                <Toggle key={id} value={id}>
                  {t.extraNames[id]}
                </Toggle>
              ))}
            </ToggleGroup>
            <p className='install-option-hint'>{t.extrasHint}</p>
          </fieldset>
          <Options setup={setup} update={update} t={t} />
        </div>
      </section>
      <section id='install-packages'>
        <h2>{t.step(1, t.installTitle)}</h2>
        <p>{t.installIntro}</p>
        <Code
          file={t.installLabel}
          language='bash'
          code={installCommand(setup)}
          t={t}
          wrap
        />
        {imports && (
          <>
            <p>{t.importsIntro}</p>
            <Code file={t.importsLabel} language='tsx' code={imports} t={t} />
          </>
        )}
        <Collapsible.Root className='install-more'>
          <Collapsible.Trigger render={<Button variant='ghost' size='sm' />}>
            {t.newAppTitle}
          </Collapsible.Trigger>
          <Collapsible.Panel>
            <Code
              file={t.createLabel}
              language='bash'
              code={createCommand(setup)}
              t={t}
              wrap
            />
            {note && (
              <p className='install-note'>
                <Prose>{note}</Prose>
              </p>
            )}
          </Collapsible.Panel>
        </Collapsible.Root>
      </section>
      <section id='install-files'>
        <h2>{t.step(2, t.filesTitle)}</h2>
        <p>{t.filesIntro}</p>
        <Tabs.Root value={current} onValueChange={(value) => setTab(value)}>
          <Tabs.List aria-label={t.filesLabel}>
            {files.map((file) => (
              <Tabs.Tab key={file.file} value={file.file}>
                {file.file.split('/').pop()}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {files.map((file) => (
            <Tabs.Panel
              key={file.file}
              value={file.file}
              className='install-file'
            >
              <p className='install-note'>
                <Prose>
                  {file.kind === providerKind
                    ? `${t.fileNotes(file.kind, setup)} ${t.highlightNote}`
                    : t.fileNotes(file.kind, setup)}
                </Prose>
              </p>
              <Code {...file} t={t} />
            </Tabs.Panel>
          ))}
        </Tabs.Root>
      </section>
      <section id='install-check'>
        <h2>{t.step(3, t.checkTitle)}</h2>
        <ul className='install-checks'>
          <li>
            <Prose>{t.checks.theme}</Prose>
          </li>
          <li>
            <Prose>{t.checks.button}</Prose>
          </li>
          {tailwind && (
            <li>
              <Prose>{t.checks.tailwind}</Prose>
            </li>
          )}
          {remember && (
            <li>
              <Prose>{t.checks.remember}</Prose>
            </li>
          )}
          {providerKind && (
            <li>
              <Prose>{t.checks.highlighting}</Prose>
            </li>
          )}
        </ul>
      </section>
      <section id='install-layers'>
        <h2>{t.layersTitle}</h2>
        <ul>
          <li>
            <Prose>{t.layerRules.unlayered}</Prose>
          </li>
          <li>
            <Prose>
              {tailwind ? t.layerRules.tailwind : t.layerRules.reset}
            </Prose>
          </li>
        </ul>
        <Collapsible.Root className='install-more'>
          <Collapsible.Trigger render={<Button variant='ghost' size='sm' />}>
            {t.layerOrderTitle}
          </Collapsible.Trigger>
          <Collapsible.Panel>
            <Table.Container bleed label={t.layersCaption}>
              <Table.Root className='install-layer-table'>
                <Table.Caption>{t.layersCaption}</Table.Caption>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell scope='col'>{t.layer}</Table.HeaderCell>
                    <Table.HeaderCell scope='col'>
                      {t.contents}
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {t.layerRows.map(([layer, contents]) => (
                    <Table.Row key={layer}>
                      <Table.Cell>
                        <code>{layer}</code>
                      </Table.Cell>
                      <Table.Cell>{contents}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.Container>
            {!tailwind && (
              <Code
                file={t.resetLabel}
                language='css'
                code={resetExample}
                t={t}
              />
            )}
          </Collapsible.Panel>
        </Collapsible.Root>
        <p className='install-links'>
          <Link href='/foundations/themes'>{t.themesLink}</Link>
          <a href='https://github.com/Ashon/surflane/blob/main/docs/frameworks.md'>
            {t.frameworksLink}
          </a>
          <a href='https://github.com/Ashon/surflane/tree/main/examples'>
            {t.examplesLink}
          </a>
        </p>
      </section>
    </>
  )
}
