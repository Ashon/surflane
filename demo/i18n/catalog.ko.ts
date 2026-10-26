import type { Stage } from '../catalog'
// Korean overrides for catalog data, keyed by page path. Missing keys fall back to English.
export const catalogKo: {
  names: Record<string, string>
  summaries: Record<string, string>
  groups: Record<string, string>
  stages: Record<Stage, string>
} = {
  names: {
    '/foundations/layout': '레이아웃',
    '/foundations/hierarchy': '시각 위계',
    '/foundations/typography': '타이포그래피',
    '/tokens': '디자인 토큰',
    '/foundations/color': '색',
    '/foundations/iconography': '아이콘',
    '/foundations/interaction': '인터랙션 상태',
    '/foundations/motion': '모션',
    '/foundations/themes': '테마',
    '/foundations/accessibility': '접근성',
    '/foundations/content': '콘텐츠와 현지화',
    '/foundations/layers': '레이어',
    '/patterns/app-shell': '앱 셸 / 사이드바',
    '/patterns/page-header': '페이지 헤더',
    '/patterns/filter-bar': '검색 / 필터 바',
    '/patterns/dashboard': '대시보드',
    '/patterns/data-table': '데이터 테이블',
    '/patterns/resource-list': '리소스 목록',
    '/patterns/inline-confirmation': '인라인 확인',
    '/patterns/form-workflow': '폼 워크플로',
    '/patterns/async-job': '비동기 작업 / 실행 상세',
    '/patterns/documentation': '문서 페이지',
    '/patterns/command-search': '명령 검색',
    '/patterns/error-recovery': '오류 / 권한 / 오프라인',
    '/patterns/responsive-navigation': '반응형 내비게이션',
  },
  summaries: {
    '/foundations/layout': '컨테이너, 그리드, 간격, 컴포넌트 크기를 정합니다.',
    '/foundations/hierarchy':
      '면, 높이, 선, 점을 구조에서 세부 순서로 정합니다.',
    '/foundations/typography':
      '글꼴, 타입 역할, 줄 길이, 한국어 조판 규칙을 정합니다.',
    '/tokens': '테마별 토큰 값, 별칭, 소스를 나열합니다.',
    '/foundations/color': '색 역할, 대비 기준, 팔레트 만드는 법을 정합니다.',
    '/foundations/iconography':
      '아이콘 크기, 획, 방향, 접근 가능한 이름을 정합니다.',
    '/foundations/interaction':
      '컨트롤이 호버, 누름, 포커스, 선택, 대기 상태를 보여 주는 방식을 정합니다.',
    '/foundations/motion':
      '모든 전환의 지속 시간, 이징, 모션 줄이기를 정합니다.',
    '/foundations/themes':
      '페이지나 영역에 라이트나 다크를 적용하고, 직접 테마를 만듭니다.',
    '/foundations/accessibility':
      '모든 화면이 지킬 WCAG 2.2 AA 기준을 정합니다.',
    '/foundations/content': '인터페이스 문구, 숫자와 날짜 형식을 정합니다.',
    '/foundations/layers':
      '앱 크롬, 대화상자, 팝업, 툴팁의 쌓임 순서를 정합니다.',
    '/components/button': '명확한 라벨로 작업을 실행합니다.',
    '/components/input': '짧은 텍스트와 식별자를 입력받습니다.',
    '/components/select': '고정 목록에서 옵션 하나를 선택합니다.',
    '/components/native-select':
      '기존 HTML option 마크업을 공유 Select에 연결합니다.',
    '/components/field': '라벨, 도움말 텍스트, 오류, 값을 연결합니다.',
    '/components/fieldset': '관련 입력을 범례 아래에 그룹화합니다.',
    '/components/form': '검증과 제출 결과를 알려 줍니다.',
    '/components/textarea': '여러 줄 설명을 입력받습니다.',
    '/components/checkbox': '독립 옵션을 원하는 만큼 선택합니다.',
    '/components/checkbox-group':
      '여러 선택을 전체 선택 체크박스에 연결합니다.',
    '/components/radio-group': '상호 배타적 옵션 중 하나를 선택합니다.',
    '/components/switch': '즉시 적용되는 설정을 켜고 끕니다.',
    '/components/toggle': '눌림과 해제 상태를 전환합니다.',
    '/components/toggle-group': '도구 모드와 표시 옵션을 선택합니다.',
    '/components/combobox': '옵션 목록을 검색하고 하나를 선택합니다.',
    '/components/autocomplete': '입력한 텍스트를 유지하면서 제안을 탐색합니다.',
    '/components/number-field': '증가·감소로 숫자 범위를 조절합니다.',
    '/components/slider': '범위 안에서 값을 조절합니다.',
    '/components/otp-field': '슬롯으로 나뉜 일회용 코드를 입력받습니다.',
    '/components/date-picker':
      '로케일별 형식으로 날짜, 시간, 범위를 입력받습니다.',
    '/components/time-range-picker':
      '모니터링 화면이 보여 줄 지금부터의 기간과 새로 고침 간격을 고릅니다.',
    '/components/file-upload': '파일 제한과 업로드 상태를 설명합니다.',
    '/components/popover': '트리거 옆에서 보조 작업을 제공합니다.',
    '/components/menu': '현재 컨텍스트의 작업을 모아 둡니다.',
    '/components/context-menu':
      '오른쪽 클릭이나 길게 누르면 작업을 열고, 보이는 메뉴 폴백을 제공합니다.',
    '/components/tooltip': '포커스와 호버 시 짧은 보조 설명을 보여 줍니다.',
    '/components/preview-card': '링크 대상을 미리 봅니다.',
    '/components/dialog': '전체 주의가 필요한 독립 작업을 엽니다.',
    '/components/alert-dialog':
      '데이터를 잃을 수 있는 작업 전에 명시적 응답을 요구합니다.',
    '/components/sheet': '한쪽에 고정된 상세 패널을 엽니다.',
    '/components/drawer': '스와이프로 닫히는 작업 패널을 엽니다.',
    '/components/tabs': '같은 컨텍스트에서 패널을 전환합니다.',
    '/components/accordion': '헤딩에 연결된 세부 내용을 펼칩니다.',
    '/components/collapsible': '한 섹션의 세부 내용을 접고 펼칩니다.',
    '/components/navigation-menu': '관련 페이지를 계층적으로 탐색합니다.',
    '/components/menubar': '여러 작업 메뉴를 한 줄에서 탐색합니다.',
    '/components/toolbar': '키보드로 오갈 수 있게 관련 도구를 묶습니다.',
    '/components/link': '명확한 대상으로 이동합니다.',
    '/components/breadcrumbs': '현재 위치와 상위 경로를 보여 줍니다.',
    '/components/pagination': '큰 결과 집합을 페이지로 나눕니다.',
    '/components/bottom-navigation':
      '휴대폰의 주요 목적지를 화면 아래쪽에 둡니다.',
    '/components/avatar': '사용자와 그룹 이미지를 폴백과 함께 보여 줍니다.',
    '/components/badge': '상태를 색, 아이콘, 텍스트로 함께 보여 줍니다.',
    '/components/description-list':
      '리소스의 속성을 용어와 값으로 보여 줍니다.',
    '/components/banner':
      '앱 셸 전체에 걸쳐 제품 전체의 상태를 모두에게 알립니다.',
    '/components/timeline':
      '배포 기록이나 감사 로그처럼 시간 순서의 사건을 보여 줍니다.',
    '/components/segmented-control':
      '기간이나 방향처럼 몇 개 중 값 하나를 고릅니다.',
    '/components/kbd': '키나 단축키를 이 플랫폼이 쓰는 대로 적습니다.',
    '/components/card': '관련 정보만 한 표면에 그룹화합니다.',
    '/components/table': '정렬된 행과 열로 정보를 비교합니다.',
    '/components/code': '긴 식별자와 코드를 복사 동작과 함께 표시합니다.',
    '/components/syntax-highlighter':
      '각 언어의 코드를 안전하고 읽기 쉽게 렌더링합니다.',
    '/components/markdown': '문서, 코드, 표를 공유 읽기 스타일로 렌더링합니다.',
    '/components/list': '반복 콘텐츠와 작업을 정렬합니다.',
    '/components/stat': '핵심 수치를 변화와 기준 설명과 함께 보여 줍니다.',
    '/components/sparkline': '카드나 표 셀 안에 작은 추이선을 그립니다.',
    '/components/bar-list':
      '이름 붙은 값을 가장 큰 값에 비례한 막대와 함께 순위대로 늘어놓습니다.',
    '/components/tree': '중첩 리소스를 키보드로 탐색합니다.',
    '/components/chart': '단위, 범례, 대체 테이블과 함께 추세를 보여 줍니다.',
    '/components/scroll-area': '레이아웃 안에 가로·세로 스크롤을 추가합니다.',
    '/components/separator': '전체 너비 또는 안쪽 경계를 그립니다.',
    '/components/progress': '작업 완료 정도나 실행 중임을 보여 줍니다.',
    '/components/meter': '알려진 범위 안의 측정값을 보여 줍니다.',
    '/components/toast': '흐름을 막지 않고 작업 결과를 알립니다.',
    '/components/inline-message':
      '현재 컨텍스트에서 정보, 경고, 오류를 설명합니다.',
    '/components/spinner': '짧은 작업의 진행을 나타냅니다.',
    '/components/skeleton': '로드 중 콘텐츠 구조를 보여 줍니다.',
    '/components/empty-state': '결과가 없는 이유와 다음 단계를 설명합니다.',
    '/patterns/app-shell':
      '접을 수 있는 내비게이션, 위쪽 브랜드와 테마, 아래쪽 계정으로 콘텐츠를 구성합니다.',
    '/patterns/page-header':
      '브레드크럼, 제목, 설명, 작업을 정렬하고 간격을 둡니다.',
    '/patterns/filter-bar': '검색, 필터, 적용 상태, 초기화를 연결합니다.',
    '/patterns/dashboard':
      '데이터 패널을 제목, 상태, 새로 고침과 함께 반응형 격자에 놓습니다.',
    '/patterns/data-table':
      '선택, 정렬, 필터, 열 설정, 페이지네이션을 연결합니다.',
    '/patterns/resource-list':
      '항목 패딩, 호버 영역, 상태, 상세 링크를 연결합니다.',
    '/patterns/inline-confirmation':
      '트리거한 컨트롤 옆에서 가벼운 작업을 확인합니다.',
    '/patterns/form-workflow':
      '입력, 검증, 서버 오류, 대기와 성공 상태를 연결합니다.',
    '/patterns/async-job':
      '대기, 실행, 취소, 부분 실패 상태를 빌드 로그와 연결합니다.',
    '/patterns/documentation':
      '본문, 목차, 코드, 콜아웃, 언어 전환을 구성합니다.',
    '/patterns/command-search':
      '키보드로 빠른 탐색, 명령, 검색 결과를 연결합니다.',
    '/patterns/error-recovery':
      '실패, 접근 제한, 연결 끊김, 복구 경로를 설명합니다.',
    '/patterns/responsive-navigation':
      '데스크톱 내비게이션을 모바일에서 접고 펼칩니다.',
  },
  groups: {
    Foundations: '파운데이션',
    Style: '스타일',
    Behavior: '동작',
    Standards: '공통 기준',
    Actions: '액션',
    Forms: '폼',
    Selection: '선택',
    Overlays: '오버레이',
    Navigation: '내비게이션',
    'Data display': '데이터 표시',
    Structure: '구조',
    Feedback: '피드백',
    Patterns: '패턴',
  },
  stages: {
    available: '사용 가능',
    primitive: '프리미티브만',
    planned: '계획됨',
  },
}
