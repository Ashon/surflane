import type { Locale } from '../../i18n'

const en = {
  closeDialog: 'Close dialog',
  principles: [
    [
      'Use a named layer, never a raw z-index.',
      'The `--surf-layer-*` scale keeps app chrome, dialogs, popups, and tooltips in one order.',
    ],
    [
      'Portal anything that floats.',
      "A child's z-index can't escape its parent's stacking context or overflow clip.",
    ],
    [
      'Close overlays from the inside out.',
      'Escape closes the innermost layer first and returns focus to its trigger.',
    ],
    [
      'Diagnose before raising a number.',
      'A higher number rarely fixes an overlay, because the cause is usually the portal target, an ancestor context, or clipping.',
    ],
  ],
  sections: {
    scale: 'Layer scale',
    contexts: 'Stacking contexts',
    overlays: 'Nested overlays',
    diagnosis: 'Diagnosis',
  },
  scaleIntro:
    'Layers set paint order only. How a raised surface looks, its shadow and edge, is part of Visual hierarchy.',
  roles: [
    ['--surf-layer-chrome', 'Fixed app chrome, such as BottomNavigation'],
    ['--surf-layer-backdrop', 'The backdrop behind a Dialog'],
    ['--surf-layer-dialog', 'Dialog, Sheet, and Drawer'],
    ['--surf-layer-popup', 'Menus, select lists, popovers, and toasts'],
    ['--surf-layer-tooltip', 'Tooltip positioners'],
  ],
  surfaceTableLabel: 'Layer tokens',
  tableCaption: 'Layer tokens, back to front',
  tokenHeader: 'Token',
  roleHeader: 'Use',
  resolvedHeader: 'Value',
  reading: 'Reading…',
  scaleNote:
    'Sheet and Drawer keep their backdrop at 0 and content at 1 inside one isolated positioner. Menus and toasts share the popup layer, so when numbers tie, DOM order decides.',
  contextsIntro:
    "A child's z-index can't leave its parent's stacking context. transform, opacity below 1, isolation, and some contain values each create one, so don't put a transform on a whole content area.",
  overlayPlane: 'Overlay / z-index: 9999',
  portalToStage: 'Portal to demonstration stage',
  clipLocalHost: 'Clip local host',
  stageLabelPortaled:
    'Portaled overlay appears above the sibling plane and outside local clipping.',
  stageLabelLocal:
    'Local overlay stays below the sibling plane despite its larger z-index.',
  parentContext: 'Parent context / z-index: 1',
  siblingContext: 'Sibling context / z-index: 2',
  stackResultLabel: 'Stacking demonstration result',
  statusPortal:
    'Portal: the overlay is a sibling of the two contexts and appears in front.',
  statusLocal:
    "Local: the child stays in its parent's context, so 9999 can't outrank a sibling context at 2.",
  stackingNote:
    "Clipping and paint order are separate: turning off the clip doesn't change the order. The values 1, 2, and 9999 show the rule and aren't product layers.",
  overlaysIntro:
    'Base UI handles initial focus, the Tab range, the inert background, Escape order, and focus return. Keep selection state and task data in the calling screen.',
  openLayeredDialog: 'Open layered dialog',
  layeredWorkspacePreview: 'Layered workspace preview',
  layeredWorkspaceDescription:
    "Local example. The menu keeps this task's selection even when portaled outside the sheet.",
  previewEnvironment: 'Preview environment',
  stagingPreview: 'Staging preview',
  productionPreview: 'Production preview',
  selectedEnvironment: 'Selected environment:',
  inspectOverlayDetails: 'Inspect overlay details',
  overlayDetails: 'Overlay details',
  sharedPopoverNote: 'A real portal that uses the shared Popover.',
  currentSelection: 'Current selection:',
  explainThisLayer: 'Explain this layer',
  tooltipExplainLayer: 'Tooltip uses the layer above popups.',
  openNestedDialog: 'Open nested dialog',
  nestedInspectionTitle: 'Nested inspection',
  nestedInspectionDescription:
    'Escape closes only this dialog and returns focus to its trigger in the parent.',
  closeNestedInspection: 'Close nested inspection',
  closeLayeredPreview: 'Close layered preview',
  diagnosis: [
    'Find the real portal target and ancestor contexts in the DOM. The React tree can differ.',
    'Tell clipping by overflow, mask, or clip-path apart from paint order.',
    "Set the layer token on the outermost positioned element, such as a popup's positioner, not on content inside it.",
    "Look for the browser's top layer: showModal() dialogs, the popover attribute, and fullscreen sit above every z-index. Surflane's Dialog is a portal, not showModal().",
  ],
  referencesLabel: 'References:',
  w3cStackingOrderLink: 'W3C stacking order',
  w3cPositionedLayoutLink: 'W3C positioned layout / top layer',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    closeDialog: '대화상자 닫기',
    principles: [
      [
        'z-index 숫자 대신 이름 붙은 레이어를 쓰세요.',
        '`--surf-layer-*` 단계가 앱 크롬, 대화상자, 팝업, 툴팁을 한 순서로 묶습니다.',
      ],
      [
        '떠 있는 것은 모두 포털하세요.',
        '자식의 z-index는 부모의 쌓임 컨텍스트와 overflow 클리핑을 벗어나지 못합니다.',
      ],
      [
        '오버레이는 안쪽부터 닫으세요.',
        'Escape는 가장 안쪽 레이어부터 닫고 포커스를 그 트리거로 돌려줍니다.',
      ],
      [
        '숫자를 올리기 전에 진단하세요.',
        '원인은 대개 포털 대상, 조상 컨텍스트, 클리핑이므로 숫자를 올려서는 잘 고쳐지지 않습니다.',
      ],
    ],
    sections: {
      scale: '레이어 단계',
      contexts: '쌓임 컨텍스트',
      overlays: '중첩 오버레이',
      diagnosis: '진단',
    },
    scaleIntro:
      '레이어는 그리는 순서만 정합니다. 떠 있는 면의 모양, 즉 그림자와 가장자리는 시각 위계에서 다룹니다.',
    roles: [
      ['--surf-layer-chrome', 'BottomNavigation 같은 고정 앱 크롬'],
      ['--surf-layer-backdrop', 'Dialog 뒤의 배경'],
      ['--surf-layer-dialog', 'Dialog, Sheet, Drawer'],
      ['--surf-layer-popup', '메뉴, 선택 목록, Popover, 토스트'],
      ['--surf-layer-tooltip', 'Tooltip의 Positioner'],
    ],
    surfaceTableLabel: '레이어 토큰',
    tableCaption: '뒤에서 앞 순서의 레이어 토큰',
    tokenHeader: '토큰',
    roleHeader: '용도',
    resolvedHeader: '값',
    reading: '읽는 중…',
    scaleNote:
      'Sheet와 Drawer는 격리된 Positioner 하나 안에서 배경에 0, 콘텐츠에 1을 씁니다. 메뉴와 토스트는 popup 레이어를 함께 쓰므로, 숫자가 같으면 DOM 순서가 정합니다.',
    contextsIntro:
      '자식의 z-index는 부모의 쌓임 컨텍스트를 벗어나지 못합니다. transform, 1보다 작은 opacity, isolation, 일부 contain 값이 컨텍스트를 만들므로, 콘텐츠 영역 전체에 transform을 넣지 마세요.',
    overlayPlane: '오버레이 / z-index: 9999',
    portalToStage: '데모 무대로 포털',
    clipLocalHost: '로컬 호스트 클리핑',
    stageLabelPortaled:
      '포털한 오버레이는 형제 평면 위에, 로컬 클리핑 밖에 나타납니다.',
    stageLabelLocal:
      'z-index가 더 커도 로컬 오버레이는 형제 평면 아래에 머무릅니다.',
    parentContext: '부모 컨텍스트 / z-index: 1',
    siblingContext: '형제 컨텍스트 / z-index: 2',
    stackResultLabel: '쌓임 데모 결과',
    statusPortal: '포털: 오버레이가 두 컨텍스트의 형제가 되어 앞에 나타납니다.',
    statusLocal:
      '로컬: 자식은 부모 컨텍스트에 머무르므로 9999도 z-index가 2인 형제 컨텍스트를 앞서지 못합니다.',
    stackingNote:
      '클리핑과 그리는 순서는 별개입니다. 클리핑을 꺼도 순서는 바뀌지 않습니다. 1, 2, 9999는 원리를 보여 주는 값이며 제품의 레이어 값이 아닙니다.',
    overlaysIntro:
      'Base UI가 초기 포커스, Tab 범위, 배경 차단, Escape 순서, 포커스 복귀를 맡습니다. 선택 상태와 작업 데이터는 호출하는 화면에 두세요.',
    openLayeredDialog: '레이어드 Dialog 열기',
    layeredWorkspacePreview: '레이어드 작업 공간 미리보기',
    layeredWorkspaceDescription:
      '로컬 예시입니다. 시트 밖으로 포털해도 메뉴는 이 작업의 선택을 유지합니다.',
    previewEnvironment: '미리보기 환경',
    stagingPreview: '스테이징 미리보기',
    productionPreview: '프로덕션 미리보기',
    selectedEnvironment: '선택한 환경:',
    inspectOverlayDetails: '오버레이 세부 정보 확인',
    overlayDetails: '오버레이 세부 정보',
    sharedPopoverNote: '공용 Popover를 쓰는 실제 포털입니다.',
    currentSelection: '현재 선택:',
    explainThisLayer: '이 레이어 설명',
    tooltipExplainLayer: 'Tooltip은 팝업 위의 레이어를 씁니다.',
    openNestedDialog: '중첩 Dialog 열기',
    nestedInspectionTitle: '중첩 검사',
    nestedInspectionDescription:
      'Escape는 이 Dialog만 닫고 부모에 있는 트리거로 포커스를 돌려줍니다.',
    closeNestedInspection: '중첩 검사 닫기',
    closeLayeredPreview: '레이어드 미리보기 닫기',
    diagnosis: [
      'DOM에서 실제 포털 대상과 조상 컨텍스트를 찾으세요. React 트리와 다를 수 있습니다.',
      'overflow, mask, clip-path로 잘린 것과 그리는 순서를 구분하세요.',
      '레이어 토큰은 안쪽 콘텐츠가 아니라 팝업의 Positioner처럼 가장 바깥에 위치한 요소에 두세요.',
      '브라우저의 top layer를 확인하세요. showModal() 대화상자, popover 속성, 전체 화면은 모든 z-index 위에 놓입니다. Surflane의 Dialog는 showModal()이 아니라 포털입니다.',
    ],
    referencesLabel: '참고 자료:',
    w3cStackingOrderLink: 'W3C 쌓임 순서',
    w3cPositionedLayoutLink: 'W3C 위치 지정 레이아웃 / top layer',
  },
}
