import type { Locale } from '../../i18n'

export type SwatchKind = 'fill' | 'text' | 'line'
export type Tone =
  'neutral' | 'info' | 'success' | 'danger' | 'caution' | 'progress'
export type Direction = 'up' | 'down' | 'flat'
export type PairGroupId =
  | 'text'
  | 'status'
  | 'trend'
  | 'controlText'
  | 'controlEdges'
  | 'charts'
  | 'syntax'
/** A token, how its swatch draws it, what it is for, and the surface it sits on. */
type RoleRow = [token: string, kind: SwatchKind, use: string, on?: string]
type RoleGroup = { id: string; title: string; rows: RoleRow[] }

const en = {
  syntax: (role: string) => `Syntax: ${role}`,
  title: 'Title',
  body: 'Body',
  secondaryText: 'Secondary text',
  insetContent: 'Inset content',
  selectedContent: 'Selected content',
  errorTextOnSelection: 'Error text on selection',
  brandAction: 'Brand action',
  brandTextLink: 'Brand text / link',
  status: (tone: string) => `Status: ${tone}`,
  badge: (tone: string) => `Badge: ${tone}`,
  textSelection: 'Text selection',
  chromeText: 'Chrome text',
  inputText: 'Input text',
  inputPlaceholder: 'Input placeholder',
  inputHoverText: 'Input hover text',
  focusedInputText: 'Focused input text',
  tooltip: 'Tooltip',
  choiceMark: 'Choice mark',
  choiceHoverMark: 'Choice hover mark',
  inputBoundary: 'Input boundary',
  inputBoundaryInside: 'Input boundary / inside',
  inputHoverBoundary: 'Input hover boundary',
  inputHoverBoundaryInside: 'Input hover boundary / inside',
  inputFocusOutside: 'Input focus / outside',
  inputFocusInside: 'Input focus / inside',
  choiceBoundary: 'Choice boundary',
  choiceHoverBoundary: 'Choice hover boundary',
  choiceSelectedBoundary: 'Choice selected boundary',
  errorBoundary: 'Error boundary',
  chartSeries: (index: number) => `Chart series ${index}`,
  chartCategory: (index: number) => `Chart category ${index}`,
  trend: (direction: 'up' | 'down') => `Trend ${direction}`,
  trendSurface: (direction: 'up' | 'down') =>
    `Trend ${direction} on its surface`,
  onThisPage: 'On this page',
  nav: [
    { id: 'roles', label: 'Roles' },
    { id: 'oklch', label: 'OKLCH' },
    { id: 'lab', label: 'Palette lab' },
    { id: 'contrast', label: 'Contrast' },
    { id: 'states', label: 'States' },
    { id: 'application', label: 'Application' },
  ],
  rolesHeading: 'Color roles',
  rolesIntro:
    'Reference roles, not color names. Each role resolves in both themes: the swatches show the light theme, then the dark. Every token with its value and source is in',
  tokensLink: 'Design tokens',
  rolesIntroEnd: '.',
  roleColumns: ['Light', 'Dark', 'Token', 'Use'],
  roleGroups: [
    {
      id: 'surfaces',
      title: 'Surfaces',
      rows: [
        ['--chrome', 'fill', "The app's outer frame and sidebar"],
        ['--canvas', 'fill', 'The sheet where work happens, and dialogs'],
        ['--surface', 'fill', 'A secondary area inside the sheet'],
        ['--code-bg', 'fill', 'Code blocks and inline code'],
        ['--selected', 'fill', 'The current or chosen item'],
        ['--menu-background', 'fill', 'Menus, select lists and toasts'],
      ],
    },
    {
      id: 'text',
      title: 'Text',
      rows: [
        ['--ink', 'text', 'Headings, values and input text'],
        ['--ink-body', 'text', 'Body text'],
        ['--ink-muted', 'text', 'Descriptions and captions, still 4.5:1'],
        [
          '--control-placeholder',
          'text',
          'Placeholders in fields',
          '--control-background',
        ],
      ],
    },
    {
      id: 'brand',
      title: 'Brand',
      rows: [
        ['--brand', 'fill', 'Fills for primary actions'],
        ['--on-brand', 'text', 'Text and icons on --brand', '--brand'],
        ['--brand-ink', 'text', 'Links, always underlined'],
      ],
    },
    {
      id: 'lines',
      title: 'Lines and focus',
      rows: [
        ['--line', 'line', 'Decorative dividers and same-tone edges'],
        ['--control-border', 'line', 'Control edges, 3:1 against their plane'],
        ['--control-focus', 'line', "A focused field's border"],
        ['--interaction-focus', 'line', 'Focus rings on everything else'],
      ],
    },
  ] as RoleGroup[],
  statusTitle: 'Status',
  statusColumns: ['Tone', '--status-*-fg', '--status-*-bg', '--badge-*-bg'],
  tones: {
    neutral: 'Neutral',
    info: 'Info',
    success: 'Success',
    danger: 'Danger',
    caution: 'Caution',
    progress: 'Progress',
  } as Record<Tone, string>,
  trendTitle: 'Trend',
  trendColumns: ['Direction', '--trend-*-fg', '--trend-*-bg'],
  directions: { up: 'Up', down: 'Down', flat: 'Flat' } as Record<
    Direction,
    string
  >,
  trendNote:
    'Markets that read red as a rise swap --trend-up and --trend-down.',
  chartTitle: 'Charts',
  chartColumns: ['Set', 'Light', 'Dark', 'Tokens'],
  chartSets: {
    series: 'Series',
    categories: 'Categories',
  },
  chartNote:
    'Series default to ink with dashes and markers. Categories separate by hue, and every one still has a label.',
  contrastHeading: 'Live color contrast',
  contrastIntro:
    "Colors are defined and transitioned in OKLCH. Contrast is calculated from WCAG relative luminance in linear sRGB. The color model doesn't change the contrast criteria.",
  contrastSteps:
    'Keep each surface step at least 1.05:1 from the one it sits on, so no layer disappears into its background. Surfaces step from the chrome to the sheet, then to recessed surfaces, the code well, hover, and selection. Place recessed surfaces on the sheet. On the chrome, use the sheet tone.',
  contrastThresholds:
    'Normal text needs 4.5:1 and large text needs 3:1. Large text is at least 18pt (24 CSS px), or at least 14pt (about 18.67 CSS px) when bold. Text rows use the normal-text threshold. Input boundary, focus border, and selection mark rows need 3:1 against the adjacent color.',
  contrastApprox:
    "Ratios are approximate: they come from the current theme's computed colors, converted to 8-bit sRGB pixels. Ratios display rounded to two decimal places, but results use the unrounded value. The check skips transparent colors, gradients, images, ancestor opacity, overlap, anti-aliasing, and some interaction states. Recheck borderline values and real products with a separate tool.",
  forcedColorsStatus:
    "Forced colors mode is active. The user's system colors take precedence, so token contrast checks are skipped.",
  pairColumns: ['Pair', 'Foreground', 'Background', 'Ratio', 'Result'],
  groups: {
    text: 'Text on surfaces',
    status: 'Status and badges',
    trend: 'Trends',
    controlText: 'Text in controls',
    controlEdges: 'Control edges and marks',
    charts: 'Chart colors',
    syntax: 'Code syntax',
  } as Record<PairGroupId, string>,
  minimum: (ratio: number) => `${ratio}:1 minimum`,
  notEvaluated: 'Not evaluated',
  meetsThreshold: 'Meets threshold',
  reviewRequired: 'Review required',
  summary: (passed: number, total: number) =>
    `${passed} / ${total} pairs meet their threshold. Forced colors and unsupported colors are excluded.`,
  indicatorContrast:
    "Control boundaries, and the icons or lines required to identify state, need at least 3:1 against adjacent colors. Don't apply this rule wholesale to decorative dividers, secondary badge surfaces, or disabled controls. Compare each state's indicator with its adjacent surface, not the pre-hover color with the hover color. The solid border identifies focus. The faint outer glow is secondary.",
  wcagTextContrast: 'WCAG 1.4.3 — Text contrast',
  wcagNonTextContrast: 'WCAG 1.4.11 — Non-text contrast',
  statesHeading: 'State beyond color',
  statesIntro:
    'Text selection pairs an opaque neutral gray surface with a text color, both tuned to the theme. A translucent highlight would overlap body, code, or status surfaces and change the contrast. Drag to select the sentence below.',
  selectionSample: 'Selected text stays comfortable to read across surfaces.',
  statusIndicators:
    'Show status with a label, an SVG icon, and position. Use the full border and background, not an accent on one side of a rounded surface. Context and wording also tell brand actions apart from success states.',
  statusExamplesLabel: 'Semantic status examples',
  passed: 'Passed',
  failed: 'Failed',
  needsReview: 'Needs review',
  running: 'Running',
  notStarted: 'Not started',
  inspectContrast: 'Inspect contrast',
  badgeUsage: 'Badge usage and API',
  staticStatusesNote:
    "These statuses are static examples. Announce real asynchronous results once, where they're needed. Keep errors and recovery actions in the page content.",
  applicationHeading: 'Apply semantic color roles',
  tipStatusResults:
    'Show task results with a status name and an icon. For a failure, add the reason and a recovery action.',
  tipSelection:
    'Keep data status distinct from user selection. Show selection with checkboxes or a selected surface, and actions with clear buttons.',
  tipLinks:
    'Keep underlines on links in body text. Keep code and secondary descriptions at readable contrast too.',
  codeExampleLabel: 'Semantic color example',
  applyFooterStart:
    "Don't copy color values into products. Reference tokens instead: see the",
  tokenBrowserLink: 'token browser',
  applyFooterMid: ' and',
  inlineMessageLink: 'Inline message',
  applyFooterEnd: ' for real tokens and usage examples.',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    syntax: (role: string) => `구문: ${role}`,
    title: '제목',
    body: '본문',
    secondaryText: '보조 텍스트',
    insetContent: '안쪽 콘텐츠',
    selectedContent: '선택된 콘텐츠',
    errorTextOnSelection: '선택 영역의 오류 텍스트',
    brandAction: '브랜드 액션',
    brandTextLink: '브랜드 텍스트 / 링크',
    status: (tone: string) => `상태: ${tone}`,
    badge: (tone: string) => `배지: ${tone}`,
    textSelection: '텍스트 선택',
    chromeText: '크롬 텍스트',
    inputText: '입력 텍스트',
    inputPlaceholder: '입력 플레이스홀더',
    inputHoverText: '입력 호버 텍스트',
    focusedInputText: '포커스된 입력 텍스트',
    tooltip: '툴팁',
    choiceMark: '선택 항목 표시',
    choiceHoverMark: '선택 항목 호버 표시',
    inputBoundary: '입력 경계',
    inputBoundaryInside: '입력 경계 / 안쪽',
    inputHoverBoundary: '입력 호버 경계',
    inputHoverBoundaryInside: '입력 호버 경계 / 안쪽',
    inputFocusOutside: '입력 포커스 / 바깥',
    inputFocusInside: '입력 포커스 / 안쪽',
    choiceBoundary: '선택 항목 경계',
    choiceHoverBoundary: '선택 항목 호버 경계',
    choiceSelectedBoundary: '선택된 항목 경계',
    errorBoundary: '오류 경계',
    chartSeries: (index: number) => `차트 계열 ${index}`,
    chartCategory: (index: number) => `차트 범주 ${index}`,
    trend: (direction: 'up' | 'down') => (direction === 'up' ? '상승' : '하락'),
    trendSurface: (direction: 'up' | 'down') =>
      direction === 'up' ? '상승 면 위의 상승' : '하락 면 위의 하락',
    onThisPage: '이 페이지에서',
    nav: [
      { id: 'roles', label: '역할' },
      { id: 'oklch', label: 'OKLCH' },
      { id: 'lab', label: '팔레트 랩' },
      { id: 'contrast', label: '대비' },
      { id: 'states', label: '상태' },
      { id: 'application', label: '적용' },
    ],
    rolesHeading: '색 역할',
    rolesIntro:
      '색 이름이 아니라 역할을 참조하세요. 각 역할은 두 테마 모두에서 해석되며, 견본은 라이트 테마 다음에 다크 테마를 보여 줍니다. 모든 토큰의 값과 출처는',
    tokensLink: '디자인 토큰',
    rolesIntroEnd: '에 있습니다.',
    roleColumns: ['라이트', '다크', '토큰', '용도'],
    roleGroups: [
      {
        id: 'surfaces',
        title: '면',
        rows: [
          ['--chrome', 'fill', '앱의 바깥 틀과 사이드바'],
          ['--canvas', 'fill', '작업이 일어나는 시트와 대화상자'],
          ['--surface', 'fill', '시트 안의 보조 영역'],
          ['--code-bg', 'fill', '코드 블록과 인라인 코드'],
          ['--selected', 'fill', '현재 항목이나 선택한 항목'],
          ['--menu-background', 'fill', '메뉴, 선택 목록, 토스트'],
        ],
      },
      {
        id: 'text',
        title: '글자',
        rows: [
          ['--ink', 'text', '제목, 값, 입력 글자'],
          ['--ink-body', 'text', '본문'],
          ['--ink-muted', 'text', '설명과 캡션, 그래도 4.5:1'],
          [
            '--control-placeholder',
            'text',
            '입력 필드의 플레이스홀더',
            '--control-background',
          ],
        ],
      },
      {
        id: 'brand',
        title: '브랜드',
        rows: [
          ['--brand', 'fill', '주요 작업의 채움'],
          ['--on-brand', 'text', '--brand 위의 글자와 아이콘', '--brand'],
          ['--brand-ink', 'text', '링크, 언제나 밑줄과 함께'],
        ],
      },
      {
        id: 'lines',
        title: '선과 포커스',
        rows: [
          ['--line', 'line', '장식용 구분선과 같은 톤의 가장자리'],
          ['--control-border', 'line', '컨트롤의 경계, 면과 3:1'],
          ['--control-focus', 'line', '포커스된 입력 필드의 테두리'],
          ['--interaction-focus', 'line', '그 밖의 모든 포커스 링'],
        ],
      },
    ],
    statusTitle: '상태',
    statusColumns: ['톤', '--status-*-fg', '--status-*-bg', '--badge-*-bg'],
    tones: {
      neutral: '중립',
      info: '정보',
      success: '성공',
      danger: '위험',
      caution: '주의',
      progress: '진행',
    },
    trendTitle: '추이',
    trendColumns: ['방향', '--trend-*-fg', '--trend-*-bg'],
    directions: { up: '상승', down: '하락', flat: '보합' },
    trendNote:
      '빨강을 상승으로 읽는 시장에서는 --trend-up과 --trend-down을 바꿔 씁니다.',
    chartTitle: '차트',
    chartColumns: ['묶음', '라이트', '다크', '토큰'],
    chartSets: {
      series: '계열',
      categories: '범주',
    },
    chartNote:
      '계열은 기본으로 잉크 색에 점선과 마커로 구분하고, 범주는 색상으로 구분하되 모두 라벨을 함께 둡니다.',
    contrastHeading: '실시간 색 대비',
    contrastIntro:
      '색은 OKLCH로 정의하고 전환합니다. 대비는 선형 sRGB에서 WCAG 상대 밝기로 계산합니다. 색 모델이 대비 기준을 바꾸지는 않습니다.',
    contrastSteps:
      '각 면은 그 위에 놓인 면과 최소 1.05:1 차이를 유지해, 어떤 레이어도 배경에 묻히지 않게 하세요. 면은 크롬에서 시트로, 다시 움푹 들어간 면, 코드 웰, 호버, 선택으로 단계가 이어집니다. 움푹 들어간 면은 시트 위에 두세요. 크롬 위에서는 시트 톤을 사용하세요.',
    contrastThresholds:
      '일반 텍스트는 4.5:1, 큰 텍스트는 3:1이 필요합니다. 큰 텍스트는 최소 18pt(24 CSS px)이거나, 굵게일 때 최소 14pt(약 18.67 CSS px)입니다. 텍스트 행은 일반 텍스트 기준을 적용합니다. 입력 경계, 포커스 테두리, 선택 표시 행은 인접한 색에 대해 3:1이 필요합니다.',
    contrastApprox:
      '비율은 근사값입니다: 현재 테마의 계산된 색을 8비트 sRGB 픽셀로 변환해 구합니다. 비율은 소수점 둘째 자리까지 반올림해 표시하지만, 결과는 반올림하지 않은 값을 사용합니다. 검사에서는 투명 색, 그라디언트, 이미지, 조상 요소의 불투명도, 겹침, 앤티앨리어싱, 일부 인터랙션 상태를 건너뜁니다. 아슬아슬한 값과 실제 제품은 별도 도구로 다시 확인하세요.',
    forcedColorsStatus:
      '강제 색상 모드가 켜져 있습니다. 사용자 시스템 색상이 우선이므로 토큰 대비 검사는 건너뜁니다.',
    pairColumns: ['조합', '전경', '배경', '비율', '결과'],
    groups: {
      text: '면 위의 글자',
      status: '상태와 배지',
      trend: '추이',
      controlText: '컨트롤 안의 글자',
      controlEdges: '컨트롤 경계와 표시',
      charts: '차트 색',
      syntax: '코드 구문',
    },
    minimum: (ratio: number) => `최소 ${ratio}:1`,
    notEvaluated: '평가 안 됨',
    meetsThreshold: '기준 충족',
    reviewRequired: '검토 필요',
    summary: (passed: number, total: number) =>
      `${passed} / ${total}쌍이 기준을 충족합니다. 강제 색상과 지원되지 않는 색상은 제외됩니다.`,
    indicatorContrast:
      '컨트롤 경계와 상태를 식별하는 데 필요한 아이콘이나 선은 인접한 색에 대해 최소 3:1이 필요합니다. 이 규칙을 장식용 구분선, 보조 배지 면, 비활성 컨트롤에 그대로 적용하지 마세요. 각 상태의 표시는 인접한 면과 비교하고, 호버 전 색과 호버 색을 서로 비교하지 마세요. 실선은 포커스를 나타냅니다. 옅은 바깥쪽 빛은 보조적인 표시입니다.',
    wcagTextContrast: 'WCAG 1.4.3 — 텍스트 대비',
    wcagNonTextContrast: 'WCAG 1.4.11 — 비텍스트 대비',
    statesHeading: '색을 넘은 상태 전달',
    statesIntro:
      '텍스트 선택은 테마에 맞춘 불투명한 중립 회색 면과 텍스트 색을 짝으로 사용합니다. 반투명 강조는 본문, 코드, 상태 면 위에 겹쳐 대비를 바꿀 수 있습니다. 아래 문장을 드래그하여 선택하세요.',
    selectionSample: '선택한 텍스트는 어떤 면 위에서도 읽기 편하게 유지됩니다.',
    statusIndicators:
      '상태는 레이블, SVG 아이콘, 위치로 나타내세요. 둥근 면의 한쪽 강조 대신 전체 테두리와 배경을 사용하세요. 문맥과 문구도 브랜드 액션을 성공 상태와 구분해 줍니다.',
    statusExamplesLabel: '시맨틱 상태 예시',
    passed: '통과',
    failed: '실패',
    needsReview: '검토 필요',
    running: '실행 중',
    notStarted: '시작하지 않음',
    inspectContrast: '대비 확인',
    badgeUsage: 'Badge 사용법과 API',
    staticStatusesNote:
      '이 상태는 정적 예시입니다. 실제 비동기 결과는 필요한 위치에서 한 번만 알리세요. 오류와 복구 액션은 페이지 콘텐츠 안에 두세요.',
    applicationHeading: '시맨틱 색 역할 적용',
    tipStatusResults:
      '작업 결과는 상태 이름과 아이콘으로 나타내세요. 실패한 경우 원인과 복구 액션을 추가하세요.',
    tipSelection:
      '데이터 상태와 사용자 선택을 구분하세요. 선택은 체크박스나 선택된 면으로, 액션은 명확한 버튼으로 나타내세요.',
    tipLinks:
      '본문 링크에는 밑줄을 유지하세요. 코드와 보조 설명도 읽기 좋은 대비를 유지하세요.',
    codeExampleLabel: '시맨틱 색 예시',
    applyFooterStart:
      '색 값을 제품에 복사하지 마세요. 대신 토큰을 참조하세요. 실제 토큰과 사용 예시는',
    tokenBrowserLink: '토큰 브라우저',
    applyFooterMid: '와',
    inlineMessageLink: 'Inline message',
    applyFooterEnd: '에서 확인하세요.',
  },
}
