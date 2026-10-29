import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '테이블, diff, 로그 같은 긴 콘텐츠를 제한된 공간에 맞추세요. 스크롤바는 스크롤 중이거나 포인터가 가장자리 24px 안에 들어올 때 나타납니다. 드래그와 키보드 스크롤 중에도 계속 조작할 수 있습니다. 높이나 flex·grid 트랙을 받으면 영역이 그 높이를 채우고 스크롤하며, 없으면 내용의 높이를 따릅니다. 내용을 가리는 가장자리는 위아래까지 흐려져, 잘린 목록이 더 있다는 것을 보여 줍니다. AppShell의 콘텐츠처럼 페이지 자체를 스크롤하는 영역에는 fade="none"을 주세요.',
  avoid:
    '페이지를 불필요한 중첩 스크롤 영역으로 나누지 마세요. 대신 단일 스크롤 영역을 사용하세요. 콘텐츠가 뷰 밖으로 스크롤되는 모든 영역에 label을 지정하세요.',
  keyboard:
    'Tab이 영역에 포커스를 둡니다. 화살표 키와 Page Up 또는 Page Down으로 스크롤합니다. 휠과 터치 스크롤은 계속 동작합니다. label이 영역의 접근 가능한 이름을 제공합니다.',
  props: {
    label: '접근 가능한 영역 이름',
    orientation:
      'vertical | horizontal | both; 네이티브 스크롤과 표시되는 바를 해당 축으로 제한합니다.',
    scrollChain:
      'auto는 가장자리에서 휠/터치를 부모로 전달합니다. contain은 활성화된 축을 격리합니다.',
    fade: 'both | start | end | none: 스크롤하는 축마다 내용을 가릴 때 흐려질 가장자리. 무언가가 그 위에 고정되는 쪽은 끄고, 페이지 자체의 스크롤 영역에는 none을 주세요',
    'style / className': 'viewport 속성',
    'rootStyle / rootClassName': '외부 크기와 flex/grid 배치',
    tabIndex: '필요할 때 명명된 viewport 기본값을 재정의합니다.',
  },
}
