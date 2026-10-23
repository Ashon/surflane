import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '되돌리기 어려운 작업(예: 삭제 또는 폐기)을 확인하세요. Content.initialFocus를 안전한 취소 버튼에 지정하세요.',
  avoid:
    '중립적인 OK나 Yes로 액션을 표시하지 마세요. 대신 구체적인 액션 이름을 사용하세요. 외부 클릭을 응답으로 처리하지 마세요. 명시적인 선택을 기다리세요.',
  keyboard:
    '포커스는 안전한 취소 액션에서 시작하며 dialog 안에 유지됩니다. Escape는 취소로 동작합니다.',
  props: {
    'Root.open / onOpenChange': '제어 상태',
    'Content.initialFocus': '안전한 취소 버튼 ref',
  },
}
