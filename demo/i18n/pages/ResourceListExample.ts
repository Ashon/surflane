import type { Locale } from '../../i18n'

const en = {
  resultState: 'Result state',
  ready: 'Ready',
  loading: 'Loading',
  error: 'Error',
  permissionRestricted: 'Permission restricted',
  initiallyEmpty: 'Initially empty',
  findResourceExamples: 'Find resource examples',
  findResources: 'Find resources',
  searchPlaceholder: 'Name or product…',
  clearSearch: 'Clear search',
  summary: (resources: number, selected: number, visibleSelections: number) =>
    `${resources} resources / ${selected} selected / ${visibleSelections} visible selections`,
  previewState: (mode: string) => `Preview state: ${mode}`,
  loadingPreview: 'Loading resource preview',
  waitingDescription:
    'Waiting for preview resources. Change the result state to continue.',
  loadFailedTitle: 'Resources could not be loaded',
  retainedDescription: 'Your search and selection are retained.',
  retryPreview: 'Retry preview',
  accessUnavailable: 'Resource access unavailable',
  accessDescription:
    "This preview account can't access the resource collection.",
  restoreAccess: 'Restore preview access',
  noRegistered: 'No registered resources',
  addResourcesDescription: 'Add resources before filtering or inspecting them.',
  showSample: 'Show sample resources',
  noMatching: 'No matching resources',
  tryAnotherDescription: 'Try another name or clear the search.',
  resetSearch: 'Reset resource search',
  selectVisibleEditable: 'Select visible editable resources',
  clearSelection: 'Clear selection',
  listLabel: 'Resource examples',
  selectItem: (name: string) => `Select ${name}`,
  readOnlyPreview: 'Read-only preview: review and selection unavailable.',
  reviewed: 'Reviewed',
  actionsFor: (name: string) => `Actions for ${name}`,
  actions: 'Actions',
  markReviewed: 'Mark reviewed',
  markedReviewed: (name: string) =>
    `Marked ${name} as reviewed in this local preview.`,
  resetReview: 'Reset review',
  reviewReset: (name: string) =>
    `Reset review for ${name} in this local preview.`,
  footer:
    "Local design examples. Title links open the related documentation. Review actions don't contact product services.",
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    resultState: '결과 상태',
    ready: '준비됨',
    loading: '로드 중',
    error: '오류',
    permissionRestricted: '권한 제한됨',
    initiallyEmpty: '처음부터 비어 있음',
    findResourceExamples: '리소스 예시 찾기',
    findResources: '리소스 찾기',
    searchPlaceholder: '이름 또는 제품…',
    clearSearch: '검색 지우기',
    summary: (resources, selected, visibleSelections) =>
      `${resources}개 리소스 / ${selected}개 선택 / ${visibleSelections}개 표시 선택`,
    previewState: (mode: string) => `미리보기 상태: ${mode}`,
    loadingPreview: '리소스 미리보기 로드 중',
    waitingDescription:
      '미리보기 리소스를 기다리는 중입니다. 결과 상태를 변경하여 계속하세요.',
    loadFailedTitle: '리소스를 불러올 수 없습니다',
    retainedDescription: '검색과 선택은 유지됩니다.',
    retryPreview: '미리보기 다시 시도',
    accessUnavailable: '리소스 액세스 사용 불가',
    accessDescription:
      '이 미리보기 계정은 리소스 컬렉션에 액세스할 수 없습니다.',
    restoreAccess: '미리보기 액세스 복원',
    noRegistered: '등록된 리소스 없음',
    addResourcesDescription: '필터링하거나 검사하기 전에 리소스를 추가하세요.',
    showSample: '샘플 리소스 표시',
    noMatching: '일치하는 리소스 없음',
    tryAnotherDescription: '다른 이름을 시도하거나 검색을 지우세요.',
    resetSearch: '리소스 검색 초기화',
    selectVisibleEditable: '표시된 편집 가능한 리소스 선택',
    clearSelection: '선택 해제',
    listLabel: '리소스 예시',
    selectItem: (name: string) => `${name} 선택`,
    readOnlyPreview: '읽기 전용 미리보기: 검토와 선택이 불가능합니다.',
    reviewed: '검토됨',
    actionsFor: (name: string) => `${name} 액션`,
    actions: '액션',
    markReviewed: '검토됨으로 표시',
    markedReviewed: (name: string) =>
      `${name}을(를) 이 로컬 미리보기에서 검토됨으로 표시했습니다.`,
    resetReview: '검토 초기화',
    reviewReset: (name: string) =>
      `${name}의 검토를 이 로컬 미리보기에서 초기화했습니다.`,
    footer:
      '로컬 디자인 예시입니다. 제목 링크는 관련 문서를 엽니다. 검토 액션은 제품 서비스에 연결되지 않습니다.',
  },
}
