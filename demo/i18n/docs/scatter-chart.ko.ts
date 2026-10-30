import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '품질과 뉴스 감성에 따른 종목, 처리량과 지연에 따른 모델처럼 항목마다 두 측정값을 점 하나로 놓으세요. 제목, 사실 그대로의 요약, 두 축의 이름을 주고, 값에 단위가 있으면 단위도 주세요. groups는 정렬과 괴리처럼 점을 차트의 범주 색과 표식으로 나눕니다. 그룹 색은 직접 고를 수도 있습니다. 없으면 모든 점이 한 잉크입니다. references는 중간값이나 목표처럼 x나 y에 선을 긋습니다. 축마다 하나씩 있으면 플롯이 나뉘고, quadrants가 네 부분의 이름을 모서리에 씁니다. 점수의 0~10처럼 정해진 척도에는 xDomain과 yDomain을 주세요. 없으면 축은 점과 선을 감싸는 반올림한 값을 씁니다.',
  avoid: [
    '시간에 따른 측정에는 ScatterChart를 쓰지 마세요. Chart를 쓰세요.',
    '점을 사분면만으로 색칠하지 마세요. group을 주어 표식으로도 말하게 하거나, 사분면 이름이 위치를 말하게 하세요.',
    'description prop이 자동으로 추론한 분석이라고 기대하지 마세요. 호출하는 쪽이 쓴 사실 요약입니다.',
  ],
  keyboard: [
    'Tab으로 플롯과 데이터 표 토글에 갑니다.',
    '플롯에 포커스가 있으면 왼쪽/오른쪽으로 점을 왼쪽부터 차례로 살핍니다. x가 같으면 아래 점이 먼저입니다. Home과 End는 처음과 마지막 점입니다. Escape는 자세히 보기를 지웁니다.',
    '포인터, 터치, 화살표 키는 점에 고리를 두르고 그 옆 상자에 이름과 값을 보여 줍니다. 같은 값이 플롯 아래 자세히 보기 영역(polite 라이브 영역)에도 채워지고, 상자는 접근성 트리 밖에 둡니다.',
    '읽기와 표는 점마다 그룹과 사분면을 말합니다. 두 값이 다 없는 점은 플롯 밖, 표 안에 남습니다.',
    '원, 사각형, 삼각형 표식이 색 말고도 그룹을 나누고, 고대비 모드에서도 남습니다.',
  ],
  props: {
    'title / description': '차트의 이름 / 사실 요약',
    data: '읽기 전용 {id, label, x, y, group?}[]. 두 값이 다 없는 점은 표에 남습니다',
    groups: '읽기 전용 {key, label, color?}[]: 그룹마다 색과 표식',
    'xLabel / yLabel': '축 이름',
    'xUnit / yUnit': '값 뒤와 축 이름에 붙는 단위',
    'xDomain / yDomain': '[0, 10] 같은 축 범위',
    references:
      '읽기 전용 ({x, label, tone?} | {y, label, tone?})[]: 플롯을 가로지르는 선. 범례가 이름을 씁니다',
    quadrants:
      '{topLeft?, topRight?, bottomLeft?, bottomRight?}: 첫 x 선과 첫 y 선이 만드는 부분의 이름',
    height: '플롯 높이(px)',
    density: 'default | compact',
    'formatX / formatY / locale': '각 축의 값을 쓰는 함수 / Intl 숫자 locale',
    labels:
      'missing, empty, keyboardHelp, values(title), viewTable, table(title), tableCaption, inspectHint, noRows, legend(title), group, quadrant',
  },
}
