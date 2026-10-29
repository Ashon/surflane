import React, { useEffect, useRef, useState } from 'react'
import {
  Stack,
  Text,
  Inline,
  Button,
  Field,
  InlineMessage,
  List,
  NativeSelect,
  Progress,
  StatusBadge,
  type StatusTone,
  Toggle,
} from '@surflane/ui'
import { CatalogCodeBlock as CodeBlock } from './CatalogCodeBlock'
import { useLocale } from './i18n'
import { text } from './i18n/pages/AsyncJobExample'

type Scenario = 'success' | 'partial' | 'failure'
type Phase =
  | 'queued'
  | 'running'
  | 'cancel-requested'
  | 'canceled'
  | 'success'
  | 'partial'
  | 'failed'
type StepState =
  'waiting' | 'running' | 'succeeded' | 'failed' | 'skipped' | 'canceled'
type Step = {
  name: string
  state: StepState
  evidence?: string
  source?: string
}
type Run = {
  id: string
  target: string
  scenario: Scenario
  phase: Phase
  steps: Step[]
  reused: number
}
type Delivery = { controller: AbortController; version: number; busy: boolean }
const tones: Record<string, StatusTone> = {
  queued: 'neutral',
  running: 'progress',
  'cancel-requested': 'caution',
  canceled: 'neutral',
  success: 'success',
  succeeded: 'success',
  partial: 'caution',
  failed: 'danger',
}
function active(run: Run | null) {
  return !!run && ['queued', 'running', 'cancel-requested'].includes(run.phase)
}
function advance(run: Run): Run {
  const steps = run.steps.map((step) => ({ ...step }))
  if (run.phase === 'cancel-requested') {
    for (const step of steps) {
      if (step.state === 'running') step.state = 'canceled'
      if (step.state === 'waiting') step.state = 'skipped'
    }
    return { ...run, steps, phase: 'canceled' }
  }
  const index = steps.findIndex((step) => step.state === 'running')
  if (index !== -1) {
    const step = steps[index]
    const failed = index === 1 && run.scenario !== 'success'
    step.state = failed ? 'failed' : 'succeeded'
    step.source = run.id
    step.evidence = JSON.stringify(
      {
        run: run.id,
        environment: run.target,
        check: step.name,
        result: failed ? 'Sample service unhealthy' : 'Preview check passed',
        localPreview: true,
      },
      null,
      2,
    )
    if (failed && run.scenario === 'failure') {
      for (const remaining of steps.slice(index + 1))
        remaining.state = 'skipped'
      return { ...run, steps, phase: 'failed' }
    }
  }
  const next = steps.find((step) => step.state === 'waiting')
  if (next) {
    next.state = 'running'
    return { ...run, steps, phase: 'running' }
  }
  return {
    ...run,
    steps,
    phase: steps.some((step) => step.state === 'failed')
      ? 'partial'
      : 'success',
  }
}
export function AsyncJobExample() {
  const t = text[useLocale().locale]
  const names = t.names
  const phaseLabels = t.phaseLabels
  const stepStateLabels = t.stepStateLabels
  const [target, setTarget] = useState('Sample environment')
  const [scenario, setScenario] = useState<Scenario>('success')
  const [run, setRun] = useState<Run | null>(null)
  const [inspected, setInspected] = useState<number | null>(null)
  const current = useRef<Run | null>(null),
    delivery = useRef<Delivery | null>(null),
    sequence = useRef(0)
  const cancel = useRef<HTMLButtonElement>(null),
    update = useRef<HTMLButtonElement>(null),
    result = useRef<HTMLHeadingElement>(null)
  const focus = useRef<'cancel' | 'update' | 'result' | null>(null)
  useEffect(
    () => () => {
      delivery.current?.controller.abort()
      delivery.current = null
    },
    [],
  )
  useEffect(() => {
    if (focus.current) {
      ;({ cancel, update, result })[focus.current].current?.focus({
        preventScroll: true,
      })
      focus.current = null
    }
  }, [run])
  function commit(next: Run) {
    current.current = next
    setRun(next)
  }
  function start(retry = false) {
    if (active(current.current) || !target.trim()) return
    delivery.current?.controller.abort()
    delivery.current = {
      controller: new AbortController(),
      version: 0,
      busy: false,
    }
    const previous = current.current
    const steps: Step[] = names.map((name, index) =>
      retry && previous?.steps[index].state === 'succeeded'
        ? { ...previous.steps[index] }
        : { name, state: 'waiting' },
    )
    const next: Run = {
      id: `preview-run-${++sequence.current}`,
      target: retry && previous ? previous.target : target.trim(),
      scenario,
      phase: 'queued',
      steps,
      reused: steps.filter((step) => step.state === 'succeeded').length,
    }
    setInspected(null)
    focus.current = 'cancel'
    commit(next)
  }
  function requestCancel() {
    const owner = delivery.current,
      snapshot = current.current
    if (
      !owner ||
      !snapshot ||
      !active(snapshot) ||
      snapshot.phase === 'cancel-requested'
    )
      return
    owner.version++
    owner.busy = false
    focus.current = 'update'
    commit({ ...snapshot, phase: 'cancel-requested' })
  }
  function deliver() {
    const owner = delivery.current,
      snapshot = current.current
    if (!owner || !snapshot || !active(snapshot) || owner.busy) return
    owner.busy = true
    const version = owner.version
    // A real transport may deliver after cancellation or navigation. Fence every response.
    Promise.resolve().then(() => {
      if (
        delivery.current !== owner ||
        owner.controller.signal.aborted ||
        version !== owner.version ||
        current.current !== snapshot
      )
        return
      owner.busy = false
      const next = advance(snapshot)
      if (!active(next)) {
        owner.controller.abort()
        focus.current = 'result'
      }
      commit(next)
    })
  }
  const finished =
    run?.steps.filter(
      (step) => step.state === 'succeeded' || step.state === 'failed',
    ).length ?? 0
  const evidence = inspected === null ? null : run?.steps[inspected]
  return (
    <Stack gap={5} className='async-job-example'>
      <Text color='secondary'>{t.intro}</Text>
      <Field.Root name='job-target'>
        <Field.Label>{t.nextRunEnvironment}</Field.Label>
        <Field.Control
          value={target}
          onChange={(event) => setTarget(event.target.value)}
          disabled={active(run)}
        />
        <Field.Description>{t.fieldDescription}</Field.Description>
      </Field.Root>
      <Field.Root>
        <Field.Label>{t.nextRunResult}</Field.Label>
        <NativeSelect
          value={scenario}
          onChange={(event) => setScenario(event.target.value as Scenario)}
          disabled={active(run)}
        >
          <option value='success'>{t.scenarioSuccess}</option>
          <option value='partial'>{t.scenarioPartial}</option>
          <option value='failure'>{t.scenarioFailure}</option>
        </NativeSelect>
      </Field.Root>
      <Inline gap={3}>
        <Button
          onClick={() => start()}
          disabled={active(run) || !target.trim()}
        >
          {t.startPreviewRun}
        </Button>
        {run && !active(run) && run.phase !== 'success' && (
          <Button variant='outline' onClick={() => start(true)}>
            {t.retryUnfinishedSteps}
          </Button>
        )}
        {active(run) && (
          <>
            <Button
              ref={cancel}
              variant='outline'
              onClick={requestCancel}
              disabled={run?.phase === 'cancel-requested'}
            >
              {t.requestCancellation}
            </Button>
            <Button ref={update} variant='outline' onClick={deliver}>
              {run?.phase === 'cancel-requested'
                ? t.acknowledgeCancellation
                : t.deliverNextPreviewUpdate}
            </Button>
          </>
        )}
      </Inline>
      {run && (
        <Stack gap={5} role='region' aria-label={t.runDetailsLabel}>
          <h3 ref={result} tabIndex={-1}>
            {t.runSummary}
          </h3>
          <Text color='secondary'>
            {run.id} / {run.target}
          </Text>
          <div role='status' aria-label={t.runStatusLabel}>
            <StatusBadge tone={tones[run.phase]}>
              {phaseLabels[run.phase]}
            </StatusBadge>
          </div>
          {run.reused > 0 && (
            <Text color='secondary'>{t.reusedChecks(run.reused)}</Text>
          )}
          <Progress.Root
            value={finished}
            max={3}
            aria-valuetext={t.checksFinished(finished)}
          >
            <Progress.Label>{t.finishedChecksLabel}</Progress.Label>
            <Progress.Value>{() => t.progressValue(finished)}</Progress.Value>
            <Progress.Track>
              <Progress.Indicator />
            </Progress.Track>
          </Progress.Root>
          {['partial', 'failed', 'cancel-requested', 'canceled'].includes(
            run.phase,
          ) && (
            <InlineMessage.Root
              tone={run.phase === 'failed' ? 'danger' : 'caution'}
            >
              <InlineMessage.Content>
                <InlineMessage.Title>
                  {phaseLabels[run.phase]}
                </InlineMessage.Title>
                <InlineMessage.Description>
                  {run.phase === 'cancel-requested'
                    ? t.cancelRequestedDescription
                    : run.phase === 'canceled'
                      ? t.canceledDescription
                      : t.partialDescription}
                </InlineMessage.Description>
              </InlineMessage.Content>
            </InlineMessage.Root>
          )}
          <List.Root aria-label={t.runStepsLabel}>
            {run.steps.map((step, index) => (
              <List.Item key={step.name} selected={inspected === index}>
                <List.Content>
                  <List.Title>{step.name}</List.Title>
                  <List.Description>
                    <StatusBadge tone={tones[step.state] ?? 'neutral'}>
                      {stepStateLabels[step.state]}
                    </StatusBadge>
                    {step.source && <span> / {t.logsFrom(step.source)}</span>}
                  </List.Description>
                </List.Content>
                <List.Actions>
                  <Toggle
                    disabled={!step.evidence}
                    pressed={inspected === index}
                    onPressedChange={(pressed) =>
                      pressed && setInspected(index)
                    }
                  >
                    {t.inspectStep(step.name)}
                  </Toggle>
                </List.Actions>
              </List.Item>
            ))}
          </List.Root>
          {evidence?.evidence && (
            <CodeBlock
              code={evidence.evidence}
              label={t.stepOutput(evidence.name)}
              language='json'
              wrap
            />
          )}
        </Stack>
      )}
    </Stack>
  )
}
