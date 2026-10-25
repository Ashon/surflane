import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    "모니터링 화면의 데이터 패널을 한 격자에 두세요. Dashboard.Root는 20rem 패널이 들어가는 만큼 열을 두고, 폰에서는 한 열입니다. Dashboard.Panel은 카드 한 장에 제목, 정보 버튼 뒤의 설명(선택), 머리글 끝의 동작, 데이터 상태를 담습니다. 첫 데이터가 오기 전에는 자리표시자를, 실패하면 다시 시도가 있는 메시지를, 기간이 비면 문장을 보여 줍니다. 새로 고치는 동안에는 내용을 그대로 두고 제목 옆에 스피너를 띄웁니다. 촘촘한 대시보드는 SizeProvider size='small' density='compact'로 감싸세요. 패널 간격과 안쪽 여백이 12px이 되고, 제목은 label 역할을 쓰며, 안의 차트와 표도 compact가 됩니다.",
  avoid: [
    '새로 고치는 동안 패널을 비우지 마세요. 마지막 값을 두고 refreshing을 주세요.',
    '페이지의 다른 구획을 패널에 넣지 마세요. 모든 블록이 카드인 곳은 대시보드뿐입니다.',
    '촘촘한 차트에 패널 제목을 되풀이하지 마세요. 차트 제목은 보조 기술에만 남습니다.',
  ],
  keyboard:
    '패널마다 제목이 이름인 묶음이고, 불러오거나 새로 고치는 동안 busy입니다. 정보 버튼은 설명을 팝오버로 열고 Escape가 닫습니다. 다시 시도와 머리글 동작은 보통 버튼입니다. 다시 시도로 오류가 사라져 버튼이 없어지면 포커스는 패널 제목으로 옮겨 갑니다.',
  props: {
    'Root.label':
      '대시보드를 "클러스터 개요"처럼 페이지의 영역으로 이름 붙입니다',
    'Root.columns':
      '넓은 화면에서 보일 최대 열 수. 그만큼으로 짠 줄이 비율을 지킵니다',
    'Root style --surf-dashboard-panel-min-width':
      '격자가 열을 하나 줄이기 전까지 패널의 가장 좁은 폭',
    'Panel.title / level':
      '제목과 제목 레벨. 잘린 제목은 마우스를 올리면 전체가 보입니다',
    'Panel.description':
      '패널이 보여 주는 것과 재는 방법. 정보 버튼 뒤에 둡니다',
    'Panel.state':
      'ready | loading | error | empty | stale. stale은 새로 고침에 실패했다는 주의와 다시 시도 아래에 마지막 내용을 둡니다',
    'Panel.placeholderHeight':
      '로딩 자리표시자의 높이. 내용만큼 잡아 두면 아래 패널이 밀리지 않습니다',
    'Panel.refreshing':
      '내용을 두고 제목 옆에 스피너를 띄우며 패널을 busy로 표시합니다',
    'Panel.onRetry / message':
      '오류 메시지의 다시 시도 버튼 / 오류나 빈 상태 문장',
    'Panel.actions': '머리글 끝의 컨트롤',
    'Panel.span': '1 | 2 | 3 | full: 들어가는 곳에서 차지할 열. 폰에서는 하나',
    'Panel.labels':
      'about(title), loading, refreshing, error, stale, retry, empty',
  },
}
