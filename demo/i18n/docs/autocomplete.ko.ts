import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '검색과 태그 입력에 제안을 넣되 선택을 요구하지 마세요. 입력한 텍스트는 일치하는 제안이 없어도 유효합니다. Root.value는 선택된 ID가 아닌 입력 문자열입니다.',
  avoid:
    '사용자가 등록된 리소스를 골라야 하면 Combobox를 쓰세요. 제안 밖의 텍스트를 오류로 취급하지 마세요. 입력한 대로 받아들이세요. 선택 직후 알림 없이 폼을 제출하지 마세요. 알리거나 submitOnItemClick을 끄세요.',
  keyboard:
    '입력하면 제안이 좁아집니다. 화살표 키와 Enter는 텍스트를 완성합니다. Escape나 Tab은 팝업을 닫습니다. 기본적으로 항목 선택은 폼을 제출하지 않습니다. Base UI는 문자열이 아닌 객체 제안과 그룹 항목의 타입을 보존합니다.',
  props: {
    'Root.value / defaultValue / onValueChange':
      '입력 텍스트와 취소 가능한 Base UI 콜백',
    'Root.items / filteredItems / filter':
      '평면/그룹 제안; 호출하는 쪽 소유의 원격 결과',
    'Root.itemToStringValue': '표시/입력 텍스트로의 객체 변환',
    'Root.submitOnItemClick': '제안 선택 시 제출',
    'Content.side / align / sideOffset / collisionPadding': '팝업 배치',
    'Root.name / form / required / disabled / readOnly':
      '네이티브 폼 소유권, 초기화, 검증',
  },
}
