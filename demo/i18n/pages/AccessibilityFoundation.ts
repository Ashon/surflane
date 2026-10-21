import type { Locale } from '../../i18n'

const en = {
  onThisPage: 'On this page',
  nav: [
    { id: 'principles', label: 'Principles' },
    { id: 'forms', label: 'Forms' },
    { id: 'keyboard', label: 'Keyboard' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'testing', label: 'Testing' },
  ],
  principlesTitle: 'Shared behavior, product responsibility',
  principlesIntro:
    "Using the components doesn't make a screen accessible on its own. Base UI and the shared wrappers handle interaction, focus, and styling. The product owns the screen name, document structure, data, error meaning, permissions, and task-completion messages.",
  tableLabel: 'Accessibility responsibilities',
  caption: 'What to implement and review in each area',
  areaHeader: 'Area',
  implementationHeader: 'Implementation',
  reviewHeader: 'Review',
  responsibilities: [
    [
      'Structure',
      'main, nav, headings, and a meaningful DOM order',
      'After a route change, check the h1, document title, and Skip to content',
    ],
    [
      'Keyboard',
      'Buttons, links, and forms keep their native semantics',
      'Complete tasks with Tab, Shift+Tab, arrow keys, Enter, Space, and Escape',
    ],
    [
      'Forms',
      'Field labels, descriptions, error associations, and required state',
      'Preserve values, and state the cause and the fix',
    ],
    [
      'Feedback',
      'status or alert, matched to severity',
      'Announce once, and keep results and recovery actions in the page content',
    ],
    [
      'Perception',
      'Shared color, focus, size, and motion tokens',
      'Check themes, zoom, text spacing, narrow widths, and high contrast',
    ],
  ],
  buildOnStart: 'Build new behavior on the ',
  keyboardGuidanceLink: 'keyboard guidance for each component',
  buildOnEnd:
    ". Don't add positive tabIndex values, clickable divs, unnamed icon buttons, or unnecessary ARIA roles.",
  formsTitle: 'Recover without losing input',
  formsIntro:
    'Submit an empty name or an invalid format, then check how the description and error are associated. Enter a valid name to try Simulate name conflict. The example validates locally, sends no server requests, and creates no resources.',
  formAriaLabel: 'Accessible validation preview',
  validatedMessage: (name: string) =>
    `Validated: ${name}. This local example created no resources.`,
  previewResetMessage: 'Preview reset. Enter a name to try again.',
  nameLabel: 'Preview name (required)',
  nameDescription:
    'Use lowercase letters, numbers, and hyphens. Example: demo-e2e-01.',
  valueMissingError: 'Enter a name.',
  patternMismatchError: 'Use only lowercase letters, numbers, and hyphens.',
  validatePreview: 'Validate preview',
  resetPreview: 'Reset preview',
  simulateNameConflict: 'Simulate name conflict',
  nameConflictError: 'This name is already in use. Enter a different name.',
  formsNotes:
    'Mark required fields with the label and the required attribute. Errors state the cause and the fix, not just a color change. The name conflict associates its error and moves focus to the input only after an explicit user action. Successful validation leaves focus where it is.',
  codeLabel: 'Accessible field composition',
  keyboardTitle: 'Follow a predictable focus path',
  keyboardIntroStart: 'Draw the focus outline with ',
  keyboardIntroMid: ". Don't replace it with the faint ",
  keyboardIntroAfterRing: ' background alone. Size interactive areas with ',
  keyboardIntroEnd:
    " and the button size rules. Don't remove the focus indicator or hide it behind content.",
  keyboardDomOrder:
    "Tab order follows DOM order. Links navigate, buttons run actions, and headings define document structure. On a route change, update the document title and h1. Same-page table-of-contents links keep the browser's native anchor navigation.",
  keyboardModals:
    "In modals, check Tab cycling, Escape, the close button, and focus restoration. The shared Dialog provides this behavior, so don't add your own keyboard trap. When an action removes its trigger, the product picks the next meaningful focus target.",
  openFocusPreview: 'Open focus preview',
  closeFocusPreview: 'Close focus preview',
  focusPreviewTitle: 'Keyboard focus preview',
  focusPreviewDescription:
    'Cycle with Tab and Shift+Tab. Press Escape to close and return to the trigger.',
  localNote: 'Local note',
  keyboardInputValue: 'Navigate with the keyboard',
  done: 'Done',
  feedbackTitle: 'Announce once, preserve the result',
  feedbackItem1:
    "Announce updates that don't move focus, such as completion or search results, in a role=status region. Mount it in advance and keep the message brief.",
  feedbackItem2:
    "Use alert only for errors that need immediate attention. Don't repeat the same sentence in the field, a toast, and a status region.",
  feedbackItem3:
    "Keep the failure reason and the retry and fix paths in the page content. Don't rely on a toast's timing or motion alone.",
  feedbackItem4:
    'Use color, icons, and labels together. Name icon-only actions by their target and purpose.',
  inlineMessageLink: 'Inline message',
  toastLink: 'Toast',
  iconNamesLink: 'Icon names',
  testingTitle: 'Test the complete task',
  testingItem1:
    'Run the task by keyboard alone: start, edit, complete, cancel, and recover from failure. Visible focus must match the actual active element.',
  testingItem2:
    'Check at a 320 CSS px width and on desktop. Test 200% and 400% browser zoom and text spacing changes yourself. Put two-dimensional content, such as tables and code, in named, independent scroll areas.',
  testingItem3Start:
    'Check light, dark, system, forced colors, and reduced motion settings. Apply the ',
  colorContrastLink: 'color contrast',
  testingItem3Mid: ' and ',
  motionGuidanceLink: 'motion guidance',
  testingItem3End: ' together.',
  testingItem4:
    "Confirm names, order, errors, and states with real assistive technologies, such as VoiceOver and NVDA. axe checks and viewport resizing don't replace this manual check.",
  testingItem5:
    'Test the tasks users perform from start to finish, such as entering data, saving, recovering from errors, reading, and copying code.',
  testingClosing:
    "Don't mark untested items as complete. This guide and the automated checks aren't an accessibility certification or a completed full manual review.",
  waiFormNotifications: 'WAI — Form notifications',
  wcagFocusOrder: 'WCAG — Focus order',
  w3cKeyboardControl: 'W3C — Keyboard control',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    onThisPage: '이 페이지에서',
    nav: [
      { id: 'principles', label: '원칙' },
      { id: 'forms', label: '폼' },
      { id: 'keyboard', label: '키보드' },
      { id: 'feedback', label: '피드백' },
      { id: 'testing', label: '테스트' },
    ],
    principlesTitle: '동작은 공유, 책임은 제품',
    principlesIntro:
      '컴포넌트를 사용한다고 해서 화면이 자동으로 접근 가능해지지는 않습니다. Base UI와 공유 래퍼가 인터랙션, 포커스, 스타일링을 처리합니다. 화면 이름, 문서 구조, 데이터, 오류 의미, 권한, 작업 완료 메시지는 제품이 담당합니다.',
    tableLabel: '접근성 책임',
    caption: '각 영역에서 구현하고 검토할 내용',
    areaHeader: '영역',
    implementationHeader: '구현',
    reviewHeader: '검토',
    responsibilities: [
      [
        '구조',
        'main, nav, 제목, 의미 있는 DOM 순서',
        '라우트 변경 후 h1, 문서 제목, Skip to content를 확인하세요',
      ],
      [
        '키보드',
        '버튼, 링크, 폼은 고유 의미를 유지합니다',
        'Tab, Shift+Tab, 화살표 키, Enter, Space, Escape로 작업을 완료하세요',
      ],
      [
        '폼',
        '필드 라벨, 설명, 오류 연결, 필수 상태',
        '값을 보존하고 원인과 해결책을 알리세요',
      ],
      [
        '피드백',
        'status 또는 alert, 심각도에 맞춰 사용',
        '한 번만 알리고 결과와 복구 액션을 페이지 콘텐츠에 유지하세요',
      ],
      [
        '지각',
        '공유 색, 포커스, 크기, 모션 토큰',
        '테마, 확대, 텍스트 간격, 좁은 너비, 고대비를 확인하세요',
      ],
    ],
    buildOnStart: '새 동작은 ',
    keyboardGuidanceLink: '각 컴포넌트의 키보드 가이드라인',
    buildOnEnd:
      '. 양수 tabIndex 값, 클릭 가능한 div, 이름 없는 아이콘 버튼, 불필요한 ARIA role을 추가하지 마세요.',
    formsTitle: '입력 손실 없이 복구하기',
    formsIntro:
      '빈 이름이나 잘못된 형식으로 제출한 다음 설명과 오류가 어떻게 연결되는지 확인하세요. 유효한 이름을 입력해 이름 충돌 시뮬레이션을 시도하세요. 이 예시는 로컬에서 검증하며 서버 요청을 보내지 않고 리소스도 만들지 않습니다.',
    formAriaLabel: '접근성 검증 미리보기',
    validatedMessage: (name: string) =>
      `검증 완료: ${name}. 이 로컬 예시는 리소스를 만들지 않았습니다.`,
    previewResetMessage:
      '미리보기가 초기화되었습니다. 이름을 입력해 다시 시도하세요.',
    nameLabel: '미리보기 이름 (필수)',
    nameDescription: '소문자, 숫자, 하이픈만 사용하세요. 예: demo-e2e-01.',
    valueMissingError: '이름을 입력하세요.',
    patternMismatchError: '소문자, 숫자, 하이픈만 사용하세요.',
    validatePreview: '미리보기 검증',
    resetPreview: '미리보기 초기화',
    simulateNameConflict: '이름 충돌 시뮬레이션',
    nameConflictError: '이 이름은 이미 사용 중입니다. 다른 이름을 입력하세요.',
    formsNotes:
      '필수 필드는 라벨과 required 속성으로 표시하세요. 오류는 색상 변경만이 아니라 원인과 해결책을 알립니다. 이름 충돌은 오류를 연결하고 명시적 사용자 동작 후에만 입력으로 포커스를 이동합니다. 검증 성공 시 포커스는 그 자리에 유지됩니다.',
    codeLabel: '접근 가능한 필드 구성',
    keyboardTitle: '예측 가능한 포커스 경로를 따르세요',
    keyboardIntroStart: '포커스 아웃라인은 ',
    keyboardIntroMid: '로 그리세요. 희미한 ',
    keyboardIntroAfterRing: ' 배경만으로 대체하지 마세요. 인터랙티브 영역은 ',
    keyboardIntroEnd:
      '와 버튼 크기 규칙으로 크기를 정하세요. 포커스 표시를 제거하거나 콘텐츠 뒤에 숨기지 마세요.',
    keyboardDomOrder:
      'Tab 순서는 DOM 순서를 따릅니다. 링크는 탐색, 버튼은 액션 실행, 제목은 문서 구조를 정의합니다. 라우트 변경 시 문서 제목과 h1을 업데이트하세요. 같은 페이지의 목차 링크는 브라우저 기본 앵커 탐색을 유지합니다.',
    keyboardModals:
      '모달에서 Tab 순환, Escape, 닫기 버튼, 포커스 복원을 확인하세요. 공유 Dialog가 이 동작을 제공하므로 자체 키보드 트랩을 추가하지 마세요. 액션이 트리거를 제거하면 제품이 다음 의미 있는 포커스 대상을 선택합니다.',
    openFocusPreview: '포커스 미리보기 열기',
    closeFocusPreview: '포커스 미리보기 닫기',
    focusPreviewTitle: '키보드 포커스 미리보기',
    focusPreviewDescription:
      'Tab과 Shift+Tab으로 순환하세요. Escape를 눌러 닫고 트리거로 돌아가세요.',
    localNote: '로컬 메모',
    keyboardInputValue: '키보드로 탐색',
    done: '완료',
    feedbackTitle: '한 번만 알리고 결과를 유지하세요',
    feedbackItem1:
      '포커스를 이동하지 않는 업데이트(완료 또는 검색 결과 등)는 role=status 영역에서 알리세요. 미리 마운트해 두고 메시지를 간결하게 유지하세요.',
    feedbackItem2:
      'alert는 즉시 주의가 필요한 오류에만 사용하세요. 필드, Toast, status 영역에서 같은 문장을 반복하지 마세요.',
    feedbackItem3:
      '실패 원인과 재시도 및 수정 경로를 페이지 콘텐츠에 유지하세요. Toast의 타이밍이나 모션만으로 의존하지 마세요.',
    feedbackItem4:
      '색, 아이콘, 라벨을 함께 사용하세요. 아이콘만 있는 액션은 대상과 목적에 맞게 이름을 지으세요.',
    inlineMessageLink: '인라인 메시지',
    toastLink: 'Toast',
    iconNamesLink: '아이콘 이름',
    testingTitle: '전체 작업을 테스트하세요',
    testingItem1:
      '키보드만으로 작업을 실행하세요: 시작, 편집, 완료, 취소, 실패 복구. 보이는 포커스는 실제 활성 요소와 일치해야 합니다.',
    testingItem2:
      '320 CSS px 너비와 데스크톱에서 확인하세요. 200%와 400% 브라우저 확대와 텍스트 간격 변경을 직접 테스트하세요. 표와 코드 같은 2차원 콘텐츠는 이름 있는 독립 스크롤 영역에 넣으세요.',
    testingItem3Start:
      '라이트, 다크, 시스템, 강제 색상, 모션 축소 설정을 확인하세요. ',
    colorContrastLink: '색 대비',
    testingItem3Mid: '와 ',
    motionGuidanceLink: '모션 가이드라인',
    testingItem3End: '을 함께 적용하세요.',
    testingItem4:
      '실제 보조 기술(예: VoiceOver, NVDA)로 이름, 순서, 오류, 상태를 확인하세요. axe 검사와 뷰포트 크기 조정은 이 수동 검사를 대체하지 않습니다.',
    testingItem5:
      '데이터 입력, 저장, 오류 복구, 읽기, 코드 복사와 같이 사용자가 수행하는 작업을 처음부터 끝까지 테스트하세요.',
    testingClosing:
      '테스트하지 않은 항목을 완료로 표시하지 마세요. 이 가이드와 자동 검사는 접근성 인증이나 완료된 전체 수동 검토가 아닙니다.',
    waiFormNotifications: 'WAI — 양식 알림',
    wcagFocusOrder: 'WCAG — 포커스 순서',
    w3cKeyboardControl: 'W3C — 키보드 제어',
  },
}
