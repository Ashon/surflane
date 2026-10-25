import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '온전히 집중해야 하는 독립 작업에 쓰세요. Title, Description, 명시적인 닫기 방법을 넣으세요.',
  avoid:
    '간단한 공지로 흐름을 반복해서 막지 마세요. 대신 Toast를 사용하세요. Dialog에서 데이터 손실을 확인하지 마세요. 별도의 AlertDialog를 사용하세요.',
  keyboard:
    'Tab은 dialog 안에서 포커스를 유지합니다. Escape 또는 닫기 버튼이 dialog를 닫습니다. 중첩된 Select가 먼저 닫힌 다음, 부모 Dialog가 닫힙니다.',
  props: {
    'Content.size': 'small | default | large: 너비 420 / 640 / 840px와 밀도',
    '--surf-dialog-width':
      '사용자 지정 속성: 주변 밀도를 그대로 두고 너비를 정합니다',
    'Content.closeLabel':
      '닫기(X) 버튼의 이름입니다. 모든 대화상자에 닫기 버튼이 있습니다.',
    'Content.closeDisabled': '저장 중일 때처럼 닫기 버튼을 비활성화합니다.',
    'Content.focusBoundaryLabel':
      '가장자리 포커스 가드의 이름입니다. 스크린 리더가 마지막 컨트롤을 지나면 만납니다.',
    'Content.initialFocus': 'ref / 포커스 콜백 (Base UI)',
    'Root.open / onOpenChange': '제어 dialog 상태',
  },
}
