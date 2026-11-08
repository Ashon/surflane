import type { DocKo } from './types'
export const doc: DocKo = {
  usage: [
    '리소스 편집이나 계획 확인처럼 사용자가 온전히 집중해야 하는 작업에 쓰세요. Title과 Description을 넣으세요. 닫기(X) 버튼은 모든 dialog에 있고, Footer에는 작업의 액션을 둡니다.',
    '목록이나 카드 그리드에서 세션, 배포 같은 항목의 상세를 보여 줄 때는 dialog 대신 옆에 Sheet를 열어 목록이 화면에 남게 하세요. 탭이 필요한 긴 기록은 페이지를 따로 두세요.',
  ],
  avoid: [
    '간단한 공지로 흐름을 반복해서 막지 마세요. 대신 Toast를 사용하세요.',
    'Dialog에서 데이터 손실을 확인하지 마세요. 별도의 AlertDialog를 사용하세요.',
    '작업이 없는 dialog의 Footer에 닫기 버튼을 넣지 마세요. 닫기(X) 버튼이 이미 그 일을 합니다. Footer에는 저장, 취소 같은 액션을 두세요.',
  ],
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
