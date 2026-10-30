import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    "콘텐츠에서 가로 또는 세로로 의미 있는 경계를 표시하세요. 바깥 간격은 부모 Stack이나 Inline이 설정합니다. 통계 줄처럼 한 줄에 놓인 값 사이에는 variant='dot'이 양옆에 여백을 둔 작은 점을 둡니다. 보조 기술과 복사한 텍스트에는 그 자리에 쉼표가 들어가 값이 서로 붙지 않습니다.",
  avoid:
    '모든 행 사이에 선을 반복하지 마세요. 대신 간격을 사용하세요. 순수 장식 선에는 CSS나 aria-hidden을 사용하세요.',
  keyboard:
    'Separator는 비대화형이며 Tab 순서에 없습니다. aria-orientation이 방향을 전달합니다.',
  props: {
    inset: 'space-4만큼 가로 인셋',
    variant:
      'line | dot: dot은 한 줄에 놓인 값 사이에 둡니다. 보조 기술과 복사한 텍스트에는 쉼표가 됩니다',
  },
}
