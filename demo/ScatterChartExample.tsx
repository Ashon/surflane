import React from 'react'
import { Stack } from '@surflane/ui'
import { ScatterChart, type ScatterPoint } from '@surflane/ui/scatter-chart'
import { useLocale } from './i18n'
import { text } from './i18n/pages/ScatterChartExample'

// Quality score and news sentiment, each out of 10.
const holdings = [
  ['northwind', 8.2, 7.1],
  ['vertex', 7.4, 6.2],
  ['pioneer', 6.8, 5.4],
  ['atlas', 6.1, 3.8],
  ['meridian', 5.6, 2.9],
  ['lumen', 4.6, 7.8],
  ['tidal', 4.2, 6.6],
  ['summit', 3.1, 5.9],
  ['beacon', 3.5, 4.1],
  ['cobalt', 2.8, 2.2],
] as const
// Throughput in tokens per second and 95th-percentile latency in ms.
const models = [
  ['drift-3b', 1680, 310],
  ['tide-8b', 1450, 420],
  ['gale-14b', 980, 560],
  ['reef-24b', 720, 690],
  ['swell-70b', 380, 1150],
  ['surge-120b', 290, 1380],
] as const

export function ScatterChartExample() {
  const { locale } = useLocale()
  const t = text[locale]
  const tag = locale === 'ko' ? 'ko-KR' : 'en-US'
  // A holding agrees when quality and sentiment are on the same side of 5.
  const points: ScatterPoint[] = holdings.map(([id, x, y]) => ({
    id,
    label: t.holding[id],
    x,
    y,
    group: x >= 5 === y >= 5 ? 'aligned' : 'diverged',
  }))
  return (
    <Stack gap={8}>
      <ScatterChart
        title={t.qualityTitle}
        description={t.qualityDescription}
        data={points}
        groups={[
          { key: 'aligned', label: t.aligned },
          { key: 'diverged', label: t.diverged },
        ]}
        xLabel={t.quality}
        yLabel={t.sentiment}
        xDomain={[0, 10]}
        yDomain={[0, 10]}
        references={[
          { x: 5, label: t.qualityMidpoint },
          { y: 5, label: t.sentimentMidpoint },
        ]}
        quadrants={{
          topRight: t.strongLiked,
          topLeft: t.weakLiked,
          bottomLeft: t.weakDisliked,
          bottomRight: t.strongDisliked,
        }}
        locale={tag}
      />
      <ScatterChart
        title={t.servingTitle}
        description={t.servingDescription}
        data={models.map(([id, x, y]) => ({ id, label: id, x, y }))}
        xLabel={t.throughput}
        xUnit={t.tokensPerSecond}
        yLabel={t.latency}
        yUnit='ms'
        references={[{ y: 800, label: t.latencyTarget, tone: 'caution' }]}
        locale={tag}
      />
    </Stack>
  )
}
