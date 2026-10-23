import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '계층을 탐색하고 리소스를 선택하세요. Tree는 Headless Tree의 명시적 ARIA 계층 속성을 TanStack Virtual과 결합해 보이는 행과 포커스된 행만 렌더링합니다. 포커스와 선택은 분리되어 있으며 확장 버튼은 자식만 보이거나 숨깁니다. 예시는 제어된 선택과 확장, 단일 및 다중 선택, RTL, 비활성 리소스, 빈 상태, 10,100개 노드를 다룹니다.',
  avoid: [
    '일반 내비게이션 목록에 tree role을 추가하지 마세요. 대신 링크 목록이 있는 nav를 사용하세요.',
    '변경 가능하거나 부분적으로 로드된 데이터를 전달하지 마세요. 대신 고유 ID가 있는 이미 로드된 불변 데이터를 전달하세요.',
    'Tree가 데이터를 가져오거나 저장하리라 기대하지 마세요. 서버 요청, 권한 확인, 비동기 자식 로딩, 데이터 이동, 영속성은 제품이 소유합니다.',
    '화살표 키가 비활성 노드를 건너뛰리라 기대하지 마세요. 발견 가능성을 위해 포커스를 받지만 선택하거나 확장할 수는 없습니다.',
    '행 높이를 rowHeight와 다르게 하지 마세요. 가상화 계산이 여기에 의존합니다. 긴 이름은 시각적으로 잘리며 전체 접근 가능한 이름과 title을 유지합니다.',
    '가상화가 전송 데이터 크기를 줄이리라 기대하지 마세요. 렌더링되는 행 수만 제한합니다.',
  ],
  keyboard: [
    'Tab은 단일 현재 treeitem에서 트리로 들어갑니다.',
    'Up과 Down은 보이는 항목을 이동합니다. Home과 End는 첫 번째와 마지막 항목으로 갑니다.',
    'Right는 그룹을 확장한 뒤 첫 번째 자식으로 이동하며, 리프에서는 아무것도 하지 않습니다. Left는 그룹을 접거나 부모로 이동하며, RTL에서는 Left와 Right가 바뀝니다.',
    '*는 같은 레벨의 모든 그룹을 확장합니다.',
    '문자를 빠르게 입력하면 해당 접두사로 시작하는 보이는 이름으로 이동합니다. 같은 문자를 반복하면 다음 일치 항목으로 이동합니다.',
    'Enter 또는 Space는 선택합니다. 화살표 키로 포커스를 이동해도 선택은 바뀌지 않습니다.',
    '다중 선택에서 Space 또는 클릭은 토글, Shift는 범위 선택, Ctrl/Meta+A는 보이는 선택 가능한 모든 노드를 선택합니다.',
    '가상화된 행으로 이동하면 실제 DOM 포커스와 내부 스크롤 위치가 함께 이동합니다.',
  ],
  props: {
    'nodes / label':
      'readonly TreeNode[]; 고유 문자열 ID, labels, 선택적 children/disabled; 접근 가능한 트리 이름',
    'expandedIds / defaultExpandedIds':
      '제어 또는 초기 확장 분기 ID; 잘못된 ID는 무시',
    'selectedIds / defaultSelectedIds':
      '제어 또는 초기 선택; 비활성/누락 ID는 무시',
    'onExpandedIdsChange / onSelectedIdsChange':
      '다음 정규화된 ID 배열; 선택은 포커스와 분리',
    'virtualized / height / rowHeight':
      '포커스된 행을 유지하는 윈도우 행; 고정 픽셀 크기',
    'dir / className': 'RTL 키/들여쓰기 방향; scroll-root 클래스',
    labels:
      '트리가 보여 주거나 이름 붙이는 텍스트: expand(label), collapse(label), scrollArea(label), empty. emptyLabel은 deprecated입니다',
  },
}
