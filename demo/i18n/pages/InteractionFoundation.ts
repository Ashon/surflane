import type { Locale } from '../../i18n'

const en = {
  onThisPage: 'On this page',
  nav: [
    { id: 'states', label: 'States' },
    { id: 'activation', label: 'Activation' },
    { id: 'async-work', label: 'Async Work' },
    { id: 'keyboard', label: 'Keyboard' },
    { id: 'application', label: 'Application' },
  ],
  states: [
    [
      'Default',
      'Ready to act',
      'Clearly shows the label, role, and next action',
    ],
    [
      'Hover',
      'The pointer is over the target',
      'Brief color and surface feedback, while essential information stays available',
    ],
    [
      'Focus visible',
      "The keyboard user's current position",
      'An immediate focus ring, separate from the surface, with Tab order preserved',
    ],
    [
      'Active',
      'The brief moment while pressed',
      'Press feedback that never reads as a persistent selection',
    ],
    [
      'Pressed / selected',
      'A selection that persists',
      'Toggle and selection components change their state and ARIA value together',
    ],
    [
      'Disabled',
      "The action can't run",
      'Native disabled state, with the reason in adjacent text',
    ],
    [
      'Read only',
      'The value can be read and copied',
      'Keeps the value and focus, and blocks only edits',
    ],
    [
      'Pending',
      'Started and waiting for a result',
      'Blocks duplicate requests, announces status, and offers a cancel path when possible',
    ],
    [
      'Error / success',
      'The result of the actual action',
      'A persistent result and recovery path, never conveyed by motion alone',
    ],
  ],
  statusIdle: 'No preview has run.',
  statusPending: 'Local preview running.',
  statusSuccess: 'Local preview completed. No resources were created.',
  statusError: 'Local preview failed. Review the persistent message and retry.',
  statusCanceled: 'Local preview canceled. Run it again when ready.',
  statesHeading: 'One action, understandable states',
  statesIntro:
    "States tell users which actions are available now and what actually happened. Pointer hover and active, keyboard focus, persistent selection, and pending server work each mean something different. Don't merge them into a single color. Don't offer actions only on hover.",
  statesTableLabel: 'Interaction state contracts',
  statesTableCaption: 'State contracts for shared controls and product actions',
  stateColumns: ['State', 'Meaning', 'Contract'],
  activationHeading: 'Distinguish selection from activation',
  activationIntro:
    "Mouse, touch, Enter, and Space must all run the same action. Below, the Toggle shows a persistent selection. The disabled button shows an action that can't run. The read-only input shows a copyable value. State changes apply only to this local example.",
  includeEvidence: 'Include evidence',
  unavailablePreview: 'Unavailable preview',
  unavailableReason:
    'Unavailable preview: no external environment is connected.',
  evidenceIncluded: 'Evidence included.',
  evidenceExcluded: 'Evidence excluded.',
  readOnlyResourceId: 'Read-only resource ID',
  readOnlyResourceDescription: "Focus and copy this value. It can't be edited.",
  activationNote:
    "Keep the native keyboard semantics of Base UI buttons and the ARIA contracts of selection components. Don't add clickable divs, positive tabIndex values, or separate keydown handlers that run the action a second time.",
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    onThisPage: '이 페이지에서',
    nav: [
      { id: 'states', label: '상태' },
      { id: 'activation', label: '활성화' },
      { id: 'async-work', label: '비동기 작업' },
      { id: 'keyboard', label: '키보드' },
      { id: 'application', label: '애플리케이션' },
    ],
    states: [
      [
        '기본',
        '작업할 준비가 됨',
        '라벨, 역할, 다음 작업을 분명히 보여 줍니다',
      ],
      [
        '호버',
        '포인터가 대상 위에 있음',
        '짧은 색과 면 피드백, 필수 정보는 계속 사용 가능',
      ],
      [
        '포커스 표시',
        '키보드 사용자의 현재 위치',
        '면과 구분되는 즉각적인 포커스 링, Tab 순서 유지',
      ],
      [
        '액티브',
        '누르는 짧은 순간',
        '지속되는 선택으로 보이지 않는 눌림 피드백',
      ],
      [
        '눌림 / 선택됨',
        '지속되는 선택',
        'Toggle과 선택 컴포넌트는 상태와 ARIA 값을 함께 바꿉니다',
      ],
      [
        '비활성',
        '작업을 실행할 수 없음',
        '네이티브 disabled 상태, 이유는 인접한 텍스트에 표시',
      ],
      [
        '읽기 전용',
        '값을 읽고 복사할 수 있음',
        '값과 포커스를 유지하고 편집만 차단',
      ],
      [
        '대기 중',
        '시작되어 결과를 기다리는 중',
        '중복 요청을 차단하고 상태를 알리며, 가능하면 취소 경로도 제공',
      ],
      [
        '오류 / 성공',
        '실제 작업의 결과',
        '지속되는 결과와 복구 경로, 모션만으로 전달하지 않음',
      ],
    ],
    statusIdle: '실행된 미리보기가 없습니다.',
    statusPending: '로컬 미리보기를 실행합니다.',
    statusSuccess:
      '로컬 미리보기가 완료되었습니다. 리소스는 생성되지 않았습니다.',
    statusError:
      '로컬 미리보기가 실패했습니다. 지속되는 메시지를 확인하고 다시 시도하세요.',
    statusCanceled: '로컬 미리보기를 취소했습니다. 준비되면 다시 실행하세요.',
    statesHeading: '작업은 하나, 상태는 명확하게',
    statesIntro:
      '상태는 사용자에게 지금 어떤 작업을 사용할 수 있고 실제로 무슨 일이 있었는지 알려 줍니다. 포인터 호버와 액티브, 키보드 포커스, 지속되는 선택, 대기 중인 서버 작업은 각각 의미가 다릅니다. 하나의 색으로 합치지 마세요. 호버에서만 작업을 제공하지 마세요.',
    statesTableLabel: '인터랙션 상태 계약',
    statesTableCaption: '공용 컨트롤과 제품 작업을 위한 상태 계약',
    stateColumns: ['상태', '의미', '계약'],
    activationHeading: '선택과 활성화의 구분',
    activationIntro:
      '마우스, 터치, Enter, Space 모두 동일한 작업을 실행해야 합니다. 아래에서 Toggle은 지속되는 선택을, 비활성 버튼은 실행할 수 없는 작업을, 읽기 전용 입력창은 복사할 수 있는 값을 보여 줍니다. 상태 변경은 이 로컬 예시에만 적용됩니다.',
    includeEvidence: '증거 포함',
    unavailablePreview: '사용할 수 없는 미리보기',
    unavailableReason:
      '사용할 수 없는 미리보기: 외부 환경이 연결되어 있지 않습니다.',
    evidenceIncluded: '증거가 포함되었습니다.',
    evidenceExcluded: '증거가 제외되었습니다.',
    readOnlyResourceId: '읽기 전용 리소스 ID',
    readOnlyResourceDescription:
      '이 값에 포커스하고 복사하세요. 편집할 수 없습니다.',
    activationNote:
      'Base UI 버튼의 네이티브 키보드 동작과 선택 컴포넌트의 ARIA 계약을 유지하세요. 클릭 가능한 div, 양수 tabIndex 값, 작업을 두 번 실행하는 별도 keydown 핸들러를 추가하지 마세요.',
  },
}
