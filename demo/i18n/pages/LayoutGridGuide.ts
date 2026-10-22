import type { Locale } from '../../i18n'

const en = {
  intro:
    'Use Grid columns for equal cards, and the 12 / 6 / 4 layout grid for regions of different widths, such as main content beside a panel.',
  breakpointsLabel: 'Grid breakpoints',
  caption: 'Grid by viewport',
  viewport: 'Viewport',
  layoutTracks: 'Layout grid',
  defaultGutter: 'Gutter',
  equalCards: 'Equal cards',
  rows: [
    ['Above 1100px', '12 tracks', '24px', '1–4 columns'],
    ['761–1100px', '6 tracks', '24px', '2 columns'],
    ['760px and below', '4 tracks', '16px', '1 column'],
  ],
  primaryContent: 'Primary content',
  primaryTracks: '8 / 4 / 4 tracks',
  supportingDetails: 'Supporting details',
  secondaryTracks: '4 / 2 / 4 tracks',
  fullWidthResults: 'Full-width results',
  fullTracks:
    '12 / 6 / 4 tracks, long-resource-identifiers-for-staging-deployments-also-wrap',
  codeLabel: 'Responsive grid composition',
  bleed:
    "Match bleed to the card padding, such as bleed={4} for padding={4}, so card text lines up with the text around the grid. Don't bleed at the window edge or inside a clipped area.",
  spansStart: 'Scroll wide tables and code inside a ',
  scrollArea: 'ScrollArea',
  spansEnd: ' instead of widening the page.',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    intro:
      '같은 크기의 카드에는 Grid 열을, 본문 옆 패널처럼 너비가 다른 영역에는 12 / 6 / 4 레이아웃 그리드를 쓰세요.',
    breakpointsLabel: '그리드 브레이크포인트',
    caption: '뷰포트별 그리드',
    viewport: '뷰포트',
    layoutTracks: '레이아웃 그리드',
    defaultGutter: '거터',
    equalCards: '같은 크기 카드',
    rows: [
      ['1100px 초과', '12트랙', '24px', '1–4열'],
      ['761–1100px', '6트랙', '24px', '2열'],
      ['760px 이하', '4트랙', '16px', '1열'],
    ],
    primaryContent: '주요 콘텐츠',
    primaryTracks: '8 / 4 / 4트랙',
    supportingDetails: '보조 정보',
    secondaryTracks: '4 / 2 / 4트랙',
    fullWidthResults: '전체 너비 결과',
    fullTracks:
      '12 / 6 / 4트랙, long-resource-identifiers-for-staging-deployments-also-wrap',
    codeLabel: '반응형 그리드 구성',
    bleed:
      'bleed를 카드 패딩과 같게 두면(padding={4}에 bleed={4}) 카드 글이 주변 글과 줄을 맞춥니다. 창 가장자리나 잘리는 영역에서는 bleed를 쓰지 마세요.',
    spansStart: '넓은 테이블과 코드는 페이지를 넓히지 말고 ',
    scrollArea: 'ScrollArea',
    spansEnd: ' 안에서 스크롤하세요.',
  },
}
