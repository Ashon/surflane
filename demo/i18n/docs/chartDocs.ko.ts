import type { DocKo } from './types'

export const chartDocsKo: Record<string, DocKo> = {
  chart: {
    usage:
      '한 단위의 숫자 추세를 라인, 바, 에어리어 차트로 비교합니다. 항상 제목, 사실 요약, 단위가 있는 축 이름을 제공하세요. 시리즈는 기본적으로 브랜드와 중립 색상의 채움과 선을 사용합니다. 호출하는 쪽이 소유한 불변 배열로 data를 전달하세요.',
    avoid: [
      '한 축에 단위를 섞지 마세요. 대신 별도 차트를 사용하세요.',
      '한 화면에 많은 시리즈를 겹치지 마세요. 대신 필터나 별도 차트를 사용하세요.',
      '누락 값을 0으로 대체하지 마세요. 대신 null을 전달하세요. 차트는 null, undefined, NaN, Infinity를 누락으로 처리하며 그 사이에 선을 연결하지 않습니다.',
      '잘린 y축을 기대하지 마세요. 항상 0을 포함하고 음수 값을 유지합니다.',
      '부드러운 곡선을 기대하지 마세요. 선은 선형이므로 차트가 측정되지 않은 극단값을 만들지 않습니다.',
      '차트가 로딩, 오류, 재시도 상태를 보여주기를 기대하지 마세요. 제품 화면에서 직접 만드세요.',
      'description prop이 자동 추론된 분석이기를 기대하지 마세요. 호출하는 쪽의 사실 요약을 담습니다.',
    ],
    keyboard: [
      'Tab은 범례 버튼, 차트, 데이터 테이블 토글에 도달합니다.',
      '차트에 포커스가 있으면 Left와 Right로 데이터 포인트 사이를 이동합니다.',
      '범례 버튼의 Enter나 Space는 시리즈를 표시하거나 숨기며, aria-pressed가 표시 여부를 알립니다. 숨겨진 시리즈는 데이터 테이블에 유지됩니다.',
      'View data table은 Enter나 Space로 펼쳐지는 네이티브 details 요소입니다. 긴 테이블은 양축으로 스크롤되며 헤더, 단위, 전체 값을 포함합니다.',
      'Escape는 상세를 지우고, 화살표 키는 다시 표시합니다.',
      '포인터와 터치는 같은 상세 영역을 업데이트합니다. 고정 위치의 polite live region이며 마크를 가리지 않습니다.',
      '원, 사각형, 삼각형 마커, 선 패턴, 바 채움 패턴이 색 외에 시리즈를 구분합니다. 고대비 모드에서도 유지됩니다.',
      '40포인트를 넘으면 플롯이 겹침을 줄이기 위해 마커를 생략합니다. 범례 마커, 선 패턴, 상세, 테이블은 유지됩니다.',
      '애니메이션은 기본적으로 꺼져 있습니다.',
      '제품 통합 후 실제 보조 기술 사용성을 별도로 테스트하세요.',
    ],
    props: {
      'title / description / xLabel / yLabel / unit':
        '필수 문자열 라벨, 사실 요약, 공유 단위',
      data: '읽기 전용 {id, label, values: Record<seriesKey, number | null | undefined>}[]; 고유한 비어 있지 않은 id',
      series: '읽기 전용 {key, label}[]; 고유한 비어 있지 않은 key',
      height: '유한 픽셀 높이, 최소 200',
      'locale / formatValue':
        'Intl 숫자 locale / 선택적 유한 값 포맷터(단위 추가)',
      'hiddenSeries / defaultHiddenSeries / onHiddenSeriesChange':
        '제어 또는 비제어 숨김 키; 콜백이 다음 키를 요청',
      labels:
        '차트가 보여 주거나 알리는 텍스트: missing, empty, noSeries, showAll, keyboardHelp, values, viewTable, table, tableCaption',
      'ref / className / figure props':
        '루트 HTMLElement ref와 네이티브 figure 속성',
    },
  },
}
