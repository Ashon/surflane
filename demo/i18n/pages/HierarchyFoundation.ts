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
  plane: ['--chrome', '--canvas', '--surface', '--selected'],
  elevation: ['--shadow-float', '--shadow-sheet', '--layer-popup'],
  line: ['--control-border', '--line', '--focus-ring-width'],
  point: ['--ink', '--ink-muted', '--brand-ink', '--icon-size-md'],
}

const en = {
  onThisPage: 'On this page',
  nav: [
    { id: 'order', label: 'Order' },
    { id: 'build', label: 'Build a screen' },
    { id: 'planes', label: 'Planes' },
    { id: 'elevation', label: 'Elevation' },
    { id: 'lines', label: 'Lines' },
    { id: 'points', label: 'Points' },
    { id: 'review', label: 'Review' },
  ],
  orderTitle: 'Planes, elevation, lines, points',
  orderIntro:
    "Every screen is built from four means, from the largest to the smallest: flat planes, elevation, lines, and points such as type, icons, and other glyphs. Decide them in that order, and reach for the next means only when the one before can't do the job. Tone and spacing come before a shadow, a shadow lifts only what overlaps, a line appears only where planes can't separate, and points carry the content itself.",
  tiers: [
    {
      id: 'plane',
      step: '1',
      name: 'Plane',
      role: 'Divides the screen into regions by tone: the frame, the sheet, secondary areas, and selection.',
      tokens: tokens.plane,
    },
    {
      id: 'elevation',
      step: '2',
      name: 'Elevation',
      role: 'Lifts what sits over the work for now: menus, popovers, dialogs, and notifications.',
      tokens: tokens.elevation,
    },
    {
      id: 'line',
      step: '3',
      name: 'Line',
      role: "Marks a control's edge, or divides where same-tone areas meet and planes can't.",
      tokens: tokens.line,
    },
    {
      id: 'point',
      step: '4',
      name: 'Point',
      role: 'Carries the content and its emphasis: type, icons, badges, and markers.',
      tokens: tokens.point,
    },
  ] as Tier[],
  orderNote:
    'The order is also an order of weight. A plane changes how the whole screen reads; a point changes one word. Solve structure with the largest means that works, and keep the smallest for content.',
  buildTitle: 'Build a screen in order',
  buildIntro:
    "The workspace below uses real components. Each step turns on one more means, through its tokens and only inside this preview; the components themselves don't change. At step 1 the regions already read from tone alone.",
  stepsLabel: 'Hierarchy step',
  steps: ['1 Planes', '2 + Elevation', '3 + Lines', '4 + Points'],
  stepStatus: [
    'Step 1 of 4, planes: the frame, the sheet, the summary area and the selected row read as regions from tone alone; the other rows part by spacing. The open filter has no shadow yet, so it merges with the sheet.',
    'Step 2 of 4, elevation: the sheet rests a hair above the frame, and only the open filter, which overlaps the work, casts a real shadow.',
    "Step 3 of 4, lines: the search field, the Filter button, the checkboxes and the open filter's edge show their boundaries. Nothing else needed a line.",
    'Step 4 of 4, points: type, icons and badges carry the content, ranked by type role, ink and position.',
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
  planesTitle: 'Planes come first',
  planesIntro:
    'A plane is a flat area of one tone. Regions read from the difference between tones and from spacing, before any line or shadow.',
  planeRules: [
    "Use the roles in order of depth: --chrome for the app's outer frame and sidebar, --canvas for the sheet where work happens, --surface for a secondary area inside the sheet, and --selected for the current or chosen item.",
    'Neighboring roles differ by at least 1.05:1, enough to read as separate regions without a line. Status tints such as --status-danger-bg are planes too, and always come with a label.',
    'Keep one level of surface inside the sheet. Within a plane, separate content with spacing and headings, not with another plane: never a card inside a card.',
    "A plane's inset is the same on all four sides, and a plane inside it takes the radius max(0, outer radius − inset), so the corners stay concentric.",
    'Hover and pressed states tint the plane under them with --interaction-hover-bg and --interaction-active-bg; selection fills it with --selected.',
  ],
  elevationTitle: 'Elevation only for what overlaps',
  elevationIntro:
    'Elevation says "this sits over your work for now". It belongs to UI that appears on demand and goes away: menus, select lists, popovers, dialogs, toasts, and the chart\'s floating values.',
  elevationRules: [
    'Floating UI takes --shadow-float on an opaque plane, --menu-background or --canvas, and a --layer-* token. A shadow without its layer, or a layer without its shadow, misreports what is on top.',
    'The only resting shadow is --shadow-sheet, a hairline that sets the content sheet off the frame.',
    "Don't lift static content, such as a card, a section or a chart, to make it stand out. Give it a plane or a heading instead.",
    'A floating plane often has the tone of the sheet under it, and shadows read weakly in the dark theme, so floating UI keeps a --menu-border edge as well: the line rule at work, where same-tone areas meet.',
    'In forced colors shadows disappear, so floating UI also draws a 1px system-color border there.',
  ],
  elevationLink:
    'Stacking order, portals and clipping are in Layers / elevation.',
  linesTitle: "Lines where planes can't separate",
  linesIntro:
    "A line is the thinnest means and the easiest to overuse. It has two jobs: to show where a control begins and ends, and to divide where same-tone areas meet and spacing alone can't separate them.",
  lineRules: [
    '--control-border marks inputs, selects, checkboxes and outline buttons, and meets 3:1 against its plane, because a person has to find the control. It is the one line that carries meaning.',
    "--line is decorative: a full-width divider that turns stacked sections into panels, the edge where fixed chrome meets scrolling content of the same tone, or a menu's edge.",
    "Don't box a region that tone or spacing already separates, and don't add a border on top of a change of plane. Table rows part by spacing, and hover and selection fill them as planes, not rules.",
    "Don't mark status with a one-sided accent border. Status takes a label, an icon and its position.",
    'Focus rings are lines that belong to interaction: --focus-ring-width in --interaction-focus, never removed and never replaced by a shadow alone.',
  ],
  pointsTitle: 'Points carry the content',
  pointsIntro:
    'Points are the smallest marks: letters, numbers, icons, badges, dots and chart markers. They carry what the screen says, so within a region they decide what is read first.',
  pointRules: [
    'Rank points by type role and ink, not by decoration: a heading role over body text, --ink over --ink-body over --ink-muted, and weight 500 only for headings, labels and actions.',
    'Icons are 16, 20 or 24px in currentColor and sit beside a word or carry an accessible name. A glyph never stands alone for meaning.',
    'Small saturated points, such as a badge, a status dot or the current destination, are the loudest marks on a quiet page. Spend them on status, the current location and the primary action.',
    "Don't build structure out of points. Bold labels, icons or colored text can't stand in for a plane, a heading or spacing.",
  ],
  reviewTitle: 'Review a screen in the same order',
  reviewSteps: [
    'Blur your eyes or hide the text: do the regions still read from tone and spacing alone?',
    "Is anything raised that doesn't overlap the work? Lower it to a plane.",
    'Can a line go because a plane or spacing already separates? Every line left should mark a control or a meeting of same-tone areas.',
    'Count the saturated points. Each one should be a status, the current location or the primary action.',
  ],
  reviewNote:
    'Component reviews follow the same order: a component adds a border or a shadow only where these rules call for it.',
}

export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    onThisPage: '이 페이지에서',
    nav: [
      { id: 'order', label: '순서' },
      { id: 'build', label: '화면 쌓기' },
      { id: 'planes', label: '면' },
      { id: 'elevation', label: '높이' },
      { id: 'lines', label: '선' },
      { id: 'points', label: '점' },
      { id: 'review', label: '검토' },
    ],
    orderTitle: '면, 높이, 선, 점',
    orderIntro:
      '모든 화면은 큰 것부터 작은 것까지 네 가지 수단으로 만듭니다. 평평한 면, 높이, 선, 그리고 글자·아이콘 같은 점입니다. 이 순서대로 정하고, 앞의 수단으로 안 될 때만 다음 수단을 쓰세요. 그림자보다 톤과 간격이 먼저이고, 그림자는 겹치는 것만 띄우며, 선은 면으로 나눌 수 없는 곳에만 긋고, 점은 내용 자체를 싣습니다.',
    tiers: [
      {
        id: 'plane',
        step: '1',
        name: '면',
        role: '톤으로 화면을 영역으로 나눕니다. 바깥 틀, 작업 시트, 보조 영역, 선택이 여기에 속합니다.',
        tokens: tokens.plane,
      },
      {
        id: 'elevation',
        step: '2',
        name: '높이',
        role: '잠시 작업 위에 놓이는 것을 띄웁니다. 메뉴, 팝오버, 대화상자, 알림입니다.',
        tokens: tokens.elevation,
      },
      {
        id: 'line',
        step: '3',
        name: '선',
        role: '컨트롤의 경계를 표시하거나, 같은 톤이 만나 면으로 나눌 수 없는 곳을 나눕니다.',
        tokens: tokens.line,
      },
      {
        id: 'point',
        step: '4',
        name: '점',
        role: '내용과 강조를 싣습니다. 글자, 아이콘, 배지, 마커입니다.',
        tokens: tokens.point,
      },
    ],
    orderNote:
      '이 순서는 무게의 순서이기도 합니다. 면은 화면 전체가 읽히는 방식을 바꾸고, 점은 단어 하나를 바꿉니다. 구조는 통하는 가장 큰 수단으로 풀고, 가장 작은 수단은 내용에 남겨 두세요.',
    buildTitle: '순서대로 화면 쌓기',
    buildIntro:
      '아래 작업 화면은 실제 컴포넌트로 만들었습니다. 단계마다 수단을 하나씩 켜는데, 이 미리보기 안에서 해당 토큰만 켜고 컴포넌트 자체는 바꾸지 않습니다. 1단계에서도 영역은 톤만으로 이미 읽힙니다.',
    stepsLabel: '위계 단계',
    steps: ['1 면', '2 + 높이', '3 + 선', '4 + 점'],
    stepStatus: [
      '4단계 중 1단계, 면: 바깥 틀, 시트, 요약 영역, 선택한 행이 톤만으로 영역으로 읽히고, 나머지 행은 간격으로 나뉩니다. 열린 필터는 아직 그림자가 없어 시트와 섞입니다.',
      '4단계 중 2단계, 높이: 시트는 틀 위에 아주 살짝 놓이고, 작업 위에 겹치는 열린 필터만 실제 그림자를 드리웁니다.',
      '4단계 중 3단계, 선: 검색 입력, 필터 버튼, 체크박스, 열린 필터의 가장자리가 경계를 드러냅니다. 다른 곳에는 선이 필요 없었습니다.',
      '4단계 중 4단계, 점: 글자, 아이콘, 배지가 내용을 싣고, 타입 역할과 잉크, 위치로 서열이 정해집니다.',
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
    planesTitle: '면이 먼저입니다',
    planesIntro:
      '면은 한 가지 톤의 평평한 영역입니다. 영역은 선이나 그림자보다 먼저, 톤의 차이와 간격으로 읽힙니다.',
    planeRules: [
      '깊이 순서대로 역할을 쓰세요. 앱의 바깥 틀과 사이드바는 --chrome, 작업이 일어나는 시트는 --canvas, 시트 안의 보조 영역은 --surface, 현재 항목이나 선택한 항목은 --selected입니다.',
      '이웃한 역할은 1.05:1 이상 차이 나서 선 없이도 다른 영역으로 읽힙니다. --status-danger-bg 같은 상태 톤도 면이며, 언제나 라벨과 함께 씁니다.',
      '시트 안의 보조 면은 한 단계만 두세요. 한 면 안의 내용은 다른 면이 아니라 간격과 제목으로 나눕니다. 카드 안에 카드를 두지 마세요.',
      '면의 안쪽 여백은 네 변이 같고, 그 안의 면은 max(0, 바깥 반경 − 여백)의 반경을 써서 모서리가 동심원을 이룹니다.',
      '호버와 누름 상태는 아래 면을 --interaction-hover-bg와 --interaction-active-bg로 물들이고, 선택은 --selected로 채웁니다.',
    ],
    elevationTitle: '높이는 겹치는 것에만',
    elevationIntro:
      '높이는 "이것이 지금 잠시 작업 위에 놓여 있다"는 뜻입니다. 필요할 때 나타났다 사라지는 UI의 것입니다. 메뉴, 선택 목록, 팝오버, 대화상자, 토스트, 차트의 떠 있는 값 상자가 여기에 속합니다.',
    elevationRules: [
      '떠 있는 UI는 불투명한 면(--menu-background나 --canvas)에 --shadow-float와 --layer-* 토큰을 함께 씁니다. 레이어 없는 그림자나 그림자 없는 레이어는 무엇이 위에 있는지 잘못 알려 줍니다.',
      '머물러 있는 그림자는 --shadow-sheet 하나뿐입니다. 콘텐츠 시트를 바깥 틀에서 아주 얇게 띄웁니다.',
      '카드, 섹션, 차트처럼 고정된 내용을 돋보이게 하려고 띄우지 마세요. 대신 면이나 제목을 주세요.',
      '떠 있는 면은 아래 시트와 톤이 같은 경우가 많고 다크 테마에서는 그림자가 약하게 읽히므로, 떠 있는 UI는 --menu-border 가장자리도 함께 둡니다. 같은 톤의 영역이 만나는 곳에 선을 긋는 선 규칙이 그대로 적용된 것입니다.',
      '강제 색상 모드에서는 그림자가 사라지므로, 떠 있는 UI는 그때 1px 시스템 색 테두리를 함께 그립니다.',
    ],
    elevationLink: '쌓임 순서, 포털, 잘림은 레이어 / 높이에서 다룹니다.',
    linesTitle: '선은 면으로 나눌 수 없는 곳에',
    linesIntro:
      '선은 가장 가는 수단이고 가장 남용하기 쉽습니다. 할 일은 두 가지입니다. 컨트롤이 어디서 시작하고 끝나는지 보여 주는 것, 그리고 같은 톤의 영역이 만나 간격만으로 나눌 수 없는 곳을 나누는 것입니다.',
    lineRules: [
      '--control-border는 입력, 선택, 체크박스, 외곽선 버튼의 경계를 표시하고 면과 3:1 이상 대비됩니다. 사람이 컨트롤을 찾아야 하기 때문입니다. 의미를 싣는 유일한 선입니다.',
      '--line은 장식입니다. 쌓인 섹션을 패널로 바꾸는 전체 너비 구분선, 같은 톤의 스크롤 콘텐츠와 고정 크롬이 만나는 가장자리, 메뉴의 가장자리에 씁니다.',
      '톤이나 간격으로 이미 나뉜 영역을 상자로 두르지 말고, 면이 바뀌는 곳에 테두리를 덧대지 마세요. 표의 행도 선이 아니라 간격으로 나뉘고, 호버와 선택은 행을 면으로 채웁니다.',
      '한쪽 강조 테두리로 상태를 표시하지 마세요. 상태는 라벨, 아이콘, 위치로 나타냅니다.',
      '포커스 링은 인터랙션에 속한 선입니다. --interaction-focus 색의 --focus-ring-width이며, 지우거나 그림자만으로 대신하지 않습니다.',
    ],
    pointsTitle: '점이 내용을 싣습니다',
    pointsIntro:
      '점은 가장 작은 표시입니다. 글자, 숫자, 아이콘, 배지, 점, 차트 마커가 여기에 속합니다. 화면이 하는 말을 싣기 때문에, 한 영역 안에서 무엇을 먼저 읽을지 정합니다.',
    pointRules: [
      '점의 서열은 장식이 아니라 타입 역할과 잉크로 정하세요. 본문보다 제목 역할, --ink-muted보다 --ink-body, 그보다 --ink이고, 500 굵기는 제목, 라벨, 작업에만 씁니다.',
      '아이콘은 16, 20, 24px에 currentColor를 쓰고, 단어 옆에 두거나 접근성 이름을 가집니다. 글리프 혼자 의미를 전하지 않습니다.',
      '배지, 상태 점, 현재 목적지처럼 채도가 높은 작은 점은 조용한 화면에서 가장 큰 소리를 냅니다. 상태, 현재 위치, 주요 작업에만 쓰세요.',
      '점으로 구조를 만들지 마세요. 굵은 라벨, 아이콘, 색 글자는 면이나 제목, 간격을 대신할 수 없습니다.',
    ],
    reviewTitle: '같은 순서로 화면 검토하기',
    reviewSteps: [
      '눈을 흐리게 뜨거나 글자를 가려 보세요. 영역이 톤과 간격만으로 여전히 읽히나요?',
      '작업 위에 겹치지 않는데 띄워진 것이 있나요? 면으로 내리세요.',
      '면이나 간격이 이미 나누고 있어서 지울 수 있는 선이 있나요? 남은 선은 모두 컨트롤이나 같은 톤의 만남을 표시해야 합니다.',
      '채도가 높은 점을 세어 보세요. 하나하나가 상태, 현재 위치, 주요 작업이어야 합니다.',
    ],
    reviewNote:
      '컴포넌트 검토도 같은 순서를 따릅니다. 컴포넌트는 이 규칙이 요구하는 곳에만 테두리나 그림자를 더합니다.',
  },
}
