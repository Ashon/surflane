import type { DocKo } from './types'
export const doc: DocKo = {
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
}
