import type { Locale } from '../../i18n'

const en = {
  onThisPage: 'On this page',
  nav: [
    { id: 'principles', label: 'Principles' },
    { id: 'library', label: 'Library' },
    { id: 'semantics', label: 'Semantics' },
    { id: 'direction', label: 'Direction' },
    { id: 'application', label: 'Application' },
  ],
  principlesTitle: 'One visual language',
  principlesIntro:
    "Draw icons as SVG shapes with a 24×24 viewBox, currentColor, and the shared stroke width. Don't substitute special characters, emoji, or icon fonts for UI symbols. Product logos and illustrations are separate assets.",
  tableLabel: 'Icon design tokens',
  caption: 'Icon size and alignment',
  tokenHeader: 'Token',
  usageHeader: 'Usage',
  exampleHeader: 'Example',
  sizeSm: '16px / compact controls',
  sizeMd: '20px / general UI',
  sizeLg: '24px / emphasis',
  strokeWidthUsage: '1.7 / viewBox units, scales with icon size',
  strokeCaps: 'Round caps / joins',
  principlesClosing:
    "Make the parent control the click target, not the icon. Inside buttons, use flex alignment and the shared gap. Inline, align icons to the text baseline. Keep the parent's click target and focus ring when you resize the icon.",
  libraryTitle: 'Shared vocabulary',
  libraryIntro: (n: number) =>
    `The shared Icon currently provides ${n} shapes. To add one, put it in the shared source with a name and usage guidance, then test it. This list doesn't replace a full icon library.`,
  galleryLabel: 'Shared icon vocabulary',
  semanticsTitle: 'Names belong to meaning',
  semanticsIntro:
    "An icon next to text is decorative by default. Give an icon-only button an aria-label that describes its action, and hide the SVG. A Tooltip doesn't replace the accessible name. For a meaningful standalone graphic, set decorative=false with label.",
  incrementPreview: 'Increment preview',
  resetPreview: 'Reset preview',
  localCount: (n: number) => `Local count: ${n}`,
  supplementaryInfoLabel: 'Supplementary information',
  standaloneIconNote: 'A standalone icon with an explicit name.',
  semanticsClosingStart:
    "The button is the focusable element. Don't add tabIndex or a separate click behavior to the SVG. Show status with both an icon and text, and prefer ",
  statusBadgeLink: 'StatusBadge',
  semanticsClosingEnd: '.',
  primitiveContractTitle: 'Primitive contract',
  primitiveNameRest: ' takes a value from the shared list above.',
  primitiveSizeRest: ' is sm (the default, 16px), md, or lg.',
  primitiveDecorativeRest:
    ' defaults to true. A meaningful standalone SVG sets ',
  primitiveLabelRest: ' with a non-empty ',
  primitiveRefRest:
    '. The ref points to the SVGSVGElement. Compose it with className, style, and data attributes. If you override styles, recheck size, contrast, and direction.',
  codeLabel: 'Accessible icon examples',
  directionTitle: 'Logical direction',
  directionIntro:
    "Only the logical-direction icons, arrow-back and chevron-forward, mirror with the DOM dir. Search, play, copy, external link, and expand-down icons don't mirror. For keyboard direction in Base UI controls, also set the product's DirectionProvider to the same direction.",
  previewDirectionLabel: 'Preview direction',
  ltrOption: 'Left to right',
  rtlOption: 'Right to left',
  back: 'Back',
  next: 'Next',
  externalLink: 'External link',
  directionPreviewNote:
    "Static markers for comparing direction. They don't navigate.",
  applicationTitle: 'Icon implementation rules',
  rule1:
    'Use the same symbol for the same action. Keep the status name on result states.',
  rule2:
    "Include the target and the action in an icon button's accessible name. Don't shrink the hit area when you make the icon smaller.",
  rule3:
    "Use the code copy and external link symbols consistently. Wording and link purpose must stay clear even when the SVG isn't visible.",
  applicationNote:
    "Color follows the parent's currentColor. Don't force-override the user's high-contrast colors. Check that required symbols have enough contrast against the adjacent background. Don't distinguish states by color alone.",
  w3cSvgIcons: 'W3C — SVG icons',
  waiFunctionalImages: 'WAI — Functional images',
  colorContrastLink: 'Color and contrast',
  closingNote:
    "This page covers the shared primitive and guidance added so far. It doesn't mean every existing product and component SVG has moved to this API.",
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    onThisPage: '이 페이지에서',
    nav: [
      { id: 'principles', label: '원칙' },
      { id: 'library', label: '라이브러리' },
      { id: 'semantics', label: '의미' },
      { id: 'direction', label: '방향' },
      { id: 'application', label: '적용' },
    ],
    principlesTitle: '하나의 시각 언어',
    principlesIntro:
      '아이콘은 24×24 viewBox, currentColor, 공유 stroke 너비를 가진 SVG 모양으로 그리세요. 특수 문자, 이모지, 아이콘 폰트를 UI 심볼 대신 사용하지 마세요. 제품 로고와 일러스트레이션은 별도 자산입니다.',
    tableLabel: '아이콘 디자인 토큰',
    caption: '아이콘 크기와 정렬',
    tokenHeader: '토큰',
    usageHeader: '사용법',
    exampleHeader: '예시',
    sizeSm: '16px / 컴팩트 컨트롤',
    sizeMd: '20px / 일반 UI',
    sizeLg: '24px / 강조',
    strokeWidthUsage: '1.7 / viewBox 단위, 아이콘 크기에 따라 배율 조정',
    strokeCaps: 'Round caps / joins',
    principlesClosing:
      '클릭 대상은 아이콘이 아니라 부모가 제어하게 하세요. 버튼 안에서는 flex 정렬과 공유 gap을 사용하세요. 인라인에서는 아이콘을 텍스트 기준선에 맞추세요. 아이콘 크기를 조정할 때 부모의 클릭 대상과 포커스 링을 유지하세요.',
    libraryTitle: '공유 어휘',
    libraryIntro: (n: number) =>
      `공유 Icon은 현재 ${n}개의 모양을 제공합니다. 추가하려면 이름과 사용법 안내를 함께 공유 소스에 넣고 테스트하세요. 이 목록은 전체 아이콘 라이브러리를 대체하지 않습니다.`,
    galleryLabel: '공유 아이콘 어휘',
    semanticsTitle: '이름은 의미를 따른다',
    semanticsIntro:
      '텍스트 옆의 아이콘은 기본적으로 장식입니다. 아이콘만 있는 버튼에는 동작을 설명하는 aria-label을 주고 SVG를 숨기세요. Tooltip은 접근 가능한 이름을 대체하지 않습니다. 의미 있는 단독 그래픽에는 decorative=false와 label을 설정하세요.',
    incrementPreview: '미리보기 증가',
    resetPreview: '미리보기 초기화',
    localCount: (n: number) => `로컬 카운트: ${n}`,
    supplementaryInfoLabel: '보충 정보',
    standaloneIconNote: '명시적 이름을 가진 독립 아이콘.',
    semanticsClosingStart:
      '버튼이 포커스 가능한 요소입니다. SVG에 tabIndex나 별도의 클릭 동작을 추가하지 마세요. 상태는 아이콘과 텍스트로 함께 표시하고 ',
    statusBadgeLink: 'StatusBadge',
    semanticsClosingEnd: '를 선호하세요.',
    primitiveContractTitle: '프리미티브 계약',
    primitiveNameRest: '는 위 공유 목록의 값을 사용합니다.',
    primitiveSizeRest: '는 sm(기본값, 16px), md, lg 중 하나입니다.',
    primitiveDecorativeRest: '는 기본적으로 true입니다. 의미 있는 독립 SVG는 ',
    primitiveLabelRest: '와 함께 ',
    primitiveRefRest:
      '를 설정합니다. ref는 SVGSVGElement를 가리킵니다. className, style, data 속성과 함께 구성하세요. 스타일을 재정의하면 크기, 대비, 방향을 다시 확인하세요.',
    codeLabel: '접근 가능한 아이콘 예시',
    directionTitle: '논리적 방향',
    directionIntro:
      '논리 방향 아이콘인 arrow-back과 chevron-forward만 DOM dir과 함께 미러링됩니다. Search, play, copy, external link, expand-down 아이콘은 미러링되지 않습니다. Base UI 컨트롤의 키보드 방향을 위해 제품의 DirectionProvider도 같은 방향으로 설정하세요.',
    previewDirectionLabel: '미리보기 방향',
    ltrOption: '왼쪽에서 오른쪽으로',
    rtlOption: '오른쪽에서 왼쪽으로',
    back: '뒤로',
    next: '다음',
    externalLink: '외부 링크',
    directionPreviewNote: '방향 비교용 정적 마커입니다. 탐색하지 않습니다.',
    applicationTitle: '아이콘 구현 규칙',
    rule1:
      '같은 액션에는 같은 심볼을 사용하세요. 결과 상태에는 상태 이름을 유지하세요.',
    rule2:
      '아이콘 버튼의 접근 가능한 이름에 대상과 액션을 포함하세요. 아이콘을 작게 만들어도 히트 영역을 줄이지 마세요.',
    rule3:
      '코드 복사와 외부 링크 심볼을 일관되게 사용하세요. SVG가 보이지 않아도 문구와 링크 목적이 명확해야 합니다.',
    applicationNote:
      '색은 부모의 currentColor를 따릅니다. 사용자의 고대비 색상을 강제로 덮어쓰지 마세요. 필수 심볼이 인접 배경과 충분한 대비를 가지는지 확인하세요. 상태를 색으로만 구분하지 마세요.',
    w3cSvgIcons: 'W3C — SVG 아이콘',
    waiFunctionalImages: 'WAI — 기능적 이미지',
    colorContrastLink: '색과 대비',
    closingNote:
      '이 페이지는 지금까지 추가된 공유 프리미티브와 가이드를 다룹니다. 모든 기존 제품과 컴포넌트 SVG가 이 API로 옮겨졌다는 뜻은 아닙니다.',
  },
}
