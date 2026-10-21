import type { DocKo } from './types'

export const commandDocsKo: Record<string, DocKo> = {
  toggle: {
    usage:
      '상태를 유지하는 버튼으로 명령을 켜고 끄세요. 두 상태 모두 라벨은 동일하게 유지하세요. aria-pressed가 상태를 전달하고, 완전히 둥근 표면이 상태를 보여줍니다.',
    avoid:
      '네비게이션 또는 일회성 액션에는 Link나 Button을 사용하세요. 폼에서 체크된 값이 필요하면 Checkbox나 Switch를 사용하세요. FormData나 폼 리셋에 Toggle 상태가 포함된다고 가정하지 마세요.',
    keyboard:
      'Tab으로 토글에 이동한 뒤 Enter나 Space로 상태를 변경하세요. 비활성 토글은 변경되지 않습니다. pressed와 onPressedChange로 제어하거나 defaultPressed를 설정하세요. event.cancel()이 변경을 취소합니다.',
    props: {
      'pressed / defaultPressed': '제어/비제어 boolean 상태',
      onPressedChange: '(pressed, eventDetails) => void; cancel() 지원',
      disabled: '상호작용 차단',
      value: 'ToggleGroup 내부의 문자열 식별자',
      'render / className': 'Base UI 컴포지션과 상태 기반 스타일링',
    },
  },
  'toggle-group': {
    usage:
      '관련 표시 모드나 필터를 그룹화하세요. multiple=true면 여러 항목이, 아니면 최대 한 항목이 눌립니다. 단일 모드에서도 값은 항상 배열입니다.',
    avoid:
      '폼이 정확히 하나의 선택을 요구하면 RadioGroup을 사용하세요. 눌린 상태는 aria-selected가 아닌 aria-pressed가 전달하게 하세요. 시각적 레이아웃에 맞춰 orientation을 설정하세요.',
    keyboard:
      '그룹은 단일 Tab 정지점입니다. 화살표 키, Home, End는 포커스만 이동합니다. Enter나 Space는 포커스된 항목을 선택합니다. 비활성 항목은 건너뜁니다. RTL에서는 DirectionProvider와 DOM dir을 모두 설정하세요.',
    props: {
      'value / defaultValue': '읽기 전용 string[]; 일반 값 유니온 보존',
      onValueChange: '(values, eventDetails) => void; cancel() 지원',
      multiple: '여러 개의 눌린 항목 허용',
      'orientation / loopFocus': 'horizontal | vertical / 순환 포커스',
      disabled: '모든 토글 비활성화',
      'aria-label / aria-labelledby': '관련 명령 그룹 이름 지정',
    },
  },
  toolbar: {
    usage:
      '한 화면의 관련 액션과 표시 설정을 하나의 툴바로 그룹화하세요. 테두리가 아닌 표면이 컨테이너를 컨트롤과 구분합니다. 안쪽 모서리는 바깥 반지름에서 안쪽 패딩을 뺀 값을 사용합니다. 버튼이 중첩되지 않도록 Button, Toggle, Menu 트리거를 render로 합성하세요.',
    avoid:
      '모든 단순 버튼 그룹에 Toolbar를 추가하지 마세요. 대신 Inline을 사용하세요. 텍스트 입력은 편집 키를 유지하게 하세요. 네비게이션은 명령으로 위장하지 말고 Toolbar.Link를 사용하세요.',
    keyboard:
      '툴바는 단일 Tab 정지점입니다. 방향을 따른 화살표 키, Home, End가 포커스를 이동합니다. 입력 내부의 편집 키는 동작을 유지합니다. focusableWhenDisabled가 기본적으로 true라서 비활성 Button도 포커스는 가능하지만 실행되지는 않습니다. Link는 네이티브 네비게이션을 유지하며 Root.disabled가 비활성화하지 않습니다.',
    props: {
      'Root.orientation / loopFocus': 'horizontal | vertical / 순환 포커스',
      'Root.disabled / Group.disabled':
        '명령 컨트롤 비활성화; 링크는 네이티브로 계속 이동',
      'Button.focusableWhenDisabled': '비활성 명령도 찾을 수 있게 유지',
      'Button.render': '중첩 버튼 없이 Toggle이나 팝업 트리거 합성',
      'Input / Link': '네이티브 input 또는 anchor props + 툴바 포커스 처리',
      'Separator.orientation': '시각적/의미적 구분선 방향',
    },
  },
  menubar: {
    usage:
      '애플리케이션 명령을 Run, View, Help 같은 메뉴로 그룹화하세요. 각 메뉴는 공유 Menu 파트를 재사용합니다: Item, CheckboxItem, RadioItem, 하위 메뉴, LinkItem.',
    avoid:
      '사이트의 기본 내비게이션이나 단순 링크 목록에는 NavigationMenu나 네이티브 nav를 사용하세요. Menu.Trigger 안에 다른 버튼을 중첩하지 마세요. 그런 명령은 Menu.Item으로 추가하세요.',
    keyboard: [
      '화살표 키는 메뉴 트리거 사이를 이동합니다.',
      'Enter나 Space, 또는 메뉴 방향 화살표 키가 메뉴를 엽니다.',
      'Base UI가 열린 메뉴 사이 이동, Escape로 닫기, 트리거로 포커스 복귀, 하위 메뉴 화살표 키를 처리합니다.',
      '방향을 DirectionProvider와 DOM dir에 맞게 유지하세요.',
      'Base UI 1.9는 초기 방향을 메뉴 모델에 저장합니다. 런타임에 방향이 바뀌면 Menubar에 orientation 기반 키를 주어 다시 마운트되게 하세요.',
      '메뉴 선택 값을 부모에서 제어하세요.',
    ],
    props: {
      'orientation / loopFocus': 'horizontal | vertical / 순환 포커스',
      modal: '메뉴가 열려 있는 동안 외부 상호작용 제한',
      disabled: '모든 메뉴 트리거 비활성화',
      'Menu.Content': '스타일된 Positioner와 Popup; Menu.Portal로 감싸기',
      'Menu.Item / CheckboxItem / RadioItem / LinkItem':
        '공유 스타일 Base UI 메뉴 명령',
      'Menu.SubmenuTrigger.indicator':
        '커스텀 ReactNode; false는 기본 SVG 화살표 숨김',
    },
  },
}
