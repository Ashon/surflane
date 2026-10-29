import type { Locale } from '../../i18n'

const en = {
  scopeAndReadiness: 'Scope and readiness',
  scopeIntro:
    'The scope covers the web UI needed for platform development, plus the Base UI component list. The summary and inventory below show actual implementation and documentation readiness.',
  available: 'Available',
  availableDesc: ': has a shared implementation and a working example. ',
  primitiveOnly: 'Primitive only',
  primitiveDesc:
    ": re-exports the upstream primitive. Styling hasn't started. ",
  planned: 'Planned',
  plannedDesc:
    ': still needs a shared implementation or dedicated guide. Product deployment and full accessibility certification are reviewed separately.',
  deliveryWaves: 'Delivery waves',
  coverageInventory: 'Coverage inventory',
  wave0Title: 'Wave 0 — Existing controls and overlays',
  wave0Desc:
    'Move existing inputs, selection, confirmation, panels, and scrolling to their own pages. Pair each behavior with usage guidance.',
  wave1Title: 'Wave 1 — Daily product UI',
  wave1Desc:
    'Refine composition and interaction for Field, Checkbox, Radio, Switch, Tabs, status, tables, empty states, and the sidebar.',
  wave2Title: 'Wave 2 — Rich interaction',
  wave2Desc:
    "Extend searchable selection, numeric input, Toast, data tables, and run flows. Each component's own wave label takes precedence.",
  wave3Title: 'Wave 3 — Specialized UI',
  wave3Desc:
    'Review dedicated behavior and library fit for dates, files, trees, charts, OTP, and command search.',
  layer: 'Layer',
  allLayers: 'All layers',
  wave: 'Wave',
  allWaves: 'All waves',
  waveOption: (n: number) => `Wave ${n}`,
  tableLabel: 'Coverage inventory table',
  caption: (n: number) => `${n} coverage items`,
  itemHeader: 'Item',
  layerCategoryHeader: 'Layer / category',
  basisHeader: 'Basis',
  waveHeader: 'Wave',
  stageHeader: 'Stage',
  definitionOfReady: 'Definition of ready',
  readyItem1:
    'Keep a working example and docs for usage, anti-patterns, states, API, and keyboard on the same page.',
  readyItem2:
    'Check light, dark, and system themes. Check enter motion, instant close, and reduced motion.',
  readyItem3:
    'Confirm labels, initial focus, focus movement and restoration, and error messages. Check 320px width, long Korean and English text, and zoom.',
  readyItem4:
    'Check submit, reset, and server errors in forms. Check portals, nesting, and outside clicks in overlays. Check loading, empty values, and partial failure in data UI.',
  readyItem5:
    'React builds on Base UI, with explicit library composition for specialized features. Astro docs prefer framework-independent CSS. Domain rules stay in the product.',
  researchBoundaries: 'Research and implementation boundaries',
  researchIntro:
    'Base UI provides the accessibility and behavior primitives. Tables, status, the app shell, and document flows build on semantic HTML and shared styles. For dates, trees, charts, and similar features, confirm what Base UI provides before relying on it.',
  researchNote:
    "Component list and packages reviewed as of 2026-10-17, with Base UI 1.9.0. The framework utilities CSP, Direction, mergeProps, and useRender don't count as separate interactive components.",
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    scopeAndReadiness: '범위와 준비 상태',
    scopeIntro:
      '범위는 플랫폼 개발에 필요한 웹 UI와 Base UI 컴포넌트 목록을 포함합니다. 아래 요약과 인벤토리는 실제 구현 및 문서화 준비 상태를 보여줍니다.',
    available: '사용 가능',
    availableDesc: ': 공유 구현과 동작하는 예시가 있습니다. ',
    primitiveOnly: '프리미티브만',
    primitiveDesc:
      ': 업스트림 프리미티브를 다시 내보냅니다. 스타일링은 아직 시작하지 않았습니다. ',
    planned: '계획됨',
    plannedDesc:
      ': 공유 구현 또는 전용 가이드가 아직 필요합니다. 제품 배포와 전체 접근성 인증은 별도로 검토합니다.',
    deliveryWaves: '도입 단계',
    coverageInventory: '커버리지 인벤토리',
    wave0Title: '0단계 — 기존 컨트롤과 오버레이',
    wave0Desc:
      '기존 입력, 선택, 확인, 패널, 스크롤을 각각의 페이지로 옮깁니다. 각 동작에 사용법 안내를 함께 제공합니다.',
    wave1Title: '1단계 — 일상 제품 UI',
    wave1Desc:
      'Field, Checkbox, Radio, Switch, Tabs, 상태, 테이블, 빈 상태, 사이드바의 구성과 인터랙션을 다듬습니다.',
    wave2Title: '2단계 — 풍부한 인터랙션',
    wave2Desc:
      '검색 가능한 선택, 숫자 입력, Toast, 데이터 테이블, 실행 흐름을 확장합니다. 각 컴포넌트의 고유 단계 라벨이 우선합니다.',
    wave3Title: '3단계 — 특화 UI',
    wave3Desc:
      '날짜, 파일, 트리, 차트, OTP, 명령 검색의 전용 동작과 라이브러리 적합성을 검토합니다.',
    layer: '레이어',
    allLayers: '모든 레이어',
    wave: '단계',
    allWaves: '모든 단계',
    waveOption: (n: number) => `${n}단계`,
    tableLabel: '커버리지 인벤토리 테이블',
    caption: (n: number) => `${n}개 커버리지 항목`,
    itemHeader: '항목',
    layerCategoryHeader: '레이어 / 카테고리',
    basisHeader: '근거',
    waveHeader: '단계',
    stageHeader: '준비 상태',
    definitionOfReady: '준비 완료 조건',
    readyItem1:
      '동작하는 예시와 사용법, 안티패턴, 상태, API, 키보드 문서를 같은 페이지에 유지하세요.',
    readyItem2:
      '라이트, 다크, 시스템 테마를 확인하세요. 등장 모션, 즉시 닫힘, 축소 모션을 확인하세요.',
    readyItem3:
      '라벨, 초기 포커스, 포커스 이동과 복원, 오류 메시지를 확인하세요. 320px 너비, 긴 한국어와 영어 텍스트, 확대를 확인하세요.',
    readyItem4:
      '폼에서 제출, 초기화, 서버 오류를 확인하세요. 오버레이에서 포털, 중첩, 외부 클릭을 확인하세요. 데이터 UI에서 로딩, 빈 값, 부분 실패를 확인하세요.',
    readyItem5:
      'React는 Base UI 위에 빌드하며, 특화 기능은 명시적 라이브러리 구성으로 처리합니다. Astro 문서는 프레임워크 독립 CSS를 선호합니다. 도메인 규칙은 제품에 유지됩니다.',
    researchBoundaries: '연구와 구현 경계',
    researchIntro:
      'Base UI는 접근성과 동작 프리미티브를 제공합니다. 테이블, 상태, 앱 셸, 문서 흐름은 의미 있는 HTML과 공유 스타일 위에 만듭니다. 날짜, 트리, 차트 등 유사한 기능은 Base UI가 제공하는 것을 확인한 뒤 사용하세요.',
    researchNote:
      '2026-10-17 기준으로 컴포넌트 목록과 패키지를 검토했으며 Base UI 1.9.0을 사용합니다. 프레임워크 유틸리티 CSP, Direction, mergeProps, useRender는 별도의 인터랙티브 컴포넌트로 치지 않습니다.',
  },
}
