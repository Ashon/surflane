import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '고정된 목록에서 옵션을 하나 선택하세요. 검색이 필요할 만큼 목록이 길면 Combobox를 사용하세요.',
  avoid:
    'Select로 액션을 실행하지 마세요. 대신 Menu를 사용하세요. 선택한 결과와 제출된 값을 함께 확인하세요.',
  keyboard:
    'Enter, Space 또는 화살표 키로 listbox를 엽니다. 화살표 키와 타이핑으로 항목 사이를 이동합니다. Escape는 listbox만 닫고 포커스를 돌려줍니다.',
  props: {
    'value / onValueChange': '제어 값 + 콜백',
    'defaultValue / name / required / disabled': '선택 및 폼 props',
  },
}
