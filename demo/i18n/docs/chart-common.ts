type Marks = 'line' | 'area' | 'bar'

// The Korean of demo/docs/chart-common.ts: the keyboard and the props rows the
// three chart pages share. Named without .ko.ts so the page loader skips it.
export const chartKeyboardKo = (marks: Marks): string[] => [
  'Tab은 범례 버튼, 차트, 데이터 테이블 토글에 도달합니다.',
  '차트에 포커스가 있으면 Left와 Right로 데이터 포인트 사이를 이동합니다.',
  '범례 버튼의 Enter나 Space는 시리즈를 표시하거나 숨기며, aria-pressed가 표시 여부를 알립니다. 숨겨진 시리즈는 데이터 테이블에 유지됩니다.',
  'View data table은 Enter나 Space로 펼쳐지는 네이티브 details 요소입니다. 긴 테이블은 양축으로 스크롤됩니다. 단위는 시리즈 헤더에 한 번만 쓰고, 셀에는 전체 값을 끝에 맞춰 둡니다.',
  'Escape는 상세를 지우고, 화살표 키는 다시 표시합니다.',
  '포인터, 터치, 화살표 키로 고른 지점의 값이 그 옆 상자에 뜹니다. 상자는 공간이 넓은 쪽으로 열리고 플롯 밖으로 나가지 않습니다. 같은 값이 플롯 아래 상세 영역에도 채워지는데, 이 영역은 마크를 가리지 않는 polite live region입니다. 상자 자체는 접근성 트리에서 빠집니다.',
  ...(marks === 'bar'
    ? [
        '채움 패턴이 색 외에 막대를 구분하고, 범례에도 같은 패턴을 그립니다. 고대비 모드에서도 유지됩니다.',
      ]
    : [
        `원, 사각형, 삼각형 마커와 선 패턴${marks === 'area' ? ', 그 아래의 채움 패턴' : ''}이 색 외에 시리즈를 구분합니다. 고대비 모드에서도 유지됩니다.`,
        '대시를 끄면 마커가 그 구분을 혼자 담당하므로, 대시를 둔 차트가 40포인트 이상에서 마커를 지울 때도 실선으로 긋는 차트는 마커를 남깁니다.',
        '40포인트를 넘으면 플롯이 겹침을 줄이기 위해 마커를 생략합니다. 범례 마커, 선 패턴, 상세, 테이블은 유지됩니다.',
      ]),
  '애니메이션은 기본적으로 꺼져 있습니다.',
  '제품 통합 후 실제 보조 기술 사용성을 별도로 테스트하세요.',
]
const comparisonRowKo: Record<Marks, string> = {
  line: '다른 시리즈를 견주는 기준, 벤치마크 같은 것. 흐린 잉크에 조용한 선 굵기로 다른 시리즈 아래에 그립니다',
  area: '다른 시리즈를 견주는 기준, 벤치마크 같은 것. 흐린 잉크에 조용한 선 굵기로 다른 시리즈 아래에 그리고 쌓기에 넣지 않습니다',
  bar: '다른 시리즈를 견주는 기준, 작년 같은 것. 흐린 잉크로, 범례 순서에 두고 쌓기에 넣지 않습니다',
}
const planRowKo: Record<Marks, string> = {
  line: '실제 값 옆의 목표처럼 이 시리즈가 계획하는 시리즈의 key. 그 시리즈의 색과 표식에 점선으로, 조용한 선 굵기로 그 아래에 그리고, 계획되는 시리즈는 실선으로 둡니다',
  area: '실제 값 옆의 목표처럼 이 시리즈가 계획하는 시리즈의 key. plan은 채울 양이 아니라 닿을 수준이므로, 그 시리즈의 색과 표식으로 점선만, 조용한 선 굵기로 그 아래에 그리고 쌓기에 넣지 않습니다',
  bar: '실제 값 옆의 목표처럼 이 시리즈가 계획하는 시리즈의 key. plan은 채울 양이 아니라 닿을 수준이므로, 그 시리즈 옆에 그 색의 채우지 않은 점선 막대로, 조용한 선 굵기로, 범례 순서에 두고 쌓기에 넣지 않습니다',
}
/** The Korean of the rows every chart page lists, minus the rows each page adds
 * of its own; the keys match the English table's first column exactly. */
export const chartPropsKo = (marks: Marks): Record<string, string> => ({
  'title / description / xLabel / yLabel / unit':
    '필수 문자열 라벨, 사실 요약, 공유 단위',
  data: '읽기 전용 {id, label, values: Record<seriesKey, number | null | undefined>}[]; 고유한 비어 있지 않은 id',
  series:
    '읽기 전용 {key, label, color?}[]; 고유한 비어 있지 않은 key. color는 시리즈 하나의 팔레트 색을 바꿉니다',
  'series[].comparison': comparisonRowKo[marks],
  'series[].planOf': planRowKo[marks],
  height:
    "유한 픽셀 높이, 최소 200(compact는 120). 'fill'은 늘어난 대시보드 패널처럼 컨테이너 높이를 채우고, 제목과 범례가 남긴 자리를 플롯에 줍니다. 기본 높이보다 작아지지는 않습니다",
  'xScale / data[].time':
    marks === 'bar'
      ? 'category는 행을 라벨로 고르게 놓고, time은 시각(ms 또는 Date)으로 놓아 각 막대를 제 시각에 가운데 두며, 둥근 시각에 눈금을 둡니다'
      : 'category는 행을 라벨로 고르게 놓고, time은 시각(ms 또는 Date)으로 놓아 둥근 시각에 눈금을 두고 평소 간격의 두 배 넘게 빈 곳에서 선을 끊습니다',
  references:
    '읽기 전용 ({y, label, tone?} | {from, to, label, tone?} | {x, label, tone?} | {xFrom, xTo, label, tone?})[]: 값 축이 닿는 임계선과 띠, 데이터 id나 시각에 놓는 사건 선과 기간. neutral, caution, danger로 칠합니다. 범례가 값이나 자리와 함께 이름을 적고, 행을 살피면 그 행의 사건과 기간을 말합니다',
  density:
    'default | compact: compact는 플롯, 범례, 떠 있는 값만 보이고 캡션, 도움말, 값 영역은 보조 기술에만 남깁니다',
  minimal:
    '카드 위 추세처럼 표시만 남깁니다. 축, 격자, 범례, 축 이름은 화면에서 빠지고, 값 영역, 키보드, 기준선, 데이터 표는 남으며, 축 이름은 보조 기술에 남고, 데이터 표 펼침은 키보드 포커스가 닿을 때만 보입니다',
  extremes:
    '처음 보이는 시리즈의 가장 큰 값과 가장 작은 값에 값과 행의 label을 붙입니다. 기간의 고점과 저점 같은 것',
  'legendPosition / legendLimit':
    'top | bottom / 범례에 보일 항목 수. 시리즈, 기준선·이벤트, 차이의 두 쪽 순서이며 나머지는 "+N" 팝오버로 접습니다. auto는 한 줄에 들어가는 만큼 보입니다',
  palette:
    marks === 'bar'
      ? 'neutral | categorical | extended: 잉크에 채움 패턴으로 구분하거나, 범주에는 열두 색상, 시리즈가 열둘을 넘으면 같은 열두 색조를 한 단계 다른 스물넷을 씁니다. 두 번째 열둘은 채움 패턴도 한 단계 어긋나게 시작하므로, 12개씩 떨어진 시리즈가 색과 패턴을 동시에 공유하지는 않습니다'
      : 'neutral | categorical | extended: 잉크에 대시와 마커로 구분하거나, 범주에는 열두 색상, 시리즈가 열둘을 넘으면 같은 열두 색조를 한 단계 다른 스물넷을 씁니다. 두 번째 열둘은 대시와 마커도 한 단계 어긋나게 시작하므로, 12개씩 떨어진 시리즈가 색과 대시와 모양을 동시에 공유하지는 않습니다',
  ...(marks === 'bar'
    ? {
        '--surf-chart-line-width / --surf-chart-line-quiet-ratio':
          '토큰: plan의 점선 윤곽이 두 값을 곱한 굵기로 그려집니다. 다른 차트에서 plan 선이 그어지는 굵기입니다',
      }
    : {
        '--surf-chart-line-width':
          '토큰: 시리즈 선의 굵기. 범례 견본도 이 굵기를 따릅니다. :root에 주면 모든 차트에, 차트 하나에 주면 그 차트에만 적용됩니다',
        '--surf-chart-line-quiet-ratio':
          '토큰: 비교나 plan 선이 그 굵기에서 차지하는 몫. 1이면 플롯의 모든 선이 같은 굵기가 됩니다',
      }),
  'locale / formatValue':
    'Intl 숫자·날짜 locale. 숫자 도우미처럼 받습니다. 서버가 차트를 그리면 넘겨서 브라우저와 글자가 같게 하세요 / 선택적 유한 값 포맷터(단위 추가)',
  'hiddenSeries / defaultHiddenSeries / onHiddenSeriesChange':
    '제어 또는 비제어 숨김 키; 콜백이 다음 키를 요청',
  labels:
    '차트가 보여 주거나 알리는 텍스트: missing, empty, noSeries, showAll, keyboardHelp, values, viewTable, table, tableCaption, inspectHint, noRows, legend(title), series(label), moreSeries(count), moreEntries(count), total, high, low',
  ChartSeriesMark: `{type, index, palette, color, comparison, plan, dashes}: 범례가 그리는 시리즈 견본. 직접 만든 범례에 쓰며, type='${marks}'에 견본이 가리키는 시리즈의 플래그를 그대로 넘깁니다`,
  'ref / className / figure props':
    '루트 HTMLElement ref와 네이티브 figure 속성',
  Chart:
    "더는 권하지 않습니다. LineChart, AreaChart, BarChart를 하나로 합쳐 type='line' | 'bar' | 'area'로 고르는 차트로, 표시가 읽는지와 상관없이 모든 차트의 prop을 받습니다",
})
