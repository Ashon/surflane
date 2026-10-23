import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '독립 옵션을 선택하세요. 혼합 상태는 대시 SVG를 보여줍니다. 읽기 전용과 비활성 상태는 구분되어 보입니다.',
  avoid:
    '상호 배타적 옵션 중 하나를 고를 때 사용하지 마세요. RadioGroup을 사용하세요. 상태를 색으로만 구분하지 마세요. Indicator 아이콘도 상태를 보여주게 하세요.',
  keyboard:
    'Tab은 체크박스에 포커스를 줍니다. Space가 토글합니다. Base UI의 숨겨진 input이 라벨 클릭, 폼 제출, 리셋을 처리합니다.',
  props: {
    'Root.checked / defaultChecked': '제어/비제어 boolean',
    'Root.indeterminate / readOnly / disabled': '혼합 또는 사용 불가 상태',
    'Root.name / value / uncheckedValue': '네이티브 폼 값',
    'Root.size': 'small | default | large',
    'ChoiceLabel control / description':
      '컨트롤; 라벨 아래 텍스트로, 컨트롤의 설명으로 읽힘',
  },
}
