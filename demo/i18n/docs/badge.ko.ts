import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    'StatusBadge로 짧은 상태를 보여주세요. 각 tone에 의미 있는 SVG를 추가합니다. 일반 라벨이나 개수에는 중립 표면에서 Badge를 사용하세요. Badge는 테두리가 없습니다. 상태 배지는 badge 배경 토큰의 밝은 tone 표면과 텍스트, 아이콘을 짝지으며 InlineMessage와 분리됩니다. 작은 상태 라벨은 12px, medium(500) weight를 사용해 가독성을 유지합니다. StatusDot은 말이 없는 상태입니다. 묶음의 개수처럼 옆 텍스트가 상태를 말할 때, 아바타의 상태 표식처럼 tone의 표식 색으로 납작한 점을 둡니다. 표식 색은 tone의 색조를 지키면서 어두운 면에서는 밝게, 밝은 면에서는 어둡게 맞춰 3:1을 지킵니다. 배지 글자색을 쓰면 잉크처럼 어두워지기 때문입니다. live는 상태가 이어지는 동안 점을 숨 쉬게 하고, attention은 답 기다림처럼 상태가 막 왔을 때 세 번 깜빡인 뒤 멈춥니다.',
  avoid:
    '색이나 아이콘만으로 상태를 전달하지 마세요. 항상 텍스트 라벨을 포함하세요. StatusDot 옆에 두거나, 상태를 말하는 텍스트가 없으면 label을 주세요. 계속 부르려고 점을 깜빡이지 마세요. attention은 상태가 올 때만 깜빡입니다. 액션에는 Button을 사용하고 배지를 버튼처럼 꾸미지 마세요. 변경 사항은 role=status 문장 하나에서 알리고, 모든 배지에 live role을 두지 마세요.',
  keyboard:
    '배지는 정적 span이며 Tab 순서에 없습니다. 상태 변경을 알리려면 role=status를 문장 하나에 두세요.',
  props: {
    icon: '커스텀 ReactNode; false는 아이콘 숨김',
    children: '보이는 상태 라벨 또는 개수',
    'StatusDot label':
      '근처 텍스트가 상태를 말하지 않을 때의 상태 이름: 점이 그 이름의 role=img가 됩니다. 없으면 점은 aria-hidden입니다',
    'StatusDot live / attention':
      'live는 상태가 이어지는 동안 숨 쉬고, attention은 상태가 올 때 세 번 깜빡인 뒤 멈춥니다. 둘 중 하나만 받고, 모션 줄이기에서는 멈춰 있습니다',
  },
}
