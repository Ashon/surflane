import type { Locale } from '../../i18n'

const en = {
  principles: [
    [
      'Meet WCAG 2.2 AA on every screen.',
      'Components handle their own behavior, and the product owns names, structure, and messages.',
    ],
    [
      'Keep native semantics.',
      'Links navigate, buttons act, and headings outline the page, so assistive technology reads them right.',
    ],
    [
      "Keep the reader's input.",
      'After an error, keep every value and say what went wrong and how to fix it.',
    ],
    [
      'Announce each result once.',
      'Give a change one status message, and leave the result on the page.',
    ],
    [
      'Test the whole task.',
      'Finish it by keyboard, at 320px wide and 400% zoom, and with a screen reader.',
    ],
  ],
  sections: {
    responsibilities: 'Shared and product responsibilities',
    keyboard: 'Keyboard and focus',
    recovery: 'Errors and recovery',
    announcements: 'Announcements',
    testing: 'Testing',
  },
  responsibilitiesIntro:
    'Shared components handle interaction, focus, and styling. The product owns the rest.',
  tableLabel: 'Accessibility responsibilities',
  caption: 'What to build and check in each area',
  areaHeader: 'Area',
  buildHeader: 'Build',
  checkHeader: 'Check',
  responsibilities: [
    [
      'Structure',
      'main, nav, headings, DOM order',
      'Title, h1, and skip link after a route change',
    ],
    [
      'Keyboard',
      'Native buttons, links, and form controls',
      'The task with Tab, arrows, Enter, Space, and Escape',
    ],
    [
      'Forms',
      'Labels, descriptions, errors, required state',
      'Values kept, cause and fix stated',
    ],
    [
      'Feedback',
      'status or alert, by severity',
      'One announcement, result kept on the page',
    ],
    [
      'Perception',
      'Shared color, focus, size, and motion tokens',
      'Themes, zoom, text spacing, 320px width, forced colors',
    ],
  ],
  keyboardOrder:
    "Tab order follows DOM order, so write the DOM in reading order. Don't add positive tabIndex values or clickable divs. Use a button or a link instead.",
  keyboardTargetStart: 'On touch and narrow screens, controls are ',
  keyboardTargetEnd:
    " (44px) tall. A control that keeps a smaller look, such as a table row's checkbox or a tree's disclosure button, reaches that size around it. A compact density, for dense monitoring screens, keeps them at their size instead, never under WCAG 2.2 AA's 24px. Never remove or cover the focus ring.",
  keyboardDialog:
    "Dialogs keep focus inside, close on Escape, and return focus to their trigger. Don't build a focus trap of your own. When an action removes its trigger, move focus to the next meaningful element.",
  openFocusPreview: 'Open focus preview',
  closeFocusPreview: 'Close focus preview',
  focusPreviewTitle: 'Keyboard focus preview',
  focusPreviewDescription:
    'Cycle with Tab and Shift+Tab. Press Escape to close and return to the trigger.',
  localNote: 'Local note',
  keyboardInputValue: 'Navigate with the keyboard',
  done: 'Done',
  recoveryIntro:
    'Submit the example empty or with spaces, then try a name conflict. It validates locally and sends nothing.',
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
  recoveryNotes:
    'Mark a required field in its label and with required. State the cause and the fix in words, not by color alone. Move focus to a field only after the reader acts, as the conflict does.',
  codeLabel: 'Accessible field composition',
  announcements: [
    "Announce a change that doesn't move focus, such as saved settings or new results, in a role=status region. Mount the region before its text changes.",
    'Use role=alert only for an error that needs action now.',
    "Say it once. Don't repeat one message in the field, a toast, and a status region.",
    "Keep the result and its recovery path on the page. Don't rely on a toast alone.",
    "When a status or a name has no place on screen, such as the name of a column of checkboxes, put it in VisuallyHidden: it keeps its place in the reading order and takes no space. Don't hide it with display: none, which removes it for everyone.",
  ],
  testing: [
    'Finish the task by keyboard alone: start, edit, cancel, and recover from an error.',
    'Check at 320px wide, at 200% and 400% zoom, and with wider text spacing.',
    'Switch between light, dark, forced colors, and reduced motion.',
    "Check names, order, and states with VoiceOver or NVDA. Automated checks such as axe don't replace this.",
  ],
  testingClosing:
    "Mark only what you tested as done. These checks aren't an accessibility certification.",
  waiFormNotifications: 'WAI — Form notifications',
  wcagFocusOrder: 'WCAG — Focus order',
  w3cKeyboardControl: 'W3C — Keyboard control',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    principles: [
      [
        '모든 화면에서 WCAG 2.2 AA를 지키세요.',
        '컴포넌트는 자기 동작을 맡고, 이름과 구조와 메시지는 제품이 맡습니다.',
      ],
      [
        '네이티브 의미를 유지하세요.',
        '링크는 이동하고 버튼은 실행하고 제목은 구조를 만들어야 보조 기술이 바르게 읽습니다.',
      ],
      [
        '입력값을 잃지 않게 하세요.',
        '오류가 나도 값을 모두 유지하고, 무엇이 잘못됐고 어떻게 고치는지 알리세요.',
      ],
      [
        '결과는 한 번만 알리세요.',
        '변경 하나에 상태 메시지 하나를 두고, 결과는 페이지에 남기세요.',
      ],
      [
        '작업 전체를 테스트하세요.',
        '키보드만으로, 320px 너비와 400% 확대에서, 스크린 리더로 끝까지 해 보세요.',
      ],
    ],
    sections: {
      responsibilities: '공유 책임과 제품 책임',
      keyboard: '키보드와 포커스',
      recovery: '오류와 복구',
      announcements: '상태 알림',
      testing: '테스트',
    },
    responsibilitiesIntro:
      '공유 컴포넌트는 인터랙션, 포커스, 스타일을 맡습니다. 나머지는 제품이 맡습니다.',
    tableLabel: '접근성 책임',
    caption: '영역별로 만들 것과 확인할 것',
    areaHeader: '영역',
    buildHeader: '만들 것',
    checkHeader: '확인할 것',
    responsibilities: [
      [
        '구조',
        'main, nav, 제목, DOM 순서',
        '라우트 변경 후 문서 제목, h1, 건너뛰기 링크',
      ],
      [
        '키보드',
        '네이티브 버튼, 링크, 폼 컨트롤',
        'Tab, 화살표, Enter, Space, Escape로 끝내는 작업',
      ],
      ['폼', '라벨, 설명, 오류, 필수 상태', '유지된 값, 원인과 해결 방법'],
      [
        '피드백',
        '심각도에 맞는 status나 alert',
        '한 번의 알림, 페이지에 남는 결과',
      ],
      [
        '지각',
        '공유 색, 포커스, 크기, 모션 토큰',
        '테마, 확대, 텍스트 간격, 320px 너비, 강제 색상',
      ],
    ],
    keyboardOrder:
      'Tab 순서는 DOM 순서를 따르므로 DOM을 읽는 순서대로 쓰세요. 양수 tabIndex나 클릭 가능한 div를 더하지 마세요. 대신 버튼이나 링크를 쓰세요.',
    keyboardTargetStart: '터치와 좁은 화면에서 컨트롤 높이는 ',
    keyboardTargetEnd:
      '(44px)입니다. 표 행의 체크박스나 트리의 펼침 버튼처럼 더 작게 보이는 컨트롤은 보이는 크기를 두고, 누르는 영역만 그 크기까지 넓힙니다. 촘촘한 모니터링 화면을 위한 compact 밀도에서는 크기를 그대로 두되, WCAG 2.2 AA의 24px 아래로는 줄이지 않습니다. 포커스 링은 없애거나 가리지 마세요.',
    keyboardDialog:
      '대화상자는 포커스를 안에 가두고, Escape로 닫히고, 닫히면 트리거로 포커스를 돌려줍니다. 포커스 트랩을 직접 만들지 마세요. 작업이 트리거를 없애면 다음 의미 있는 요소로 포커스를 옮기세요.',
    openFocusPreview: '포커스 미리보기 열기',
    closeFocusPreview: '포커스 미리보기 닫기',
    focusPreviewTitle: '키보드 포커스 미리보기',
    focusPreviewDescription:
      'Tab과 Shift+Tab으로 순환하세요. Escape를 누르면 닫히고 트리거로 돌아갑니다.',
    localNote: '로컬 메모',
    keyboardInputValue: '키보드로 탐색',
    done: '완료',
    recoveryIntro:
      '예시를 비워 두거나 공백을 넣어 제출한 뒤 이름 충돌을 시험해 보세요. 검증은 로컬에서만 하고 아무것도 보내지 않습니다.',
    formAriaLabel: '접근성 검증 미리보기',
    validatedMessage: (name: string) =>
      `검증 완료: ${name}. 이 로컬 예시는 리소스를 만들지 않았습니다.`,
    previewResetMessage:
      '미리보기를 초기화했습니다. 이름을 입력해 다시 시도하세요.',
    nameLabel: '미리보기 이름 (필수)',
    nameDescription: '소문자, 숫자, 하이픈만 사용하세요. 예: demo-e2e-01.',
    valueMissingError: '이름을 입력하세요.',
    patternMismatchError: '소문자, 숫자, 하이픈만 사용하세요.',
    validatePreview: '미리보기 검증',
    resetPreview: '미리보기 초기화',
    simulateNameConflict: '이름 충돌 시뮬레이션',
    nameConflictError: '이 이름은 이미 사용 중입니다. 다른 이름을 입력하세요.',
    recoveryNotes:
      '필수 필드는 라벨과 required로 표시하세요. 원인과 해결 방법은 색만이 아니라 글로 알리세요. 포커스는 충돌 예시처럼 사용자가 동작한 뒤에만 필드로 옮기세요.',
    codeLabel: '접근 가능한 필드 구성',
    announcements: [
      '설정 저장이나 새 결과처럼 포커스가 움직이지 않는 변경은 role=status 영역에서 알리세요. 영역은 내용이 바뀌기 전에 마운트하세요.',
      'role=alert는 지금 조치가 필요한 오류에만 쓰세요.',
      '한 번만 알리세요. 같은 메시지를 필드, 토스트, 상태 영역에 반복하지 마세요.',
      '결과와 복구 경로는 페이지에 남기세요. 토스트에만 기대지 마세요.',
      '체크박스 열의 이름처럼 화면에 자리가 없는 상태나 이름은 VisuallyHidden에 넣으세요. 읽는 순서에서 자리를 지키고 공간은 차지하지 않습니다. display: none으로 숨기면 모두에게서 사라지니 쓰지 마세요.',
    ],
    testing: [
      '키보드만으로 작업을 끝내 보세요. 시작, 편집, 취소, 오류 복구까지 해 봅니다.',
      '320px 너비, 200%와 400% 확대, 넓힌 텍스트 간격에서 확인하세요.',
      '라이트, 다크, 강제 색상, 모션 줄이기를 오가며 확인하세요.',
      'VoiceOver나 NVDA로 이름, 순서, 상태를 확인하세요. axe 같은 자동 검사가 이를 대신하지 않습니다.',
    ],
    testingClosing:
      '테스트한 항목만 완료로 표시하세요. 이 점검은 접근성 인증이 아닙니다.',
    waiFormNotifications: 'WAI — 폼 알림',
    wcagFocusOrder: 'WCAG — 포커스 순서',
    w3cKeyboardControl: 'W3C — 키보드 제어',
  },
}
