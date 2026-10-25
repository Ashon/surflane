import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '고정된 목록에서 옵션을 하나, 또는 multiple로 여럿 고르세요. 프로젝트 필터가 그런 예입니다. 검색이 필요할 만큼 목록이 길면 Combobox를 사용하세요.',
  avoid:
    'Select로 액션을 실행하지 마세요. 대신 Menu를 사용하세요. 선택한 결과와 제출된 값을 함께 확인하세요.',
  keyboard:
    'Enter, Space 또는 화살표 키로 listbox를 엽니다. 화살표 키와 타이핑으로 항목 사이를 이동합니다. Escape는 listbox만 닫고 포커스를 돌려줍니다.',
  props: {
    ref: '트리거 버튼, triggerRef와 같습니다',
    'value / onValueChange': '제어 값 + 콜백',
    'defaultValue / name / required / disabled': '선택 및 폼 props',
    'multiple / labels':
      '필터처럼 여러 값을 한 줄에. 트리거는 하나면 그 이름을, 여럿이면 개수를, 모두면 labels.all을 씁니다. 첫 옵션이 전부 고르거나 비웁니다. value와 defaultValue는 string[]입니다. 검색할 긴 목록과 칩에는 Combobox multiple을 쓰세요',
    width:
      'fill은 폼 필드처럼 컨테이너 폭을 채웁니다. content는 가장 긴 옵션에 맞춘 폭을 유지해 머리글이나 툴바에 나란히 둘 수 있습니다',
  },
}
