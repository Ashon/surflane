import type { Locale } from '../../i18n'

const en = {
  title: 'Responsive grid system',
  intro:
    "Use Grid's 1–4 columns for lists of equal-size cards. Use the 12 / 6 / 4 column layout grid for areas of different widths, such as main content and a supporting panel. Keep visual order and DOM order the same. Limit reading content to the separate reading width. Guide lines are overlaid as pseudo-elements, so they never change the position or height of the UI.",
  breakpointsLabel: 'Grid breakpoints',
  caption: 'Shared grid contract by viewport',
  viewport: 'Viewport',
  layoutTracks: 'Layout tracks',
  defaultGutter: 'Default gutter',
  catalogCards: 'Catalog cards',
  rows: [
    [
      'Above 1100px',
      '12',
      '24px / space-6',
      '3 columns (Foundations index: 2)',
    ],
    ['761–1100px', '6', '24px / space-6', '2 columns'],
    ['Up to 760px', '4', '16px / space-4', '1 column'],
  ],
  containers:
    "Containers fill the available width up to 75rem for workspace, 96rem for wide, and 52rem for reading. The catalog's own sheet is limited to 1100px. Gutters follow the default token. Dense combinations, such as lists and filters, set gap to space-4 explicitly.",
  primaryContent: 'Primary content',
  primaryTracks: '8 / 4 / 4 tracks',
  supportingDetails: 'Supporting details',
  secondaryTracks: '4 / 2 / 4 tracks',
  fullWidthResults: 'Full-width results',
  fullTracks:
    '12 / 6 / 4 tracks, long-resource-identifiers-for-staging-deployments-also-wrap',
  codeLabel: 'Responsive grid composition',
  bleedStart:
    "Match bleed to card padding so card text aligns with surrounding content. In a card grid, the card's edge and the line where its text starts differ. With space-4 card padding, set",
  bleedEnd:
    " on Grid. Only the grid's left and right edges extend, by 16px each. Column gaps and card padding stay the same. The default bleed is 0, and it doesn't propagate to nested grids. Reserve that space, and room for focus indicators, in the outer container. Don't use bleed at the window edge or in clipped areas. The overview and each index card use the same contract.",
  gridItem:
    'Use GridItem as a direct child of columns="layout". An unset span inherits from the next larger size, capped at the current column count. Don\'t reorder content with hidden columns or CSS order. Check the minimum inner width of inputs, tables, and code. Let tables and code scroll only in the direction they need, with',
  scrollArea: 'ScrollArea',
  tokensUsed: 'Tokens used:',
  allComponents: 'All components',
  seeAllComponents: 'See',
  seeAllComponentsRest: ' for a real list that uses the same card grid.',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    title: '반응형 그리드 시스템',
    intro:
      '같은 크기의 카드 목록에는 Grid의 1–4열을 사용하세요. 서로 다른 너비의 영역(예: 메인 콘텐츠와 보조 패널)에는 12 / 6 / 4열 레이아웃 그리드를 사용하세요. 시각적 순서와 DOM 순서와 동일하게 유지하세요. 읽기 콘텐츠는 별도의 읽기 너비로 제한하세요. 가이드 라인은 의사 요소로 오버레이되므로 UI의 위치나 높이를 변경하지 않습니다.',
    breakpointsLabel: '그리드 브레이크포인트',
    caption: '뷰포트별 공유 그리드 계약',
    viewport: '뷰포트',
    layoutTracks: '레이아웃 트랙',
    defaultGutter: '기본 거터',
    catalogCards: '카탈로그 카드',
    rows: [
      ['1100px 이상', '12', '24px / space-6', '3열 (파운데이션 인덱스: 2)'],
      ['761–1100px', '6', '24px / space-6', '2열'],
      ['760px 이하', '4', '16px / space-4', '1열'],
    ],
    containers:
      '컨테이너는 사용 가능한 너비를 채웁니다. workspace는 workspace는 최대 75rem, wide는 96rem, reading은 52rem입니다. 카탈로그의 시트 자체는 1100px로 제한됩니다. 거터는 기본 토큰을 따릅니다. 목록과 필터 같은 밀집 조합은 gap을 space-4로 명시적으로 설정합니다.',
    primaryContent: '기본 콘텐츠',
    primaryTracks: '8 / 4 / 4 트랙',
    supportingDetails: '보조 세부정보',
    secondaryTracks: '4 / 2 / 4 트랙',
    fullWidthResults: '전체 너비 결과',
    fullTracks:
      '12 / 6 / 4 / 4 트랙, long-resource-identifiers-for-staging-deployments-also-wrap',
    codeLabel: '반응형 그리드 구성',
    bleedStart:
      'bleed를 카드 패딩에 맞춰 카드 텍스트가 주변 콘텐츠와 정렬되게 하세요. 카드 그리드에서 카드의 가장자리와 텍스트가 시작되는 선은 서로 다릅니다. space-4 카드 패딩을 사용하면 Grid에',
    bleedEnd:
      '를 설정하세요. 그리드의 왼쪽과 오른쪽 가장자리만 16px씩 확장됩니다. 열 간격과 카드 패딩은 그대로입니다. 기본 bleed는 0이며 중첩 그리드로 전파되지 않습니다. 바깥 컨테이너에 그 공간과 포커스 표시기 공간을 확보하세요. 창 가장자리와 잘린 영역에서 bleed를 사용하지 마세요. 개요와 각 인덱스 카드는 같은 계약을 사용합니다.',
    gridItem:
      'GridItem을 columns="layout"의 직접 자식으로 사용하세요. 설정되지 않은 span은 다음으로 큰 크기에서 상속되며, 현재 열 수에서 제한됩니다. 숨겨진 열이나 CSS order로 콘텐츠를 재배열하지 마세요. 입력, 테이블, 코드의 최소 내부 너비를 확인하세요. 테이블과 코드는 필요한 방향으로만 스크롤되게 하려면',
    scrollArea: 'ScrollArea를 사용하세요',
    tokensUsed: '사용된 토큰:',
    allComponents: '모든 컴포넌트',
    seeAllComponents: '같은 카드 그리드를 쓰는 실제 목록은',
    seeAllComponentsRest: '를 참조하세요.',
  },
}
