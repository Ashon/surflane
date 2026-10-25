import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '기존 option 및 optgroup 마크업을 이 호환 어댑터로 점진적으로 마이그레이션하세요. 새 화면에는 Select를 사용하세요.',
  avoid:
    '브라우저 네이티브 select 팝업의 DOM API를 가정하지 마세요. 대신 value 및 onChange 어댑터를 사용하세요.',
  keyboard:
    '키는 공유 Select와 동일하게 동작합니다. 숨겨진 input이 폼과 함께 값을 제출합니다.',
  props: {
    children: 'option / optgroup 요소',
    'value / onChange': '네이티브 스타일 변경 어댑터',
  },
}
