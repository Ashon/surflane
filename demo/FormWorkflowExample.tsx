import React, { useEffect, useRef, useState } from 'react'
import {
  Form,
  Field,
  Fieldset,
  Select,
  NativeSelect,
  Button,
  InlineMessage,
  Spinner,
} from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/FormWorkflowExample'
type Draft = { name: string; url: string; region: string }
type Outcome =
  'success' | 'field-conflict' | 'request-failure' | 'permission-denied'
type Phase =
  | 'idle'
  | 'pending'
  | 'field-error'
  | 'request-error'
  | 'permission'
  | 'success'
const initial: Draft = { name: '', url: '', region: 'cluster-a' }
/** A manually resolved local request: no product service is contacted. */
function previewRequest(id: number, values: Draft, outcome: Outcome) {
  const controller = new AbortController()
  let complete!: (reply: Outcome | 'aborted') => void
  const promise = new Promise<Outcome | 'aborted'>((resolve) => {
    complete = resolve
    controller.signal.addEventListener('abort', () => resolve('aborted'), {
      once: true,
    })
  })
  return { id, values: { ...values }, outcome, controller, complete, promise }
}
export function FormWorkflowExample() {
  const t = text[useLocale().locale]
  const [draft, setDraft] = useState<Draft>(initial),
    [outcome, setOutcome] = useState<Outcome>('success'),
    [phase, setPhase] = useState<Phase>('idle'),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [saved, setSaved] = useState<Draft | null>(null),
    [notice, setNotice] = useState(''),
    [attempts, setAttempts] = useState(0),
    [generation, setGeneration] = useState(0)
  const pending = useRef<ReturnType<typeof previewRequest> | null>(null),
    sequence = useRef(0)
  const name = useRef<HTMLInputElement>(null),
    submit = useRef<HTMLButtonElement>(null),
    cancel = useRef<HTMLButtonElement>(null),
    success = useRef<HTMLElement>(null),
    restore = useRef<HTMLButtonElement>(null)
  const nextFocus = useRef<
    'name' | 'submit' | 'cancel' | 'success' | 'restore' | null
  >(null)
  useEffect(() => {
    const target = nextFocus.current
    if (target) {
      ;({ name, submit, cancel, success, restore })[target].current?.focus()
      nextFocus.current = null
    }
  }, [phase, generation])
  useEffect(
    () => () => {
      const request = pending.current
      pending.current = null
      request?.controller.abort()
    },
    [],
  )
  const edit = (key: keyof Draft, value: string) => {
    if (pending.current) return
    setDraft((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
    setPhase('idle')
    setNotice('')
    setSaved(null)
  }
  const start = (values: Draft) => {
    if (pending.current || phase === 'permission') return
    const request = previewRequest(++sequence.current, values, outcome)
    pending.current = request
    setAttempts((value) => value + 1)
    setErrors({})
    setNotice('')
    setSaved(null)
    nextFocus.current = 'cancel'
    setPhase('pending')
    void request.promise.then((reply) => {
      if (
        request.controller.signal.aborted ||
        pending.current !== request ||
        reply === 'aborted'
      )
        return
      pending.current = null
      if (reply === 'field-conflict') {
        setErrors({
          name: t.fieldConflictError,
        })
        nextFocus.current = 'name'
        setPhase('field-error')
      } else if (reply === 'request-failure') {
        nextFocus.current = 'submit'
        setPhase('request-error')
      } else if (reply === 'permission-denied') {
        nextFocus.current = 'restore'
        setPhase('permission')
      } else {
        setSaved(request.values)
        nextFocus.current = 'success'
        setPhase('success')
      }
    })
  }
  const reset = () => {
    const request = pending.current
    pending.current = null
    request?.controller.abort()
    setDraft(initial)
    setErrors({})
    setSaved(null)
    setNotice(t.previewResetNotice)
    nextFocus.current = 'name'
    setPhase('idle')
    setGeneration((value) => value + 1)
  }
  const cancelRequest = () => {
    const request = pending.current
    pending.current = null
    request?.controller.abort()
    setNotice(t.cancelRequestNotice)
    nextFocus.current = 'name'
    setPhase('idle')
  }
  const busy = phase === 'pending',
    restricted = phase === 'permission'
  return (
    <div className='form-workflow-example'>
      <Field.Root className='workflow-response'>
        <Field.Label>{t.previewResponseLabel}</Field.Label>
        <NativeSelect
          value={outcome}
          disabled={busy}
          onChange={(event) => setOutcome(event.target.value as Outcome)}
        >
          <option value='success'>{t.outcomeSuccess}</option>
          <option value='field-conflict'>{t.outcomeFieldConflict}</option>
          <option value='request-failure'>{t.outcomeRequestFailure}</option>
          <option value='permission-denied'>{t.outcomePermissionDenied}</option>
        </NativeSelect>
      </Field.Root>
      <p>{t.intro}</p>
      {phase === 'field-error' && (
        <InlineMessage.Root tone='danger' role='alert'>
          <InlineMessage.Icon tone='danger' />
          <InlineMessage.Content>
            <InlineMessage.Title>{t.fieldErrorTitle}</InlineMessage.Title>
            <InlineMessage.Description>
              {t.fieldErrorDescription}
            </InlineMessage.Description>
          </InlineMessage.Content>
        </InlineMessage.Root>
      )}
      {phase === 'request-error' && (
        <InlineMessage.Root tone='danger' role='alert'>
          <InlineMessage.Icon tone='danger' />
          <InlineMessage.Content>
            <InlineMessage.Title>{t.requestErrorTitle}</InlineMessage.Title>
            <InlineMessage.Description>
              {t.requestErrorDescription}
            </InlineMessage.Description>
          </InlineMessage.Content>
        </InlineMessage.Root>
      )}
      {restricted && (
        <InlineMessage.Root tone='caution' role='alert'>
          <InlineMessage.Icon tone='caution' />
          <InlineMessage.Content>
            <InlineMessage.Title>{t.permissionTitle}</InlineMessage.Title>
            <InlineMessage.Description id='workflow-permission-reason'>
              {t.permissionDescription}
            </InlineMessage.Description>
            <InlineMessage.Actions>
              <Button
                ref={restore}
                variant='outline'
                onClick={() => {
                  setNotice(t.previewAccessRestoredNotice)
                  nextFocus.current = 'name'
                  setPhase('idle')
                }}
              >
                {t.restorePreviewAccess}
              </Button>
            </InlineMessage.Actions>
          </InlineMessage.Content>
        </InlineMessage.Root>
      )}
      {phase === 'success' && saved && (
        <InlineMessage.Root tone='success'>
          <InlineMessage.Icon tone='success' />
          <InlineMessage.Content>
            <InlineMessage.Title ref={success} tabIndex={-1}>
              {t.successTitle}
            </InlineMessage.Title>
            <InlineMessage.Description>
              {saved.name} / {saved.url} / {saved.region}
            </InlineMessage.Description>
            <InlineMessage.Actions>
              <Button variant='outline' onClick={reset}>
                {t.startAnotherPreview}
              </Button>
            </InlineMessage.Actions>
          </InlineMessage.Content>
        </InlineMessage.Root>
      )}
      <Form<Draft>
        key={generation}
        aria-label={t.formAriaLabel}
        aria-busy={busy}
        errors={errors}
        onFormSubmit={start}
        onReset={(event) => {
          event.preventDefault()
          reset()
        }}
      >
        <Fieldset.Root
          disabled={busy || restricted}
          aria-describedby={
            restricted ? 'workflow-permission-reason' : undefined
          }
        >
          <Fieldset.Legend>{t.environmentDetails}</Fieldset.Legend>
          <Field.Root name='name'>
            <Field.Label>{t.environmentNameLabel}</Field.Label>
            <Field.Control
              ref={name}
              required
              pattern={'[a-z][a-z0-9\\-]{2,47}'}
              maxLength={48}
              value={draft.name}
              onChange={(event) => edit('name', event.target.value)}
              placeholder='preview-environment'
            />
            <Field.Description>{t.nameDescription}</Field.Description>
            <Field.Error />
          </Field.Root>
          <Field.Root name='url'>
            <Field.Label>{t.serviceUrlLabel}</Field.Label>
            <Field.Control
              type='url'
              required
              pattern='https://.+'
              value={draft.url}
              onChange={(event) => edit('url', event.target.value)}
              placeholder='https://api.example.test'
            />
            <Field.Description>{t.urlDescription}</Field.Description>
            <Field.Error />
          </Field.Root>
          <Field.Root name='region'>
            <Field.Label>{t.clusterLabel}</Field.Label>
            <Select
              name='region'
              value={draft.region}
              onValueChange={(value) => edit('region', value)}
              options={[
                { value: 'cluster-a', label: 'Cluster A' },
                { value: 'cluster-b', label: 'Cluster B' },
              ]}
            />
          </Field.Root>
        </Fieldset.Root>
        <div className='actions'>
          <Button ref={submit} type='submit' disabled={busy || restricted}>
            {busy
              ? t.submittingPreview
              : phase === 'request-error'
                ? t.retryRegistration
                : t.registerPreview}
          </Button>
          <Button type='reset' variant='outline' disabled={busy}>
            {t.resetPreview}
          </Button>
        </div>
      </Form>
      {busy && (
        <InlineMessage.Root tone='progress'>
          <InlineMessage.Icon>
            <Spinner decorative size='small' />
          </InlineMessage.Icon>
          <InlineMessage.Content>
            <InlineMessage.Title role='status'>
              {t.submittingPreviewTitle}
            </InlineMessage.Title>
            <InlineMessage.Description>
              {t.busyDescription}
            </InlineMessage.Description>
            <InlineMessage.Actions>
              <Button
                variant='outline'
                onClick={() => {
                  const request = pending.current
                  request?.complete(request.outcome)
                }}
              >
                {t.completePreviewRequest}
              </Button>
              <Button ref={cancel} variant='outline' onClick={cancelRequest}>
                {t.cancelRequest}
              </Button>
            </InlineMessage.Actions>
          </InlineMessage.Content>
        </InlineMessage.Root>
      )}
      <p className='workflow-notice' role='status'>
        {notice}
      </p>
      <p className='catalog-preview-note'>{t.catalogNote(attempts)}</p>
    </div>
  )
}
