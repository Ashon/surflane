import type { Locale } from '../../i18n'

const en = {
  principles: [
    [
      'Give each state its own signal.',
      'Hover, press, focus, selection, and pending mean different things, so never merge them into one color.',
    ],
    [
      'Never hide an action behind hover or drag.',
      'Touch and keyboard users have neither, so give every action a visible control.',
    ],
    [
      'Leave focus where the reader put it.',
      "Show it with the shared ring, and don't move it when a task finishes.",
    ],
    [
      'Treat pending as not done.',
      'Block a second start, offer cancel when you can, and announce only the real result.',
    ],
    [
      'Explain an unavailable action.',
      'Put the reason beside a disabled control, and use read-only when people still need the value.',
    ],
  ],
  sections: {
    states: 'State model',
    focus: 'Focus ring',
    activation: 'Selection and activation',
    pending: 'Pending work',
  },
  statesIntro:
    'A state tells the reader what they can do now and what happened. Shared controls draw each one with its own token.',
  statesTableLabel: 'Interaction states',
  statesTableCaption: 'How each state shows',
  stateColumns: ['State', 'Means', 'Shown as'],
  states: [
    [
      'Hover',
      'Pointer over the target',
      '--surf-interaction-hover-bg',
      'ink at 8%',
    ],
    [
      'Pressed',
      'Pressed right now',
      '--surf-interaction-active-bg',
      'ink at 14%, gone on release',
    ],
    [
      'Focus visible',
      'Keyboard position',
      '--surf-control-focus',
      'ring or halo',
    ],
    [
      'Selected',
      'A choice that persists',
      '--surf-selected',
      'fill, set with its ARIA state',
    ],
    [
      'Disabled',
      "Can't run now",
      '--surf-control-disabled-opacity',
      '0.55 on the control; label and reason stay readable',
    ],
    [
      'Read only',
      'Readable, not editable',
      '--surf-surface',
      'the value on a plane, no border; focusable',
    ],
    ['Pending', 'Started, no result yet', '', 'spinner and aria-busy'],
    ['Error / success', 'The real result', '', 'a message that stays'],
  ],
  focusRing:
    'Buttons and choices draw a `--surf-focus-ring-width` ring at `--surf-focus-ring-offset`, both 2px, in `--surf-control-focus`. They show it for keyboard focus only (`:focus-visible`).',
  focusHalo:
    'Text fields turn their border `--surf-control-focus` and add a 3px `--surf-control-focus-ring` halo on any focus. Where a container clips, the ring moves inside by `--surf-focus-ring-inset`.',
  activationIntro:
    "Mouse, touch, Enter, and Space run the same action. Below, the toggle keeps a selection, the disabled button can't run, and the read-only field stays copyable.",
  includeEvidence: 'Include evidence',
  unavailablePreview: 'Unavailable preview',
  unavailableReason:
    'Unavailable preview: no external environment is connected.',
  evidenceIncluded: 'Evidence included.',
  evidenceExcluded: 'Evidence excluded.',
  readOnlyResourceId: 'Read-only resource ID',
  readOnlyResourceDescription: "Focus and copy this value. It can't be edited.",
  activationNote:
    "Link a disabled control to its reason with aria-describedby. Keep each component's native keys, and don't add a keydown handler that runs the action twice.",
  baseUiButton: 'Base UI — Button',
  ariaButtonPattern: 'WAI-ARIA — Button pattern',
  pendingIntro:
    'While pending, the run button keeps focus and blocks a second start. Cancel returns focus to it, and finishing moves nothing. Try failure, cancel, and retry on this 900ms local task.',
  failPreview: 'Fail local preview',
  runPreview: 'Run local preview',
  cancelPreview: 'Cancel local preview',
  attempts: 'Started attempts:',
  resultLabel: 'Local preview result',
  statusIdle: 'No preview has run.',
  statusPending: 'Local preview running.',
  statusSuccess: 'Local preview completed. No resources were created.',
  statusError: 'Local preview failed. Review the persistent message and retry.',
  statusCanceled: 'Local preview canceled. Run it again when ready.',
  errorTitle: 'Preview needs attention',
  errorDescription:
    'This is a sample failure. Clear Fail local preview, then run it again.',
  pendingTiming:
    'Respond to a press within 100ms. Show a spinner for work that can pass 1 second, and [progress](/components/progress) for work past 10 seconds.',
  codeLabel: 'Pending action composition',
  pendingNote:
    'A disabled state alone stops no request, so guard the handler too. For real writes, the server owns idempotency and permission.',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    principles: [
      [
        '상태마다 신호를 따로 두세요.',
        '호버, 누름, 포커스, 선택, 대기는 뜻이 다르므로 한 가지 색으로 합치지 마세요.',
      ],
      [
        '작업을 호버나 드래그 뒤에 숨기지 마세요.',
        '터치와 키보드 사용자에게는 둘 다 없으므로 모든 작업에 보이는 컨트롤을 두세요.',
      ],
      [
        '포커스는 사용자가 둔 곳에 두세요.',
        '공유 포커스 링으로 보여 주고, 작업이 끝났다고 옮기지 마세요.',
      ],
      [
        '대기 중을 완료로 다루지 마세요.',
        '두 번째 시작을 막고, 가능하면 취소를 두고, 실제 결과만 알리세요.',
      ],
      [
        '쓸 수 없는 작업에는 이유를 알리세요.',
        '비활성 컨트롤 옆에 이유를 쓰고, 값을 읽어야 하면 읽기 전용을 쓰세요.',
      ],
    ],
    sections: {
      states: '상태 모델',
      focus: '포커스 링',
      activation: '선택과 실행',
      pending: '대기 중인 작업',
    },
    statesIntro:
      '상태는 지금 할 수 있는 일과 방금 일어난 일을 알려 줍니다. 공유 컨트롤은 상태마다 토큰을 따로 씁니다.',
    statesTableLabel: '인터랙션 상태',
    statesTableCaption: '상태별 표시 방식',
    stateColumns: ['상태', '뜻', '표시'],
    states: [
      [
        '호버',
        '포인터가 대상 위에 있음',
        '--surf-interaction-hover-bg',
        '잉크 8%',
      ],
      [
        '누름',
        '지금 누르고 있음',
        '--surf-interaction-active-bg',
        '잉크 14%, 손을 떼면 사라짐',
      ],
      ['포커스 표시', '키보드 위치', '--surf-control-focus', '링 또는 헤일로'],
      ['선택됨', '유지되는 선택', '--surf-selected', '채움, ARIA 상태와 함께'],
      [
        '비활성',
        '지금 실행할 수 없음',
        '--surf-control-disabled-opacity',
        '컨트롤만 0.55, 레이블과 이유는 그대로',
      ],
      [
        '읽기 전용',
        '읽을 수 있고 편집할 수 없음',
        '--surf-surface',
        '테두리 없이 면 위의 값, 포커스 가능',
      ],
      ['대기 중', '시작했고 결과가 아직 없음', '', '스피너와 aria-busy'],
      ['오류 / 성공', '실제 결과', '', '남아 있는 메시지'],
    ],
    focusRing:
      '버튼과 선택 컨트롤은 `--surf-control-focus` 색으로 `--surf-focus-ring-width` 링을 `--surf-focus-ring-offset`만큼 띄워 그립니다. 둘 다 2px이고, 키보드 포커스(`:focus-visible`)에서만 보입니다.',
    focusHalo:
      '텍스트 필드는 포커스를 받으면 테두리를 `--surf-control-focus`로 바꾸고 3px `--surf-control-focus-ring` 헤일로를 더합니다. 컨테이너가 잘라 내는 곳에서는 링이 `--surf-focus-ring-inset`만큼 안쪽으로 들어갑니다.',
    activationIntro:
      '마우스, 터치, Enter, Space는 같은 작업을 실행합니다. 아래에서 토글은 선택을 유지하고, 비활성 버튼은 실행되지 않고, 읽기 전용 필드는 복사할 수 있습니다.',
    includeEvidence: '증거 포함',
    unavailablePreview: '사용할 수 없는 미리보기',
    unavailableReason:
      '사용할 수 없는 미리보기: 외부 환경이 연결되어 있지 않습니다.',
    evidenceIncluded: '증거를 포함했습니다.',
    evidenceExcluded: '증거를 제외했습니다.',
    readOnlyResourceId: '읽기 전용 리소스 ID',
    readOnlyResourceDescription:
      '이 값에 포커스하고 복사하세요. 편집할 수는 없습니다.',
    activationNote:
      '비활성 컨트롤은 aria-describedby로 이유와 연결하세요. 컴포넌트의 기본 키 동작을 유지하고, 작업을 두 번 실행하는 keydown 핸들러를 더하지 마세요.',
    baseUiButton: 'Base UI — Button',
    ariaButtonPattern: 'WAI-ARIA — 버튼 패턴',
    pendingIntro:
      '대기 중에는 실행 버튼이 포커스를 유지하고 두 번째 시작을 막습니다. 취소하면 포커스가 실행 버튼으로 돌아오고, 완료되어도 포커스는 그대로입니다. 900ms 로컬 작업으로 실패, 취소, 재시도를 시험해 보세요.',
    failPreview: '로컬 미리보기 실패시키기',
    runPreview: '로컬 미리보기 실행',
    cancelPreview: '로컬 미리보기 취소',
    attempts: '시작한 횟수:',
    resultLabel: '로컬 미리보기 결과',
    statusIdle: '실행한 미리보기가 없습니다.',
    statusPending: '로컬 미리보기를 실행하고 있습니다.',
    statusSuccess: '로컬 미리보기를 마쳤습니다. 리소스는 만들지 않았습니다.',
    statusError:
      '로컬 미리보기가 실패했습니다. 남아 있는 메시지를 확인하고 다시 시도하세요.',
    statusCanceled: '로컬 미리보기를 취소했습니다. 준비되면 다시 실행하세요.',
    errorTitle: '미리보기를 확인하세요',
    errorDescription:
      '예시로 만든 실패입니다. 로컬 미리보기 실패시키기를 해제하고 다시 실행하세요.',
    pendingTiming:
      '누름에는 100ms 안에 반응하세요. 1초를 넘길 수 있는 작업에는 스피너를, 10초를 넘는 작업에는 [진행률](/components/progress)을 보여 주세요.',
    codeLabel: '대기 중 작업 구성',
    pendingNote:
      '비활성 상태만으로는 요청이 막히지 않으므로 핸들러에서도 막으세요. 실제 쓰기 작업의 멱등성과 권한은 서버가 맡습니다.',
  },
}
