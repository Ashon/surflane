import type { Locale } from '../../i18n'

const en = {
  filterPreviewResources: 'Filter preview resources',
  searchResources: 'Search resources',
  nameOrIdentifier: 'Name or identifier…',
  product: 'Product',
  filterProduct: 'Filter product',
  state: 'State',
  filterState: 'Filter state',
  clearAllFilters: 'Clear all filters',
  appliedFilters: 'Applied filters',
  removeSearchFilter: (value: string) =>
    `Remove search filter: Search: ${value}`,
  searchValue: (value: string) => `Search: ${value}`,
  removeProductFilter: (label: string) => `Remove product filter: ${label}`,
  removeStateFilter: (label: string) => `Remove state filter: ${label}`,
  allProducts: 'All products',
  workspace: 'Workspace',
  inventory: 'Inventory',
  documentation: 'Documentation',
  allStates: 'All states',
  ready: 'Ready',
  pending: 'Pending',
  summary: (visible: number, total: number, active: number) =>
    `${visible} of ${total} resources / ${active} active filters`,
  noMatchingResources: 'No matching resources',
  tryDifferentSearchTerm: 'Try a different search term or filter combination.',
  resetFilters: 'Reset filters',
  footer:
    'Filters apply immediately in this local example. The product connects server requests, URL sync, and permissions.',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    filterPreviewResources: '미리보기 리소스 필터',
    searchResources: '리소스 검색',
    nameOrIdentifier: '이름 또는 식별자…',
    product: '제품',
    filterProduct: '제품 필터',
    state: '상태',
    filterState: '상태 필터',
    clearAllFilters: '모든 필터 지우기',
    appliedFilters: '적용된 필터',
    removeSearchFilter: (value: string) => `검색 필터 제거: 검색: ${value}`,
    searchValue: (value: string) => `검색: ${value}`,
    removeProductFilter: (label: string) => `제품 필터 제거: ${label}`,
    removeStateFilter: (label: string) => `상태 필터 제거: ${label}`,
    allProducts: '모든 제품',
    workspace: '워크스페이스',
    inventory: '인벤토리',
    documentation: '문서',
    allStates: '모든 상태',
    ready: '준비됨',
    pending: '보류 중',
    summary: (visible: number, total: number, active: number) =>
      `${visible} / ${total}개 리소스 / ${active}개 활성 필터`,
    noMatchingResources: '일치하는 리소스 없음',
    tryDifferentSearchTerm: '다른 검색어나 필터 조합을 시도하세요.',
    resetFilters: '필터 초기화',
    footer:
      '이 로컬 예시에서는 필터가 즉시 적용됩니다. 제품은 서버 요청, URL 동기화, 권한을 연결합니다.',
  },
}
