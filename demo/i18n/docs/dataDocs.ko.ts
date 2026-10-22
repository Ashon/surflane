import type { DocKo } from './types'

export const dataDocsKo: Record<string, DocKo> = {
  table: {
    usage:
      '행과 열의 관계를 비교하세요. 네이티브 테이블을 렌더링합니다: Caption, scope=col 또는 scope=row의 HeaderCell, Cell. 라벨이 있는 스크롤 영역인 Container로 감쌉니다. 숫자 열에는 numeric을, 정렬할 수 있는 열에는 SortHeader를 쓰고, 포인터로 훑어보는 콘솔에는 density="compact"를 설정하세요. 정렬, 검색, 선택 상태는 호출하는 화면이 소유하며, useTableSelection이 행 ID로 선택을 기억합니다. 규칙마다 동작하는 시안은 아래 가이드라인에 있습니다.',
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
      'Root.stickyHeader':
        '높이를 제한하고 orientation="both"를 준 Container 안에서 헤더를 고정합니다. 배경은 --table-surface로 정합니다',
      'Caption / Head / Body / Foot': '네이티브 테이블 요소 속성',
      'HeaderCell.scope / aria-sort': '네이티브 헤더 scope와 정렬 상태',
      'HeaderCell.numeric / Cell.numeric':
        '끝 쪽에 맞추고 고정폭 숫자를 사용합니다',
      'HeaderCell.align / Cell.align': 'start | center | end',
      'SortHeader.sort / onSort':
        '정렬 중인 열에는 ascending | descending, 나머지 열에는 생략. 누르면 onSort가 실행됩니다',
      Truncate:
        '말줄임표로 끝나는 한 줄, 기본 32ch. 문자열 내용은 title이 됩니다',
      'Message.colSpan':
        '로딩, 빈 상태, 오류, 권한 메시지를 위한 전체 너비 본문 행. hover 강조가 없습니다',
      'Row.selected': '시각적일 뿐; 이름 있는 checkbox가 선택 의미를 담당',
      'Cell.colSpan / headers': '네이티브 테이블 셀 속성',
      useTableSelection:
        'rows, getId, canSelect, selected 또는 defaultSelected, onSelectedChange → pageCheckbox, rowCheckbox(row), isSelected, toggle, clear, hiddenCount',
      'Container.bleed':
        '셀 안쪽 여백만큼 표를 바깥으로 내어, 셀 텍스트가 주변 텍스트와 줄을 맞춤',
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
  stat: {
    usage:
      '대시보드의 핵심 수치를 보여 주세요. 무엇을 재는지, 값, 어떻게 움직였는지, 무엇을 기준으로 하는지를 함께 둡니다. Change는 변화를 숫자로 받아 부호와 화살표를 보이고, 추세 토큰으로 방향에 맞는 색을 칠합니다. 값은 formatNumber, formatCurrency, formatPercent로 서식을 맞추면 모든 화면이 숫자를 같은 방식으로 씁니다.',
    avoid: [
      '방향을 색만으로 보여 주지 마세요. Change는 부호와 화살표를 함께 둡니다. 지우지 마세요.',
      "Caption에 긴 문장을 넣지 마세요. '전일 종가 대비'처럼 기간이나 비교 기준만 쓰세요.",
      '여러 행을 비교해야 하는 값에는 Stat을 쓰지 마세요. 대신 numeric 셀을 쓴 Table을 쓰세요.',
    ],
    keyboard:
      'Stat은 정적인 텍스트입니다. 이름표가 값의 이름이 되는 설명 목록이라 Tab 순서에 들어가지 않습니다. 직접 넣은 링크나 버튼은 각자 포커스를 받습니다.',
    props: {
      'Change.value': '숫자. 부호가 방향을 정합니다',
      'Change.format': '(value) => ReactNode',
      'Change.direction': 'up | down | flat',
      'Change.lowerIsBetter': '하락이 좋은 지표에서 색을 맞바꿉니다',
      'Root / Label / Value / Caption': '네이티브 dl, dt, dd 속성',
    },
  },
  sparkline: {
    usage:
      '계열의 모양을 카드나 표 셀 안에서, 그것이 설명하는 수치 옆에 보여 주세요. 축, 범례, 툴팁이 없으니 label에 무엇을 보여 주고 어떻게 움직였는지 쓰세요. baseline에는 전일 종가 같은 기준값을 줍니다.',
    avoid: [
      '값을 읽어야 하는 곳에는 Sparkline을 쓰지 마세요. 축, 읽기 영역, 표가 있는 Chart를 쓰세요.',
      'label을 빼지 마세요. 선은 이미지라서, 스크린 리더가 듣는 것은 label뿐입니다.',
    ],
    keyboard:
      'Sparkline은 접근 가능한 이름이 있는 이미지입니다. 포커스를 받지 않고 상호작용도 없습니다.',
    props: {
      data: '(number | null)[]. 빠진 값은 선을 끊습니다',
      label: '선의 접근 가능한 이름',
      size: 'small | default | large: 높이 24, 32, 48px',
      baseline: "number | 'first' | 'none'",
      marker: '마지막 값의 점',
      trend: 'auto | up | down | flat | neutral',
      lowerIsBetter: '상승과 하락 색을 맞바꿉니다',
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
