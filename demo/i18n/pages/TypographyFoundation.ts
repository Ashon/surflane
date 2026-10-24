import type { Locale } from '../../i18n'

const en = {
  labTitle: 'Typography',
  principles: [
    [
      'Choose a role, not a size.',
      'A role sets size, line height, and tracking together, so text reads the same everywhere.',
    ],
    [
      'Set the heading level and the role separately.',
      'The HTML level sets the outline and size sets the look, so the outline survives any design.',
    ],
    [
      'Use two weights.',
      'Headings, buttons, links, and emphasis take 500, and everything else takes 400.',
    ],
    [
      'Keep reading lines short.',
      'Long lines make the next line hard to find, so reading text keeps to a set measure.',
    ],
    [
      'Let text grow.',
      'Role sizes are in rem and wrapping text keeps room between lines, so zoom and wider text spacing never break a layout.',
    ],
  ],
  sections: {
    typefaces: 'Typefaces',
    roles: 'Type roles',
    measure: 'Line length and line height',
    korean: 'Korean text',
  },
  typefacesIntro:
    'Each script takes its own face. Set lang on a block in another language so its glyphs come from that face.',
  typefaceTableLabel: 'Typefaces by text',
  typefaceCaption: 'Typeface by text',
  textHeader: 'Text',
  typefaceHeader: 'Typeface',
  typefaces: [
    ['Latin text and headings', 'Manrope'],
    ['Korean', 'Pretendard'],
    ['Japanese', 'Noto Sans JP'],
    ['Code, tokens, and values', 'JetBrains Mono'],
  ],
  displaySpecimenCaption: 'Display / Manrope + Pretendard',
  bodySpecimenCaption: 'Body / Manrope, Pretendard, Noto Sans JP',
  sourcesStart: 'Get the files from ',
  sourcesEnd:
    " and each typeface's package. Check each license before you redistribute a font.",
  rolesIntro:
    'Pick a role by what the text does. Display and title grow with the screen; every other role keeps one size.',
  typographyRoles: 'Typography roles',
  roleDisplay: 'Display',
  roleTitle: 'Title',
  rolePage: 'Page',
  roleSection: 'Section',
  roleSubsection: 'Subsection',
  roleReading: 'Reading',
  roleBody: 'Body',
  roleLabel: 'Label',
  roleCompact: 'Compact',
  roleCaption: 'Caption',
  roleCode: 'Code',
  roleMetric: 'Metric',
  weightsIntro:
    'In the samples below, the subhead, the emphasis, and the button take 500.',
  subhead: 'Card and column subhead',
  bodyStart: 'Review the deployment plan and ',
  bodyStrong: 'check the build status',
  bodyEnd: ' before continuing.',
  captionNote: 'Last deployed in the selected time zone.',
  serviceName: 'Service name',
  deployPreview: 'Deploy preview',
  setupIntro:
    'Put surf-typography on body so dialogs, menus, and other portals take the roles too.',
  codeLabel: 'Typography setup',
  measureStart: 'Reading text stops at ',
  measureEnd:
    ' (54ch), about 70 Latin or 50 Hangul characters per line. Prose and Markdown apply it to paragraphs and lists; tables, code, and images keep the full width.',
  leading:
    'Wrapping text keeps a line height of 1.5 or more, and headings tighten from 1.4 to 1.2 as they grow. Layouts hold at 200% text and with wider text spacing (WCAG 1.4.4, 1.4.12).',
  koreanIntro: "Set lang='ko' on Korean text so these rules apply.",
  korean: [
    'Lines break between words (word-break: keep-all). Only a word longer than the line breaks inside.',
    "Word spaces widen by --surf-type-hangul-word-spacing (0.05em) to match Pretendard's space.",
    'Hangul has no italic. Emphasize with weight 500 instead.',
  ],
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    labTitle: '타이포그래피',
    principles: [
      [
        '크기가 아니라 역할을 고르세요.',
        '역할은 크기, 줄 높이, 자간을 함께 정하므로 어디서든 글이 똑같이 읽힙니다.',
      ],
      [
        '제목 레벨과 역할은 따로 정하세요.',
        'HTML 레벨은 개요를, size는 모양을 정하므로 디자인이 바뀌어도 개요가 맞습니다.',
      ],
      [
        '굵기는 두 가지만 쓰세요.',
        '제목, 버튼, 링크, 강조는 500이고 나머지는 모두 400입니다.',
      ],
      [
        '읽는 줄은 짧게 두세요.',
        '줄이 길면 다음 줄을 찾기 어려우므로 읽기 텍스트는 정해진 줄 길이를 지킵니다.',
      ],
      [
        '글이 커져도 버티게 하세요.',
        '역할 크기는 rem이고 줄 사이가 넉넉해서, 확대하거나 텍스트 간격을 넓혀도 레이아웃이 깨지지 않습니다.',
      ],
    ],
    sections: {
      typefaces: '글꼴',
      roles: '타입 역할',
      measure: '줄 길이와 줄 높이',
      korean: '한국어 조판',
    },
    typefacesIntro:
      '문자마다 글꼴이 따로 있습니다. 다른 언어의 블록에는 lang을 지정해 그 언어의 글꼴에서 글리프를 가져오게 하세요.',
    typefaceTableLabel: '글자별 글꼴',
    typefaceCaption: '글자별 글꼴',
    textHeader: '글자',
    typefaceHeader: '글꼴',
    typefaces: [
      ['라틴 문자와 제목', 'Manrope'],
      ['한국어', 'Pretendard'],
      ['일본어', 'Noto Sans JP'],
      ['코드, 토큰, 값', 'JetBrains Mono'],
    ],
    displaySpecimenCaption: 'Display / Manrope + Pretendard',
    bodySpecimenCaption: 'Body / Manrope, Pretendard, Noto Sans JP',
    sourcesStart: '글꼴 파일은 ',
    sourcesEnd:
      '와 각 글꼴의 패키지에서 받으세요. 글꼴을 재배포하기 전에 라이선스를 확인하세요.',
    rolesIntro:
      '글이 하는 일에 맞춰 역할을 고르세요. display와 title은 화면에 따라 커지고, 나머지 역할은 크기가 하나입니다.',
    typographyRoles: '타이포그래피 역할',
    roleDisplay: '디스플레이',
    roleTitle: '타이틀',
    rolePage: '페이지',
    roleSection: '섹션',
    roleSubsection: '하위 섹션',
    roleReading: '읽기',
    roleBody: '본문',
    roleLabel: '라벨',
    roleCompact: '작은 본문',
    roleCaption: '캡션',
    roleCode: '코드',
    roleMetric: '지표',
    weightsIntro: '아래 견본에서 소제목, 강조, 버튼은 500입니다.',
    subhead: '카드와 열의 소제목',
    bodyStart: '계속하기 전에 배포 계획을 검토하고 ',
    bodyStrong: '빌드 상태를 확인하세요',
    bodyEnd: '.',
    captionNote: '선택한 시간대 기준으로 마지막에 배포했습니다.',
    serviceName: '서비스 이름',
    deployPreview: '배포 미리보기',
    setupIntro:
      'body에 surf-typography를 두면 대화상자, 메뉴 같은 포털도 역할을 따릅니다.',
    codeLabel: '타이포그래피 설정',
    measureStart: '읽기 텍스트는 ',
    measureEnd:
      '(54ch)에서 줄을 바꿉니다. 라틴 문자 약 70자, 한글 약 50자입니다. Prose와 Markdown이 문단과 목록에 적용하고, 테이블, 코드, 이미지는 전체 너비를 씁니다.',
    leading:
      '줄바꿈되는 글은 줄 높이를 1.5 이상으로 두고, 제목은 커질수록 1.4에서 1.2로 좁힙니다. 글자를 200%로 키우거나 텍스트 간격을 넓혀도 레이아웃이 유지됩니다(WCAG 1.4.4, 1.4.12).',
    koreanIntro:
      '한국어 글에는 lang="ko"를 지정해 아래 규칙이 적용되게 하세요.',
    korean: [
      '줄은 어절 사이에서 바꿉니다(word-break: keep-all). 한 줄보다 긴 어절만 안에서 나뉩니다.',
      '어절 사이 공백은 --surf-type-hangul-word-spacing(0.05em)만큼 넓혀 Pretendard의 공백 폭에 맞춥니다.',
      '한글에는 기울임꼴이 없습니다. 강조는 굵기 500으로 하세요.',
    ],
  },
}
