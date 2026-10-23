import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '메모리나 저장소 사용량처럼 알려진 범위 내 측정값을 표시합니다. 값을 단위와 함께 보여주세요.',
  avoid:
    '작업 완료나 길이를 모르는 로딩에는 Meter가 아닌 Progress를 사용하세요. 색만으로 위험을 판단하게 하지 마세요. 텍스트로도 위험을 설명하세요.',
  keyboard:
    'Meter는 읽기 전용 측정이며 Tab 순서에 없습니다. 측정 대상과 단위를 Label과 aria-valuetext에 설명하세요. RTL에서도 채움은 논리적 시작에서 자랍니다.',
  props: {
    'Root.aria-valuetext / getAriaValueText': '사람이 읽을 수 있는 단위',
  },
}
