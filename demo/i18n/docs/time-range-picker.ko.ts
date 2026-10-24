import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '모니터링 화면이 지금부터 거꾸로 보여 줄 기간(예: 최근 24시간), 새로 고침 간격, 지금 새로 고침을 고르게 하세요. 기간과 간격은 밀리초라서 화면은 now − range를 요청하면 됩니다. 페이지 머리글이나 툴바에 두세요. 안의 Select는 가장 긴 옵션 폭에 맞습니다. timeRangeOptions와 refreshIntervalOptions의 라벨을 번역하거나 직접 만든 기간을 넘기세요.',
  avoid: [
    '두 날짜 사이의 고정 기간에는 쓰지 마세요. 옆에 DateRangePicker를 두세요.',
    '데이터가 바뀌는 것보다 자주 새로 고치지 마세요. 한 시간마다 바뀌는 데이터에 10초 간격은 요청만 늘립니다.',
  ],
  keyboard:
    '묶음 안에 Select 두 개와 버튼이 있고, 각각 이름을 가지고 Tab 순서에 들어갑니다. 간격은 페이지가 숨어 있는 동안 멈추고, 다시 보일 때 한 번 새로 고칩니다.',
  props: {
    label: '묶음의 이름',
    'range / onRangeChange / ranges':
      '지금부터의 기간(ms) / 그 변경 / {value, label}[] 기간 목록',
    'refreshInterval / onRefreshIntervalChange / refreshIntervals':
      '새로 고침 사이의 ms, 0은 끔. 빼면 간격 Select가 없습니다',
    onRefresh:
      '버튼과, 페이지가 보이는 동안 매 간격마다 실행됩니다. 빼면 버튼이 없습니다',
    labels: 'range, refresh, refreshNow: Select와 버튼의 이름',
    size: 'small | default | large',
  },
}
