import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    'StatusBadge로 짧은 상태를 보여주세요. 각 tone에 의미 있는 SVG를 추가합니다. 일반 라벨이나 개수에는 중립 표면에서 Badge를 사용하세요. Badge는 테두리가 없습니다. 상태 배지는 badge 배경 토큰의 밝은 tone 표면과 텍스트, 아이콘을 짝지으며 InlineMessage와 분리됩니다. 작은 상태 라벨은 12px, medium(500) weight를 사용해 가독성을 유지합니다.',
  avoid:
    '색이나 아이콘만으로 상태를 전달하지 마세요. 항상 텍스트 라벨을 포함하세요. 액션에는 Button을 사용하고 배지를 버튼처럼 꾸미지 마세요. 변경 사항은 role=status 문장 하나에서 알리고, 모든 배지에 live role을 두지 마세요.',
  keyboard:
    '배지는 정적 span이며 Tab 순서에 없습니다. 상태 변경을 알리려면 role=status를 문장 하나에 두세요.',
  props: {
    icon: '커스텀 ReactNode; false는 아이콘 숨김',
    children: '보이는 상태 라벨 또는 개수',
  },
}
