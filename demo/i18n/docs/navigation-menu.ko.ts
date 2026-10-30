import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '링크와 하위 내비게이션을 제품, 문서, 섹션별로 그룹화하세요. 네이티브 nav, ul, li, a 구조를 유지합니다. Trigger가 하위 링크를 열고, Link가 이동합니다. Link.active로 현재 목적지를 표시하세요. 세로 목록은 목차로도 씁니다. 지금 보이는 섹션은 aria-current="location"으로 표시하면 현재 페이지와 같이 그려지고, 줄바꿈된 라벨도 위아래 여백을 유지합니다. 휴대폰처럼 페이지 탭이 다 들어가지 않을 수 있으면 overflow=\'scroll\'을 주세요. 목록이 한 줄로 남아 옆으로 스크롤하고, 현재 링크는 화면 안에 머뭅니다.',
  avoid:
    '명령에는 Menu나 Menubar를, 한 화면에서 패널 전환에는 Tabs를 사용하세요. 링크는 네이티브로 유지하고 nav에 role=menu를 주지 마세요. 호버 전용으로 만들지 마세요. 작은 화면에서도 클릭과 키보드 경로를 제공하세요.',
  keyboard: [
    'Trigger의 하위 링크가 열리면 Tab으로 그 안으로 이동합니다. Tab과 화살표 키로 하위 링크를 이동합니다.',
    '화살표 키는 최상위 항목 사이를 이동합니다. 가로 레이아웃에서는 ArrowDown이 Trigger의 하위 링크도 엽니다.',
    'Enter나 Space는 Trigger의 하위 링크를 엽니다. 하위 링크의 Enter는 이동합니다.',
    'Escape는 하위 링크를 닫습니다.',
    'RTL에서는 DirectionProvider와 DOM dir을 모두 설정하세요.',
    '세로 레이아웃에서는 orientation=vertical을 설정하세요. 의미와 레이아웃이 모두 바뀝니다.',
  ],
  props: {
    'LinkTitle / LinkDescription':
      'Link 안에서 목적지 이름과 그 아래의 조용한 설명 한 줄',
    'Root.value / defaultValue / onValueChange':
      '일반 항목 값 | null; event.cancel()',
    'Root.orientation': 'horizontal | vertical; 레이아웃과 키보드 방향',
    'Root.overflow':
      'scroll은 휴대폰의 페이지 탭처럼 링크가 다 들어가지 않을 때 가로 목록을 한 줄로 두고 ScrollArea 안에서 스크롤하며, 글꼴이 로드되거나 폭이 바뀌어도 현재 링크를 화면 안에 둡니다',
    'Root.delay / closeDelay': '호버 열기/닫기 지연(밀리초)',
    'Trigger.disabled / indicator':
      '열기 비활성화; 커스텀 indicator 또는 false',
    'Link.href / active / closeOnClick':
      '네이티브 내비게이션; aria-current=page, 이 페이지의 섹션이면 location; 선택 시 닫기',
    'Content.keepMounted': '숨겨진 콘텐츠와 SSR 링크 보존',
    'Positioner / Popup / Viewport':
      '명시적 Popup 구성; 앵커와 충돌 옵션; 측정된 크기',
    'render / ref / className': 'Base UI 컴포지션, DOM 엘리먼트 ref, 상태 콜백',
  },
}
