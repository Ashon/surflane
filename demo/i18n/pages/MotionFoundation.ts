import type { Locale } from '../../i18n'

const en = {
  onThisPage: 'On this page',
  nav: [
    { id: 'principles', label: 'Principles' },
    { id: 'transitions', label: 'Transitions' },
    { id: 'easing', label: 'Easing' },
    { id: 'theme', label: 'Theme' },
    { id: 'panels', label: 'Panels' },
    { id: 'reduction', label: 'Reduction' },
    { id: 'application', label: 'Application' },
  ],
  principlesTitle: 'Motion has a purpose',
  principlesIntro:
    "Use motion only to explain a change in position, a change in state, or how screens connect. Don't add decorative bounces or looping playback. Never make the next interaction wait for an animation to finish.",
  dialogBullet:
    'Dialog: fades in while rising from 8px below, and exits immediately.',
  sheetBullet:
    'Sheet / Drawer: an edge slide that ties the entry direction to where the panel closes. CSS transitions are off during a direct Drawer swipe.',
  themeBullet:
    "Theme: the whole screen changes as one scene, so backgrounds, borders, and icons don't trail behind at different times.",
  tableLabel: 'Motion design tokens',
  caption: 'Motion tokens resolved for the current theme',
  tokenHeader: 'Token',
  roleHeader: 'Role',
  resolvedHeader: 'Resolved value',
  reading: 'Reading…',
  principlesClosing:
    "The table shows design token values. With reduced motion on, components drop their transitions, so these values don't match real playback time.",
  tokenRoles: {
    '--motion-feedback': 'Short semantic feedback across the product',
    '--duration-fast': 'Selection control color, expand icon feedback',
    '--toast-enter-duration': 'Toast entry fade and lift',
    '--toast-stack-duration': 'Toast stack repositioning',
    '--toast-stack-ease': 'Toast stack deceleration curve',
    '--motion-reveal': 'Accordion / Collapsible expansion',
    '--dialog-enter-duration': 'Dialog entry',
    '--dialog-enter-offset': 'Dialog entry travel distance',
    '--dialog-exit-duration': 'Dialog exit',
    '--duration-base': 'Sheet / Drawer movement',
    '--theme-transition-duration': 'Theme scene transition',
    '--theme-transition-ease': 'Theme transition acceleration',
  },
  transitionsTitle: 'Transition contracts',
  transitionsIntro:
    "Entry, exit, and repeated interactions don't share one fixed duration. An entrance explains the new context. Closing never makes the user wait to take the next action. Sheet and Drawer are the exception: their spatial relationship matters, so they move in both directions.",
  transitionsTableLabel: 'Component transition policies',
  transitionsCaption: 'Transition rules tied to the actual styles',
  compHeader: 'Component',
  entryHeader: 'Entry / update',
  exitHeader: 'Exit',
  behaviorHeader: 'Behavior',
  transRowToastStack: 'Toast stack',
  transRowTheme: 'Theme',
  exitSameScene: 'same scene',
  behaviorDialog: 'opacity + lift, with immediate close and focus restoration',
  behaviorSheet:
    'edge movement that follows the pointer directly during a gesture',
  behaviorAccordion:
    "opens and closes swapped panels with height + opacity, clipped so they don't overlap",
  behaviorCollapsible: 'expands with content preserved, and closes immediately',
  behaviorToast:
    'relaxed fade + lift, with important results kept in the page content',
  behaviorToastStack:
    'repositioning time, with cards expanding on hover, focus, and touch',
  behaviorTheme:
    'one-scene snapshot transition that prevents stacked per-component transitions',
  transitionsFocusBefore:
    "Focus rings appear immediately. A running transition never blocks interaction. During rapid opening, closing, and theme changes, don't let stale timers overwrite the new state. Don't tie completion announcements to CSS transitionend. See",
  transitionsFocusLink: 'Interaction / states',
  transitionsFocusAfter: 'for real task states and duplicate-run prevention.',
  toastManagesBefore: 'The Toast primitive manages',
  toastManagesLink: 'swipe, duration, and pause',
  toastManagesAfter:
    ", and the Drawer primitive manages gestures. Don't reimplement this behavior with separate timers in examples or products. With reduced motion, these transitions drop their movement and fades. Names, focus, state, and close paths remain.",
  themeTitle: 'One scene, one clock',
  themeSceneBefore: 'The shared',
  themeSceneAfter:
    'applies the DOM theme attribute and framework state in the same update. Where supported, it fades the new screen in over the old one and briefly suppresses individual CSS transitions. Rapid repeated changes follow the last request.',
  environmentLabel: 'Current motion environment',
  resolvedThemeLabel: 'Resolved theme:',
  reducedMotionLabel: 'Reduced motion:',
  reduceValue: 'Reduce',
  noPreferenceValue: 'No preference',
  viewTransitionsLabel: 'View Transitions API:',
  availableValue: 'Available',
  unavailableValue: 'Unavailable',
  cyclePreviewTheme: 'Cycle preview theme',
  themeCycleInfo:
    'The cycle order is Light → Dark → System → Light. System follows the operating system setting. Without the API, or with reduced motion on, the whole theme applies immediately and works the same.',
  panelsTitle: 'Compare real panels',
  panelsIntro:
    'The examples below are the real shared Dialog and Sheet. Compare opening, Escape, closing, and focus restoration. Try changing the theme while a panel is open. The input draft is local state in this guide.',
  openMotionDialog: 'Open motion dialog',
  closeMotionDialog: 'Close motion dialog',
  dialogMotionPreview: 'Dialog motion preview',
  dialogMotionPreviewDesc:
    'Check the short entrance and immediate exit. Changing the theme keeps the draft and focus.',
  previewDraftLabel: 'Preview draft',
  cycleThemeInDialog: 'Cycle theme in dialog',
  done: 'Done',
  openMotionSheet: 'Open motion sheet',
  closeMotionSheet: 'Close motion sheet',
  sheetMotionPreview: 'Sheet motion preview',
  sheetMotionPreviewDesc:
    'Compare the edge entry and exit with reduced motion on and off.',
  sheetBodyNote:
    'Details open and close from the side, keeping their spatial relationship. Real task submission and completion are announced independently of the animation.',
  sheetUsageApi: 'Sheet usage and API',
  cycleThemeInSheet: 'Cycle theme in sheet',
  panelSeeBefore: 'See the',
  drawerGestureExample: 'Drawer gesture example',
  panelAnd: 'and',
  heightTransitionsLink: 'height transitions for expanding sections',
  panelSeeAfter: 'on their component pages.',
  reductionTitle: 'Respect motion preferences',
  reductionIntroBefore:
    'The guide follows the operating system or browser setting',
  reductionIntroAfter:
    '. This page adds no toggle to override it. Changing the setting updates both the environment readout above and the actual component behavior.',
  reductionBulletMovement:
    'Movement and transitions are removed from Dialog and panels. Opening, closing, keyboard, and focus restoration still work.',
  reductionBulletTheme:
    "The theme applies without the snapshot animation. Async task status and completion announcements don't depend on motion.",
  reductionBulletProducts:
    'Products that add continuous motion, auto-scrolling, or blinking need their own stop control and accessibility review.',
  w3cReducedMotionLink: 'W3C C39 — prefers-reduced-motion',
  baseUiAnimationLink: 'Base UI — animation lifecycle',
  applicationTitle: 'Theme integration',
  applicationIntro:
    "Commit the React state and the DOM theme update synchronously inside the same shared function. Call the wrapper once per user action. Don't add per-screen transition timers.",
  codeLabel: 'React theme integration',
  applicationClosing:
    'The product restores the initial theme, saves the selected mode, and subscribes to OS changes. With server rendering and hydration, check separately that the first screen renders the matching theme. Check transitions and reduced motion in the browsers you support.',
  motionTokensLink: 'Motion tokens',
  colorContrastLink: 'Color and contrast',
  interactionLabLink: 'Interaction lab',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    onThisPage: '이 페이지에서',
    nav: [
      { id: 'principles', label: '원칙' },
      { id: 'transitions', label: '전환' },
      { id: 'easing', label: 'Easing' },
      { id: 'theme', label: '테마' },
      { id: 'panels', label: '패널' },
      { id: 'reduction', label: '모션 축소' },
      { id: 'application', label: '적용' },
    ],
    principlesTitle: '모션에는 목적이 있습니다',
    principlesIntro:
      '모션은 위치 변화, 상태 변화, 화면이 이어지는 방식을 설명할 때만 사용하세요. 장식을 위한 바운스나 반복 재생은 추가하지 마세요. 다음 상호작용이 애니메이션이 끝날 때까지 기다리게 하지 마세요.',
    dialogBullet:
      'Dialog: 아래에서 8px 올라오며 페이드 인하고, 즉시 종료합니다.',
    sheetBullet:
      'Sheet / Drawer: 가장자리에서 슬라이드하며 진입 방향이 패널이 닫히는 위치와 연결됩니다. Drawer를 직접 스와이프하는 동안에는 CSS 전환이 꺼집니다.',
    themeBullet:
      '테마: 화면 전체가 하나의 장면으로 바뀌므로 배경, 테두리, 아이콘이 서로 다른 시점에 뒤처지지 않습니다.',
    tableLabel: '모션 디자인 토큰',
    caption: '현재 테마에 대해 해석된 모션 토큰',
    tokenHeader: '토큰',
    roleHeader: '역할',
    resolvedHeader: '해석된 값',
    reading: '읽는 중…',
    principlesClosing:
      '이 표는 디자인 토큰 값을 보여줍니다. 모션 축소를 켜면 컴포넌트가 전환을 생략하므로 이 값은 실제 재생 시간과 일치하지 않습니다.',
    tokenRoles: {
      '--motion-feedback': '제품 전반의 짧은 시맨틱 피드백',
      '--duration-fast': '선택 컨트롤 색, 확장 아이콘 피드백',
      '--toast-enter-duration': 'Toast 진입 페이드와 상승',
      '--toast-stack-duration': 'Toast 스택 재배치',
      '--toast-stack-ease': 'Toast 스택 감속 곡선',
      '--motion-reveal': 'Accordion / Collapsible 확장',
      '--dialog-enter-duration': 'Dialog 진입',
      '--dialog-enter-offset': 'Dialog 진입 이동 거리',
      '--dialog-exit-duration': 'Dialog 종료',
      '--duration-base': 'Sheet / Drawer 이동',
      '--theme-transition-duration': '테마 장면 전환',
      '--theme-transition-ease': '테마 전환 가속',
    },
    transitionsTitle: '전환 규약',
    transitionsIntro:
      '진입, 종료, 반복 상호작용은 하나의 고정된 시간을 공유하지 않습니다. 진입은 새로운 상황을 설명합니다. 닫을 때 사용자가 다음 동작을 위해 기다리게 하지 마세요. Sheet와 Drawer는 예외입니다. 공간적 관계가 중요하므로 양방향으로 이동합니다.',
    transitionsTableLabel: '컴포넌트 전환 정책',
    transitionsCaption: '실제 스타일에 연결된 전환 규칙',
    compHeader: '컴포넌트',
    entryHeader: '진입 / 갱신',
    exitHeader: '종료',
    behaviorHeader: '동작',
    transRowToastStack: 'Toast 스택',
    transRowTheme: '테마',
    exitSameScene: '같은 장면',
    behaviorDialog: 'opacity + 상승, 즉시 닫히며 포커스가 복원됩니다',
    behaviorSheet: '제스처 중 포인터를 직접 따르는 가장자리 이동',
    behaviorAccordion:
      '높이 + opacity로 교체되는 패널을 열고 닫으며, 겹치지 않도록 클리핑합니다',
    behaviorCollapsible: '콘텐츠를 유지한 채로 확장하고 즉시 닫습니다',
    behaviorToast:
      '여유 있는 페이드 + 상승, 중요한 결과는 페이지 콘텐츠에 남깁니다',
    behaviorToastStack: '재배치 시간, 호버, 포커스, 터치 시 카드가 확장됩니다',
    behaviorTheme: '컴포넌트별 전환이 쌓이는 것을 막는 단일 장면 스냅샷 전환',
    transitionsFocusBefore:
      '포커스 링은 즉시 나타납니다. 진행 중인 전환은 상호작용을 막지 않습니다. 빠르게 반복하는 열기, 닫기, 테마 변경 중에 오래된 타이머가 새로운 상태를 덮어쓰지 않게 하세요. 완료 안내를 CSS transitionend에 연결하지 마세요. 참고:',
    transitionsFocusLink: '인터랙션 / 상태',
    transitionsFocusAfter: '에서 실제 작업 상태와 중복 실행 방지를 확인하세요.',
    toastManagesBefore: 'Toast 프리미티브가',
    toastManagesLink: '스와이프, 지속 시간, 일시 정지',
    toastManagesAfter:
      '를 관리합니다. Drawer 프리미티브는 제스처를 관리합니다. 예시나 제품에서 별도 타이머로 이 동작을 다시 구현하지 마세요. 모션 축소를 켜면 이러한 전환은 이동과 페이드를 생략합니다. 이름, 포커스, 상태, 닫는 경로는 그대로 남습니다.',
    themeTitle: '하나의 장면, 하나의 시계',
    themeSceneBefore: '공유된',
    themeSceneAfter:
      '는 DOM 테마 속성과 프레임워크 상태를 같은 업데이트로 적용합니다. 지원되는 환경에서는 새 화면을 이전 화면 위에 페이드 인으로 보여 주며 개별 CSS 전환을 잠시 억제합니다. 짧은 시간에 반복해서 변경하면 마지막 요청을 따릅니다.',
    environmentLabel: '현재 모션 환경',
    resolvedThemeLabel: '해석된 테마:',
    reducedMotionLabel: '모션 축소:',
    reduceValue: '축소',
    noPreferenceValue: '설정 없음',
    viewTransitionsLabel: 'View Transitions API:',
    availableValue: '사용 가능',
    unavailableValue: '사용 불가',
    cyclePreviewTheme: '미리보기 테마 순환',
    themeCycleInfo:
      '순환 순서는 라이트 → 다크 → 시스템 → 라이트입니다. 시스템은 운영체제 설정을 따릅니다. API가 없거나 모션 축소를 켜면 테마 전체가 즉시 적용되며 동일하게 동작합니다.',
    panelsTitle: '실제 패널 비교',
    panelsIntro:
      '아래 예시는 실제로 공유되는 Dialog와 Sheet입니다. 열기, Escape, 닫기, 포커스 복원을 비교해 보세요. 패널이 열린 상태에서 테마를 바꿔 보세요. 입력 초안은 이 가이드의 로컬 상태입니다.',
    openMotionDialog: '모션 Dialog 열기',
    closeMotionDialog: '모션 Dialog 닫기',
    dialogMotionPreview: 'Dialog 모션 미리보기',
    dialogMotionPreviewDesc:
      '짧은 진입과 즉각적인 종료를 확인해 보세요. 테마를 바꿔도 초안과 포커스가 유지됩니다.',
    previewDraftLabel: '미리보기 초안',
    cycleThemeInDialog: 'Dialog에서 테마 순환',
    done: '완료',
    openMotionSheet: '모션 Sheet 열기',
    closeMotionSheet: '모션 Sheet 닫기',
    sheetMotionPreview: 'Sheet 모션 미리보기',
    sheetMotionPreviewDesc:
      '모션 축소를 끄고 켠 상태에서 가장자리 진입과 종료를 비교해 보세요.',
    sheetBodyNote:
      '세부 정보는 옆쪽에서 열리고 닫히며 공간적 관계를 유지합니다. 실제 작업 제출과 완료가 애니메이션과 독립적으로 안내됩니다.',
    sheetUsageApi: 'Sheet 사용법과 API',
    cycleThemeInSheet: 'Sheet에서 테마 순환',
    panelSeeBefore: '각 컴포넌트 페이지에서',
    drawerGestureExample: 'Drawer 제스처 예시',
    panelAnd: '',
    heightTransitionsLink: '섹션 확장 시 높이 전환을',
    panelSeeAfter: '확인하세요.',
    reductionTitle: '모션 설정을 존중하세요',
    reductionIntroBefore: '이 가이드는 운영체제나 브라우저 설정인',
    reductionIntroAfter:
      ' 값을 따릅니다. 이 페이지에는 이를 재정의하는 토글은 없습니다. 설정을 바꾸면 위쪽의 환경 표시와 실제 컴포넌트 동작이 모두 갱신됩니다.',
    reductionBulletMovement:
      'Dialog와 패널에서는 이동과 전환이 제거됩니다. 열기, 닫기, 키보드, 포커스 복원은 계속 동작합니다.',
    reductionBulletTheme:
      '테마는 스냅샷 애니메이션 없이 적용됩니다. 비동기 작업 상태와 완료 안내는 모션에 의존하지 않습니다.',
    reductionBulletProducts:
      '지속적인 모션, 자동 스크롤, 점멸을 추가하는 제품은 자체 정지 컨트롤과 접근성 검토가 필요합니다.',
    w3cReducedMotionLink: 'W3C C39 — prefers-reduced-motion',
    baseUiAnimationLink: 'Base UI — 애니메이션 라이프사이클',
    applicationTitle: '테마 통합',
    applicationIntro:
      'React 상태와 DOM 테마 갱신을 같은 공유 함수 안에서 동기적으로 커밋하세요. 래퍼는 사용자 동작당 한 번만 호출하세요. 화면별 전환 타이머는 추가하지 마세요.',
    codeLabel: 'React 테마 통합',
    applicationClosing:
      '제품은 초기 테마를 복원하고, 선택한 모드를 저장하고, OS 변경을 구독합니다. 서버 렌더링과 하이드레이션에서는 첫 화면이 알맞은 테마로 렌더링되는지 별도로 확인하세요. 지원하는 브라우저에서 전환과 모션 축소를 확인하세요.',
    motionTokensLink: '모션 토큰',
    colorContrastLink: '색과 대비',
    interactionLabLink: '인터랙션 랩',
  },
}
