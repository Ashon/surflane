import type { Locale } from '../../i18n'

const en = {
  chartType: 'Chart type',
  lineType: 'Line',
  barType: 'Bar',
  areaType: 'Area',
  chartData: 'Chart data',
  trendOption: 'Trend with a missing value',
  mixedOption: 'Negative and zero values',
  denseOption: '120 long resource labels',
  missingOption: 'All values unavailable',
  emptyOption: 'No rows',
  numberLocale: 'Number locale',
  lockSeriesSelection: 'Lock series selection',
  chartTitle: 'Pipeline activity',
  descriptions: {
    trend:
      'Six sample days. Workspace rises from 12 to 27 runs. Inventory has no measurement on October 3, so its line keeps a gap.',
    mixed:
      'Sample changes include negative, zero, and positive resource counts. Every bar starts at the zero baseline. Missing values stay unavailable.',
    dense:
      '120 sample resources with long Korean and English labels. Only axis labels are abbreviated. The data table keeps every label and measurement.',
    missing:
      'Two reports have no finite numeric measurement. Missing and invalid values are unavailable, never zero.',
    empty:
      'No reports in this sample scope. The empty state shows no fabricated trend.',
    latency:
      'P95 latency over six days, between 144 and 230 ms. Far from zero, so the value axis can start near the lowest value.',
    buckets:
      'Daily runs by duration in five buckets. Categories that color must tell apart use the categorical palette.',
    memory:
      'Memory in use over six days, from 1.1 to 5.6 GB. The data holds raw bytes, and formatValue reads them as GB in the readout, the table and the value axis.',
    gpu: 'GPU temperature on two nodes every 10 minutes for a day, against a 70 °C warning and an 85 °C limit. The exporter stopped from 03:00 to 04:00, so both lines break there.',
    tokens:
      'Tokens a day by kind over a week, stacked so the top of each bar is the day’s total.',
    throughput:
      'Prefill runs at thousands of tokens a second and decode at tens. A log value axis keeps both readable on one chart.',
    disk: 'Disk used by one directory, measured every hour. The value holds until the next measurement, so a step line shows it.',
    projects:
      'Tokens a day for twelve projects. Twelve categorical colors stay apart, and the legend shows four and folds the rest.',
  },
  reportingDay: 'Reporting day',
  resource: 'Resource',
  resourceChange: 'Resource change',
  pipelineRunCount: 'Pipeline run count',
  allSeriesVisible: 'All series are visible.',
  rejectedChange:
    'Series selection unchanged. The example rejected this change.',
  hiddenSeries: (n: number) =>
    `${n} hidden series. The data table still shows every series.`,
  selectionResultLabel: 'Chart selection result',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    chartType: '차트 유형',
    lineType: '라인',
    barType: '바',
    areaType: '에어리어',
    chartData: '차트 데이터',
    trendOption: '누락 값이 있는 추세',
    mixedOption: '음수 및 0 값',
    denseOption: '긴 리소스 라벨 120개',
    missingOption: '모든 값 사용 불가',
    emptyOption: '행 없음',
    numberLocale: '숫자 로케일',
    lockSeriesSelection: '시리즈 선택 잠금',
    chartTitle: '파이프라인 활동',
    descriptions: {
      trend:
        '샘플 6일간의 데이터입니다. Workspace는 12에서 27 runs로 상승합니다. Inventory는 10월 3일에 측정값이 없어 선에 갭이 남습니다.',
      mixed:
        '샘플 변경값에는 음수, 0, 양수 리소스 개수가 포함됩니다. 모든 바는 0 기준선에서 시작합니다. 누락 값은 계속 사용 불가로 유지됩니다.',
      dense:
        '긴 한국어와 영어 라벨을 가진 샘플 리소스 120개입니다. 축 라벨만 축약됩니다. 데이터 테이블은 모든 라벨과 측정값을 유지합니다.',
      missing:
        '두 보고서 모두 유한한 숫자 측정값이 없습니다. 누락 및 잘못된 값은 0이 아니라 사용 불가로 처리됩니다.',
      empty:
        '이 샘플 범위에는 보고서가 없습니다. 빈 상태는 조작된 추세를 표시하지 않습니다.',
      latency:
        '6일 동안의 P95 지연 시간으로, 144~230ms 사이입니다. 0에서 멀어서 값 축을 가장 낮은 값 근처에서 시작할 수 있습니다.',
      buckets:
        '하루 실행 수를 소요 시간에 따라 다섯 구간으로 나눴습니다. 색으로 구분해야 하는 범주라 범주형 팔레트를 씁니다.',
      memory:
        '6일 동안의 메모리 사용량으로, 1.1~5.6GB 사이입니다. 데이터는 바이트 그대로이고, formatValue가 읽기 값과 표, 값 축에서 GB로 보여 줍니다.',
      gpu: '노드 두 대의 GPU 온도를 하루 동안 10분마다 잰 값과 70 °C 주의선, 85 °C 한계선입니다. 03:00부터 04:00까지 수집기가 멈춰 두 선 모두 그 구간에서 끊깁니다.',
      tokens:
        '한 주 동안 종류별로 쓴 하루 토큰 수입니다. 쌓아서 막대 꼭대기가 그날의 합계가 됩니다.',
      throughput:
        'prefill은 초당 수천 토큰, decode는 초당 수십 토큰입니다. 로그 값 축이면 한 차트에서 둘 다 읽힙니다.',
      disk: '디렉토리 하나의 디스크 사용량을 한 시간마다 잰 값입니다. 다음 측정까지 값이 그대로이므로 계단선으로 보여 줍니다.',
      projects:
        '프로젝트 12개의 하루 토큰 수입니다. 범주형 12색이 서로 구분되고, 범례는 4개만 보이고 나머지는 접습니다.',
    },
    reportingDay: '보고일',
    resource: '리소스',
    resourceChange: '리소스 변경',
    pipelineRunCount: '파이프라인 실행 횟수',
    allSeriesVisible: '모든 시리즈가 표시됩니다.',
    rejectedChange:
      '시리즈 선택이 변경되지 않았습니다. 예제가 이 변경을 거부했습니다.',
    hiddenSeries: (n: number) =>
      `${n}개 시리즈가 숨겨져 있습니다. 데이터 테이블에는 여전히 모든 시리즈가 표시됩니다.`,
    selectionResultLabel: '차트 선택 결과',
  },
}
