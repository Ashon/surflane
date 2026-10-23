import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '반복되는 독립 리소스나 기록 항목 집합을 보여주세요. 본문 텍스트는 Content에, 상태와 액션은 Actions에 두세요. 각 Item은 호버 표면에 가로 16px, 세로 12px 패딩을 줍니다.',
  avoid: [
    '항목 사이에 구분선을 추가하거나 카드를 중첩하지 마세요. 대신 List의 간격과 호버 표면이 항목을 분리하게 하세요.',
    '전체 항목 클릭에 의존하지 마세요. 목적을 이름으로 드러내는 링크와 버튼을 사용하세요.',
    'List를 Listbox 선택 위젯으로 사용하지 마세요. 옵션 선택에는 Select, Combobox, CheckboxGroup을 사용하세요.',
  ],
  keyboard:
    '내부 액션만 Tab 순서에 들어갑니다. Root는 네이티브 목록 구조를 유지합니다. 작은 화면에서는 Actions가 다음 줄로 이동합니다.',
  props: {
    Root: 'role=list인 네이티브 ul 속성',
    Item: '네이티브 li 속성',
    'Item.selected': '시각적일 뿐; Checkbox가 체크 의미를 담당',
    'Content / Title / Actions': '네이티브 div 속성',
    Description: '네이티브 p 속성',
  },
}
