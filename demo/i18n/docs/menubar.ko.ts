import type { DocKo } from './types'
export const doc: DocKo = {
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
}
