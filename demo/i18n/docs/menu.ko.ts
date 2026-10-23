import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '현재 위치에서 사용 가능한 액션을 나열하세요. 항목을 선택하면 해당 액션이 실행됩니다.',
  avoid: '폼 값을 고르는 데 Menu를 사용하지 마세요. 대신 Select를 사용하세요.',
  keyboard:
    '화살표 키, Home, End 및 타이핑으로 항목 사이를 이동합니다. Enter 또는 Space로 항목을 활성화합니다. Escape로 메뉴를 닫습니다.',
  props: {
    'Content.align / sideOffset': 'Base UI positioner props',
    'Item.disabled / onClick': '사용 가능 여부와 액션',
  },
}
