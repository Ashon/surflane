import type { DocKo } from './types'

export const advancedFormDocsKo: Record<string, DocKo> = {
  combobox: {
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
      'Content.positionerProps': 'side / align / sideOffset / 충돌 옵션',
      'Root.name / form / required / disabled / readOnly':
        '폼 소유권과 컨트롤 상태',
      'Form reset':
        '내부 쿼리와 선택을 재생성; 취소된 초기화 건너뜀; controlled props 유지',
    },
  },
  'number-field': {
    usage:
      '범위, 단계, 표시 형식이 필요한 숫자를 입력하세요. Increment와 Decrement 버튼 옆에 직접 입력을 제공하세요. 통화 같은 표시 문자열과 기본 숫자를 분리하세요.',
    avoid:
      '계산되지 않는 식별자(전화번호, 우편번호 등)에는 쓰지 마세요. 대신 Input을 쓰세요. 작은 증가에 클릭을 여러 번 요구하지 말고, 드래그를 유일한 입력 경로로 만들지 마세요. 직접 입력을 유지하세요.',
    keyboard: [
      '값을 직접 입력하세요.',
      'Up과 Down 화살표 키, Increment와 Decrement 버튼은 값을 바꿉니다. min과 max를 존중합니다.',
      'readOnly와 disabled는 별개의 상태입니다.',
      '폼 초기화는 uncontrolled 값을 초기값으로 되돌리고, controlled 값은 부모의 값을 유지합니다. 취소된 변경과 초기화를 존중합니다.',
    ],
    props: {
      'Root.value / defaultValue / onValueChange':
        'number | null / number / Base UI 콜백',
      'Root.min / max / step': '범위와 숫자 단계',
      'Root.locale / format': 'Intl 숫자 로케일 / number-format 옵션',
      'Root.allowOutOfRange': '검증을 위해 범위 밖 입력된 값 허용',
      'Root.name / form / required / disabled / readOnly':
        '폼 소유권과 컨트롤 상태',
      'Root.onValueCommitted': '확정된 값 콜백',
      'Increment / Decrement children': '커스텀 콘텐츠; 기본 장식용 SVG',
    },
  },
}
