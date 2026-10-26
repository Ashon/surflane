import type { KbdLabels } from '@surflane/ui'
import type { Locale } from '../../i18n'

const en = {
  switchThemeLabel: 'Switch theme',
  switchThemeDescription: 'Cycle through Light, Dark, and System',
  actionCategory: 'Action',
  noCommandExecuted: 'No command executed.',
  appearanceUpdated: 'Appearance updated. The catalog page is unchanged.',
  intro:
    'Search catalog pages or change the appearance. Ctrl+K or ⌘K opens search while this page is mounted. Text fields keep their own shortcuts.',
  searchDocumentation: 'Search documentation',
  closeCommandSearch: 'Close command search',
  commandSearchTitle: 'Command search',
  commandSearchDescription:
    "Type a name, purpose, or category. Choose with the arrow keys, then press Enter to open. Planned pages can't be opened.",
  searchPagesAndActions: 'Search pages and actions',
  searchPlaceholder: 'Name, purpose, category…',
  searchResultsCount: 'Search results count',
  results: (n: number) => `${n} ${n === 1 ? 'result' : 'results'}`,
  commandResults: 'Command results',
  noResults: 'No results. Try a shorter name or another category.',
  pagesAndActions: 'Pages and actions',
  planned: 'Planned',
  keyChoose: 'Choose',
  keyOpen: 'Open',
  keyClose: 'Close',
  keyLabels: {} as Partial<KbdLabels>,
  commandResult: 'Command result',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    switchThemeLabel: '테마 전환',
    switchThemeDescription: '라이트, 다크, 시스템 테마를 순환합니다.',
    actionCategory: '액션',
    noCommandExecuted: '실행된 명령이 없습니다.',
    appearanceUpdated:
      '외관이 업데이트되었습니다. 카탈로그 페이지는 변경되지 않습니다.',
    intro:
      '카탈로그 페이지를 검색하거나 외관을 변경하세요. 이 페이지가 마운트된 동안 Ctrl+K 또는 ⌘K로 검색이 열립니다. 텍스트 필드는 자체 단축키를 유지합니다.',
    searchDocumentation: '문서 검색',
    closeCommandSearch: '명령 검색 닫기',
    commandSearchTitle: '명령 검색',
    commandSearchDescription:
      '이름, 용도 또는 카테고리를 입력하세요. 화살표 키로 선택한 후 Enter를 눌러 엽니다. 계획된 페이지는 열 수 없습니다.',
    searchPagesAndActions: '페이지 및 액션 검색',
    searchPlaceholder: '이름, 용도, 카테고리…',
    searchResultsCount: '검색 결과 수',
    results: (n: number) => `${n}개 결과`,
    commandResults: '명령 결과',
    noResults: '결과가 없습니다. 더 짧은 이름이나 다른 카테고리를 시도하세요.',
    pagesAndActions: '페이지 및 액션',
    planned: '계획됨',
    keyChoose: '선택',
    keyOpen: '열기',
    keyClose: '닫기',
    keyLabels: { up: '위쪽 화살표', down: '아래쪽 화살표' },
    commandResult: '명령 결과',
  },
}
