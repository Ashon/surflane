import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  CodeBlock,
  Field,
  InlineMessage,
  List,
  NativeSelect,
  Progress,
  StatusBadge,
  type StatusTone,
} from '@surflane/ui'

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
const names = ['Resolve build', 'Check health', 'Collect logs']
const phaseLabels: Record<Phase, string> = {
  queued: 'Queued',
  running: 'Running',
  'cancel-requested': 'Cancellation requested',
  canceled: 'Canceled',
  success: 'Completed',
  partial: 'Partially completed',
  failed: 'Failed',
}
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
    <div className='example-stack async-job-example'>
      <p>Updates arrive only when you deliver them. No real job runs.</p>
      <Field.Root name='job-target'>
        <Field.Label>Next run environment</Field.Label>
        <Field.Control
          value={target}
          onChange={(event) => setTarget(event.target.value)}
          disabled={active(run)}
        />
        <Field.Description>
          In this preview, retries keep the original environment and reuse
          successful checks.
        </Field.Description>
      </Field.Root>
      <label className='example-field'>
        Next run result
        <NativeSelect
          value={scenario}
          onChange={(event) => setScenario(event.target.value as Scenario)}
          disabled={active(run)}
        >
          <option value='success'>Success</option>
          <option value='partial'>Partial failure</option>
          <option value='failure'>Blocking failure</option>
        </NativeSelect>
      </label>
      <div className='actions'>
        <Button
          onClick={() => start()}
          disabled={active(run) || !target.trim()}
        >
          Start preview run
        </Button>
        {run && !active(run) && run.phase !== 'success' && (
          <Button variant='outline' onClick={() => start(true)}>
            Retry unfinished steps
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
              Request cancellation
            </Button>
            <Button ref={update} variant='outline' onClick={deliver}>
              {run?.phase === 'cancel-requested'
                ? 'Acknowledge cancellation'
                : 'Deliver next preview update'}
            </Button>
          </>
        )}
      </div>
      {run && (
        <section className='example-stack' aria-label='Run details'>
          <h3 ref={result} tabIndex={-1}>
            Run summary
          </h3>
          <p>
            {run.id} / {run.target}
          </p>
          <div role='status' aria-label='Run status'>
            <StatusBadge tone={tones[run.phase]}>
              {phaseLabels[run.phase]}
            </StatusBadge>
          </div>
          {run.reused > 0 && (
            <p>
              {run.reused} successful {run.reused === 1 ? 'check' : 'checks'}{' '}
              reused. Their logs keep the original run ID.
            </p>
          )}
          <Progress.Root
            value={finished}
            max={3}
            aria-valuetext={`${finished} of 3 checks finished`}
          >
            <Progress.Label>Finished checks</Progress.Label>
            <Progress.Value>{() => `${finished} / 3`}</Progress.Value>
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
                    ? 'Waiting for the worker to acknowledge. Completed work stays recorded.'
                    : run.phase === 'canceled'
                      ? 'The worker acknowledged cancellation. Completed checks are kept, and nothing is rolled back.'
                      : 'Review the failed check logs. Retry creates a new run for unfinished checks.'}
                </InlineMessage.Description>
              </InlineMessage.Content>
            </InlineMessage.Root>
          )}
          <List.Root aria-label='Run steps'>
            {run.steps.map((step, index) => (
              <List.Item key={step.name} selected={inspected === index}>
                <List.Content>
                  <List.Title>{step.name}</List.Title>
                  <List.Description>
                    <StatusBadge tone={tones[step.state] ?? 'neutral'}>
                      {step.state}
                    </StatusBadge>
                    {step.source && <span> / Logs from {step.source}</span>}
                  </List.Description>
                </List.Content>
                <List.Actions>
                  <Button
                    variant='ghost'
                    disabled={!step.evidence}
                    aria-pressed={inspected === index}
                    onClick={() => setInspected(index)}
                  >
                    Inspect {step.name}
                  </Button>
                </List.Actions>
              </List.Item>
            ))}
          </List.Root>
          {evidence?.evidence && (
            <CodeBlock
              code={evidence.evidence}
              label={`${evidence.name} output`}
              language='json'
              wrap
            />
          )}
        </section>
      )}
    </div>
  )
}
