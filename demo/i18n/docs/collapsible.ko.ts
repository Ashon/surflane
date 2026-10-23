import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '보충 정보 한 그룹을 제자리에서 펼치세요. Trigger와 Panel은 같은 가로 패딩을 공유합니다.',
  avoid:
    '여러 관련 섹션에는 Accordion을 사용하세요. Escape가 모달처럼 닫으리라 기대하지 마세요. 대신 Trigger로 닫으세요.',
  keyboard:
    'Tab으로 Trigger에 이동합니다. Enter나 Space는 Panel을 열고 닫습니다. keepMounted에서는 닫힌 Panel이 입력 상태를 유지합니다.',
  props: {
    'Root.open / defaultOpen / onOpenChange': '제어/비제어 상태',
    'Root.disabled': 'Trigger 비활성화',
    'Panel.keepMounted / hiddenUntilFound':
      '닫힌 동안 상태 유지 / 브라우저 찾기에서 표시',
  },
}
