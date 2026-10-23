import React, { useState } from 'react'
import { Button, Progress, Meter, Spinner, Skeleton } from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/FeedbackExamples'
export { feedbackExampleIds } from './exampleGroups'
export function FeedbackExample({ id }: { id: string }) {
  const t = text[useLocale().locale]
  const [value, setValue] = useState<number | null>(30)
  const [loading, setLoading] = useState(true)
  if (id === 'progress')
    return (
      <div className='example-stack'>
        <Progress.Root
          value={value}
          aria-valuetext={
            value === null ? t.waitingForWorker : t.checksCompleted(value)
          }
        >
          <Progress.Label>{t.deploymentProgress}</Progress.Label>
          <Progress.Value>
            {(formatted, current) =>
              current === null ? t.waitingForWorker : formatted
            }
          </Progress.Value>
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
        <div className='actions'>
          <Button
            variant='outline'
            onClick={() => setValue((v) => Math.min(100, (v ?? 0) + 10))}
          >
            {t.complete10Checks}
          </Button>
          <Button variant='outline' onClick={() => setValue(null)}>
            {t.waitForWorker}
          </Button>
          <Button variant='ghost' onClick={() => setValue(0)}>
            {t.resetProgress}
          </Button>
        </div>
        <p role='status'>
          {value === 100 ? t.allChecksCompleted : t.previewOnly}
        </p>
      </div>
    )
  if (id === 'meter')
    return (
      <div className='example-stack'>
        <Meter.Root
          value={value ?? 30}
          min={0}
          max={64}
          aria-valuetext={t.gibOfTotal(value ?? 30)}
        >
          <Meter.Label>{t.memoryAllocation}</Meter.Label>
          <Meter.Value>{(_, v) => t.gibValue(v)}</Meter.Value>
          <Meter.Track>
            <Meter.Indicator />
          </Meter.Track>
        </Meter.Root>
        <div className='actions'>
          <Button
            variant='outline'
            onClick={() => setValue((v) => Math.min(64, (v ?? 30) + 8))}
          >
            {t.allocate8Gib}
          </Button>
          <Button variant='ghost' onClick={() => setValue(0)}>
            {t.releaseAllocation}
          </Button>
        </div>
        <p>{t.capacityNote}</p>
      </div>
    )
  return (
    <div className='example-stack'>
      <div className='actions'>
        <Button variant='outline' onClick={() => setLoading((v) => !v)}>
          {loading ? t.finishPreviewLoading : t.reloadPreview}
        </Button>
      </div>
      <section
        aria-label={t.environmentPreview}
        aria-busy={loading}
        className='example-stack'
      >
        {loading ? (
          id === 'spinner' ? (
            <div className='actions'>
              <Spinner decorative size='small' />
              <Spinner decorative />
              <Spinner decorative size='large' />
              <span>{t.loadingEnvironmentPreview}</span>
            </div>
          ) : (
            <>
              <div className='actions'>
                <Skeleton shape='circle' />
                <div style={{ flex: 1 }}>
                  <Skeleton style={{ width: '55%' }} />
                  <Skeleton style={{ marginTop: 12, width: '80%' }} />
                </div>
              </div>
              <Skeleton shape='block' />
            </>
          )
        ) : (
          <p>{t.servicesAvailable}</p>
        )}
      </section>
      <p role='status'>
        {loading ? t.loadingEnvironmentPreview : t.environmentPreviewLoaded}
      </p>
      {id === 'spinner' && (
        <div className='actions'>
          <Spinner label={t.backgroundSyncInProgress} />
          <span>{t.standaloneStatusExample}</span>
        </div>
      )}
      {id === 'skeleton' && <p>{t.placeholderNote}</p>}
    </div>
  )
}
