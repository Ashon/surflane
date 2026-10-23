import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '계열의 모양을 카드나 표 셀 안에서, 그것이 설명하는 수치 옆에 보여 주세요. 축, 범례, 툴팁이 없으니 label에 무엇을 보여 주고 어떻게 움직였는지 쓰세요. baseline에는 전일 종가 같은 기준값을 줍니다.',
  avoid: [
    '값을 읽어야 하는 곳에는 Sparkline을 쓰지 마세요. 축, 읽기 영역, 표가 있는 Chart를 쓰세요.',
    'label을 빼지 마세요. 선은 이미지라서, 스크린 리더가 듣는 것은 label뿐입니다.',
  ],
  keyboard:
    'Sparkline은 접근 가능한 이름이 있는 이미지입니다. 포커스를 받지 않고 상호작용도 없습니다.',
  props: {
    data: '(number | null)[]. 빠진 값은 선을 끊습니다',
    label: '선의 접근 가능한 이름',
    size: 'small | default | large: 높이 24, 32, 48px',
    baseline: "number | 'first' | 'none'",
    marker: '마지막 값의 점',
    trend: 'auto | up | down | flat | neutral',
    lowerIsBetter: '상승과 하락 색을 맞바꿉니다',
  },
}
