import React, { useState } from 'react'
import {
  Stack,
  Inline,
  Text,
  Field,
  Button,
  Progress,
  Meter,
  Spinner,
  Skeleton,
  DataState,
  DescriptionList,
  Select,
  ChoiceLabel,
  Checkbox,
  type DataStateValue,
} from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/FeedbackExamples'
export { feedbackExampleIds } from './exampleGroups'
function DataStatePreview() {
  const t = text[useLocale().locale]
  const [state, setState] = useState<DataStateValue>('error')
  const [layout, setLayout] = useState<'inline' | 'block' | 'page'>('block')
  const [refreshing, setRefreshing] = useState(false)
  return (
    <Stack gap={5}>
      <Inline gap={3}>
        <Field.Root>
          <Field.Label>{t.dsState}</Field.Label>
          <Select
            width='content'
            value={state}
            onValueChange={(value) => setState(value as DataStateValue)}
            options={t.dsStates.map(([value, label]) => ({ value, label }))}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>{t.dsLayout}</Field.Label>
          <Select
            width='content'
            value={layout}
            onValueChange={(value) =>
              setLayout(value as 'inline' | 'block' | 'page')
            }
            options={t.dsLayouts.map(([value, label]) => ({ value, label }))}
          />
        </Field.Root>
        <ChoiceLabel
          control={
            <Checkbox.Root checked={refreshing} onCheckedChange={setRefreshing}>
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          {t.dsRefreshing}
        </ChoiceLabel>
      </Inline>
      {/* Retry brings the data back; focus moves to the region. */}
      <DataState
        state={state}
        layout={layout}
        refreshing={refreshing}
        onRetry={() => setState('ready')}
        aria-label={t.dsRegion}
        role='region'
      >
        <DescriptionList.Root>
          <DescriptionList.Item>
            <DescriptionList.Term>{t.dsRegionTerm}</DescriptionList.Term>
            <DescriptionList.Value>ap-northeast-2</DescriptionList.Value>
          </DescriptionList.Item>
          <DescriptionList.Item>
            <DescriptionList.Term>{t.dsInstances}</DescriptionList.Term>
            <DescriptionList.Value>6</DescriptionList.Value>
          </DescriptionList.Item>
        </DescriptionList.Root>
      </DataState>
    </Stack>
  )
}
export function FeedbackExample({ id }: { id: string }) {
  const t = text[useLocale().locale]
  if (id === 'data-state') return <DataStatePreview />
  const [value, setValue] = useState<number | null>(30)
  const [loading, setLoading] = useState(true)
  if (id === 'progress')
    return (
      <Stack gap={5}>
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
        <Inline gap={3}>
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
        </Inline>
        <Text color='secondary' role='status'>
          {value === 100 ? t.allChecksCompleted : t.previewOnly}
        </Text>
      </Stack>
    )
  if (id === 'meter')
    return (
      <Stack gap={5}>
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
        <Inline gap={3}>
          <Button
            variant='outline'
            onClick={() => setValue((v) => Math.min(64, (v ?? 30) + 8))}
          >
            {t.allocate8Gib}
          </Button>
          <Button variant='ghost' onClick={() => setValue(0)}>
            {t.releaseAllocation}
          </Button>
        </Inline>
        <Text color='secondary'>{t.capacityNote}</Text>
      </Stack>
    )
  return (
    <Stack gap={5}>
      <Inline gap={3}>
        <Button variant='outline' onClick={() => setLoading((v) => !v)}>
          {loading ? t.finishPreviewLoading : t.reloadPreview}
        </Button>
      </Inline>
      <Stack
        gap={5}
        role='region'
        aria-label={t.environmentPreview}
        aria-busy={loading}
      >
        {loading ? (
          id === 'spinner' ? (
            <Inline gap={3}>
              <Spinner decorative size='small' />
              <Spinner decorative />
              <Spinner decorative size='large' />
              <span>{t.loadingEnvironmentPreview}</span>
            </Inline>
          ) : (
            <>
              <Inline gap={3}>
                <Skeleton shape='circle' />
                <Skeleton lines={2} />
              </Inline>
              <Skeleton shape='block' />
            </>
          )
        ) : (
          <Text color='secondary'>{t.servicesAvailable}</Text>
        )}
      </Stack>
      <Text color='secondary' role='status'>
        {loading ? t.loadingEnvironmentPreview : t.environmentPreviewLoaded}
      </Text>
      {id === 'spinner' && (
        <Inline gap={3}>
          <Spinner label={t.backgroundSyncInProgress} />
          <span>{t.standaloneStatusExample}</span>
        </Inline>
      )}
      {id === 'skeleton' && <Text color='secondary'>{t.placeholderNote}</Text>}
    </Stack>
  )
}
