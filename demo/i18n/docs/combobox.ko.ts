import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '검색이 필요할 만큼 긴 목록에서 고르세요. Combobox는 단일 선택과 여러 값용 Chips 레이아웃을 지원합니다(예: 역할). Input에 Field.Label이나 네이티브 label로 이름을 지으세요. Clear, Trigger, ChipRemove 액션 이름도 주세요.',
  avoid:
    '임의의 검색 텍스트를 유효한 선택으로 제출하지 마세요. 자유 텍스트가 유효하면 Autocomplete를 쓰세요. Autocomplete는 자유 텍스트를 저장합니다.',
  keyboard: [
    '입력하면 목록이 필터링됩니다. Base UI는 한글 같은 IME 입력을 처리합니다.',
    '화살표 키로 항목을 이동합니다.',
    'Enter는 항목을 선택합니다. 비활성 항목은 선택할 수 없습니다.',
    'Escape는 열린 팝업을 닫습니다. 팝업이 닫힌 상태에서 Escape는 선택을 지웁니다.',
    '이름 있는 ChipRemove로 값을 하나 제거하세요.',
  ],
  props: {
    'Root.items / value / defaultValue': 'Base UI 일반 항목과 선택 타입',
    'Root.multiple': 'Chips / ChipRemove로 배열 선택',
    'Root.itemToStringLabel / itemToStringValue': '객체 표시 / 제출 매핑',
    'Root.inputValue / onInputValueChange': '제어되는 검색 쿼리',
    'Content.side / align / sideOffset / collisionPadding': '팝업 배치',
    'Root.name / form / required / disabled / readOnly':
      '폼 소유권과 컨트롤 상태',
    'Form reset':
      '내부 쿼리와 선택을 재생성; 취소된 초기화 건너뜀; controlled props 유지',
  },
}
