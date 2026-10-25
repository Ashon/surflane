import type { Locale } from '../../i18n'

const en = {
  principles: [
    [
      'Draw every interface symbol with Icon.',
      "Its SVGs share one grid, stroke, and color, which emoji, icon fonts, and special characters can't match.",
    ],
    [
      'Let the parent control own the action.',
      'The button or link takes focus, clicks, and the hit area, so a smaller icon never shrinks them.',
    ],
    [
      'Name the action, not the picture.',
      'Give an icon-only button a name such as "Close details", and keep icons beside text hidden.',
    ],
    [
      'Pair a status icon with a word.',
      "Shape and color alone don't reach every reader.",
    ],
    [
      'Mirror only icons that point along the reading direction.',
      'Back and forward arrows flip in right-to-left layouts, while search, play, and external link keep their shape.',
    ],
  ],
  sections: {
    sizes: 'Sizes and stroke',
    vocabulary: 'Icon set',
    names: 'Accessible names',
    direction: 'Direction',
  },
  sizesIntro:
    "Icon takes small, default or large, like every component: 14, 16 or 20px, and 16px when omitted. Inside a Button, the icon follows the button's size instead. Icons draw in currentColor, so they follow the text color and forced colors.",
  tableLabel: 'Icon design tokens',
  caption: 'Icon sizes and stroke',
  tokenHeader: 'Token',
  usageHeader: 'Use',
  exampleHeader: 'Example',
  sizeSmall: '14px: dense rows and small controls',
  sizeDefault: '16px, the default: inline text, menus, selects',
  sizeLarge: '20px: navigation items and standalone marks',
  strokeWidthUsage: '1.7 viewBox units, scaled with the icon',
  strokeCaps: 'Round caps and joins',
  libraryIntro: (n: number) =>
    `Icon has ${n} shapes: interface actions and states, and an infrastructure set for products that run machines (server, database, disk, chip, memory, network, bolt, token, thermometer), and view controls (pin, list, grid). To add one, put it in the shared source with a name and a use, and test it.`,
  galleryLabel: 'Shared icon vocabulary',
  namesIntro:
    "An icon beside text is decorative, so Icon hides it by default. Give an icon-only button an aria-label. A Tooltip doesn't replace it. A meaningful standalone icon sets decorative={false} and a label.",
  incrementPreview: 'Increment preview',
  resetPreview: 'Reset preview',
  localCount: (n: number) => `Local count: ${n}`,
  supplementaryInfoLabel: 'Supplementary information',
  standaloneIconNote: 'A standalone icon with its own name.',
  namesNote:
    "The button takes focus. Don't add tabIndex or a click handler to the SVG.",
  codeLabel: 'Accessible icon examples',
  w3cSvgIcons: 'W3C — SVG icons',
  waiFunctionalImages: 'WAI — Functional images',
  directionIntro:
    'Only arrow-back, chevron-back, and chevron-forward mirror when dir is rtl. Give DirectionProvider the same direction, so arrow keys in Base UI controls match.',
  previewDirectionLabel: 'Preview direction',
  ltrOption: 'Left to right',
  rtlOption: 'Right to left',
  back: 'Back',
  next: 'Next',
  externalLink: 'External link',
  directionPreviewNote: 'Static markers for comparing direction.',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    principles: [
      [
        '인터페이스 기호는 모두 Icon으로 그리세요.',
        'Icon의 SVG는 격자, 획, 색을 공유하지만 이모지, 아이콘 폰트, 특수 문자는 그러지 못합니다.',
      ],
      [
        '동작은 부모 컨트롤이 맡게 하세요.',
        '버튼이나 링크가 포커스, 클릭, 누르는 영역을 맡으므로 아이콘을 줄여도 영역은 줄지 않습니다.',
      ],
      [
        '그림이 아니라 동작에 이름을 붙이세요.',
        '아이콘만 있는 버튼에는 "세부 정보 닫기" 같은 이름을 주고, 텍스트 옆 아이콘은 숨기세요.',
      ],
      [
        '상태 아이콘에는 글자를 함께 쓰세요.',
        '모양과 색만으로는 모든 사람에게 뜻이 전해지지 않습니다.',
      ],
      [
        '읽는 방향을 가리키는 아이콘만 뒤집으세요.',
        '뒤로와 앞으로 화살표는 오른쪽에서 왼쪽으로 읽는 레이아웃에서 뒤집히고, 검색, 재생, 외부 링크는 그대로입니다.',
      ],
    ],
    sections: {
      sizes: '크기와 획',
      vocabulary: '아이콘 세트',
      names: '접근 가능한 이름',
      direction: '방향',
    },
    sizesIntro:
      'Icon은 다른 컴포넌트처럼 small, default, large를 받습니다. 14, 16, 20px이고, 생략하면 16px입니다. Button 안에서는 버튼 크기를 따릅니다. 아이콘은 currentColor로 그리므로 글자 색과 강제 색상을 따릅니다.',
    tableLabel: '아이콘 디자인 토큰',
    caption: '아이콘 크기와 획',
    tokenHeader: '토큰',
    usageHeader: '용도',
    exampleHeader: '예시',
    sizeSmall: '14px: 촘촘한 행과 작은 컨트롤',
    sizeDefault: '16px, 기본값: 인라인 텍스트, 메뉴, 선택 목록',
    sizeLarge: '20px: 내비게이션 항목과 단독 표시',
    strokeWidthUsage: '1.7 viewBox 단위, 아이콘 크기에 비례',
    strokeCaps: '둥근 끝과 이음',
    libraryIntro: (n: number) =>
      `Icon에는 모양이 ${n}개 있습니다. 인터페이스 동작과 상태, 그리고 장비를 운영하는 제품을 위한 인프라 묶음(server, database, disk, chip, memory, network, bolt, token, thermometer), 보기 컨트롤(pin, list, grid)입니다. 추가하려면 이름과 용도를 붙여 공유 소스에 넣고 테스트하세요.`,
    galleryLabel: '공유 아이콘 어휘',
    namesIntro:
      '텍스트 옆 아이콘은 장식이므로 Icon이 기본으로 숨깁니다. 아이콘만 있는 버튼에는 aria-label을 주세요. Tooltip은 이를 대신하지 않습니다. 의미 있는 단독 아이콘에는 decorative={false}와 label을 설정하세요.',
    incrementPreview: '미리보기 증가',
    resetPreview: '미리보기 초기화',
    localCount: (n: number) => `로컬 카운트: ${n}`,
    supplementaryInfoLabel: '보충 정보',
    standaloneIconNote: '자기 이름이 있는 단독 아이콘입니다.',
    namesNote:
      '포커스는 버튼이 받습니다. SVG에 tabIndex나 클릭 핸들러를 더하지 마세요.',
    codeLabel: '접근 가능한 아이콘 예시',
    w3cSvgIcons: 'W3C — SVG 아이콘',
    waiFunctionalImages: 'WAI — 기능 이미지',
    directionIntro:
      'dir이 rtl이면 arrow-back, chevron-back, chevron-forward만 뒤집힙니다. Base UI 컨트롤의 화살표 키도 맞도록 DirectionProvider에 같은 방향을 주세요.',
    previewDirectionLabel: '미리보기 방향',
    ltrOption: '왼쪽에서 오른쪽으로',
    rtlOption: '오른쪽에서 왼쪽으로',
    back: '뒤로',
    next: '다음',
    externalLink: '외부 링크',
    directionPreviewNote: '방향을 비교하는 정적 표시입니다.',
  },
}
