import type { Locale } from '../../i18n'

const en = {
  roles: [
    ['--chrome', 'Outer app surface, sidebar'],
    ['--canvas', 'Content sheet, dialogs'],
    ['--surface', 'Secondary surface within content'],
    ['--menu-background', 'Opaque surface for menus, select lists, and toasts'],
    ['--shadow-sheet', 'Subtle separation for the content sheet'],
    ['--shadow-float', 'Depth for transient popups and notifications'],
    ['--layer-backdrop', 'Blocking backdrop behind a Dialog'],
    ['--layer-dialog', 'Positioner for Dialog and Sheet/Drawer'],
    ['--layer-popup', 'Menus, select lists, popovers, and toasts'],
    ['--layer-tooltip', 'Positioner for explanatory tooltips'],
  ],
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
    "The two controls are independent. A stacking context sets the front-to-back order among siblings. Overflow clips painting outside a box. Setting the parent's overflow to visible doesn't change the siblings' z-index order. This example portals only into the demo stage. Real product popups use the shared Portal, as in the Base UI example below. The values 1, 2, and 9999 illustrate the principle. They aren't product layer values.",
  onThisPage: 'On this page',
  nav: [
    { id: 'surfaces', label: 'Surfaces' },
    { id: 'contexts', label: 'Contexts' },
    { id: 'overlays', label: 'Overlays' },
    { id: 'diagnostics', label: 'Diagnostics' },
    { id: 'application', label: 'Application' },
  ],
  openLayeredDialog: 'Open layered dialog',
  layeredWorkspacePreview: 'Layered workspace preview',
  layeredWorkspaceDescription:
    "Local example. The menu keeps this task's selection state even when portaled outside the sheet.",
  previewEnvironment: 'Preview environment',
  stagingPreview: 'Staging preview',
  productionPreview: 'Production preview',
  selectedEnvironment: 'Selected environment:',
  inspectOverlayDetails: 'Inspect overlay details',
  overlayDetails: 'Overlay details',
  sharedPopoverNote: 'A real portal that uses the shared Popover.',
  currentSelection: 'Current selection:',
  explainThisLayer: 'Explain this layer',
  tooltipExplainLayer:
    'Tooltip uses the explanation layer above popup surfaces.',
  openNestedDialog: 'Open nested dialog',
  nestedInspectionTitle: 'Nested inspection',
  nestedInspectionDescription:
    'Escape closes only this dialog and returns focus to its trigger in the parent.',
  closeNestedInspection: 'Close nested inspection',
  closeLayeredPreview: 'Close layered preview',
  surfacesTitle: 'Surface and elevation roles',
  surfacesIntro:
    "Surfaces group information. Layers describe front-to-back relationships. Within the content sheet, separate content with spacing, headings, and secondary surfaces. Reserve shadows for UI that temporarily overlaps, such as floating menus and notifications. Don't wrap every section in nested cards or add a border for every state.",
  contentSheet: 'Content sheet',
  contentSheetNote: 'For sustained reading and work',
  floatingSurface: 'Floating surface',
  floatingSurfaceNote: 'Temporarily overlaps the current context',
  surfaceTableLabel: 'Surface and layer tokens',
  tableCaption:
    'Surface, shadow, and layer tokens resolved for the current theme',
  tokenHeader: 'Token',
  roleHeader: 'Role',
  resolvedHeader: 'Resolved value',
  reading: 'Reading…',
  surfacesValuesNote:
    'These values order roles within a single stacking context. Sheet/Drawer uses 0 for the backdrop and 1 for the content, inside one isolated positioner. Toasts and menus share the popup role. When the numbers are equal, also check DOM order and ancestor contexts. Tooltips only explain. They never replace required actions or error messages.',
  contextsTitle: 'Stacking contexts and clipping',
  contextsIntro:
    "Raising a child's z-index alone can't escape its parent's stacking context. Properties such as transform, opacity, and isolation, and some contain values, can create a new context. The comparison below uses real CSS and a React portal. The result sentence below it repeats the labels hidden inside the figure.",
  overlaysTitle: 'Nested overlay contract',
  overlaysIntro:
    "A layer number alone doesn't make a modal. Base UI manages initial focus, the Tab range, blocking background interaction, Escape order, and focus return to the trigger. Keep selection state and task data in the calling screen. Try the select list, popover, tooltip, and nested dialog below.",
  portaledSelectionLabel: 'Portaled selection inside a dialog',
  diagnoseTitle: 'Diagnose before raising z-index',
  diagnoseStep1:
    'In the DOM, check the actual portal target and the ancestor contexts of the hidden element. The React tree and the DOM position can differ.',
  diagnoseStep2:
    "Distinguish clipping by overflow, mask, or clip-path from z-index ordering. Check that there's room for shadows and focus rings.",
  diagnoseStep3:
    "Confirm the layer token is applied to the correct positioner. Don't just add a larger value to the child popup.",
  diagnoseStep4:
    'Check that the overlay is reachable by pointer and keyboard. Escape must close from the innermost layer out, and focus must return to where it was.',
  diagnoseStep5:
    "Don't let a notification above a dialog be the only error message. Keep important status and recovery paths in the current work area too.",
  topLayerNote:
    "The browser's top layer is ordered separately from regular z-index. This system's Dialog is a Base UI portal. Don't assume it's equivalent to native showModal(). With third-party SDKs, fullscreen, or native popover, check the actual DOM and portal target.",
  applicationTitle: 'Layer composition rules',
  compositionRule1:
    "Don't let a scroll area's overflow clip menus, notifications, or shadows. Show progress in the current work area as well.",
  compositionRule2:
    'Keep the sidebar and main content on base surfaces. Use the shared portal and layer tokens for detail panels and menus.',
  compositionRule3:
    "Keep code and table scroll areas separate from popups. Don't add a transform to the whole content area. It changes the coordinate reference for floating UI.",
  themePortalNote:
    "Themes apply the shared typography scope on body, and the root tokens, to portals too. In forced colors mode, don't rely on shadows alone to separate areas.",
  referencesLabel: 'References:',
  w3cStackingOrderLink: 'W3C stacking order',
  w3cPositionedLayoutLink: 'W3C positioned layout / top layer',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    roles: [
      ['--chrome', '앱 바깥 면, 사이드바'],
      ['--canvas', '콘텐츠 시트, Dialog'],
      ['--surface', '콘텐츠 안의 보조 면'],
      ['--menu-background', '메뉴, 선택 목록, 토스트용 불투명 면'],
      ['--shadow-sheet', '콘텐츠 시트를 은은하게 구분'],
      ['--shadow-float', '일시적 팝업과 알림의 깊이'],
      ['--layer-backdrop', 'Dialog 뒤의 배경 차단 면'],
      ['--layer-dialog', 'Dialog와 Sheet/Drawer의 Positioner'],
      ['--layer-popup', '메뉴, 선택 목록, Popover, 토스트'],
      ['--layer-tooltip', '설명용 Tooltip의 Positioner'],
    ],
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
      '로컬: 자식은 부모 컨텍스트에 머무르므로 9999도 z-index가 2인 형제 컨텍스트를 앞설 수 없습니다.',
    stackingNote:
      '두 컨트롤은 서로 독립적입니다. 쌓임 컨텍스트는 형제 간의 앞뒤 순서를 정합니다. 오버플로는 상자 밖으로 그려지는 내용을 자릅니다. 부모의 overflow를 visible로 바꿔도 형제의 z-index 순서는 바뀌지 않습니다. 이 예시는 데모 무대 안에만 포털합니다. 실제 제품 팝업은 아래 Base UI 예시처럼 공용 Portal을 사용합니다. 1, 2, 9999는 원리를 보여 주기 위한 값이며, 제품의 레이어 값이 아닙니다.',
    onThisPage: '이 페이지에서',
    nav: [
      { id: 'surfaces', label: '면' },
      { id: 'contexts', label: '컨텍스트' },
      { id: 'overlays', label: '오버레이' },
      { id: 'diagnostics', label: '진단' },
      { id: 'application', label: '적용' },
    ],
    openLayeredDialog: '레이어드 Dialog 열기',
    layeredWorkspacePreview: '레이어드 작업 공간 미리보기',
    layeredWorkspaceDescription:
      '로컬 예시입니다. 시트 밖으로 포털해도 이 작업의 선택 상태는 그대로 유지됩니다.',
    previewEnvironment: '미리보기 환경',
    stagingPreview: '스테이징 미리보기',
    productionPreview: '프로덕션 미리보기',
    selectedEnvironment: '선택한 환경:',
    inspectOverlayDetails: '오버레이 세부 정보 확인',
    overlayDetails: '오버레이 세부 정보',
    sharedPopoverNote: '공용 Popover를 사용하는 실제 포털입니다.',
    currentSelection: '현재 선택:',
    explainThisLayer: '이 레이어 설명',
    tooltipExplainLayer:
      'Tooltip은 팝업 면 위에 있는 설명 레이어를 사용합니다.',
    openNestedDialog: '중첩 Dialog 열기',
    nestedInspectionTitle: '중첩 검사',
    nestedInspectionDescription:
      'Escape는 이 Dialog만 닫고 부모에 있는 트리거로 포커스를 되돌립니다.',
    closeNestedInspection: '중첩 검사 닫기',
    closeLayeredPreview: '레이어드 미리보기 닫기',
    surfacesTitle: '면과 높이의 역할',
    surfacesIntro:
      '면은 정보를 묶습니다. 레이어는 앞뒤 관계를 나타냅니다. 콘텐츠 시트 안에서는 여백, 제목, 보조 면으로 콘텐츠를 구분하세요. 뜨는 메뉴와 알림처럼 일시적으로 겹치는 UI에만 그림자를 사용하세요. 모든 섹션을 중첩 카드로 감싸거나 모든 상태에 테두리를 추가하지 마세요.',
    contentSheet: '콘텐츠 시트',
    contentSheetNote: '오래 읽고 작업하는 용도',
    floatingSurface: '떠 있는 면',
    floatingSurfaceNote: '현재 컨텍스트 위에 잠시 겹침',
    surfaceTableLabel: '면과 레이어 토큰',
    tableCaption: '현재 테마에 대해 해석된 면, 그림자, 레이어 토큰',
    tokenHeader: '토큰',
    roleHeader: '역할',
    resolvedHeader: '해석된 값',
    reading: '읽는 중…',
    surfacesValuesNote:
      '이 값은 하나의 쌓임 컨텍스트 안에서 역할의 순서를 정합니다. Sheet/Drawer는 하나의 격리된 Positioner 안에서 배경에 0, 콘텐츠에 1을 사용합니다. 토스트와 메뉴는 popup 역할을 공유합니다. 숫자가 같으면 DOM 순서와 조상 컨텍스트도 확인하세요. Tooltip은 설명만 합니다. 필수 동작이나 오류 메시지를 대체하지 않습니다.',
    contextsTitle: '쌓임 컨텍스트와 클리핑',
    contextsIntro:
      '자식의 z-index만 올려서는 부모의 쌓임 컨텍스트를 벗어날 수 없습니다. transform, opacity, isolation 같은 프로퍼티와 일부 contain 값이 새 컨텍스트를 만들 수 있습니다. 아래 비교는 실제 CSS와 React 포털을 사용합니다. 그 아래 결과 문장은 그림 안에 숨겨진 라벨을 다시 알려 줍니다.',
    overlaysTitle: '중첩 오버레이 규칙',
    overlaysIntro:
      '레이어 숫자만으로는 모달이 되지 않습니다. Base UI가 초기 포커스, Tab 범위, 배경 상호작용 차단, Escape 순서, 트리거로 되돌아가는 포커스를 관리합니다. 선택 상태와 작업 데이터는 호출하는 쪽 화면에 두세요. 아래에서 선택 목록, Popover, Tooltip, 중첩 Dialog를 사용해 보세요.',
    portaledSelectionLabel: 'Dialog 안의 포털된 선택',
    diagnoseTitle: 'z-index를 올리기 전에 진단하세요',
    diagnoseStep1:
      'DOM에서 숨겨진 요소의 실제 포털 대상과 조상 컨텍스트를 확인하세요. React 트리와 DOM 위치가 서로 다를 수 있습니다.',
    diagnoseStep2:
      'overflow, mask, clip-path로 인한 클리핑과 z-index 순서를 구분하세요. 그림자와 포커스 링이 들어갈 공간이 있는지 확인하세요.',
    diagnoseStep3:
      '레이어 토큰이 올바른 Positioner에 적용되었는지 확인하세요. 자식 팝업에 더 큰 값만 추가하지 마세요.',
    diagnoseStep4:
      '포인터와 키보드로 오버레이에 도달할 수 있는지 확인하세요. Escape는 가장 안쪽 레이어부터 바깥으로 닫아야 하고, 포커스는 원래 있던 자리로 되돌아가야 합니다.',
    diagnoseStep5:
      'Dialog 위에 있는 알림이 유일한 오류 메시지가 되지 않게 하세요. 중요한 상태와 복구 경로는 현재 작업 영역에도 두세요.',
    topLayerNote:
      '브라우저의 top layer는 일반 z-index와 별개의 순서로 정해집니다. 이 시스템의 Dialog는 Base UI 포털입니다. 네이티브 showModal()과 같다고 가정하지 마세요. 서드파티 SDK, 전체 화면, 네이티브 Popover을 쓸 때는 실제 DOM과 포털 대상을 확인하세요.',
    applicationTitle: '레이어 구성 규칙',
    compositionRule1:
      '스크롤 영역의 overflow가 메뉴, 알림, 그림자를 자르지 않게 하세요. 진행 상태도 현재 작업 영역에 표시하세요.',
    compositionRule2:
      '사이드바와 메인 콘텐츠는 기본 면에 두세요. 세부 패널과 메뉴에는 공용 포털과 레이어 토큰을 사용하세요.',
    compositionRule3:
      '코드와 표의 스크롤 영역은 팝업과 분리하세요. 콘텐츠 영역 전체에 transform을 추가하지 마세요. 떠 있는 UI의 좌표 기준이 바뀝니다.',
    themePortalNote:
      '테마는 body에 적용하는 공용 타이포그래피 범위와 루트 토큰을 포털에도 적용합니다. 강제 색상 모드에서는 영역을 구분할 때 그림자에만 의존하지 마세요.',
    referencesLabel: '참고 자료:',
    w3cStackingOrderLink: 'W3C 쌓임 순서',
    w3cPositionedLayoutLink: 'W3C 위치 지정 레이아웃 / top layer',
  },
}
