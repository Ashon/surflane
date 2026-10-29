import React, { useEffect, useRef, useState } from 'react'
import {
  Stack,
  Text,
  Button,
  Checkbox,
  Field,
  Inline,
  InlineMessage,
  Input,
  Spinner,
  Table,
  Toggle,
  ChoiceLabel,
} from '@surflane/ui'
import { CatalogCodeBlock as CodeBlock } from './CatalogCodeBlock'
import { FoundationPage, FoundationSection } from './FoundationPage'
import { codeText } from './codeText'
import { Link } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/InteractionFoundation'
type Outcome = 'idle' | 'pending' | 'success' | 'error' | 'canceled'
export function InteractionFoundation() {
  const t = text[useLocale().locale]
  const [included, setIncluded] = useState(false),
    [fail, setFail] = useState(false),
    [outcome, setOutcome] = useState<Outcome>('idle'),
    [attempts, setAttempts] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const runButton = useRef<HTMLButtonElement>(null)
  const busy = outcome === 'pending'
  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current)
    },
    [],
  )
  function run() {
    if (timer.current !== null) return
    setAttempts((value) => value + 1)
    setOutcome('pending')
    const shouldFail = fail
    timer.current = setTimeout(() => {
      timer.current = null
      setOutcome(shouldFail ? 'error' : 'success')
    }, 900)
  }
  function cancel() {
    if (timer.current === null) return
    clearTimeout(timer.current)
    timer.current = null
    setOutcome('canceled')
    runButton.current?.focus()
  }
  const status = {
    idle: t.statusIdle,
    pending: t.statusPending,
    success: t.statusSuccess,
    error: t.statusError,
    canceled: t.statusCanceled,
  }[outcome]
  return (
    <FoundationPage
      principles={t.principles}
      sections={t.sections}
      related={[
        '/foundations/accessibility',
        '/foundations/motion',
        '/components/button',
        '/components/toggle',
      ]}
    >
      <FoundationSection id='states'>
        <p>{t.statesIntro}</p>
        <Table.Container
          bleed
          label={t.statesTableLabel}
          orientation='horizontal'
        >
          <Table.Root>
            <Table.Caption>{t.statesTableCaption}</Table.Caption>
            <Table.Head>
              <Table.Row>
                {t.stateColumns.map((label) => (
                  <Table.HeaderCell key={label} scope='col'>
                    {label}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {t.states.map(([state, meaning, token, shown]) => (
                <Table.Row key={state}>
                  <Table.HeaderCell scope='row'>{state}</Table.HeaderCell>
                  <Table.Cell>{meaning}</Table.Cell>
                  <Table.Cell>
                    {token && (
                      <>
                        <Link href={`/tokens?q=${encodeURIComponent(token)}`}>
                          <code>{token}</code>
                        </Link>
                        {', '}
                      </>
                    )}
                    {shown}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
        <p>{t.statesLayering}</p>
        <p>{codeText(t.statesForced)}</p>
      </FoundationSection>
      <FoundationSection id='focus'>
        <p>{codeText(t.focusRing)}</p>
        <p>{codeText(t.focusHalo)}</p>
      </FoundationSection>
      <FoundationSection id='activation'>
        <p>{t.activationIntro}</p>
        <Stack gap={5} className='interaction-preview'>
          <Inline gap={3}>
            <Toggle
              value='evidence'
              pressed={included}
              onPressedChange={setIncluded}
            >
              {t.includeEvidence}
            </Toggle>
            <Button
              variant='outline'
              disabled
              aria-describedby='unavailable-reason'
            >
              {t.unavailablePreview}
            </Button>
          </Inline>
          <Text color='secondary' id='unavailable-reason'>
            {t.unavailableReason}
          </Text>
          <Text color='secondary' data-evidence-selection>
            {included ? t.evidenceIncluded : t.evidenceExcluded}
          </Text>
          <Field.Root>
            <Field.Label>{t.readOnlyResourceId}</Field.Label>
            <Field.Description>
              {t.readOnlyResourceDescription}
            </Field.Description>
            <Input readOnly value='demo-e2e-42' />
          </Field.Root>
        </Stack>
        <p>{t.activationNote}</p>
        <p>
          <a href='https://base-ui.com/react/components/button'>
            {t.baseUiButton}
          </a>
          {' / '}
          <a href='https://www.w3.org/WAI/ARIA/apg/patterns/button/'>
            {t.ariaButtonPattern}
          </a>
        </p>
      </FoundationSection>
      <FoundationSection id='pending'>
        <p>{t.pendingIntro}</p>
        <Stack gap={5} className='interaction-preview'>
          <ChoiceLabel
            control={
              <Checkbox.Root
                checked={fail}
                disabled={busy}
                onCheckedChange={setFail}
              >
                <Checkbox.Indicator />
              </Checkbox.Root>
            }
          >
            {t.failPreview}
          </ChoiceLabel>
          <Inline gap={3}>
            <Button
              ref={runButton}
              disabled={busy}
              focusableWhenDisabled
              aria-busy={busy}
              onClick={run}
            >
              {busy && <Spinner decorative size='small' />}
              {t.runPreview}
            </Button>
            <Button variant='outline' disabled={!busy} onClick={cancel}>
              {t.cancelPreview}
            </Button>
          </Inline>
          <Text color='secondary'>
            {t.attempts} <span data-local-attempts>{attempts}</span>
          </Text>
          <Text
            color='secondary'
            role='status'
            aria-label={t.resultLabel}
            aria-atomic='true'
            data-local-result
          >
            {status}
          </Text>
          {outcome === 'error' && (
            <InlineMessage.Root tone='danger'>
              <InlineMessage.Icon tone='danger' />
              <InlineMessage.Content>
                <InlineMessage.Title>{t.errorTitle}</InlineMessage.Title>
                <InlineMessage.Description>
                  {t.errorDescription}
                </InlineMessage.Description>
              </InlineMessage.Content>
            </InlineMessage.Root>
          )}
        </Stack>
        <p>{codeText(t.pendingTiming)}</p>
        <p>{t.pendingNote}</p>
        <CodeBlock
          language='tsx'
          label={t.codeLabel}
          code={`<Button
  disabled={pending}
  focusableWhenDisabled
  aria-busy={pending}
  onClick={startPreview}
>
  {pending && <Spinner decorative size='small' />}
  Run local preview
</Button>
<p role='status' aria-atomic='true'>
  {resultMessage}
</p>

// Also guard duplicate starts in the handler. Cancel timers / requests on cleanup.
// For real writes, the server still owns idempotency and authorization.`}
        />
      </FoundationSection>
    </FoundationPage>
  )
}
