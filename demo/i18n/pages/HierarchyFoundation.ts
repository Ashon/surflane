import type { Locale } from '../../i18n'

type Tier = {
  id: 'plane' | 'elevation' | 'line' | 'point'
  step: string
  name: string
  role: string
  tokens: string[]
}
type Stat = {
  label: string
  value: string
  change: number
  lowerIsBetter?: boolean
}
type Run = {
  service: string
  tone: 'success' | 'danger' | 'progress'
  status: string
  duration: string
}

const tokens = {
  plane: [
    '--surf-chrome',
    '--surf-canvas',
    '--surf-surface',
    '--surf-selected',
  ],
  elevation: [
    '--surf-shadow-float',
    '--surf-shadow-sheet',
    '--surf-layer-popup',
  ],
  line: ['--surf-control-border', '--surf-line', '--surf-menu-border'],
  point: [
    '--surf-ink',
    '--surf-ink-muted',
    '--surf-brand-ink',
    '--surf-icon-size-md',
  ],
}

const en = {
  principles: [
    [
      'Build structure with planes first.',
      'Tone and spacing divide a screen before any line or shadow does.',
    ],
    [
      'Raise only what overlaps the work.',
      'Elevation means "on top for now", so static content such as cards and charts stays flat.',
    ],
    [
      "Draw a line only where planes can't separate.",
      "A line marks a control's edge or a meeting of same-tone areas.",
    ],
    [
      'Keep points for content.',
      "Bold labels, icons, and colored text can't stand in for a plane, a heading, or spacing.",
    ],
    [
      'Never nest a card in a card.',
      'Inside a plane, separate content with spacing and headings.',
    ],
  ],
  sections: {
    order: 'Hierarchy order',
    build: 'Step-by-step build',
    planes: 'Planes',
    elevation: 'Elevation',
    lines: 'Lines',
    points: 'Points',
  },
  orderIntro:
    "Four tiers build a screen, heaviest first. A plane changes the whole screen, and a point changes one word. Reach for the next tier only when the one before can't do the job.",
  tiers: [
    {
      id: 'plane',
      step: '1',
      name: 'Plane',
      role: 'Divides the screen into regions by tone.',
      tokens: tokens.plane,
    },
    {
      id: 'elevation',
      step: '2',
      name: 'Elevation',
      role: 'Lifts what sits over the work for now.',
      tokens: tokens.elevation,
    },
    {
      id: 'line',
      step: '3',
      name: 'Line',
      role: "Marks a control's edge, or splits same-tone areas.",
      tokens: tokens.line,
    },
    {
      id: 'point',
      step: '4',
      name: 'Point',
      role: 'Carries the content: type, icons, and badges.',
      tokens: tokens.point,
    },
  ] as Tier[],
  buildIntro:
    'This workspace uses real components. Each step turns on one more tier through its tokens, inside this preview only.',
  stepsLabel: 'Hierarchy step',
  steps: ['1 Planes', '2 + Elevation', '3 + Lines', '4 + Points'],
  stepStatus: [
    'Step 1 of 4, planes: tone alone separates the frame, the sheet, the summary, and the selected row.',
    'Step 2 of 4, elevation: the sheet gets its hairline shadow, and only the open filter, which overlaps the work, floats.',
    "Step 3 of 4, lines: only the controls and the filter's edge show a boundary.",
    'Step 4 of 4, points: type, icons, and badges carry the content.',
  ],
  previewLabel: 'Deployments workspace preview',
  deployments: 'Deployments',
  healthy: 'Healthy',
  newDeployment: 'New deployment',
  search: 'Search services',
  filter: 'Filter',
  filterTitle: 'Show runs',
  filterOptions: ['Succeeded', 'Failed', 'Running'],
  summaryLabel: 'Today',
  stats: [
    { label: 'Runs today', value: '128', change: 0.12 },
    {
      label: 'Failure rate',
      value: '2.3%',
      change: -0.008,
      lowerIsBetter: true,
    },
    {
      label: 'Median duration',
      value: '4m 12s',
      change: -0.06,
      lowerIsBetter: true,
    },
  ] as Stat[],
  vsYesterday: 'vs yesterday',
  tableLabel: 'Recent runs',
  columns: ['Service', 'Status', 'Duration'],
  runs: [
    {
      service: 'checkout-api',
      tone: 'success',
      status: 'Succeeded',
      duration: '3m 58s',
    },
    {
      service: 'search-indexer',
      tone: 'progress',
      status: 'Running',
      duration: '1m 20s',
    },
    {
      service: 'billing-worker',
      tone: 'danger',
      status: 'Failed',
      duration: '0m 42s',
    },
  ] as Run[],
  planeRules: [
    'Use the roles by depth: `--surf-chrome` for the frame, `--surf-canvas` for the sheet, `--surf-surface` for a secondary area, and `--surf-selected` for the current item.',
    'Neighboring roles differ by at least 1.05:1, enough to read as regions without a line.',
    'Keep one surface level inside the sheet.',
    'Inset a nested plane equally on all sides, with the radius max(0, outer radius − inset).',
    'Blur the screen to check: the regions should still read from tone and spacing alone.',
  ],
  elevationRules: [
    'Floating UI takes `--surf-shadow-float` on an opaque `--surf-menu-background`, with its `--surf-layer-*` token. A shadow without its layer misreports what is on top.',
    'The only resting shadow is `--surf-shadow-sheet`, a hairline between the sheet and the frame.',
    'Floating UI keeps its 1px `--surf-menu-border`, because shadows fade in the dark theme and vanish in forced colors.',
  ],
  lineRules: [
    '`--surf-control-border` marks inputs, selects, checkboxes, and outline buttons. As the one line with meaning, it meets 3:1 against its plane (WCAG 1.4.11).',
    '`--surf-line` is decorative: section dividers, and the edge where fixed chrome meets same-tone scrolling content.',
    "Don't box what tone or spacing already separates. Table rows part by spacing, and hover and selection fill them.",
    "Don't mark status with a one-sided accent border. Use a label and an icon.",
  ],
  pointRules: [
    'Rank points by type role and ink, not decoration: `--surf-ink`, then `--surf-ink-body`, then `--surf-ink-muted`.',
    'Spend small saturated points, such as badges and status dots, on status, the current location, and the primary action.',
  ],
}

export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    principles: [
      [
        '구조는 면으로 먼저 만드세요.',
        '선이나 그림자보다 톤과 간격이 먼저 화면을 나눕니다.',
      ],
      [
        '작업 위에 겹치는 것만 띄우세요.',
        '높이는 "지금 잠시 위에 있다"는 뜻이므로 카드와 차트는 평평하게 둡니다.',
      ],
      [
        '면으로 나눌 수 없는 곳에만 선을 그으세요.',
        '선은 컨트롤의 경계나 같은 톤이 만나는 곳을 표시합니다.',
      ],
      [
        '점은 내용에만 쓰세요.',
        '굵은 라벨, 아이콘, 색 글자는 면이나 제목, 간격을 대신하지 못합니다.',
      ],
      [
        '카드 안에 카드를 두지 마세요.',
        '면 안의 내용은 간격과 제목으로 나누세요.',
      ],
    ],
    sections: {
      order: '위계 순서',
      build: '단계별 쌓기',
      planes: '면',
      elevation: '높이',
      lines: '선',
      points: '점',
    },
    orderIntro:
      '화면은 무거운 것부터 네 가지 수단으로 만듭니다. 면은 화면 전체를, 점은 단어 하나를 바꿉니다. 앞의 수단으로 안 될 때만 다음 수단을 쓰세요.',
    tiers: [
      {
        id: 'plane',
        step: '1',
        name: '면',
        role: '톤으로 화면을 영역으로 나눕니다.',
        tokens: tokens.plane,
      },
      {
        id: 'elevation',
        step: '2',
        name: '높이',
        role: '잠시 작업 위에 놓이는 것을 띄웁니다.',
        tokens: tokens.elevation,
      },
      {
        id: 'line',
        step: '3',
        name: '선',
        role: '컨트롤의 경계나 같은 톤이 만나는 곳을 표시합니다.',
        tokens: tokens.line,
      },
      {
        id: 'point',
        step: '4',
        name: '점',
        role: '글자, 아이콘, 배지로 내용을 싣습니다.',
        tokens: tokens.point,
      },
    ],
    buildIntro:
      '실제 컴포넌트로 만든 작업 화면입니다. 단계마다 수단을 하나씩, 이 미리보기 안에서만 토큰으로 켭니다.',
    stepsLabel: '위계 단계',
    steps: ['1 면', '2 + 높이', '3 + 선', '4 + 점'],
    stepStatus: [
      '4단계 중 1단계, 면: 톤만으로 틀, 시트, 요약 영역, 선택한 행이 나뉩니다.',
      '4단계 중 2단계, 높이: 시트에 아주 가는 그림자가 생기고, 작업 위에 겹친 열린 필터만 떠오릅니다.',
      '4단계 중 3단계, 선: 컨트롤과 필터의 가장자리에만 경계가 생깁니다.',
      '4단계 중 4단계, 점: 글자, 아이콘, 배지가 내용을 싣습니다.',
    ],
    previewLabel: '배포 작업 화면 미리보기',
    deployments: '배포',
    healthy: '정상',
    newDeployment: '새 배포',
    search: '서비스 검색',
    filter: '필터',
    filterTitle: '표시할 실행',
    filterOptions: ['성공', '실패', '실행 중'],
    summaryLabel: '오늘',
    stats: [
      { label: '오늘 실행', value: '128', change: 0.12 },
      { label: '실패율', value: '2.3%', change: -0.008, lowerIsBetter: true },
      {
        label: '중간 소요 시간',
        value: '4분 12초',
        change: -0.06,
        lowerIsBetter: true,
      },
    ],
    vsYesterday: '어제 대비',
    tableLabel: '최근 실행',
    columns: ['서비스', '상태', '소요 시간'],
    runs: [
      {
        service: 'checkout-api',
        tone: 'success',
        status: '성공',
        duration: '3분 58초',
      },
      {
        service: 'search-indexer',
        tone: 'progress',
        status: '실행 중',
        duration: '1분 20초',
      },
      {
        service: 'billing-worker',
        tone: 'danger',
        status: '실패',
        duration: '0분 42초',
      },
    ],
    planeRules: [
      '깊이에 따라 역할을 쓰세요. 틀은 `--surf-chrome`, 시트는 `--surf-canvas`, 보조 영역은 `--surf-surface`, 현재 항목은 `--surf-selected`입니다.',
      '이웃한 역할은 1.05:1 이상 차이 나서 선 없이도 영역으로 읽힙니다.',
      '시트 안의 보조 면은 한 단계만 두세요.',
      '안에 놓는 면은 네 변의 여백을 같게 두고, 반경을 max(0, 바깥 반경 − 여백)로 맞추세요.',
      '화면을 흐리게 보며 확인하세요. 영역은 톤과 간격만으로 읽혀야 합니다.',
    ],
    elevationRules: [
      '떠 있는 UI는 불투명한 `--surf-menu-background`에 `--surf-shadow-float`와 `--surf-layer-*` 토큰을 함께 씁니다. 레이어 없는 그림자는 무엇이 위인지 잘못 알립니다.',
      '머무는 그림자는 시트와 틀 사이의 가는 `--surf-shadow-sheet` 하나뿐입니다.',
      '떠 있는 UI는 1px `--surf-menu-border`를 유지하세요. 그림자는 다크 테마에서 흐려지고 강제 색상 모드에서 사라집니다.',
    ],
    lineRules: [
      '`--surf-control-border`는 입력, 선택, 체크박스, 외곽선 버튼의 경계입니다. 의미를 싣는 유일한 선이라 면과 3:1 이상 대비됩니다(WCAG 1.4.11).',
      '`--surf-line`은 장식입니다. 섹션 구분선과, 고정 크롬이 같은 톤의 스크롤 콘텐츠와 만나는 가장자리에 씁니다.',
      '톤이나 간격으로 나뉜 곳을 상자로 두르지 마세요. 표의 행은 간격으로 나누고, 호버와 선택은 면으로 채웁니다.',
      '한쪽 강조 테두리로 상태를 표시하지 마세요. 라벨과 아이콘을 쓰세요.',
    ],
    pointRules: [
      '점의 서열은 장식이 아니라 타입 역할과 잉크로 정하세요. `--surf-ink`, `--surf-ink-body`, `--surf-ink-muted` 순입니다.',
      '배지와 상태 점처럼 채도가 높은 작은 점은 상태, 현재 위치, 주요 작업에만 쓰세요.',
    ],
  },
}
