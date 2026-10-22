import type { Locale } from '../../i18n'

const en = {
  intro:
    'Duration is the total time, and easing spreads progress over it. On the curve, time runs across and progress runs up.',
  easingRole: 'Easing role',
  stateFeedback: 'Fades and state changes',
  dialogRise: 'Dialog rise',
  toastStack: 'Toast stack',
  accelerationComparison: 'Acceleration comparison',
  linearComparison: 'Linear comparison',
  previewDuration: 'Preview duration',
  slowPreviewSuffix: ' (slow preview)',
  reducedMotionStatus: 'Reduced motion: static preview',
  motionPreviewEnabled: 'Motion preview enabled',
  graphTitle: 'Time to movement progress curve',
  graphDescription:
    'Horizontal axis: elapsed time from 0 to 100 percent. Vertical axis: movement progress from 0 to 100 percent. The marker follows the preview time slider.',
  timeAxisLabel: '100% time',
  previewTime: 'Preview time',
  readout: (time: string, progress: string) =>
    `Time ${time}% / Progress ${progress}%`,
  playPreview: 'Play easing preview',
  resetPreview: 'Reset easing preview',
  playbackStatusLabel: 'Easing playback status',
  tableLabel: 'Easing progress samples',
  caption: 'Progress at the same fraction of total time',
  elapsedTimeHeader: 'Elapsed time',
  movementProgressHeader: 'Movement progress',
  curveRead:
    'To read `cubic-bezier(x1, y1, x2, y2)`, find time x on the curve and take its y as progress. A steep slope means fast change.',
  curveLimits:
    "The system's curves never overshoot. 600ms is a slow preview, not a default.",
  cssEasingLink: 'W3C CSS Easing Functions',
  webAnimationsLink: 'Web Animations',
  phaseLabels: {
    Ready: 'Ready',
    'Completed without motion': 'Completed without motion',
    'Paused at preview time': 'Paused at preview time',
    Playing: 'Playing',
    Completed: 'Completed',
  },
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    intro:
      '지속 시간은 전체 시간이고, 이징은 그 시간에 진행을 나눕니다. 곡선의 가로축은 시간, 세로축은 진행률입니다.',
    easingRole: '이징 역할',
    stateFeedback: '페이드와 상태 변화',
    dialogRise: 'Dialog 상승',
    toastStack: 'Toast 스택',
    accelerationComparison: '가속 비교',
    linearComparison: '선형 비교',
    previewDuration: '미리보기 시간',
    slowPreviewSuffix: ' (느린 미리보기)',
    reducedMotionStatus: '모션 줄이기: 정지 미리보기',
    motionPreviewEnabled: '모션 미리보기 켜짐',
    graphTitle: '시간 대 이동 진행률 곡선',
    graphDescription:
      '가로축: 0~100퍼센트 경과 시간. 세로축: 0~100퍼센트 이동 진행률. 마커는 미리보기 시간 슬라이더를 따라갑니다.',
    timeAxisLabel: '시간 100%',
    previewTime: '미리보기 시간',
    readout: (time: string, progress: string) =>
      `시간 ${time}% / 진행률 ${progress}%`,
    playPreview: '이징 미리보기 재생',
    resetPreview: '이징 미리보기 초기화',
    playbackStatusLabel: '이징 재생 상태',
    tableLabel: '이징 진행률 샘플',
    caption: '전체 시간의 같은 비율에서 본 진행률',
    elapsedTimeHeader: '경과 시간',
    movementProgressHeader: '이동 진행률',
    curveRead:
      '`cubic-bezier(x1, y1, x2, y2)`를 읽을 때는 곡선에서 시간 x를 찾고 그 점의 y를 진행률로 보세요. 기울기가 가파를수록 빠르게 바뀝니다.',
    curveLimits:
      '이 시스템의 곡선은 오버슈트하지 않습니다. 600ms는 느린 미리보기이고 기본값이 아닙니다.',
    cssEasingLink: 'W3C CSS Easing Functions',
    webAnimationsLink: 'Web Animations',
    phaseLabels: {
      Ready: '준비됨',
      'Completed without motion': '모션 없이 완료',
      'Paused at preview time': '미리보기 시간에서 멈춤',
      Playing: '재생 중',
      Completed: '완료',
    },
  },
}
