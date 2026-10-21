import type { Locale } from '../../i18n'

const en = {
  title: 'Design tokens',
  intro: (n: number) =>
    `${n} tokens generated from the CSS source. Search by name, role, or reference to see each computed value for the current theme and screen size.`,
  search: 'Search',
  searchAriaLabel: 'Search design tokens',
  searchPlaceholder: 'e.g. --ink, typography, dialog',
  category: 'Category',
  categoryAriaLabel: 'Token category',
  allCategories: 'All categories',
  count: (n: number, shown: number) => `${n} matching tokens / ${shown} shown`,
  sourceAndReferences: 'Source and references',
  copyLabel: (name: string) => `Copy ${name}`,
  copy: 'Copy',
  copied: 'Copied',
  unavailable: 'Unavailable',
  noMatching: 'No matching tokens. Try a different search term or category.',
  showMore: 'Show more tokens',
  usageNotePrefix:
    "Don't copy raw values into product code. Reference them with ",
  usageNoteSuffix:
    '. Use semantic tokens for color and status, and scale tokens for size and spacing.',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    title: '디자인 토큰',
    intro: (n: number) =>
      `${n}개의 토큰이 CSS 소스에서 생성되었습니다. 이름, 역할 또는 참조로 검색하면 현재 테마와 화면 크기의 계산된 값을 볼 수 있습니다.`,
    search: '검색',
    searchAriaLabel: '디자인 토큰 검색',
    searchPlaceholder: '예: --ink, typography, dialog',
    category: '카테고리',
    categoryAriaLabel: '토큰 카테고리',
    allCategories: '모든 카테고리',
    count: (n: number, shown: number) =>
      `${n}개 일치하는 토큰 / ${shown}개 표시`,
    sourceAndReferences: '소스와 참조',
    copyLabel: (name: string) => `${name} 복사`,
    copy: '복사',
    copied: '복사됨',
    unavailable: '사용 불가',
    noMatching:
      '일치하는 토큰이 없습니다. 다른 검색어나 카테고리를 사용해 보세요.',
    showMore: '토큰 더 보기',
    usageNotePrefix: '원시 값을 제품 코드에 복사하지 마세요. ',
    usageNoteSuffix:
      '으로 참조하세요. 색과 상태에는 시맨틱 토큰을, 크기와 간격에는 스케일 토큰을 사용하세요.',
  },
}
