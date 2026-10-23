import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '콘텐츠에서 가로 또는 세로로 의미 있는 경계를 표시하세요. 바깥 간격은 부모 Stack이나 Inline이 설정합니다.',
  avoid:
    '모든 행 사이에 선을 반복하지 마세요. 대신 간격을 사용하세요. 순수 장식 선에는 CSS나 aria-hidden을 사용하세요.',
  keyboard:
    'Separator는 비대화형이며 Tab 순서에 없습니다. aria-orientation이 방향을 전달합니다.',
  props: {
    inset: 'space-4만큼 가로 인셋',
  },
}
