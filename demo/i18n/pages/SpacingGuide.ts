import type { Locale } from '../../i18n'

const en = {
  title: 'Spacing and grouping',
  intro:
    'Spacing uses tokens on a 4px base unit. Group closely related items with small gaps. Separate different tasks with larger ones. Decide how information relates before increasing all spacing evenly.',
  scaleLabel: 'Spacing token scale',
  tableLabel: 'Spacing usage guidelines',
  caption: 'Default spacing by relationship',
  relationship: 'Relationship',
  spacing: 'Spacing',
  token: 'Token',
  examples: 'Examples',
  rules: [
    [
      'Closely related elements',
      '4–8px',
      'space-1 / space-2',
      'Icon and label, heading and description, label and input',
    ],
    [
      'Related controls',
      '12–16px',
      'space-3 / space-4',
      '8–12px between buttons, 16px between an input and its action button',
    ],
    [
      'Task groups',
      '24px',
      'space-6',
      'Separate field groups, filters, and results',
    ],
    [
      'Sections',
      '32–48px',
      'space-8 / space-12',
      'Between independent topics or task steps',
    ],
    [
      'Inside containers',
      '16–32px',
      'space-4 / space-6 / space-8',
      'Popovers 16px, panels 24px, pages from 32px',
    ],
  ],
  inputsActionsTitle: 'Spacing between inputs and actions',
  inputsActionsIntro:
    'The example below uses 4px between heading and description, 8px between label and input, 16px between the input and the button row, and 8px between buttons. Popovers use the same spacing.',
  spacingDimensions: 'Spacing dimensions',
  dimensionLines:
    'Dimension lines measure the actual gaps between elements and take up no space.',
  accountDetails: 'Account details',
  enterNameToDisplay: 'Enter the name to display.',
  displayName: 'Display name',
  namePlaceholder: 'Name',
  savePreview: 'Save preview',
  cancelPreview: 'Cancel preview',
  codeLabel: 'Spacing composition',
  manageSpacing:
    "Manage spacing in one place. Don't combine a Stack or Inline gap with child margins. The parent layout owns outer spacing, and the container owns inner padding. In compact layouts, reduce group spacing from 24px to 16px, but keep input height and focus indicators. On small screens, reduce page padding and let button rows wrap. Don't size form spacing as a fraction of viewport height.",
  divider:
    "A full-width divider turns sections into panels. Like a card, a panel keeps the same inset on all four sides. Use the container's inset on both sides of the divider. The 32–48px section spacing applies when whitespace alone separates sections. A card grid inside a panel then sits as evenly as a paragraph.",
  relatedTokensLabel: 'Related tokens:',
  relatedTokensRest:
    "The catalog's own sheet is an explicit exception. It uses one 40px inset (24px at 960px and below) on every side, including above the page title, and on both sides of each section divider.",
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    title: '간격과 그룹화',
    intro:
      '간격은 4px 기본 단위 토큰을 사용합니다. 밀접한 항목은 작은 간격으로, 다른 작업은 큰 간격으로 분리하세요. 모든 간격을 균등하게 늘리기 전에 정보가 어떻게 관련되는지 먼저 정하세요.',
    scaleLabel: '간격 토큰 스케일',
    tableLabel: '간격 사용 가이드라인',
    caption: '관계별 기본 간격',
    relationship: '관계',
    spacing: '간격',
    token: '토큰',
    examples: '예시',
    rules: [
      [
        '밀접하게 관련된 요소',
        '4–8px',
        'space-1 / space-2',
        '아이콘과 라벨, 제목과 설명, 라벨과 입력',
      ],
      [
        '관련 컨트롤',
        '12–16px',
        'space-3 / space-4',
        '버튼 사이 8–12px, 입력과 액션 버튼 사이 16px',
      ],
      ['작업 그룹', '24px', 'space-6', '필드 그룹, 필터, 결과를 분리하세요'],
      ['구획', '32–48px', 'space-8 / space-12', '독립된 주제나 작업 단계 사이'],
      [
        '컨테이너 내부',
        '16–32px',
        'space-4 / space-6 / space-8',
        'Popover 16px, 패널 24px, 페이지 32px부터',
      ],
    ],
    inputsActionsTitle: '입력과 액션 사이 간격',
    inputsActionsIntro:
      '아래 예시는 제목과 설명 사이 4px, 라벨과 입력 사이 8px, 입력과 버튼 행 사이 16px, 버튼 사이 8px를 사용합니다. Popover도 같은 간격을 사용합니다.',
    spacingDimensions: '간격 치수',
    dimensionLines:
      '치수선은 요소 사이 실제 간격을 측정하며 공간을 차지하지 않습니다.',
    accountDetails: '계정 세부정보',
    enterNameToDisplay: '표시할 이름을 입력하세요.',
    displayName: '표시 이름',
    namePlaceholder: '이름',
    savePreview: '미리보기 저장',
    cancelPreview: '미리보기 취소',
    codeLabel: '간격 구성',
    manageSpacing:
      '간격을 한 곳에서 관리하세요. Stack이나 Inline gap을 자식 여백과 함께 쓰지 마세요. 바깥 간격은 부모 레이아웃이, 안쪽 패딩은 컨테이너가 담당합니다. 컴팩트 레이아웃에서는 그룹 간격을 24px에서 16px로 줄이되 입력 높이와 포커스 표시기는 유지하세요. 작은 화면에서는 페이지 패딩을 줄이고 버튼 행이 줄바꿈되게 하세요. 폼 간격을 뷰포트 높이의 분수로 크기를 정하지 마세요.',
    divider:
      '전체 너비 구분선은 구획을 패널로 만듭니다. 카드처럼 패널도 네 면에 같은 인셋을 유지합니다. 구분선 양쪽에 컨테이너의 인셋을 사용하세요. 공백만으로 구획을 분리할 때 32–48px 구획 간격이 적용됩니다. 그러면 패널 안 카드 그리드가 문단처럼 균등하게 배치됩니다.',
    relatedTokensLabel: '관련 토큰:',
    relatedTokensRest:
      '카탈로그의 시트 자체는 명시적 예외입니다. 모든 면에 40px 인셋(960px 이하 24px)을 사용하며, 페이지 제목 위와 각 구획 구분선 양쪽에도 적용됩니다.',
  },
}
