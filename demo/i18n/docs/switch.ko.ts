import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '즉시 적용되는 설정을 토글하세요. 엄지 위치와 배경이 함께 변경됩니다. 두 상태 모두 라벨은 동일하게 유지됩니다. 읽기 전용 모드에서는 값이 보이지만 변경할 수 없습니다.',
  avoid:
    '액션 버튼 대신 사용하지 마세요. Button을 사용하세요. 다중 선택 목록에 사용하지 마세요. CheckboxGroup을 사용하세요.',
  keyboard:
    'Tab은 스위치에 포커스를 줍니다. Space가 토글합니다. 폼에서는 name, value, uncheckedValue props가 명시적 값을 제출합니다.',
  props: {
    'checked / defaultChecked / onCheckedChange': '제어/비제어 boolean 및 콜백',
    'readOnly / disabled': '상호작용 방지',
    'name / value / uncheckedValue': '폼 페이로드',
    'Root.size': 'small | default | large',
  },
}
