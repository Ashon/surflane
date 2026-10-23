import type { DocKo } from './types'
export const doc: DocKo = {
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
}
