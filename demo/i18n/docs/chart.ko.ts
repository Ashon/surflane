import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '한 단위의 숫자 추세를 라인, 바, 에어리어 차트로 비교합니다. 항상 제목, 사실 요약, 단위가 있는 축 이름을 제공하세요. 시리즈는 기본적으로 브랜드와 중립 색상의 채움과 선을 쓰고, 대시와 마커로 구분합니다. 구간처럼 색으로 나눠야 하는 범주에는 palette="categorical"을 주세요. 가격이나 지연 시간처럼 0에서 먼 값에는 includeZero={false}를 주세요. 모니터링에서는 xScale="time"이 data[].time으로 행을 놓고 둥근 시각에 눈금을 두며 수집이 멈춘 곳이나 breakAfter보다 긴 공백에서 선을 끊습니다(영업일 종가라면 4일). references는 임계선과 목표 띠, x 축의 사건과 기간을, comparison 시리즈는 벤치마크처럼 조용한 비교선을, difference는 두 선 사이의 차이를, stacked는 합계를, curve="step"은 바뀔 때만 잰 값을, yScale="log"는 자릿수가 다른 값을 보여 줍니다. 대시보드 카드 안에서는 density="compact"가 플롯, 범례, 떠 있는 값만 남기고, 카드 위 추세에는 minimal이 표시만 남기며 extremes가 기간의 고점과 저점에 라벨을 붙입니다. 호출하는 쪽이 소유한 불변 배열로 data를 전달하세요.',
  avoid: [
    '한 축에 단위를 섞지 마세요. 대신 별도 차트를 사용하세요.',
    '한 측정값을 다른 측정값에 대어 놓을 때는 여기 말고 ScatterChart를 쓰세요. 항목마다 점 하나입니다.',
    '고를 수 있다면 한 차트에 시리즈를 일곱 개 넘게 넣지 마세요. 큰 것만 남기고 나머지는 기타로 합치거나 차트를 나누세요. 프로젝트별 토큰처럼 더 많이 비교해야 하는 모니터링 화면은 선을 모두 플롯에 두고, 범주형 12색을 쓰고, legendLimit으로 범례를 접습니다.',
    '누락 값을 0으로 대체하지 마세요. 대신 null을 전달하세요. 차트는 null, undefined, NaN, Infinity를 누락으로 처리하며 그 사이에 선을 연결하지 않습니다.',
    '두 번째 값 축을 기대하지 마세요. 다른 단위는 다른 차트에, 자릿수가 크게 다른 값은 yScale="log"에 두세요.',
    '부드러운 곡선을 기대하지 마세요. 선은 직선이나 계단이므로 차트가 측정되지 않은 극단값을 만들지 않습니다.',
    '차트가 로딩, 오류, 재시도 상태를 보여주기를 기대하지 마세요. 제품 화면에서 직접 만드세요.',
    'description prop이 자동 추론된 분석이기를 기대하지 마세요. 호출하는 쪽의 사실 요약을 담습니다.',
  ],
  keyboard: [
    'Tab은 범례 버튼, 차트, 데이터 테이블 토글에 도달합니다.',
    '차트에 포커스가 있으면 Left와 Right로 데이터 포인트 사이를 이동합니다.',
    '범례 버튼의 Enter나 Space는 시리즈를 표시하거나 숨기며, aria-pressed가 표시 여부를 알립니다. 숨겨진 시리즈는 데이터 테이블에 유지됩니다.',
    'View data table은 Enter나 Space로 펼쳐지는 네이티브 details 요소입니다. 긴 테이블은 양축으로 스크롤됩니다. 단위는 시리즈 헤더에 한 번만 쓰고, 셀에는 전체 값을 끝에 맞춰 둡니다.',
    'Escape는 상세를 지우고, 화살표 키는 다시 표시합니다.',
    '포인터, 터치, 화살표 키로 고른 지점의 값이 그 옆 상자에 뜹니다. 상자는 공간이 넓은 쪽으로 열리고 플롯 밖으로 나가지 않습니다. 같은 값이 플롯 아래 상세 영역에도 채워지는데, 이 영역은 마크를 가리지 않는 polite live region입니다. 상자 자체는 접근성 트리에서 빠집니다.',
    '원, 사각형, 삼각형 마커, 선 패턴, 바 채움 패턴이 색 외에 시리즈를 구분합니다. 고대비 모드에서도 유지됩니다.',
    '40포인트를 넘으면 플롯이 겹침을 줄이기 위해 마커를 생략합니다. 범례 마커, 선 패턴, 상세, 테이블은 유지됩니다.',
    '애니메이션은 기본적으로 꺼져 있습니다.',
    '제품 통합 후 실제 보조 기술 사용성을 별도로 테스트하세요.',
  ],
  props: {
    'title / description / xLabel / yLabel / unit':
      '필수 문자열 라벨, 사실 요약, 공유 단위',
    data: '읽기 전용 {id, label, values: Record<seriesKey, number | null | undefined>}[]; 고유한 비어 있지 않은 id',
    series:
      '읽기 전용 {key, label, color?}[]; 고유한 비어 있지 않은 key. color는 시리즈 하나의 팔레트 색을 바꿉니다',
    height:
      "유한 픽셀 높이, 최소 200(compact는 120). 'fill'은 늘어난 대시보드 패널처럼 컨테이너 높이를 채우고, 제목과 범례가 남긴 자리를 플롯에 줍니다. 기본 높이보다 작아지지는 않습니다",
    'xScale / data[].time':
      'category는 행을 라벨로 고르게 놓고, time은 시각(ms 또는 Date)으로 놓아 둥근 시각에 눈금을 두고 평소 간격의 두 배 넘게 빈 곳에서 선을 끊습니다',
    breakAfter:
      '시간 축에서 선이 건너 잇는 가장 긴 행 사이 공백(ms). 그보다 길면 선을 끊습니다. 영업일 종가라면 4일이 주말과 하루 휴일을 건너 잇고, 누락 값은 여전히 선을 끊습니다',
    yScale:
      'linear | log: log는 자릿수가 다른 값을 함께 보여 줍니다. 0과 음수는 플롯에서 빠지고 표에 남습니다',
    curve: 'linear | step: step은 다음 값까지 값을 유지합니다',
    stacked: '막대와 에어리어 시리즈를 쌓고, 값 영역에 합계를 더합니다',
    'series[].comparison':
      '다른 시리즈를 견주는 기준, 벤치마크 같은 것. 더 가늘고 흐린 잉크로 다른 시리즈 아래에 그립니다',
    'series[].planOf':
      '실제 값 옆의 목표처럼 이 시리즈가 계획하는 시리즈의 key. 그 시리즈의 색과 표식에 점선으로, 더 가늘게 그 아래에 그리고, 계획되는 시리즈는 실선으로 둡니다',
    difference:
      '{series, against, above, below}: 라인 차트에서 두 시리즈 사이를 series가 위면 trend-up 색, 아래면 trend-down 색으로 칠합니다. 범례가 두 쪽의 이름을 적고, 행을 살피면 어느 쪽인지와 차이를 말합니다. gap은 예전 이름이며 더는 권하지 않습니다',
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
    includeZero: '값 축에 0을 둡니다. 막대는 항상 0에서 시작합니다',
    palette:
      'neutral | categorical: 잉크와 대시, 마커로 구분하거나, 범주에 열두 색상을 씁니다',
    'locale / formatValue':
      'Intl 숫자·날짜 locale. 숫자 도우미처럼 받습니다. 서버가 차트를 그리면 넘겨서 브라우저와 글자가 같게 하세요 / 선택적 유한 값 포맷터(단위 추가)',
    'hiddenSeries / defaultHiddenSeries / onHiddenSeriesChange':
      '제어 또는 비제어 숨김 키; 콜백이 다음 키를 요청',
    labels:
      '차트가 보여 주거나 알리는 텍스트: missing, empty, noSeries, showAll, keyboardHelp, values, viewTable, table, tableCaption, inspectHint, noRows, legend(title), series(label), moreSeries(count), moreEntries(count), total, high, low',
    ChartSeriesMark:
      '{type, index, palette, color}: 범례가 그리는 시리즈 견본. 직접 만든 범례에 씁니다',
    'ref / className / figure props':
      '루트 HTMLElement ref와 네이티브 figure 속성',
  },
}
