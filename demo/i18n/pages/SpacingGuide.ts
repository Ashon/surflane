import type { Locale } from '../../i18n'

const en = {
  intro: 'Pick each gap from the scale by how closely two things relate.',
  scaleLabel: 'Spacing token scale',
  tableLabel: 'Spacing by relationship',
  caption: 'Default gap by relationship',
  relationship: 'Relationship',
  spacing: 'Gap',
  token: 'Token',
  examples: 'Example',
  rules: [
    [
      'Parts of one item',
      '4–8px',
      '--surf-space-1, --surf-space-2',
      'Icon and label, label and input',
    ],
    ['Controls in a row', '8px', '--surf-space-2', 'Buttons in an action row'],
    [
      'Field and its actions',
      '16px',
      '--surf-space-4',
      'Input and the buttons below',
    ],
    ['Task groups', '24px', '--surf-space-6', 'Field groups, filters, results'],
    [
      'Sections',
      '48px',
      '--surf-layout-section-gap',
      'Independent topics or steps',
    ],
    [
      'Inside a container',
      '16–32px',
      '--surf-space-4, --surf-space-6, --surf-layout-page-inset',
      'Popover 16px, card 24px, page 32px',
    ],
  ],
  measureIntro:
    'The form below follows the table. Turn on the dimensions to measure each gap.',
  spacingDimensions: 'Spacing dimensions',
  accountDetails: 'Account details',
  enterNameToDisplay: 'Enter the name to display.',
  displayName: 'Display name',
  namePlaceholder: 'Name',
  savePreview: 'Save preview',
  cancelPreview: 'Cancel preview',
  codeLabel: 'Spacing composition',
  adapting:
    'Compact layouts tighten task groups to 16px and leave controls as they are. On phones, the page inset drops to 16px and section gaps to 32px. Size gaps from the scale, never from viewport height.',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    intro:
      '두 요소가 얼마나 가까운 관계인지에 따라 스케일에서 간격을 고르세요.',
    scaleLabel: '간격 토큰 스케일',
    tableLabel: '관계별 간격',
    caption: '관계별 기본 간격',
    relationship: '관계',
    spacing: '간격',
    token: '토큰',
    examples: '예',
    rules: [
      [
        '한 항목의 부분',
        '4–8px',
        '--surf-space-1, --surf-space-2',
        '아이콘과 라벨, 라벨과 입력',
      ],
      ['한 줄의 컨트롤', '8px', '--surf-space-2', '액션 행의 버튼'],
      ['필드와 그 액션', '16px', '--surf-space-4', '입력과 그 아래 버튼'],
      ['작업 묶음', '24px', '--surf-space-6', '필드 묶음, 필터, 결과'],
      ['섹션', '48px', '--surf-layout-section-gap', '독립된 주제나 단계'],
      [
        '컨테이너 안쪽',
        '16–32px',
        '--surf-space-4, --surf-space-6, --surf-layout-page-inset',
        'Popover 16px, 카드 24px, 페이지 32px',
      ],
    ],
    measureIntro: '아래 폼은 표를 따릅니다. 치수를 켜서 간격을 재 보세요.',
    spacingDimensions: '간격 치수',
    accountDetails: '계정 세부정보',
    enterNameToDisplay: '표시할 이름을 입력하세요.',
    displayName: '표시 이름',
    namePlaceholder: '이름',
    savePreview: '미리보기 저장',
    cancelPreview: '미리보기 취소',
    codeLabel: '간격 구성',
    adapting:
      '촘촘한 레이아웃은 작업 묶음 간격만 16px로 줄이고 컨트롤은 그대로 둡니다. 휴대폰에서는 페이지 인셋이 16px, 섹션 간격이 32px로 줄어듭니다. 간격은 뷰포트 높이가 아니라 스케일로 정하세요.',
  },
}
