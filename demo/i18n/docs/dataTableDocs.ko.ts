import type { DocKo } from './types'

export const dataTableDocsKo: Record<string, DocKo> = {
  'data-table': {
    usage: [
      '비교 작업에 Table, FilterBar, Checkbox, Menu, Pagination을 조합하세요.',
      '데이터를 필터 → 안정 정렬 → 페이지네이션 순서로 처리하세요. 검색, 정렬, 페이지 크기를 바꾸면 첫 페이지로 돌아갑니다.',
      '선택을 행 ID로 유지하세요. 헤더 checkbox는 현재 페이지의 관리 가능한 행만 선택합니다.',
      '현재 페이지 밖에 있는 선택 수를 알리세요. 일괄 액션은 숨겨진 선택을 포함한 명시적 선택 집합에 적용됩니다.',
      'Columns 메뉴는 필수 name 열을 항상 유지합니다. 정렬된 열을 숨기면 정렬이 name 오름차순으로 재설정됩니다.',
    ],
    avoid: [
      '전체 테이블을 ARIA grid로 만들지 마세요. 네이티브 테이블 의미를 유지하세요.',
      '전체 행 클릭에 내비게이션을 숨기지 마세요. Checkbox, name 링크, 정렬 버튼은 각자 독립적으로 작동합니다.',
      '보이지 않는 서버 결과를 자동 선택하지 마세요.',
      '가상화나 서버 전체 선택을 가정하지 마세요. 둘 다 구현되지 않았으며 예시는 작은 로컬 데이터만 다룹니다.',
      '큰 데이터셋을 로컬에서 필터링, 정렬, 페이지네이션하지 마세요. 서버 측 필터링, 정렬, 페이지네이션과 URL 상태, 요청 취소, 권한, 멱등 일괄 변경, 선택 검증은 제품이 소유합니다.',
    ],
    keyboard: [
      'Tab, Shift+Tab, Enter, Space는 컨트롤을 작동시킵니다. 각 정렬 컨트롤은 헤더 셀 안의 버튼입니다.',
      '검색과 페이지 변경은 사용 중인 컨트롤에 포커스를 유지합니다. 로딩이 끝나거나, 재시도, 복원된 접근, 지워진 검색 후에는 검색 입력으로 포커스가 돌아갑니다.',
      'Columns 메뉴는 Base UI의 화살표 키와 Escape를 따르며, 트리거로 포커스를 돌려보냅니다.',
      '모바일에서는 공유 ScrollArea가 가로 오버플로를 처리합니다.',
      '테이블은 scope=col과 scope=row로 네이티브 의미를 유지합니다. 정렬된 열만 aria-sort를 가집니다.',
    ],
    props: {
      'Processing order':
        'query/product 필터 → ID tie-break의 안정 정렬 → 클램프된 페이지',
      Selection:
        '안정적인 행 ID; 현재 페이지 관리 가능 전체 선택; 숨겨진 선택 알림',
      Columns: 'name 필수; product와 environment는 독립적으로 토글',
      Sort: 'name / product / environment, 오름차순 / 내림차순; 활성 정렬을 숨기면 name 복원',
      'Page size':
        '3 / 5 / 10; 변경 시 페이지 재설정; 결과 없음은 빈 상태 표시',
      'Preview state':
        'ready / loading / error / permission / empty; 수동 복구, 서비스 호출 없음',
    },
  },
}
