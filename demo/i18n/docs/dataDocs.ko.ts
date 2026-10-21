import type { DocKo } from './types'

export const dataDocsKo: Record<string, DocKo> = {
  table: {
    usage:
      '행과 열의 관계를 비교하세요. 네이티브 테이블을 렌더링합니다: Caption, scope=col 또는 scope=row의 HeaderCell, Cell. 라벨이 있는 스크롤 영역인 Container로 감쌉니다. 정렬, 검색, 선택 상태는 호출하는 화면이 소유합니다.',
    avoid: [
      '일반 테이블에 grid role이나 화살표 키 셀 내비게이션을 추가하지 마세요. 대신 네이티브 테이블 의미를 유지하세요.',
      '전체 행 클릭에 의존하지 마세요. 대신 셀 안에 링크, 버튼, checkbox를 두세요.',
      'Row.selected만 믿지 마세요. 시각적일 뿐입니다. 선택 의미를 담는 이름 있는 checkbox와 함께 쓰세요.',
    ],
    keyboard:
      'Tab은 정렬 버튼, 행 선택 checkbox, 액션을 순서대로 이동합니다. 행은 포커스 대상이 아닙니다. 작은 화면에서는 라벨이 있는 영역이 포커스를 받고 가로로 스크롤됩니다. 정렬된 HeaderCell에 aria-sort를 설정하세요.',
    props: {
      'Container.label': '스크롤 영역의 접근 가능한 이름',
      'Root / Caption / Head / Body / Foot': '네이티브 테이블 요소 속성',
      'HeaderCell.scope / aria-sort': '네이티브 헤더 scope와 정렬 상태',
      'Row.selected': '시각적일 뿐; 이름 있는 checkbox가 선택 의미를 담당',
      'Cell.colSpan / headers': '네이티브 테이블 셀 속성',
    },
  },
  list: {
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
  },
  'inline-message': {
    usage:
      '현재 작업에 대한 안내, 오류, 경고를 원인과 다음 단계와 함께 설명하세요. 정적 메시지는 라이브 영역이 아닙니다. 비동기 변경만 알리세요. role=status를 쓰고, 긴급할 때는 role=alert를 쓰세요.',
    avoid: [
      '톤을 색으로만 구분하지 마세요. 대신 Title과 Description에 상태를 밝히세요.',
      '페이지 로드 시 모든 메시지를 alert로 알리지 마세요. 정적 메시지는 알리지 않은 채 두세요.',
      '재시도가 실제 결과를 보장한다고 암시하지 마세요. 대신 재시도가 무엇을 시도하는지 말하세요.',
    ],
    keyboard:
      '메시지는 포커스를 받지 않습니다. Tab은 액션 버튼에 도달하고 Enter 또는 Space가 이를 활성화합니다. Icon은 장식입니다. Title과 Description이 상태를 전달합니다. Root.role은 호출하는 쪽이 설정합니다.',
    props: {
      'Root.role': '네이티브 role; 라이브 알림을 신중히 선택하세요',
      'Icon.children': '사용자 지정 장식 아이콘',
      'Title / Description / Actions': '네이티브 strong / p / div 속성',
    },
  },
  'empty-state': {
    usage:
      '보여줄 것이 없는 이유를 설명하고 가능한 다음 단계를 제시하세요. 첫 사용, 검색 결과 없음, 권한 부족을 구분하세요. 다른 콘텐츠가 있으면 화면 전체를 대체하지 말고 관련 영역에 상태를 보여주세요.',
    avoid:
      '오류를 빈 성공 상태로 제시하지 마세요. 대신 InlineMessage를 사용하세요. 권한이 없는 것을 만들도록 유도하지 마세요. 수행할 수 없는 액션을 기본 버튼으로 만들지 마세요. 대신 권한 안내를 제공하세요.',
    keyboard:
      '포커스를 받거나 라이브 영역을 만들지 않습니다. Title.level을 주변 제목 위계에 맞게 설정하세요. 검색 지우기, 항목 만들기, 권한 안내를 명확히 이름 붙인 버튼이나 링크로 제공하세요.',
    props: {
      Root: '네이티브 div 속성; 자동 role이나 포커스 없음',
      Title: '네이티브 heading 속성 + level (2–6)',
      Icon: '네이티브 div 속성; 장식 SVG에는 aria-hidden 설정',
      'Description / Actions': '네이티브 p / div 속성',
    },
  },
}
