import type { Locale } from '../../i18n'

const en = {
  dashboardTime: 'Dashboard time',
  overview: 'Cluster overview',
  gpu: 'GPU temperature',
  gpuDescription:
    'The hottest GPU on each node, measured every 10 minutes. 85 °C is the limit.',
  disk: 'Free disk',
  tokens: 'Tokens by project',
  tokensDescription: 'Prompt and completion tokens this week.',
  jobs: 'Failed jobs',
  latency: 'Request latency',
  belowLimit: 'Below 30 GiB',
  noFailures: 'No failed jobs in this range.',
  offline: 'The metrics service did not answer.',
  stateLabel: 'Panel states',
  states: {
    ready: 'Ready',
    loading: 'Loading',
    refreshing: 'Refreshing',
    error: 'Error',
  },
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    dashboardTime: '대시보드 시간',
    overview: '클러스터 개요',
    gpu: 'GPU 온도',
    gpuDescription:
      '노드마다 가장 뜨거운 GPU를 10분마다 잰 값입니다. 85 °C가 한계입니다.',
    disk: '남은 디스크',
    tokens: '프로젝트별 토큰',
    tokensDescription: '이번 주 프롬프트와 응답 토큰입니다.',
    jobs: '실패한 작업',
    latency: '요청 지연 시간',
    belowLimit: '30 GiB 미만',
    noFailures: '이 기간에 실패한 작업이 없습니다.',
    offline: '지표 서비스가 응답하지 않았습니다.',
    stateLabel: '패널 상태',
    states: {
      ready: '준비됨',
      loading: '불러오는 중',
      refreshing: '새로 고치는 중',
      error: '오류',
    },
  },
}
