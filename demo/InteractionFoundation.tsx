import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Checkbox,
  CodeBlock,
  Field,
  Inline,
  InlineMessage,
  Input,
  Spinner,
  Table,
  Toggle,
  ChoiceLabel,
} from '@surflane/ui'
import { Link } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/InteractionFoundation'
type Outcome = 'idle' | 'pending' | 'success' | 'error' | 'canceled'
export function InteractionFoundation() {
  const t = text[useLocale().locale]
  const states = t.states
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
    <>
      <nav className='page-toc' aria-label={t.onThisPage}>
        {t.nav.map(({ id, label }) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>
      <section id='states'>
        <h2>{t.statesHeading}</h2>
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
              {states.map(([state, meaning, contract]) => (
                <Table.Row key={state}>
                  <Table.HeaderCell scope='row'>{state}</Table.HeaderCell>
                  <Table.Cell>{meaning}</Table.Cell>
                  <Table.Cell>{contract}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
      </section>
      <section id='activation'>
        <h2>{t.activationHeading}</h2>
        <p>{t.activationIntro}</p>
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
        <p id='unavailable-reason'>{t.unavailableReason}</p>
        <p data-evidence-selection>
          {included ? t.evidenceIncluded : t.evidenceExcluded}
        </p>
        <Field.Root className='content-name-field'>
          <Field.Label>{t.readOnlyResourceId}</Field.Label>
          <Field.Description>{t.readOnlyResourceDescription}</Field.Description>
          <Input readOnly value='demo-e2e-42' />
        </Field.Root>
        <p>{t.activationNote}</p>
      </section>
      <section id='async-work'>
        <h2>Pending is not completion</h2>
        <p>
          While pending, the run button keeps focus and blocks duplicate runs.
          After cancellation, focus returns to the run button. Completion itself
          doesn't move the user's focus. Try failure, cancellation, and retry on
          the 900ms local task below. It makes no server requests and creates no
          resources.
        </p>
        <div className='example-stack interaction-work-preview'>
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
            Fail local preview
          </ChoiceLabel>
          <Inline gap={3}>
            <Button
              ref={runButton}
              disabled={busy}
              focusableWhenDisabled
              aria-busy={busy}
              onClick={run}
            >
              {busy && <Spinner decorative size='sm' />}Run local preview
            </Button>
            <Button variant='outline' disabled={!busy} onClick={cancel}>
              Cancel local preview
            </Button>
          </Inline>
          <p>
            Started attempts: <span data-local-attempts>{attempts}</span>
          </p>
          <p
            role='status'
            aria-label='Local preview result'
            aria-atomic='true'
            data-local-result
          >
            {status}
          </p>
          {outcome === 'error' && (
            <InlineMessage.Root tone='danger'>
              <InlineMessage.Icon tone='danger' />
              <InlineMessage.Content>
                <InlineMessage.Title>
                  Preview needs attention
                </InlineMessage.Title>
                <InlineMessage.Description>
                  This is a sample failure, not a real system failure or a
                  permission problem. Clear Fail local preview, then select Run
                  local preview again.
                </InlineMessage.Description>
              </InlineMessage.Content>
            </InlineMessage.Root>
          )}
        </div>
        <CodeBlock
          language='tsx'
          code={`<Button
  disabled={pending}
  focusableWhenDisabled
  aria-busy={pending}
  onClick={startPreview}
>
  {pending && <Spinner decorative size='sm' />}
  Run local preview
</Button>
<p role='status' aria-atomic='true'>
  {resultMessage}
</p>

// Also guard duplicate starts in the handler. Cancel timers / requests on cleanup.
// For real writes, the server still owns idempotency and authorization.`}
        />
        <p>
          This pattern pairs aria-disabled with a JavaScript guard. Don't assume
          a state attribute alone blocks requests. For real write operations,
          the server and the product own idempotency, authorization, and whether
          cancellation is possible.
        </p>
      </section>
      <section id='keyboard'>
        <h2>Keep every input path usable</h2>
        <ul>
          <li>
            Tab and Shift+Tab follow a meaningful DOM order. Buttons respond to
            Enter and Space, and links to Enter. Composite components follow the
            arrow-key contract in their own guides.
          </li>
          <li>
            When a popup opens, set its initial focus. After Escape or close,
            restore focus to the original trigger. Async completion doesn't
            steal the current focus.
          </li>
          <li>
            Give touch users a path that doesn't require hover. Preserve the
            touch targets for labels, close, and cancel. Pair drag and swipe
            with click and keyboard alternatives.
          </li>
          <li>
            Scroll with the shared ScrollArea, which keeps wheel, keyboard, and
            touch support. Transitions don't change the DOM order of content or
            current input values.
          </li>
        </ul>
        <p>
          See also the{' '}
          <Link href='/foundations/accessibility'>
            accessibility error and focus examples
          </Link>
          ,{' '}
          <Link href='/components/drawer'>alternative controls in Drawer</Link>,
          and{' '}
          <Link href='/components/toast'>F6, dismiss, and pause in Toast</Link>.
        </p>
      </section>
      <section id='application'>
        <h2>Connect behavior to motion and products</h2>
        <p>
          Keep visual transition time separate from actual task time. Show focus
          rings and status text immediately. Use the per-component tokens from
          the{' '}
          <Link href='/foundations/motion#transitions'>transition policy</Link>{' '}
          and the{' '}
          <Link href='/foundations/motion#easing'>easing mechanism</Link>.
          Success, error, cancellation, and every task path must work the same
          with reduced motion.
        </p>
        <p>
          Actions such as start, cancel, save, and edit connect this state model
          to their actual results and recovery policies. This page's local delay
          and failure option aren't evidence of operational status.
        </p>
        <p>
          References:{' '}
          <a href='https://base-ui.com/react/components/button'>
            Base UI Button
          </a>
          ,{' '}
          <a href='https://www.w3.org/WAI/ARIA/apg/patterns/button/'>
            WAI-ARIA button pattern
          </a>
          . See the <Link href='/components'>individual component pages</Link>{' '}
          for each component's API, focus, and keyboard details.
        </p>
      </section>
    </>
  )
}
