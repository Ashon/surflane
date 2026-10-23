import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '같은 컨텍스트에서 관련 패널을 전환하세요. 선택된 탭은 전체 둥근 표면으로 표시됩니다. Panel.keepMounted를 설정해 입력을 보존하세요.',
  avoid:
    '탭 상태로 별도 페이지 사이의 내비게이션을 흉내 내지 마세요. 대신 링크를 사용하세요. 화살표 키 포커스에 느린 콘텐츠를 로드하지 마세요. 기본 수동 활성화를 유지하세요.',
  keyboard:
    'Tab은 활성 탭으로 포커스를 이동합니다. 화살표 키, Home, End는 탭 사이를 이동합니다. 기본 수동 모드에서는 Enter나 Space가 포커스된 탭을 활성화합니다. List.activateOnFocus=true에서는 탭이 포커스를 받으면 활성화됩니다. 비활성 탭은 포커스를 받지만 활성화되지는 않습니다.',
  props: {
    'Root.value / defaultValue / onValueChange': '선택된 탭 값과 변경 콜백',
    'List.activateOnFocus': '화살표 키 포커스 시 탭 활성화',
    'Panel.keepMounted': '비활성 패널을 DOM에 유지',
  },
}
