import type { Locale } from '../../i18n'

const en = {
  principles: [
    [
      'Reference a token, never its value.',
      'Write `var(--surf-ink)`, not the color it resolves to, so themes and screen sizes reach your code.',
    ],
    [
      'Choose a token by its role.',
      'Role tokens such as `--surf-ink-muted`, `--surf-canvas`, and `--surf-space-4` say what a value is for, and each theme decides how it looks.',
    ],
    [
      'Tune a component through its own tokens.',
      'Component tokens such as `--surf-control-height` alias role tokens, so one override reaches every part without restyling internals.',
    ],
  ],
  sections: {
    reading: 'Reading a token',
    tokens: 'All tokens',
  },
  reading: [
    "Each row shows a token's name, category, and purpose, then its value in the current theme and window width. Switch the theme or resize the window, and the values follow.",
    'Source and references lists every declaration with its context, file, and line, and links the tokens it aliases. Copy puts `var(--name)` on the clipboard.',
  ],
  title: 'Design tokens',
  intro: (n: number) =>
    `${n} tokens, generated from the CSS source. Search by name, purpose, or alias.`,
  search: 'Search',
  searchPlaceholder: 'e.g. --surf-ink, typography, dialog',
  category: 'Category',
  allCategories: 'All categories',
  count: (n: number, shown: number) => `${n} matching tokens / ${shown} shown`,
  sourceAndReferences: 'Source and references',
  copyLabel: (name: string) => `Copy ${name}`,
  copy: 'Copy',
  copied: 'Copied',
  unavailable: 'Unavailable',
  noMatching: 'No matching tokens. Try a different search term or category.',
  showMore: 'Show more tokens',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    principles: [
      [
        '값이 아니라 토큰을 참조하세요.',
        '토큰이 가리키는 색 대신 `var(--surf-ink)`를 써야 테마와 화면 크기가 코드에 반영됩니다.',
      ],
      [
        '토큰은 역할로 고르세요.',
        '`--surf-ink-muted`, `--surf-canvas`, `--surf-space-4` 같은 역할 토큰은 값의 용도를 말하고, 모습은 테마가 정합니다.',
      ],
      [
        '컴포넌트는 자기 토큰으로 조정하세요.',
        '`--surf-control-height` 같은 컴포넌트 토큰은 역할 토큰을 참조하므로, 내부 스타일을 덮지 않고도 한 번의 재정의가 모든 부분에 닿습니다.',
      ],
    ],
    sections: {
      reading: '토큰 읽는 법',
      tokens: '전체 토큰',
    },
    reading: [
      '각 행은 토큰의 이름, 카테고리, 용도를 보여 주고, 현재 테마와 창 너비에서 계산된 값을 이어서 보여 줍니다. 테마를 바꾸거나 창 크기를 조절하면 값이 따라 바뀝니다.',
      '소스와 참조에는 선언마다 컨텍스트, 파일, 줄이 있고, 참조하는 토큰으로 가는 링크가 있습니다. 복사하면 `var(--name)`이 클립보드에 들어갑니다.',
    ],
    title: '디자인 토큰',
    intro: (n: number) =>
      `CSS 소스에서 생성한 토큰 ${n}개입니다. 이름, 용도, 별칭으로 검색하세요.`,
    search: '검색',
    searchPlaceholder: '예: --surf-ink, typography, dialog',
    category: '카테고리',
    allCategories: '모든 카테고리',
    count: (n: number, shown: number) =>
      `일치하는 토큰 ${n}개 / ${shown}개 표시`,
    sourceAndReferences: '소스와 참조',
    copyLabel: (name: string) => `${name} 복사`,
    copy: '복사',
    copied: '복사됨',
    unavailable: '사용 불가',
    noMatching:
      '일치하는 토큰이 없습니다. 다른 검색어나 카테고리를 사용해 보세요.',
    showMore: '토큰 더 보기',
  },
}
