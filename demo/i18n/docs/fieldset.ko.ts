import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '한 주제의 입력을 Legend 아래에 그룹화하세요. 그룹의 비활성 상태가 하위 Field로 전달됩니다.',
  avoid:
    '시각적 테두리만 그리려고 사용하지 마세요. Card를 사용하세요. 각 입력에 개별 라벨을 유지하세요.',
  keyboard:
    'Tab은 입력의 자연스러운 순서를 따릅니다. 비활성 그룹은 상호작용과 폼 제출에서 제외됩니다. Legend가 그룹의 접근 가능한 이름을 제공합니다.',
  props: {
    'Root.disabled': 'boolean; 중첩 필드로 전파',
    Legend: '접근 가능한 그룹 이름',
  },
}
