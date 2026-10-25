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
  focusedInputText: 'Focused input text',
  tooltip: 'Tooltip',
  choiceMark: 'Choice mark',
  choiceHoverMark: 'Choice hover mark',
  inputBoundary: 'Input boundary',
  inputBoundaryInside: 'Input boundary / inside',
  inputHoverBoundary: 'Input hover boundary',
  inputFocusOutside: 'Input focus / outside',
  inputFocusInside: 'Input focus / inside',
  choiceBoundary: 'Choice boundary',
  choiceHoverBoundary: 'Choice hover boundary',
  choiceSelectedBoundary: 'Choice selected boundary',
  errorBoundary: 'Error boundary',
  progressFill: 'Progress fill on its track',
  progressFillSheet: 'Progress fill on the sheet',
  statusBorder: (tone: string) => `Status border, ${tone}`,
  chartSeries: (index: number) => `Chart series ${index}`,
  chartCategory: (index: number) => `Chart category ${index}`,
  trend: (direction: 'up' | 'down') => `Trend ${direction}`,
  trendSurface: (direction: 'up' | 'down') =>
    `Trend ${direction} on its surface`,
  principles: [
    [
      'Use roles, not values.',
      'A role resolves in every theme, and a copied value breaks in the next one.',
    ],
    [
      'Set lightness first.',
      'Contrast depends mostly on OKLCH lightness, so tune hue and chroma afterward and check the ratio again.',
    ],
    [
      'Meet 4.5:1 for text and 3:1 for marks.',
      'Text needs 4.5:1 (WCAG 1.4.3), and control edges, focus indicators and state icons need 3:1 (WCAG 1.4.11).',
    ],
    [
      'Never rely on color alone.',
      'Name every status in words, beside its icon, so it reads with color vision deficiency and in forced colors (WCAG 1.4.1).',
    ],
    [
      'Save chroma for small areas.',
      'Large surfaces stay near gray, and the strongest color goes to small marks such as badges.',
    ],
  ],
  sections: {
    roles: 'Color roles',
    contrast: 'Contrast',
    status: 'Status and selection',
    oklch: 'OKLCH palette',
    lab: 'Palette lab',
  },
  rolesIntro:
    'Each row shows a role in the light theme, then the dark. Values and sources are in',
  tokensLink: 'Design tokens',
  rolesIntroEnd: '.',
  roleColumns: ['Light', 'Dark', 'Token', 'Use'],
  roleGroups: [
    {
      id: 'surfaces',
      title: 'Surfaces',
      rows: [
        ['--surf-chrome', 'fill', "The app's outer frame and sidebar"],
        ['--surf-canvas', 'fill', 'The sheet where work happens, and dialogs'],
        ['--surf-surface', 'fill', 'A secondary area inside the sheet'],
        [
          '--surf-recessed',
          'fill',
          'Tracks, read-only values and tab lists: the surface on the sheet, the canvas in a card',
        ],
        ['--surf-code-bg', 'fill', 'Code blocks and inline code'],
        ['--surf-selected', 'fill', 'The current or chosen item'],
        ['--surf-menu-background', 'fill', 'Menus, select lists and toasts'],
      ],
    },
    {
      id: 'text',
      title: 'Text',
      rows: [
        ['--surf-ink', 'text', 'Headings, values and input text'],
        ['--surf-ink-body', 'text', 'Body text'],
        ['--surf-ink-muted', 'text', 'Descriptions and captions, still 4.5:1'],
        [
          '--surf-control-placeholder',
          'text',
          'Placeholders in fields',
          '--surf-control-background',
        ],
      ],
    },
    {
      id: 'brand',
      title: 'Brand',
      rows: [
        ['--surf-brand', 'fill', 'Fills for primary actions'],
        [
          '--surf-on-brand',
          'text',
          'Text and icons on --surf-brand',
          '--surf-brand',
        ],
        [
          '--surf-brand-ink',
          'text',
          'Focus rings, a hovered link and the current location',
        ],
      ],
    },
    {
      id: 'lines',
      title: 'Lines and focus',
      rows: [
        ['--surf-line', 'line', 'Decorative dividers and same-tone edges'],
        [
          '--surf-control-border',
          'line',
          'Control edges, 3:1 against their plane',
        ],
        ['--surf-control-focus', 'line', "A focused field's border"],
        ['--surf-interaction-focus', 'line', 'Focus rings on everything else'],
      ],
    },
  ] as RoleGroup[],
  statusTitle: 'Status',
  statusColumns: [
    'Tone',
    '--surf-status-*-fg',
    '--surf-status-*-bg',
    '--surf-badge-*-bg',
  ],
  tones: {
    neutral: 'Neutral',
    info: 'Info',
    success: 'Success',
    danger: 'Danger',
    caution: 'Caution',
    progress: 'Progress',
  } as Record<Tone, string>,
  trendTitle: 'Trend',
  trendColumns: ['Direction', '--surf-trend-*-fg', '--surf-trend-*-bg'],
  directions: { up: 'Up', down: 'Down', flat: 'Flat' } as Record<
    Direction,
    string
  >,
  trendNote:
    'Markets that read red as a rise swap --surf-trend-up and --surf-trend-down.',
  chartTitle: 'Charts',
  chartColumns: ['Set', 'Light', 'Dark', 'Tokens'],
  chartSets: {
    series: 'Series',
    categories: 'Categories',
  },
  chartNote:
    'Series use ink with dashes and markers. Categories use hue, and each keeps a label.',
  codeIntro: 'In CSS, read a role through var().',
  codeExampleLabel: 'Semantic color example',
  contrastThresholds:
    'Text needs 4.5:1, and large text 3:1: 24px, or 18.67px bold. Control edges, focus indicators and selection marks need 3:1 against the color next to them. Decorative dividers and disabled controls are exempt.',
  contrastSurfaces:
    'Each surface keeps at least 1.05:1 against the one it sits on, so no plane disappears.',
  contrastMethod:
    "The tables measure the current theme's computed colors as WCAG 2 luminance in sRGB. They skip transparency, gradients and overlap, so recheck borderline values with a separate tool.",
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
  wcagTextContrast: 'WCAG 1.4.3 — Text contrast',
  wcagNonTextContrast: 'WCAG 1.4.11 — Non-text contrast',
  statusIntro:
    'Show a status with a label and an icon, and fill its whole surface or border, not one rounded side. Success is green, apart from the brand, and the label still names it.',
  statusExamplesLabel: 'Semantic status examples',
  passed: 'Passed',
  failed: 'Failed',
  needsReview: 'Needs review',
  running: 'Running',
  notStarted: 'Not started',
  selectionSample:
    'Selected text takes an opaque gray and its own text color, so it stays readable on any surface. Select this sentence to see it.',
  oklchIntro:
    'OKLCH names a color by lightness L (0–1), chroma C and hue H. L tracks perceived lightness, and a hue keeps its look from light to dark, unlike HSL. So the system fixes L for contrast and lets hue and chroma vary.',
  oklchLabel: 'OKLCH palette decisions',
  oklchColumns: ['Decision', 'Rule', 'In Surflane'],
  oklchRows: [
    [
      'Lightness',
      'Set per role first; contrast mostly follows the gap',
      'Light: surfaces 0.94–1.00, text 0.24–0.38',
    ],
    [
      'Dark theme',
      'A ladder of its own, not an inversion',
      'Dark: surfaces 0.21–0.38, text 0.82–0.98',
    ],
    [
      'Gamut',
      "Clamp each step's chroma to sRGB at its L and hue",
      'maxChroma(l, h) in the theme builder',
    ],
    ['Chroma', 'Lower as the area grows', 'Grays 0.003–0.018, accent 0.12'],
    [
      'Harmony',
      'Supporting hues by angle',
      'Analogous ±30°, complementary 180°, split 180° ± 30°, triadic 120°, square 90°',
    ],
    ['Status', 'Hues by convention, always labeled', 'Danger 27°, caution 94°'],
    [
      'Categories',
      'Six hues in one lightness band, six halfway between them in another, checked for color vision deficiency',
      'Light 0.50–0.56 then 0.38–0.45, dark 0.74–0.82 then 0.84–0.92',
    ],
    [
      'Measurement',
      'Define and interpolate in OKLCH, measure contrast in sRGB',
      'WCAG 2 relative luminance',
    ],
  ],
  labIntro:
    "Pick hues on the wheel. The lab builds ramps, checks a categorical set for color vision deficiency, and measures any pair. Copy the CSS when a palette works. The site's theme doesn't change.",
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
    focusedInputText: '포커스된 입력 텍스트',
    tooltip: '툴팁',
    choiceMark: '선택 항목 표시',
    choiceHoverMark: '선택 항목 호버 표시',
    inputBoundary: '입력 경계',
    inputBoundaryInside: '입력 경계 / 안쪽',
    inputHoverBoundary: '입력 호버 경계',
    inputFocusOutside: '입력 포커스 / 바깥',
    inputFocusInside: '입력 포커스 / 안쪽',
    choiceBoundary: '선택 항목 경계',
    choiceHoverBoundary: '선택 항목 호버 경계',
    choiceSelectedBoundary: '선택된 항목 경계',
    errorBoundary: '오류 경계',
    progressFill: '트랙 위 진행률 채움',
    progressFillSheet: '시트 위 진행률 채움',
    statusBorder: (tone: string) => `상태 테두리, ${tone}`,
    chartSeries: (index: number) => `차트 계열 ${index}`,
    chartCategory: (index: number) => `차트 범주 ${index}`,
    trend: (direction: 'up' | 'down') => (direction === 'up' ? '상승' : '하락'),
    trendSurface: (direction: 'up' | 'down') =>
      direction === 'up' ? '상승 면 위의 상승' : '하락 면 위의 하락',
    principles: [
      [
        '값 대신 역할을 쓰세요.',
        '역할은 모든 테마에서 다시 해석되지만, 복사한 값은 다음 테마에서 깨집니다.',
      ],
      [
        '밝기부터 정하세요.',
        '대비는 주로 OKLCH 밝기로 정해지므로, 색상과 채도는 그다음에 다듬고 대비를 다시 확인하세요.',
      ],
      [
        '글자는 4.5:1, 표시는 3:1을 지키세요.',
        '글자는 4.5:1(WCAG 1.4.3), 컨트롤 경계와 포커스 표시와 상태 아이콘은 3:1(WCAG 1.4.11)이 필요합니다.',
      ],
      [
        '색만으로 전달하지 마세요.',
        '상태는 아이콘 옆에 글자로 이름을 붙여야 색각 이상과 강제 색상에서도 읽힙니다(WCAG 1.4.1).',
      ],
      [
        '채도는 작은 면에 쓰세요.',
        '넓은 면은 회색에 가깝게 두고, 가장 진한 색은 배지 같은 작은 표시에 씁니다.',
      ],
    ],
    sections: {
      roles: '색 역할',
      contrast: '대비',
      status: '상태와 선택',
      oklch: 'OKLCH 팔레트',
      lab: '팔레트 랩',
    },
    rolesIntro:
      '각 행은 역할을 라이트 테마, 다크 테마 순으로 보여 줍니다. 값과 출처는',
    tokensLink: '디자인 토큰',
    rolesIntroEnd: '에 있습니다.',
    roleColumns: ['라이트', '다크', '토큰', '용도'],
    roleGroups: [
      {
        id: 'surfaces',
        title: '면',
        rows: [
          ['--surf-chrome', 'fill', '앱의 바깥 틀과 사이드바'],
          ['--surf-canvas', 'fill', '작업이 일어나는 시트와 대화상자'],
          ['--surf-surface', 'fill', '시트 안의 보조 영역'],
          [
            '--surf-recessed',
            'fill',
            '트랙, 읽기 전용 값, 탭 목록. 시트 위에서는 보조 면, 카드 안에서는 캔버스',
          ],
          ['--surf-code-bg', 'fill', '코드 블록과 인라인 코드'],
          ['--surf-selected', 'fill', '현재 항목이나 선택한 항목'],
          ['--surf-menu-background', 'fill', '메뉴, 선택 목록, 토스트'],
        ],
      },
      {
        id: 'text',
        title: '글자',
        rows: [
          ['--surf-ink', 'text', '제목, 값, 입력 글자'],
          ['--surf-ink-body', 'text', '본문'],
          ['--surf-ink-muted', 'text', '설명과 캡션, 그래도 4.5:1'],
          [
            '--surf-control-placeholder',
            'text',
            '입력 필드의 플레이스홀더',
            '--surf-control-background',
          ],
        ],
      },
      {
        id: 'brand',
        title: '브랜드',
        rows: [
          ['--surf-brand', 'fill', '주요 작업의 채움'],
          [
            '--surf-on-brand',
            'text',
            '--surf-brand 위의 글자와 아이콘',
            '--surf-brand',
          ],
          ['--surf-brand-ink', 'text', '포커스 링, 호버한 링크, 현재 위치'],
        ],
      },
      {
        id: 'lines',
        title: '선과 포커스',
        rows: [
          ['--surf-line', 'line', '장식용 구분선과 같은 톤의 가장자리'],
          ['--surf-control-border', 'line', '컨트롤의 경계, 면과 3:1'],
          ['--surf-control-focus', 'line', '포커스된 입력 필드의 테두리'],
          ['--surf-interaction-focus', 'line', '그 밖의 모든 포커스 링'],
        ],
      },
    ],
    statusTitle: '상태',
    statusColumns: [
      '톤',
      '--surf-status-*-fg',
      '--surf-status-*-bg',
      '--surf-badge-*-bg',
    ],
    tones: {
      neutral: '중립',
      info: '정보',
      success: '성공',
      danger: '위험',
      caution: '주의',
      progress: '진행',
    },
    trendTitle: '추이',
    trendColumns: ['방향', '--surf-trend-*-fg', '--surf-trend-*-bg'],
    directions: { up: '상승', down: '하락', flat: '보합' },
    trendNote:
      '빨강을 상승으로 읽는 시장에서는 --surf-trend-up과 --surf-trend-down을 바꿔 씁니다.',
    chartTitle: '차트',
    chartColumns: ['묶음', '라이트', '다크', '토큰'],
    chartSets: {
      series: '계열',
      categories: '범주',
    },
    chartNote:
      '계열은 잉크 색에 점선과 마커를 쓰고, 범주는 색상으로 나누되 모두 라벨을 둡니다.',
    codeIntro: 'CSS에서는 var()로 역할을 읽으세요.',
    codeExampleLabel: '시맨틱 색 예시',
    contrastThresholds:
      '글자는 4.5:1, 24px 이상(굵으면 18.67px)인 큰 글자는 3:1이 필요합니다. 컨트롤 경계, 포커스 표시, 선택 표시는 맞닿은 색과 3:1이 필요하며, 장식용 구분선과 비활성 컨트롤은 예외입니다.',
    contrastSurfaces:
      '각 면은 아래 면과 1.05:1 이상 차이를 두어, 어떤 면도 배경에 묻히지 않게 합니다.',
    contrastMethod:
      '표는 현재 테마의 계산된 색을 sRGB의 WCAG 2 상대 휘도로 측정합니다. 투명도, 그라디언트, 겹침은 건너뛰므로 경계에 걸린 값은 별도 도구로 다시 확인하세요.',
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
    wcagTextContrast: 'WCAG 1.4.3 — 텍스트 대비',
    wcagNonTextContrast: 'WCAG 1.4.11 — 비텍스트 대비',
    statusIntro:
      '상태는 라벨과 아이콘으로 나타내고, 둥근 면의 한쪽만이 아니라 면 전체나 테두리 전체를 칠하세요. 성공은 브랜드와 다른 초록이고, 그래도 라벨로 이름을 밝힙니다.',
    statusExamplesLabel: '시맨틱 상태 예시',
    passed: '통과',
    failed: '실패',
    needsReview: '검토 필요',
    running: '실행 중',
    notStarted: '시작하지 않음',
    selectionSample:
      '선택한 글자는 불투명한 회색과 전용 글자색을 써서 어느 면에서도 읽힙니다. 이 문장을 선택해 보세요.',
    oklchIntro:
      'OKLCH는 색을 밝기 L(0–1), 채도 C, 색상 H로 나타냅니다. L은 눈에 보이는 밝기를 따르고, 색상은 HSL과 달리 밝기가 바뀌어도 유지됩니다. 그래서 대비는 L로 고정하고 색상과 채도만 바꿉니다.',
    oklchLabel: 'OKLCH 팔레트 결정',
    oklchColumns: ['결정', '규칙', 'Surflane 값'],
    oklchRows: [
      [
        '밝기',
        '역할마다 먼저 정함, 대비는 주로 그 차이를 따름',
        '라이트: 면 0.94–1.00, 글자 0.24–0.38',
      ],
      [
        '다크 테마',
        '반전이 아닌 별도의 밝기 단계',
        '다크: 면 0.21–0.38, 글자 0.82–0.98',
      ],
      [
        '색역',
        '단계마다 채도를 그 밝기와 색상의 sRGB 안으로 제한',
        '테마 빌더의 maxChroma(l, h)',
      ],
      ['채도', '면적이 넓을수록 낮게', '회색 0.003–0.018, 강조색 0.12'],
      [
        '조화',
        '보조 색상을 각도로 선택',
        '유사 ±30°, 보색 180°, 분할 보색 180° ± 30°, 삼각 120°, 사각 90°',
      ],
      ['상태', '관례를 따르는 색상, 언제나 라벨과 함께', '위험 27°, 주의 94°'],
      [
        '범주',
        '한 밝기 대역에 6색, 다른 대역에 그 사이 6색, 색각 이상 검사',
        '라이트 0.50–0.56과 0.38–0.45, 다크 0.74–0.82와 0.84–0.92',
      ],
      ['측정', 'OKLCH로 정의하고 보간, 대비는 sRGB로 측정', 'WCAG 2 상대 휘도'],
    ],
    labIntro:
      '색상환에서 색상을 고르세요. 랩은 단계를 만들고, 범주 묶음을 색각 이상 기준으로 검사하고, 아무 조합의 대비든 측정합니다. 팔레트가 마음에 들면 CSS를 복사하세요. 사이트 테마는 바뀌지 않습니다.',
  },
}
