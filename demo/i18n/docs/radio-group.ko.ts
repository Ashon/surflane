import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '상호 배타적 옵션 중 하나를 선택하세요. 그룹과 각 항목에 이름을 주세요.',
  avoid:
    '이름 없는 단독 Radio를 두지 마세요. 각 Radio를 이름 있는 RadioGroup에 넣으세요. 선택 변경을 전체 폼 제출로 취급하지 마세요. 제출은 폼의 제출 버튼에 맡기세요.',
  keyboard:
    'Tab은 선택된 항목에 포커스를 줍니다. 화살표 키가 선택을 이동하고 비활성 항목을 건너뜁니다.',
  props: {
    'value / defaultValue / onValueChange': '일반 값 및 변경 콜백',
    'name / required / readOnly / disabled': '그룹 폼 및 상호작용 상태',
    'Radio.Root.value': '옵션 값',
    'Radio.Root.size': 'small | default | large',
  },
}
