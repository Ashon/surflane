import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '실행 전에 가벼운 액션(예: 필터 재설정)을 확인하세요. Popover와 Button으로 구성하세요. 독립형 export는 없습니다.',
  avoid:
    '고위험 액션(예: 삭제 또는 권한 변경)에는 사용하지 마세요. 대신 AlertDialog를 사용하세요.',
  keyboard: '포커스, Escape, 포커스 복원은 Popover와 동일하게 동작합니다.',
}
