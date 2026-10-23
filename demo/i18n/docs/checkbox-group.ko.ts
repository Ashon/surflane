import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '한 주제의 여러 선택을 관리하세요. 그룹이 부모 전체 선택 체크박스의 혼합 상태를 구동합니다. 모든 하위 값을 allValues로 전달하세요.',
  avoid:
    '부모 체크박스 상태를 하위와 분리해 저장하지 마세요. 대신 allValues를 하위 값과 동기화하세요.',
  keyboard:
    'Tab은 각 체크박스로 이동합니다. Space가 토글합니다. 부모가 모든 항목을 선택하거나 지웁니다. 일부만 선택되면 혼합으로 표시됩니다.',
  props: {
    'value / defaultValue / onValueChange': 'string[] 및 변경 콜백',
    allValues: '모든 하위 값; 부모 체크박스에 필수',
    disabled: '그룹 비활성화',
  },
}
