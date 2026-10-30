import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '행과 열의 관계를 비교하세요. 네이티브 테이블을 렌더링합니다: Caption, scope=col 또는 scope=row의 HeaderCell, Cell. 라벨이 있는 스크롤 영역인 Container로 감쌉니다. 숫자 열에는 numeric을, 정렬할 수 있는 열에는 SortHeader를 쓰고, 포인터로 훑어보는 콘솔에는 density="compact"를 설정하세요. 정렬, 검색, 선택 상태는 호출하는 화면이 소유하며, useTableSelection이 행 ID로 선택을 기억합니다. 규칙마다 동작하는 시안은 아래 가이드라인에 있습니다. 행이 바뀌어도 열이 움직이지 않게 하려면 layout="fixed"와 Column 너비를, 콘솔처럼 한 줄짜리 행에는 nowrap과 긴 이름용 Truncate를, Container가 좁아질 때 비켜도 되는 열에는 hideBelow를 쓰세요.',
  avoid: [
    '일반 테이블에 grid role이나 화살표 키 셀 내비게이션을 추가하지 마세요. 대신 네이티브 테이블 의미를 유지하세요.',
    '전체 행 클릭에 의존하지 마세요. 대신 셀 안에 링크, 버튼, checkbox를 두세요.',
    'Row.selected만 믿지 마세요. 시각적일 뿐입니다. 선택 의미를 담는 이름 있는 checkbox와 함께 쓰세요.',
    '모든 셀에 단위를 쓰지 마세요. 대신 헤더에 단위를 적고 numeric을 설정하세요.',
  ],
  keyboard:
    'Tab은 정렬 버튼, 행 선택 checkbox, 액션을 순서대로 이동합니다. 행은 포커스 대상이 아닙니다. 작은 화면에서는 라벨이 있는 영역이 포커스를 받고 가로로 스크롤됩니다. SortHeader는 정렬 중인 열에만 aria-sort를 설정하고, 버튼은 열에 보이는 이름을 그대로 씁니다.',
  props: {
    'Container.label': '스크롤 영역의 접근 가능한 이름',
    'Root.density':
      'default | compact. compact는 셀 여백 4px, 행 사이 2px로 줄입니다',
    'Root.variant':
      'plain | lined | grid | striped. lined는 행 사이에, grid는 행과 열 사이에 표 안쪽으로만 선을 긋고, striped는 한 행 걸러 톤을 깝니다. 열이 많은 넓은 표에서 행을 따라가기 어려울 때가 아니면 plain을 쓰세요',
    'Root.stickyHeader':
      '높이를 제한하고 orientation="both"를 준 Container 안에서 헤더를 고정합니다. 그룹 줄 아래 열 줄처럼 헤더가 여러 줄이면 모든 줄을 각자 자리에 고정합니다. 배경은 --surf-table-surface로 정합니다',
    'Root.stickyColumn':
      'Container가 가로로 스크롤되는 동안 각 행의 이름 같은 첫 열을 제자리에 둡니다. 그쪽 가장자리는 흐려지지 않고, 행이 그 밑으로 지나가면 선이 경계를 표시합니다',
    'Root.layout':
      'auto | fixed: fixed는 열 너비를 내용이 아니라 Column 너비와 헤더 행으로 정해, 행이 스켈레톤이나 메시지로 바뀌어도 열이 움직이지 않습니다. 너비가 없는 열은 남는 폭을 나눕니다',
    'Root.minWidth':
      "표가 좁아질 수 있는 최소 너비(예: '50rem'). 그보다 좁으면 Container가 스크롤합니다",
    'Root.nowrap':
      '콘솔의 행처럼 셀마다 한 줄로 둡니다. 긴 텍스트는 Truncate가 줄임표로 끝냅니다',
    'Columns / Column.width':
      "Root 맨 앞의 네이티브 colgroup과 col. width는 열 너비를 정합니다(예: '8rem')",
    'HeaderCell.hideBelow / Cell.hideBelow':
      'sm | md: Container가 30rem이나 40rem보다 좁을 때 그 열을 비켜, 중요한 열이 자리를 지키게 합니다. 열의 모든 셀(헤더 포함)에 주고, Column 너비는 주지 마세요',
    'Caption / Head / Body / Foot': '네이티브 테이블 요소 속성',
    'HeaderCell.scope / aria-sort': '네이티브 헤더 scope와 정렬 상태',
    'HeaderCell.numeric / Cell.numeric':
      '끝 쪽에 맞추고 고정폭 숫자를 사용합니다',
    'HeaderCell.align / Cell.align': 'start | center | end',
    'SortHeader.sort / onSort':
      '정렬 중인 열에는 ascending | descending, 나머지 열에는 생략. 누르면 onSort가 실행됩니다',
    Truncate:
      '말줄임표로 끝나는 한 줄. measure가 없으면 32ch입니다. 문자열 내용은 title이 됩니다',
    'Message.colSpan':
      '로딩, 빈 상태, 오류, 권한 메시지를 위한 전체 너비 본문 행. hover 강조가 없습니다',
    'Row.selected': '시각적일 뿐; 이름 있는 checkbox가 선택 의미를 담당',
    'Cell.colSpan / headers': '네이티브 테이블 셀 속성',
    useTableSelection:
      'rows, getId, canSelect, selected 또는 defaultSelected, onSelectedChange → pageCheckbox, rowCheckbox(row), isSelected, toggle, clear, hiddenCount',
    'Container.bleed':
      '셀 안쪽 여백만큼 표를 바깥으로 내어, 셀 텍스트가 주변 텍스트와 줄을 맞춤',
  },
}
