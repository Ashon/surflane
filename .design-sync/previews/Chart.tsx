import { Chart } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const days = [
  'Oct 18',
  'Oct 19',
  'Oct 20',
  'Oct 21',
  'Oct 22',
  'Oct 23',
  'Oct 24',
]

const regions = [
  { key: 'us-east-1', label: 'us-east-1' },
  { key: 'eu-west-2', label: 'eu-west-2' },
  { key: 'ap-northeast-2', label: 'ap-northeast-2' },
]

const latency = days.map((label, i) => ({
  id: `latency-${i}`,
  label,
  values: {
    'us-east-1': [182, 176, 190, 171, 160, 152, 144][i],
    'eu-west-2': [230, 221, 226, 214, 205, 201, 198][i],
    'ap-northeast-2': [158, 161, 155, 162, 150, 149, 152][i],
  },
}))

export const Line = () => (
  <Chart
    title='checkout-api p95 latency'
    description='All three regions got faster this week; us-east-1 fell from 182 ms to 144 ms.'
    xLabel='Day'
    yLabel='p95 latency'
    unit='ms'
    type='line'
    includeZero={false}
    data={latency}
    series={regions}
  />
)

const deploys = days.map((label, i) => ({
  id: `deploys-${i}`,
  label,
  values: {
    production: [6, 9, 4, 11, 8, 2, 1][i],
    staging: [14, 18, 12, 21, 17, 5, 3][i],
  },
}))

export const Bar = () => (
  <Chart
    title='Deployments per day'
    description='Staging takes about twice as many deployments as production; both drop on the weekend.'
    xLabel='Day'
    yLabel='Deployments'
    unit='deploys'
    type='bar'
    data={deploys}
    series={[
      { key: 'production', label: 'Production' },
      { key: 'staging', label: 'Staging' },
    ]}
  />
)

const errors = days.map((label, i) => ({
  id: `errors-${i}`,
  label,
  values: {
    '5xx': [0.4, 0.5, 0.3, 2.8, 1.1, 0.6, 0.5][i],
    '4xx': [1.9, 2.1, 2.0, 2.4, 2.2, 1.8, 1.7][i],
  },
}))

export const Area = () => (
  <Chart
    title='search-indexer error rate'
    description='5xx errors spiked to 2.8% on October 21 during the v1.8.3 rollout and recovered after the rollback.'
    xLabel='Day'
    yLabel='Error rate'
    unit='%'
    type='area'
    data={errors}
    series={[
      { key: '5xx', label: '5xx responses' },
      { key: '4xx', label: '4xx responses' },
    ]}
  />
)

const bucketSeries = [
  { key: 'under-1', label: 'Under 1 min' },
  { key: 'to-5', label: '1–5 min' },
  { key: 'to-15', label: '5–15 min' },
  { key: 'to-60', label: '15–60 min' },
  { key: 'over-60', label: 'Over 60 min' },
]
const buckets = days.slice(0, 6).map((label, i) => ({
  id: `buckets-${i}`,
  label,
  values: {
    'under-1': [40, 44, 38, 47, 52, 50][i],
    'to-5': [28, 31, 33, 30, 35, 37][i],
    'to-15': [12, 10, 14, 13, 11, 9][i],
    'to-60': [5, 6, 4, 7, 5, 4][i],
    'over-60': [1, 0, 2, 1, 0, 1][i],
  },
}))

export const Categorical = () => (
  <Chart
    title='CI pipeline duration'
    description='Most runs finish within five minutes; runs over an hour stay at two or fewer a day.'
    xLabel='Day'
    yLabel='Pipeline runs'
    unit='runs'
    type='bar'
    palette='categorical'
    data={buckets}
    series={bucketSeries}
  />
)

const throughput = days.map((label, i) => ({
  id: `rps-${i}`,
  label,
  values: {
    api: [1180, 1240, 1210, 1302, 1265, 1190, 1150][i],
    worker: [420, 455, null, null, 470, 440, 410][i],
  },
}))

export const MissingValues = () => (
  <Chart
    title='Requests per second'
    description='billing-worker sent no metrics on October 20 and 21; the line breaks rather than dropping to zero.'
    xLabel='Day'
    yLabel='Throughput'
    unit='req/s'
    type='line'
    data={throughput}
    series={[
      { key: 'api', label: 'checkout-api' },
      { key: 'worker', label: 'billing-worker' },
    ]}
  />
)
