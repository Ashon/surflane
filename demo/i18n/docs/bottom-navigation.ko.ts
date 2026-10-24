import type { DocKo } from './types'
export const doc: DocKo = {
  usage: [
    '휴대폰 앱의 주요 목적지 3~5개를 엄지가 닿는 화면 아래쪽에 두세요. 각 Item은 아이콘 아래 짧은 라벨이 붙은 링크이고, current로 지금 있는 페이지를 표시합니다.',
    '기본으로 AppShell이 사이드바를 숨기는 760px 이하에서만 보입니다. 그래서 넓은 화면에서는 같은 목적지가 사이드바에 있습니다. 휴대폰 전용 앱이면 visible="always"를 설정하세요.',
    '뷰포트 아래쪽에 고정되고 홈 인디케이터 아래 안전 영역만큼 여백을 둡니다. 마지막 줄이 가려지지 않게 스크롤 콘텐츠에 var(--surf-size-bottom-navigation)과 env(safe-area-inset-bottom)을 더한 만큼 아래 여백을 주세요. 직접 만든 프레임 안에 두려면 position="static"을 설정하세요.',
    '배지는 개수를 99+까지 보여 주고, true를 주면 점으로 보여 줍니다. badgeLabel은 스크린 리더에 배지의 뜻을 읽어 줍니다(예: "읽지 않음 3개"). 점 배지에는 꼭 필요합니다.',
  ],
  avoid: [
    '목적지를 다섯 개보다 많이, 또는 세 개보다 적게 넣지 마세요. 나머지는 사이드바나 Sheet 메뉴에 두세요.',
    '만들기, 공유 같은 작업을 넣지 마세요. 목적지만 담습니다. 작업은 페이지나 Toolbar에 두세요.',
    '라벨을 빼고 아이콘만 남기지 마세요. 좁은 화면에서 잘리므로 라벨은 짧은 한 단어로 쓰세요.',
    '한 화면 안에서 패널을 전환하는 데 쓰지 마세요. 그때는 Tabs를 쓰세요.',
  ],
  keyboard: [
    '각 목적지는 네이티브 링크입니다. Tab으로 이동하고 Enter로 따라갑니다.',
    'nav 랜드마크의 이름은 aria-label에서 오고, 현재 목적지는 현재 페이지로 읽힙니다.',
    '배지는 라벨 뒤에 badgeLabel이나 개수로 읽힙니다. 아이콘과 시각적 배지는 접근성 트리에서 빠집니다.',
  ],
  props: {
    'Root.aria-label': '내비게이션 랜드마크의 이름',
    'Root.visible':
      'mobile: AppShell이 사이드바를 숨기는 760px 이하에서 | always',
    'Root.position':
      'fixed: 모든 페이지 위, 오버레이 아래에서 뷰포트 아래쪽에 고정 | static: 문서 흐름 안에',
    'Item.icon / label': '아이콘과 그 아래 한 단어 라벨',
    'Item.current': 'aria-current="page"로 현재 목적지를 표시',
    'Item.badge / badgeLabel':
      '개수(99+까지) 또는 점을 뜻하는 true / 라벨 뒤에 읽히는 배지의 뜻',
    'Item.badgeTone':
      '배지의 뜻에 맞춘 색: 지금 처리할 일은 danger, 살펴볼 일은 caution, 소식은 neutral. info, success, progress도 있습니다',
    'Item.render / href / native a props':
      'Link처럼 클라이언트 내비게이션용 라우터 링크 엘리먼트',
  },
}
