import type { DocKo } from './types'

export const contextOverlayDocsKo: Record<string, DocKo> = {
  'context-menu': {
    usage:
      '대상에서 오른쪽 클릭이나 길게 누르기로 빠른 액션을 제공하는 보조 메뉴입니다. 항상 같은 액션을 제공하는 보이는 Menu와 함께 사용하세요. 두 경로 모두 상태와 액션 핸들러를 공유합니다.',
    avoid:
      '중요한 기능을 오른쪽 클릭으로만 제공하지 마세요. Base UI 1.9에서 Trigger는 Shift+F10을 처리하지 않는 div입니다. 키보드 사용자는 보이는 Menu.Trigger에서 같은 액션을 실행합니다. 브라우저 기본 컨텍스트 메뉴가 필요한 입력이나 링크가 아닌, 비대화형 콘텐츠만 감싸세요.',
    keyboard:
      'Tab으로 보이는 Menu.Trigger에 이동한 뒤 Enter나 Space로 메뉴를 엽니다. 화살표 키, Home, End, 타자 사전 입력으로 항목 사이를 이동합니다. Enter는 항목을 실행하고, Escape는 메뉴를 닫습니다. ContextMenu는 기본 포인터 위치 지정과 충돌 회피를 유지합니다.',
    props: {
      'Root.open / defaultOpen / onOpenChange': 'Base UI 메뉴 상태와 cancel()',
      'Root.disabled':
        '컨텍스트 열기 비활성화. 보이는 Menu는 별도로 유지됩니다.',
      Trigger: 'div; 오른쪽 클릭 또는 500ms 길게 누르기',
      'Content.positionerProps': '커서를 인식하는 ContextMenu.Positioner props',
      'Content / Popup': '전달된 div ref, 상태 className, 렌더 구성',
      'Item / CheckboxItem / RadioItem / SubmenuTrigger':
        'Menu와 동일한 스타일 파트와 SVG 표시기',
    },
  },
  'preview-card': {
    usage:
      '호버나 키보드 포커스 시 링크 대상의 요약을 미리 봅니다. 사용자에게 필요한 정보는 본문 텍스트와 대상 페이지에 유지하세요. 링크는 여전히 원래 href로 이동합니다.',
    avoid:
      'Popup에 버튼, 폼, 독점 정보를 넣지 마세요. 터치, 키보드, 스크린 리더 사용자를 위한 별도 내비게이션 경로가 아니므로 Dialog나 Tooltip 역할을 부여하지 마세요. 콘텐츠에 인터랙션이 필요하면 Popover를 사용하세요.',
    keyboard:
      '링크는 Tab과 Enter 내비게이션을 유지합니다. Popup이 지연 후 열려도 포커스가 안으로 이동하거나 갇히지 않습니다. Escape, 포커스 이동, 포인터 이동이 닫습니다. 미리 보기 정보는 대상 페이지에서도 모두 제공하세요.',
    props: {
      'Root.open / defaultOpen / onOpenChange':
        '제어/비제어 열기 상태; cancel()',
      'Trigger.href / target / rel': '네이티브 앵커 내비게이션',
      'Trigger.delay / closeDelay': '열기/닫기 지연(밀리초)',
      'createHandle<Payload> / Trigger.payload':
        '타입이 지정된 분리 또는 다중 트리거',
      'Content.positionerProps': 'side, align, anchor, 충돌 옵션',
      'Content / Popup': '전달된 div ref와 상태 의존 className',
    },
  },
}
