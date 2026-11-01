import type { DocKo } from './types'
import { chartKeyboardKo, chartPropsKo } from './chart-common'
export const doc: DocKo = {
  usage:
    '디스크 사용량이나 프로젝트별 토큰처럼 시간을 따라 흐르는 양을 에어리어로 채워 그리고, 쌓아서 맨 위가 합계가 되게 하세요. 채움은 양이므로 에어리어는 선형 축에서 항상 0에서 올라옵니다. 항상 제목, 사실 요약, 단위가 있는 축 이름을 제공하세요. 시리즈는 기본적으로 브랜드와 중립 색상의 채움을 쓰고, 채움 패턴과 대시, 마커로 구분합니다. 프로젝트처럼 색으로 나눠야 하는 범주에는 palette="categorical"을 주세요. 시리즈가 열둘을 넘는 곳에는 palette="extended"를 주세요. dashes={false}는 모든 윗선을 실선으로 긋습니다. stacked는 시리즈를 합계에 더하고 값 영역이 그 합계를 적습니다. 비교나 plan 시리즈는 목표처럼 점선만 따로 그리고 합계에 넣지 않습니다. xScale="time"에서는 행이 data[].time에 놓이고 에어리어가 수집이 멈춘 곳이나 breakAfter보다 긴 공백에서 끊깁니다. curve="step"은 디스크 사용량처럼 바뀔 때만 잰 값을 유지합니다. references는 임계선과 목표 띠, x 축의 사건과 기간을 그려 줍니다. 대시보드 카드 안에서는 density="compact"가 플롯, 범례, 떠 있는 값만 남기고, minimal이 표시만 남깁니다. 호출하는 쪽이 소유한 불변 배열로 data를 전달하세요.',
  avoid: [
    '가격처럼 0에서 먼 값이나 자릿수가 크게 다른 값은 채우지 마세요. 없는 양을 있는 것처럼 주장합니다. LineChart를 쓰되 includeZero={false}나 yScale="log"를 주세요.',
    '노드별 온도처럼 합해지지 않는 시리즈는 쌓지 마세요. 전체의 일부만 쌓고 나머지는 LineChart로 그리세요.',
    '고를 수 있다면 많은 시리즈를 쌓지 마세요. 각 겹이 아래 겹 위에 올라타므로 가장 아래 겹과 합계만 자기 변화를 읽힙니다. 큰 것만 남기고 나머지는 기타로 합치거나, LineChart로 변화를 비교하세요.',
    '한 축에 단위를 섞지 마세요. 대신 별도 차트를 사용하세요.',
    '누락 값을 0으로 대체하지 마세요. 대신 null을 전달하세요. 차트는 null, undefined, NaN, Infinity를 누락으로 처리하고 그 자리에서 에어리어를 끊습니다.',
    '차트가 로딩, 오류, 재시도 상태를 보여주기를 기대하지 마세요. 제품 화면에서 직접 만드세요.',
    'description prop이 자동 추론된 분석이기를 기대하지 마세요. 호출하는 쪽의 사실 요약을 담습니다.',
  ],
  keyboard: chartKeyboardKo('area'),
  props: {
    ...chartPropsKo('area'),
    stacked:
      '시리즈를 쌓아 맨 위가 합계가 되게 하고 값 영역에 그 합계를 더합니다. 비교나 plan 시리즈는 쌓인 값과 견주는 선이지 더할 몫이 아니므로 따로 그리고 합계에서 뺍니다',
    curve: 'linear | step: step은 다음 값까지 값을 유지합니다',
    breakAfter:
      '시간 축에서 에어리어가 건너 잇는 가장 긴 행 사이 공백(ms). 그보다 길면 에어리어가 끊깁니다. 누락 값은 여전히 끊습니다',
    dashes:
      'false면 모든 에어리어의 윗선을 실선으로 긋고 시리즈는 마커로 구분합니다. plan은 대시를 지킵니다. 그 대시가 plan을 plan답게 만들기 때문입니다',
  },
}
