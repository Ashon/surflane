import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '상태를 유지하는 버튼으로 명령을 켜고 끄세요. 두 상태 모두 라벨은 동일하게 유지하세요. aria-pressed가 상태를 전달하고, 완전히 둥근 표면이 상태를 보여줍니다.',
  avoid:
    '네비게이션 또는 일회성 액션에는 Link나 Button을 사용하세요. 폼에서 체크된 값이 필요하면 Checkbox나 Switch를 사용하세요. FormData나 폼 리셋에 Toggle 상태가 포함된다고 가정하지 마세요.',
  keyboard:
    'Tab으로 토글에 이동한 뒤 Enter나 Space로 상태를 변경하세요. 비활성 토글은 변경되지 않습니다. pressed와 onPressedChange로 제어하거나 defaultPressed를 설정하세요. event.cancel()이 변경을 취소합니다.',
  props: {
    'pressed / defaultPressed': '제어/비제어 boolean 상태',
    onPressedChange: '(pressed, eventDetails) => void; cancel() 지원',
    disabled: '상호작용 차단',
    value: 'ToggleGroup 내부의 문자열 식별자',
    'render / className': 'Base UI 컴포지션과 상태 기반 스타일링',
  },
}
