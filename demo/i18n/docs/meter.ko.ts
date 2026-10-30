import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '메모리나 저장소 사용량처럼 알려진 범위 내 측정값을 표시합니다. 값을 단위와 함께 보여주세요. low, high, optimum은 네이티브 meter 요소처럼 범위를 나눕니다. 가장 좋은 범위에서는 채움 색이 그대로이고, 한 범위 떨어지면 caution, 두 범위 떨어지면 danger가 됩니다. Target은 트랙을 가로지르는 목표를, Tick은 트랙 아래의 눈금을 표시하고, 둘 다 미터의 설명에 이름이 들어갑니다.',
  avoid:
    '작업 완료나 길이를 모르는 로딩에는 Meter가 아닌 Progress를 사용하세요. 색만으로 위험을 판단하게 하지 마세요. 텍스트로도 위험을 설명하세요.',
  keyboard:
    'Meter는 읽기 전용 측정이며 Tab 순서에 없습니다. 측정 대상과 단위를 Label과 aria-valuetext에 설명하세요. RTL에서도 채움은 논리적 시작에서 자랍니다.',
  props: {
    'Root.aria-valuetext / getAriaValueText': '사람이 읽을 수 있는 단위',
    'Root.low / high / optimum':
      'low에서 낮은 범위가 끝나고 high에서 높은 범위가 시작합니다. optimum이 속한 범위가 가장 좋고, 한 범위 떨어지면 caution, 두 범위 떨어지면 danger로 채웁니다',
    'Target.value / label':
      'value에서 트랙을 가로지르는 목표. "목표 40%"처럼 설명에 이름이 들어갑니다',
    'Tick.value / label':
      '트랙 아래의 눈금. label을 주면 이정표로 설명에 이름이 들어갑니다',
  },
}
