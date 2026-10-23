import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '대상에서 오른쪽 클릭이나 길게 누르기로 빠른 액션을 제공하는 보조 메뉴입니다. 항상 같은 액션을 제공하는 보이는 Menu와 함께 사용하세요. 두 경로 모두 상태와 액션 핸들러를 공유합니다.',
  avoid:
    '중요한 기능을 오른쪽 클릭으로만 제공하지 마세요. Base UI 1.9에서 Trigger는 Shift+F10을 처리하지 않는 div입니다. 키보드 사용자는 보이는 Menu.Trigger에서 같은 액션을 실행합니다. 브라우저 기본 컨텍스트 메뉴가 필요한 입력이나 링크가 아닌, 비대화형 콘텐츠만 감싸세요.',
  keyboard:
    'Tab으로 보이는 Menu.Trigger에 이동한 뒤 Enter나 Space로 메뉴를 엽니다. 화살표 키, Home, End, 타자 사전 입력으로 항목 사이를 이동합니다. Enter는 항목을 실행하고, Escape는 메뉴를 닫습니다. ContextMenu는 기본 포인터 위치 지정과 충돌 회피를 유지합니다.',
  props: {
    'Root.open / defaultOpen / onOpenChange': 'Base UI 메뉴 상태와 cancel()',
    'Root.disabled': '컨텍스트 열기 비활성화. 보이는 Menu는 별도로 유지됩니다.',
    Trigger: 'div; 오른쪽 클릭 또는 500ms 길게 누르기',
    'Content.side / align / sideOffset / collisionPadding': '커서 기준 배치',
    'Content / Popup': '전달된 div ref, 상태 className, 렌더 구성',
    'Item / CheckboxItem / RadioItem / SubmenuTrigger':
      'Menu와 동일한 스타일 파트와 SVG 표시기',
  },
}
