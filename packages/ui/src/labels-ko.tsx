'use client'
import * as React from 'react'
import {
  LabelsProvider,
  type LabelOverrides,
  type SurflaneLabels,
} from './labels.js'

const kilo = 1024
/** Korean labels for every group. Modifier key names stay English, as Korean
 * keyboards print them. */
export const koLabels: SurflaneLabels = {
  appShell: {
    collapse: '사이드바 접기',
    expand: '사이드바 펼치기',
    menu: '내비게이션 열기',
  },
  banner: { dismiss: '닫기' },
  chart: {
    missing: '없음',
    empty: '표시할 숫자 측정값이 없습니다.',
    noSeries: '선택한 시리즈가 없습니다.',
    showAll: '모든 시리즈 보기',
    keyboardHelp:
      '차트에 포커스를 두고 왼쪽/오른쪽 화살표로 지점을 살펴보세요. Escape는 자세히 보기를 지웁니다. 데이터 표에는 모든 시리즈가 있습니다.',
    values: (title) => `${title} 값`,
    viewTable: '데이터 표로 보기',
    table: (title) => `${title} 데이터 표`,
    tableCaption: (unit) =>
      `숨긴 시리즈를 포함한 모든 측정값입니다. 단위: ${unit}.`,
    inspectHint:
      '마우스를 올리거나 터치하거나 차트 화살표 키로 측정값을 살펴보세요.',
    noRows: '행이 없습니다.',
    legend: (title) => `${title} 시리즈`,
    series: (label) => `${label} 시리즈`,
    moreSeries: (count) => `시리즈 ${count}개 더 보기`,
    moreEntries: (count) => `범례 ${count}개 더 보기`,
    total: '합계',
    high: '고점',
    low: '저점',
  },
  scatterChart: {
    missing: '없음',
    empty: '표시할 점이 없습니다.',
    keyboardHelp:
      '차트에 포커스를 두고 왼쪽/오른쪽 화살표로 점을 왼쪽부터 차례로 살펴보세요. Home과 End는 처음과 마지막 점입니다. Escape는 자세히 보기를 지웁니다. 데이터 표에는 모든 점이 있습니다.',
    values: (title) => `${title} 값`,
    viewTable: '데이터 표로 보기',
    table: (title) => `${title} 데이터 표`,
    tableCaption: '두 값이 다 없는 점까지 모든 점입니다.',
    inspectHint:
      '마우스를 올리거나 터치하거나 차트 화살표 키로 점을 살펴보세요.',
    noRows: '행이 없습니다.',
    legend: (title) => `${title} 범례`,
    group: '그룹',
    quadrant: '사분면',
  },
  codeBlock: {
    label: '코드',
    copy: '코드 복사',
    copied: '복사함',
    copyError: '복사할 수 없음',
  },
  copyButton: { copy: '복사', copied: '복사함', copyError: '복사할 수 없음' },
  dashboardPanel: {
    about: (title) => `${title} 설명`,
    loading: '불러오는 중',
    refreshing: '새로 고치는 중',
    error: '이 패널을 불러오지 못했습니다.',
    stale: '마지막으로 받은 값입니다. 패널을 새로 고치지 못했습니다.',
    retry: '다시 시도',
    empty: '이 기간에 데이터가 없습니다.',
  },
  dataState: {
    loading: '불러오는 중',
    refreshing: '새로 고치는 중',
    error: '불러오지 못했습니다.',
    stale: '마지막으로 받은 값입니다. 새로 고치지 못했습니다.',
    retry: '다시 시도',
    empty: '아직 보여 줄 것이 없습니다.',
  },
  descriptionList: {
    empty: '설정 안 됨',
    copy: '복사',
    copied: '복사함',
    copyError: '복사할 수 없음',
  },
  dialog: { close: '대화상자 닫기', focusBoundary: '대화상자 탐색 계속' },
  fileUpload: {
    choose: '파일 선택',
    drop: '또는 여기에 파일을 놓으세요',
    upload: '올리기',
    retry: '다시 시도',
    cancel: '취소',
    remove: '빼기',
    status: {
      ready: '준비됨',
      uploading: '올리는 중',
      success: '올림',
      error: '실패',
      canceled: '취소됨',
    },
    rejection: ({ file, reason }) =>
      `${file.name}: ${reason === 'type' ? '받지 않는 파일 형식입니다' : reason === 'size' ? '파일이 너무 큽니다' : reason === 'count' ? '파일 개수 한도에 닿았습니다' : '이미 고른 파일입니다'}.`,
    changed: (count) => `파일 ${count}개를 골랐습니다.`,
    complete: (file) => `${file.name}: 올렸습니다.`,
    canceled: (file) => `${file.name}: 올리기를 취소했습니다.`,
    failed: (file) => `${file.name}: 올리지 못했습니다.`,
    reset: '파일을 비웠습니다.',
    progress: (file) => `${file.name} 올리기 진행`,
    uploadError: '올리지 못했습니다. 다시 시도하세요.',
    size: (bytes) => {
      const unit = bytes >= kilo * kilo ? 'MB' : bytes >= kilo ? 'KB' : 'B'
      const scale = unit === 'MB' ? kilo * kilo : unit === 'KB' ? kilo : 1
      return `${new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 1 }).format(bytes / scale)} ${unit}`
    },
    fileAction: (action, file) => `${file.name} ${action}`,
  },
  kbd: {
    command: 'Command',
    control: 'Control',
    option: 'Option',
    shift: 'Shift',
    up: '위쪽 화살표',
    down: '아래쪽 화살표',
    left: '왼쪽 화살표',
    right: '오른쪽 화살표',
  },
  markdown: {
    label: '마크다운 콘텐츠',
    code: (label, line) => `${label}: ${line}행의 코드`,
    table: (label, line) => `${label}: ${line}행의 표`,
    task: '할 일 항목',
    copy: '코드 복사',
    copied: '복사함',
    copyError: '복사할 수 없음',
  },
  pagination: {
    label: '페이지 탐색',
    previous: '이전 페이지',
    next: '다음 페이지',
    page: (page) => `${page}페이지`,
    more: '더 많은 페이지',
    summary: (page, pageCount) => `${pageCount}페이지 중 ${page}페이지`,
  },
  panel: { close: '패널 닫기', focusBoundary: '패널 탐색 계속' },
  select: { all: '전체', none: '없음', count: (count) => `${count}개 선택` },
  syntaxHighlighter: { label: '강조된 소스' },
  themeSwitch: {
    label: '테마',
    light: '라이트',
    dark: '다크',
    system: '시스템',
    next: (current, next) => `테마 ${current}, 누르면 ${next}`,
  },
  timeRangePicker: {
    range: '시간 범위',
    refresh: '새로 고침 간격',
    refreshNow: '지금 새로 고침',
  },
  toast: { region: '알림', close: '알림 닫기' },
  tree: {
    expand: (label) => `${label} 펼치기`,
    collapse: (label) => `${label} 접기`,
    scrollArea: (label) => `${label} 스크롤 영역`,
    empty: '항목이 없습니다.',
  },
}

/** Writes every component inside it in Korean. It takes no functions, so a Server
 * Component can render it; labels changes some over the Korean ones. */
export function KoreanLabels({
  labels,
  children,
}: {
  labels?: LabelOverrides
  children: React.ReactNode
}) {
  const merged = React.useMemo(() => {
    if (!labels) return koLabels
    const result: Record<string, object> = { ...koLabels }
    for (const [group, entries] of Object.entries(labels))
      result[group] = { ...result[group], ...entries }
    return result as LabelOverrides
  }, [labels])
  return <LabelsProvider labels={merged}>{children}</LabelsProvider>
}
