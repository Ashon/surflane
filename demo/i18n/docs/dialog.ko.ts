import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '온전히 집중해야 하는 독립 작업에 쓰세요. Title, Description, 명시적인 닫기 방법을 넣으세요.',
  avoid:
    '간단한 공지로 흐름을 반복해서 막지 마세요. 대신 Toast를 사용하세요. Dialog에서 데이터 손실을 확인하지 마세요. 별도의 AlertDialog를 사용하세요.',
  keyboard:
    'Tab은 dialog 안에서 포커스를 유지합니다. Escape 또는 닫기 버튼이 dialog를 닫습니다. 중첩된 Select가 먼저 닫힌 다음, 부모 Dialog가 닫힙니다.',
  props: {
    'Content.closeLabel': '접근 가능한 X 레이블; false는 X를 숨깁니다.',
    'Content.initialFocus': 'ref / 포커스 콜백 (Base UI)',
    'Root.open / onOpenChange': '제어 dialog 상태',
  },
}
