import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '호버나 키보드 포커스 시 링크 대상의 요약을 미리 봅니다. 사용자에게 필요한 정보는 본문 텍스트와 대상 페이지에 유지하세요. 링크는 여전히 원래 href로 이동합니다.',
  avoid:
    'Popup에 버튼, 폼, 독점 정보를 넣지 마세요. 터치, 키보드, 스크린 리더 사용자를 위한 별도 내비게이션 경로가 아니므로 Dialog나 Tooltip 역할을 부여하지 마세요. 콘텐츠에 인터랙션이 필요하면 Popover를 사용하세요.',
  keyboard:
    '링크는 Tab과 Enter 내비게이션을 유지합니다. Popup이 지연 후 열려도 포커스가 안으로 이동하거나 갇히지 않습니다. Escape, 포커스 이동, 포인터 이동이 닫습니다. 미리 보기 정보는 대상 페이지에서도 모두 제공하세요.',
  props: {
    'Root.open / defaultOpen / onOpenChange': '제어/비제어 열기 상태; cancel()',
    'Trigger.href / target / rel': '네이티브 앵커 내비게이션',
    'Trigger.delay / closeDelay': '열기/닫기 지연(밀리초)',
    'createHandle<Payload> / Trigger.payload':
      '타입이 지정된 분리 또는 다중 트리거',
    'Content.side / align / sideOffset / collisionPadding': '트리거 기준 배치',
    'Content / Popup': '전달된 div ref와 상태 의존 className',
  },
}
