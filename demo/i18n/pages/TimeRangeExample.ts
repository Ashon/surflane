import type { Locale } from '../../i18n'

const en = {
  dashboardTime: 'Dashboard time',
  ranges: [
    'Last 15 minutes',
    'Last hour',
    'Last 6 hours',
    'Last 24 hours',
    'Last 7 days',
    'Last 30 days',
  ],
  intervals: [
    'Off',
    'Every 10 seconds',
    'Every 30 seconds',
    'Every minute',
    'Every 5 minutes',
  ],
  labels: {
    range: 'Time range',
    refresh: 'Refresh interval',
    refreshNow: 'Refresh now',
  },
  status: (range: string, interval: string, count: number) =>
    `Showing ${range.toLowerCase()}. Refresh: ${interval.toLowerCase()}. Refreshed ${count} times.`,
  statusLabel: 'Time range result',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    dashboardTime: '대시보드 시간',
    ranges: [
      '최근 15분',
      '최근 1시간',
      '최근 6시간',
      '최근 24시간',
      '최근 7일',
      '최근 30일',
    ],
    intervals: ['끔', '10초마다', '30초마다', '1분마다', '5분마다'],
    labels: {
      range: '시간 범위',
      refresh: '새로 고침 간격',
      refreshNow: '지금 새로 고침',
    },
    status: (range: string, interval: string, count: number) =>
      `${range}을 보여 줍니다. 새로 고침: ${interval}. ${count}번 새로 고쳤습니다.`,
    statusLabel: '시간 범위 결과',
  },
}
