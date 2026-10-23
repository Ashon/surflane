import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '길이를 모르는 짧은 처리 중임을 나타냅니다. 단독으로는 label로 작업을 설명하세요. 상태를 이미 알리는 영역 안에서는 decorative로 설정하세요.',
  avoid:
    '스피너를 무기한으로 보여주지 마세요. 실패, 지연, 취소를 별도로 알리세요. 로딩은 여러 live region이 아닌 하나에서 알리세요.',
  keyboard:
    '기본적으로 Spinner는 role=status와 시각적으로 숨겨진 텍스트를 가집니다. decorative prop은 접근성 트리에서 제거합니다. reduced motion에서는 회전이 멈추지만 정적 표시기와 label은 유지됩니다.',
}
