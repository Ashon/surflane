import React, { useState } from 'react'
import {
  Stack,
  Inline,
  Card,
  Grid,
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
        {/* Lower is better: past 40 GiB the fill turns caution, past 56 danger. */}
        <Meter.Root
          value={value ?? 30}
          min={0}
          max={64}
          low={40}
          high={56}
          optimum={0}
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
        {/* A share against its target, with the track marked in quarters. */}
        <Meter.Root value={34} aria-valuetext={t.bondShareText}>
          <Meter.Label>{t.bondShare}</Meter.Label>
          <Meter.Value>{() => t.bondShareValue}</Meter.Value>
          <Meter.Track>
            <Meter.Indicator />
            <Meter.Target value={40} label={t.bondTarget} />
            {[25, 50, 75].map((tick) => (
              <Meter.Tick key={tick} value={tick} />
            ))}
          </Meter.Track>
        </Meter.Root>
        {/* Indicators on cards: a half circle in its ranges, with the state in text. */}
        <Grid columns={2} gap={4}>
          <Card.Root>
            <Card.Body>
              {/* Higher is calmer: below 4.4 defense, up to 5.1 a narrow band
                  drawn as a dot, above it attack. */}
              <Meter.Root
                value={4.8}
                min={0}
                max={10}
                low={4.4}
                high={5.1}
                optimum={10}
                aria-valuetext={t.marketFearText}
              >
                <Inline justify='between' gap={4}>
                  <Stack gap={1}>
                    <Meter.Label>{t.marketFear}</Meter.Label>
                    <Meter.Value>
                      {(_, current) => (
                        <Text as='span' variant='metric'>
                          {current.toFixed(1)}
                        </Text>
                      )}
                    </Meter.Value>
                    <Text variant='caption' color='secondary'>
                      {t.conditionalDefense}
                    </Text>
                  </Stack>
                  <Meter.Arc />
                </Inline>
              </Meter.Root>
            </Card.Body>
          </Card.Root>
          <Card.Root>
            <Card.Body>
              {/* Lower is calmer: past 20 caution, past 30 danger. */}
              <Meter.Root
                value={17.2}
                min={10}
                max={40}
                low={20}
                high={30}
                optimum={10}
                aria-valuetext={t.vixText}
              >
                <Meter.Label>{t.vix}</Meter.Label>
                <Meter.Value>{(_, current) => current.toFixed(1)}</Meter.Value>
                <Meter.Arc />
              </Meter.Root>
            </Card.Body>
          </Card.Root>
        </Grid>
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
