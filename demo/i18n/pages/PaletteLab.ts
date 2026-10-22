import type { Locale } from '../../i18n'
import type { Vision } from '../../oklch'
import type { Guideline, Harmony } from '../../palette'

type Criterion = Guideline['criterion']

const en = {
  oklchHeading: 'Build a palette in OKLCH',
  oklchIntro:
    "OKLCH describes a color by lightness (L, 0 to 1), chroma (C, how colorful) and hue (H, an angle). Its lightness tracks what the eye sees, so the system decides contrast with L first and lets hue and chroma vary. These principles are how Surflane's own palette and theme builder are made; the lab below lets you try them.",
  principles: [
    [
      'Lightness is the structure',
      'Give every role a lightness first. In the light theme the surfaces sit at L 1.00, 0.98 and 0.94 and the text at 0.24 to 0.38. Contrast follows the gap in L, so a role keeps its contrast when hue or chroma changes; the theme builder never moves L.',
    ],
    [
      'Hue holds as lightness moves',
      'In OKLCH a hue keeps its look from light to dark, where CIELAB LCH drifts blue toward purple and HSL makes yellow at 50% look far lighter than blue at 50%. Equal L reads as equal lightness across hues, so a set at one L is balanced.',
    ],
    [
      'Each hue has its own gamut',
      "sRGB holds the most chroma for yellow near L 0.97 and for blue near L 0.45. Build a ramp by lightness, then clamp each step's chroma to what sRGB can show at that L and hue, with a small margin, as maxChroma does.",
    ],
    [
      'Chroma follows area',
      "Large areas take the least chroma: Surflane's grays carry 0.003 to 0.018 of the brand's hue, about 248°. Accents sit near 0.12, and the highest chroma goes to small marks such as badges and status icons, the loudest points on a page.",
    ],
    [
      'Dark is its own ladder',
      'A dark theme is not an inversion. Pick L again for every role: surfaces step from 0.21 to 0.38, text sits at 0.82 to 0.98, and accents rise, as chart categories move from L 0.50–0.56 to 0.74–0.82, to keep their contrast on dark.',
    ],
    [
      'Harmony by angle, meaning by convention',
      'Choose supporting hues by angle: analogous ±30°, complementary 180°, split complementary 180° ± 30°, triadic 120°, square 90°. Status colors follow convention instead, red near 25° for danger and amber near 90° for caution, and always carry a label and an icon.',
    ],
    [
      'Categories share a lightness band',
      "Give categories one narrow lightness band and similar chroma, so no color outranks another, and space their hues apart. Then check them as people with color vision deficiencies see them: red and green often collapse for protanopia and deuteranopia, so a chart also tells series apart by markers, patterns and labels, as Surflane's Chart does.",
    ],
    [
      'Define in OKLCH, measure in sRGB',
      "WCAG contrast is defined on sRGB luminance, so L predicts it closely but not exactly: always measure. Interpolate gradients and transitions in OKLCH, so their midpoints don't turn gray.",
    ],
  ] as [string, string][],
  guidelineHeading: 'Guideline check',
  guidelineIntro:
    'The lab measures the current palette against the principles above, with these thresholds. Review means look again: a vivid hue or a hue near danger can be right, but it should be a decision.',
  guidelineLabel: 'Guideline check for the current palette',
  guidelineColumns: ['Guideline', 'Rule', 'Measured', 'Result'],
  criteria: {
    textLight: ['Text steps on light', 'At least 3 steps reach 4.5:1 on white'],
    textDark: [
      'Text steps on dark',
      'At least 3 steps reach 4.5:1 on the dark canvas',
    ],
    gamut: [
      'Chroma holds in the middle',
      'Steps 300–700 keep 80% of the chroma asked for',
    ],
    area: ['Chroma for fills', 'C 0.16 or less; above it, small marks only'],
    status: [
      'Clear of status hues',
      'No hue within 20° of danger (27°) or caution (94°)',
    ],
    accent: [
      'Accent fill carries text',
      'Ink on the L 0.82 fill reaches 4.5:1',
    ],
    distinct: [
      'Categories stay distinct',
      'Smallest ΔE 0.08 or more with typical vision',
    ],
    cvd: [
      'Distinct with color vision deficiency',
      'Every pair ΔE 0.02 or more for protan, deutan and tritan vision',
    ],
    visible: [
      'Categories stand out',
      'Every category reaches 3:1 on the canvas',
    ],
  } as Record<Criterion, [string, string]>,
  stepsOf: (count: number) => `${count} of 11 steps`,
  keeps: (step: number, percent: number) => `Step ${step} keeps ${percent}%`,
  chromaValue: (chroma: string) => `C ${chroma}`,
  nearestStatus: (hue: number, distance: number, status: string) =>
    `${hue}° is ${distance}° from ${status}`,
  danger: 'danger',
  caution: 'caution',
  noneNear: 'None within 20°',
  ratioValue: (ratio: string) => `${ratio}:1`,
  distanceValue: (distance: string, vision: string) =>
    `ΔE ${distance}, ${vision}`,
  weakestValue: (index: number, ratio: string) =>
    `Category ${index}, ${ratio}:1`,
  pass: 'Pass',
  review: 'Review',
  fail: 'Fail',
  guidelineSummary: (passed: number, total: number) =>
    `${passed} of ${total} guidelines pass.`,
  grayscaleNote:
    'In grayscale, colors at one lightness merge: that is why every category carries a label, and why achromatopsia is shown but not scored.',
  labHeading: 'Palette lab',
  labIntro:
    "Choose a hue and a chroma. The lab builds tonal ramps for the harmony you pick, checks a categorical set as different people see it, and measures any pair. Nothing here changes the site's theme: copy the CSS when a palette works.",
  controlsLabel: 'Palette inputs',
  hue: 'Hue',
  chroma: 'Chroma',
  lightness: 'Lightness',
  harmony: 'Harmony',
  harmonies: {
    monochromatic: 'Monochromatic',
    analogous: 'Analogous',
    complementary: 'Complementary',
    split: 'Split complementary',
    triadic: 'Triadic',
    square: 'Square',
  } as Record<Harmony, string>,
  evaluateIn: 'Evaluate in',
  light: 'Light',
  dark: 'Dark',
  useBrand: 'Start from the brand',
  custom: 'Custom',
  wheelLightness: 'Wheel lightness',
  wheelLabel: 'Hue and chroma wheel',
  wheelHelp:
    'Drag a marker on the wheel: around it turns the hue, toward the edge adds chroma, and a press anywhere moves the base hue there. Other markers keep their own angle. The faded area is outside sRGB at this lightness. With a marker focused, Left and Right turn it (Shift for 15°), Up and Down change chroma.',
  baseMarker: 'Base hue',
  supportMarker: (index: number) => `Hue ${index}`,
  markerValue: (hue: number, chroma: string) => `${hue}°, chroma ${chroma}`,
  gaps: (list: string) => `Angles between neighbors: ${list}`,
  hues: (list: string) => `Hues: ${list}`,
  rampsHeading: 'Tonal ramps',
  rampsIntro:
    'Eleven steps at fixed lightness, from L 0.97 to 0.24. Chroma peaks in the middle and is clamped to sRGB at each step; a dot marks a clamped step. The sample uses white or ink, whichever contrasts more.',
  pickInto: 'A swatch sets the',
  foreground: 'Foreground',
  background: 'Background',
  rampsLabel: 'Tonal ramps by hue',
  hueColumn: 'Hue',
  swatchLabel: (hue: number, step: number, css: string, clamped: boolean) =>
    `Hue ${hue}°, step ${step}, ${css}${clamped ? ', clamped to sRGB' : ''}`,
  clampedLegend: 'Dot: chroma clamped to the sRGB gamut at that step.',
  categoriesHeading: 'Categorical set',
  categoriesIntro:
    'Hues spread evenly from the base hue at one lightness. The lab checks the smallest difference between any two colors as different people see them, and each color against the canvas.',
  count: 'Colors',
  spread: 'Lightness spread',
  vision: 'Vision',
  visions: {
    typical: 'Typical',
    protanopia: 'Protanopia',
    deuteranopia: 'Deuteranopia',
    tritanopia: 'Tritanopia',
    achromatopsia: 'Achromatopsia',
  } as Record<Vision, string>,
  categoriesPreview: (vision: string) =>
    `Categorical set as seen with ${vision} vision`,
  result: 'Result',
  closestPair: 'Closest pair',
  pairText: (a: number, b: number) => `${a} and ${b}`,
  distanceNote:
    "ΔE is the distance in OKLab; 0.02 is just noticeable. Surflane's own chart categories measure 0.09 on light and 0.11 on dark with typical vision, and 0.03 for dichromats, which is why Chart also tells series apart with markers, line patterns and a legend. A small lightness spread separates neighbors further.",
  checkerHeading: 'Contrast checker',
  checkerIntro:
    'Take a foreground and a background from the system roles, a ramp swatch or the sliders. The checker measures WCAG 2 contrast and finds the nearest lightness that passes, keeping the hue.',
  source: 'Source',
  sourceGroups: {
    text: 'Text',
    surfaces: 'Surfaces',
    accents: 'Accents and status',
  },
  adjusted: 'Adjusted',
  picked: 'Picked swatch',
  contrast: 'Contrast',
  lightnessGap: (gap: string) => `Lightness gap ΔL ${gap}`,
  checksLabel: 'WCAG 2 checks',
  use: 'Use',
  minimum: 'Minimum',
  checks: [
    ['Body text', 4.5],
    ['Large text, 24px or 18.67px bold', 3],
    ['Enhanced text (AAA)', 7],
    ['Controls, icons and graphics', 3],
  ] as [string, number][],
  passes: 'Passes',
  fails: 'Fails',
  suggestionsLabel: 'Nearest passing lightness',
  target: 'Target',
  nearest: 'Foreground',
  apply: 'Apply',
  applyLabel: (target: number) => `Apply the foreground for ${target}:1`,
  unreachable: 'Not reachable with this hue',
  alreadyPasses: 'Already passes',
  sampleBody: 'Deploys finish in about four minutes.',
  sampleLarge: 'Release 0.6.0',
  sampleIcon: 'Status',
  previewLabel: 'Pair preview',
  exportHeading: 'Copy the palette',
  exportLabel: 'Palette CSS',
}

export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    oklchHeading: 'OKLCH로 팔레트 만들기',
    oklchIntro:
      'OKLCH는 색을 밝기(L, 0~1), 채도(C, 얼마나 선명한지), 색상(H, 각도)으로 나타냅니다. 밝기가 눈에 보이는 밝기를 따르므로, 시스템은 대비를 L로 먼저 정하고 색상과 채도는 바뀔 수 있게 둡니다. 아래 원칙은 Surflane의 팔레트와 테마 빌더가 만들어진 방식이며, 그 아래 랩에서 직접 해 볼 수 있습니다.',
    principles: [
      [
        '밝기가 구조입니다',
        '모든 역할에 밝기를 먼저 정하세요. 라이트 테마에서 면은 L 1.00, 0.98, 0.94에, 글자는 0.24~0.38에 있습니다. 대비는 L의 차이를 따르므로 색상이나 채도가 바뀌어도 역할의 대비가 유지되고, 테마 빌더는 L을 바꾸지 않습니다.',
      ],
      [
        '밝기가 바뀌어도 색상은 유지됩니다',
        'OKLCH에서는 한 색상이 밝은 쪽에서 어두운 쪽까지 같은 느낌을 유지합니다. CIELAB LCH는 파랑이 보라 쪽으로 흐르고, HSL에서는 50%의 노랑이 50%의 파랑보다 훨씬 밝아 보입니다. 같은 L은 색상이 달라도 같은 밝기로 읽히므로, 한 L에 모은 색들은 균형이 맞습니다.',
      ],
      [
        '색상마다 색역이 다릅니다',
        'sRGB에서 노랑은 L 0.97 근처에서, 파랑은 L 0.45 근처에서 채도가 가장 높습니다. 램프는 밝기로 먼저 만들고, 각 단계의 채도를 그 L과 색상에서 sRGB가 보여 줄 수 있는 만큼으로, 약간의 여유를 두고 자르세요. maxChroma가 하는 일입니다.',
      ],
      [
        '채도는 면적을 따릅니다',
        '넓은 면일수록 채도를 가장 낮게 씁니다. Surflane의 회색은 브랜드 색상(약 248°)을 0.003~0.018만 머금고 있습니다. 강조색은 0.12 근처이고, 가장 높은 채도는 배지나 상태 아이콘 같은 작은 표시, 즉 화면에서 가장 큰 소리를 내는 점에 씁니다.',
      ],
      [
        '다크는 별도의 사다리입니다',
        '다크 테마는 반전이 아닙니다. 모든 역할의 L을 다시 고르세요. 면은 0.21에서 0.38까지 단계를 밟고, 글자는 0.82~0.98에 있으며, 강조색은 올라갑니다. 차트 범주가 L 0.50~0.56에서 0.74~0.82로 올라가 어두운 바탕에서도 대비를 지키는 것처럼요.',
      ],
      [
        '조화는 각도로, 의미는 관습으로',
        '보조 색상은 각도로 고르세요. 유사색 ±30°, 보색 180°, 분할 보색 180° ± 30°, 삼각 120°, 사각 90°입니다. 상태색은 조화가 아니라 관습을 따릅니다. 위험은 25° 근처의 빨강, 주의는 90° 근처의 호박색이며, 언제나 라벨과 아이콘을 함께 둡니다.',
      ],
      [
        '범주는 한 밝기 대역을 공유합니다',
        '범주는 좁은 밝기 대역과 비슷한 채도로 두어 어느 색도 튀지 않게 하고, 색상은 서로 떨어뜨리세요. 그다음 색각 이상이 있는 사람의 눈으로 확인하세요. 적색맹과 녹색맹에게는 빨강과 초록이 자주 하나로 보이므로, 차트는 Surflane의 Chart처럼 마커, 패턴, 라벨로도 계열을 구분합니다.',
      ],
      [
        '정의는 OKLCH로, 측정은 sRGB로',
        'WCAG 대비는 sRGB 상대 휘도로 정의되므로 L이 대비를 가깝게 예측하지만 정확하지는 않습니다. 언제나 측정하세요. 그라디언트와 전환은 OKLCH로 보간해 중간 색이 탁해지지 않게 하세요.',
      ],
    ],
    guidelineHeading: '가이드라인 평가',
    guidelineIntro:
      '랩은 지금 팔레트를 위 원칙과 이 기준값으로 잽니다. 검토는 다시 보라는 뜻입니다. 선명한 색상이나 위험색에 가까운 색상이 맞을 수도 있지만, 그때는 의도한 결정이어야 합니다.',
    guidelineLabel: '현재 팔레트의 가이드라인 평가',
    guidelineColumns: ['가이드라인', '기준', '측정값', '결과'],
    criteria: {
      textLight: [
        '라이트의 글자 단계',
        '흰 바탕에서 4.5:1을 넘는 단계가 3개 이상',
      ],
      textDark: [
        '다크의 글자 단계',
        '다크 바탕에서 4.5:1을 넘는 단계가 3개 이상',
      ],
      gamut: ['가운데 채도 유지', '300~700단계가 요청한 채도의 80% 유지'],
      area: ['채움의 채도', 'C 0.16 이하, 넘으면 작은 표시에만'],
      status: [
        '상태색과 거리',
        '위험(27°)이나 주의(94°)에서 20° 안쪽의 색상이 없음',
      ],
      accent: ['강조 채움 위의 글자', 'L 0.82 채움 위의 잉크가 4.5:1 이상'],
      distinct: ['범주 구분', '일반 색각에서 최소 ΔE 0.08 이상'],
      cvd: [
        '색각 이상에서의 구분',
        '적·녹·청색맹 모두에서 모든 조합이 ΔE 0.02 이상',
      ],
      visible: ['범주 가시성', '모든 범주가 바탕에서 3:1 이상'],
    },
    stepsOf: (count: number) => `11단계 중 ${count}단계`,
    keeps: (step: number, percent: number) => `${step}단계가 ${percent}% 유지`,
    chromaValue: (chroma: string) => `C ${chroma}`,
    nearestStatus: (hue: number, distance: number, status: string) =>
      `${hue}°가 ${status}에서 ${distance}°`,
    danger: '위험',
    caution: '주의',
    noneNear: '20° 안쪽 없음',
    ratioValue: (ratio: string) => `${ratio}:1`,
    distanceValue: (distance: string, vision: string) =>
      `ΔE ${distance}, ${vision}`,
    weakestValue: (index: number, ratio: string) => `범주 ${index}, ${ratio}:1`,
    pass: '통과',
    review: '검토',
    fail: '미달',
    guidelineSummary: (passed: number, total: number) =>
      `가이드라인 ${total}개 중 ${passed}개를 통과합니다.`,
    grayscaleNote:
      '회색조에서는 한 밝기의 색들이 하나로 합쳐집니다. 그래서 모든 범주에 라벨을 두고, 전색맹은 보여 주되 점수에는 넣지 않습니다.',
    labHeading: '팔레트 랩',
    labIntro:
      '색상과 채도를 고르세요. 랩은 고른 조화에 맞춰 톤 램프를 만들고, 범주 색 묶음을 여러 사람의 눈으로 확인하며, 어떤 조합이든 대비를 잽니다. 사이트 테마는 바뀌지 않습니다. 마음에 드는 팔레트는 CSS로 복사하세요.',
    controlsLabel: '팔레트 입력',
    hue: '색상',
    chroma: '채도',
    lightness: '밝기',
    harmony: '조화',
    harmonies: {
      monochromatic: '단색',
      analogous: '유사색',
      complementary: '보색',
      split: '분할 보색',
      triadic: '삼각',
      square: '사각',
    },
    evaluateIn: '평가할 테마',
    light: '라이트',
    dark: '다크',
    useBrand: '브랜드에서 시작',
    custom: '직접 조정',
    wheelLightness: '색상환 밝기',
    wheelLabel: '색상과 채도 색상환',
    wheelHelp:
      '색상환의 마커를 끄세요. 둘레를 따라 움직이면 색상이, 바깥으로 갈수록 채도가 바뀌고, 아무 곳이나 누르면 기준 색상이 그리로 옮겨 갑니다. 나머지 마커는 저마다의 각도를 유지합니다. 흐린 영역은 이 밝기에서 sRGB 밖입니다. 마커에 포커스를 두고 ←/→로 돌리고(Shift는 15°), ↑/↓로 채도를 바꿉니다.',
    baseMarker: '기준 색상',
    supportMarker: (index: number) => `색상 ${index}`,
    markerValue: (hue: number, chroma: string) => `${hue}°, 채도 ${chroma}`,
    gaps: (list: string) => `이웃한 색상 사이 각도: ${list}`,
    hues: (list: string) => `색상: ${list}`,
    rampsHeading: '톤 램프',
    rampsIntro:
      'L 0.97에서 0.24까지 고정된 밝기의 11단계입니다. 채도는 가운데에서 가장 높고 단계마다 sRGB 안으로 잘리며, 잘린 단계에는 점이 붙습니다. 견본 글자는 흰색과 잉크 중 대비가 큰 쪽을 씁니다.',
    pickInto: '견본을 누르면 정해지는 쪽',
    foreground: '전경',
    background: '배경',
    rampsLabel: '색상별 톤 램프',
    hueColumn: '색상',
    swatchLabel: (hue: number, step: number, css: string, clamped: boolean) =>
      `색상 ${hue}°, ${step}단계, ${css}${clamped ? ', sRGB로 잘림' : ''}`,
    clampedLegend: '점: 그 단계에서 채도가 sRGB 색역으로 잘렸습니다.',
    categoriesHeading: '범주 색 묶음',
    categoriesIntro:
      '기준 색상에서 시작해 원을 고르게 나눈 색상을 한 밝기에 둡니다. 랩은 여러 사람의 눈으로 보았을 때 두 색 사이의 가장 작은 차이와, 바탕에 대한 각 색의 대비를 확인합니다.',
    count: '색 개수',
    spread: '밝기 벌림',
    vision: '색각',
    visions: {
      typical: '일반',
      protanopia: '적색맹',
      deuteranopia: '녹색맹',
      tritanopia: '청색맹',
      achromatopsia: '전색맹',
    },
    categoriesPreview: (vision: string) => `${vision} 색각으로 본 범주 색 묶음`,
    result: '결과',
    closestPair: '가장 가까운 조합',
    pairText: (a: number, b: number) => `${a}와 ${b}`,
    distanceNote:
      'ΔE는 OKLab에서의 거리이고, 0.02면 겨우 구분됩니다. Surflane의 차트 범주색은 일반 색각에서 라이트 0.09, 다크 0.11이고 이색형 색각에서는 0.03입니다. 그래서 Chart는 마커, 선 패턴, 범례로도 계열을 구분합니다. 밝기를 조금 벌리면 이웃한 색이 더 떨어집니다.',
    checkerHeading: '대비 계산기',
    checkerIntro:
      '전경과 배경을 시스템 역할, 램프 견본, 슬라이더 중에서 가져오세요. 계산기는 WCAG 2 대비를 재고, 색상을 유지한 채 기준을 넘는 가장 가까운 밝기를 찾아 줍니다.',
    source: '출처',
    sourceGroups: { text: '글자', surfaces: '면', accents: '강조와 상태' },
    adjusted: '직접 조정',
    picked: '고른 견본',
    contrast: '대비',
    lightnessGap: (gap: string) => `밝기 차이 ΔL ${gap}`,
    checksLabel: 'WCAG 2 확인',
    use: '용도',
    minimum: '최소',
    checks: [
      ['본문', 4.5],
      ['큰 글자, 24px 또는 굵은 18.67px', 3],
      ['강화 기준 글자(AAA)', 7],
      ['컨트롤, 아이콘, 그래픽', 3],
    ],
    passes: '통과',
    fails: '미달',
    suggestionsLabel: '기준을 넘는 가장 가까운 밝기',
    target: '목표',
    nearest: '전경',
    apply: '적용',
    applyLabel: (target: number) => `${target}:1을 위한 전경 적용`,
    unreachable: '이 색상으로는 도달할 수 없음',
    alreadyPasses: '이미 통과',
    sampleBody: '배포는 4분 정도면 끝납니다.',
    sampleLarge: '릴리스 0.6.0',
    sampleIcon: '상태',
    previewLabel: '조합 미리보기',
    exportHeading: '팔레트 복사',
    exportLabel: '팔레트 CSS',
  },
}
