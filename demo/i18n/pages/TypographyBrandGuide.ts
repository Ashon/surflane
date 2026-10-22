import type { Locale } from '../../i18n'

const en = {
  title: 'Brand type roles',
  introStart:
    "Typeface, weight, and tracking follow each element's role on screen. Latin text uses Manrope, and Korean (Hangul) text uses Pretendard. Body text, controls, and code keep default tracking for comfortable reading density. Headings tighten as they grow, and captions open slightly. Text uses sentence case. API names and identifiers keep their original spelling. Get font files from ",
  introEnd: " and each typeface's public distribution package.",
  tableLabel: 'Brand typography roles',
  caption: 'Typeface, weight, and tracking by role',
  roleHeader: 'Role',
  typefaceHeader: 'Typeface',
  weightHeader: 'Weight',
  trackingHeader: 'Tracking',
  roles: [
    ['Display / hero', 'Manrope', '500', '−0.02em'],
    ['Headline / page and section', 'Manrope', '500', '−0.01em'],
    ['Subhead / card and column', 'Manrope', '500', '−0.01em'],
    ['Body', 'Manrope', '400', '0'],
    ['Emphasis inside body', 'Manrope', '500', '0'],
    ['Caption', 'Manrope', '400', '+0.01em'],
    ['Label', 'Manrope', '400', '0'],
    ['Button and link', 'Manrope', '500', '0'],
    ['Hex, token, spec and code', 'JetBrains Mono', '400', '0'],
  ],
  subhead: 'Card and column subhead',
  bodyStart: 'Review the deployment plan and ',
  bodyStrong: 'check the build status',
  bodyEnd: ' before continuing.',
  captionNote: 'Last deployed in the selected time zone.',
  serviceName: 'Service name',
  deployPreview: 'Deploy preview',
  headingNote:
    "The HTML heading level sets document structure. The Heading size prop sets the visual role. Headings and body text use Manrope, with hierarchy built from size and weight. Labels and captions use 400. Links, buttons, and emphasis in body text use 500. Shared styles keep the browser's default bold from rendering at 700.",
  langNote:
    "Korean uses Pretendard and Japanese uses Noto Sans JP. Set lang on a language block to combine Manrope for Latin text with that language's glyphs. Check each package's license before redistributing font files.",
  scaleNote:
    'The scale below is a set of independent UI role tokens. Choose by reading density: documentation, workspace screens, or data tables.',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    title: '브랜드 타입 역할',
    introStart:
      '타입페이스, 굵기, 자간은 화면에서 각 요소의 역할을 따릅니다. 라틴 텍스트는 Manrope를, 한국어(한글) 텍스트는 Pretendard를 사용합니다. 본문 텍스트, 컨트롤, 코드는 가독성 있는 밀도를 위해 기본 자간을 유지합니다. 제목은 커질수록 자간을 좁히고, 캡션은 조금 넓힙니다. 텍스트는 문장형 대소문자를 사용합니다. API 이름과 식별자는 원래 철자를 유지합니다. 글꼴 파일은',
    introEnd: '와 각 타입페이스의 공개 배포 패키지에서 받으세요.',
    tableLabel: '브랜드 타이포그래피 역할',
    caption: '역할별 타입페이스, 굵기, 자간',
    roleHeader: '역할',
    typefaceHeader: '타입페이스',
    weightHeader: '굵기',
    trackingHeader: '자간',
    roles: [
      ['디스플레이 / 히어로', 'Manrope', '500', '−0.02em'],
      ['헤드라인 / 페이지와 섹션', 'Manrope', '500', '−0.01em'],
      ['서브헤드 / 카드와 컬럼', 'Manrope', '500', '−0.01em'],
      ['본문', 'Manrope', '400', '0'],
      ['본문 내 강조', 'Manrope', '500', '0'],
      ['캡션', 'Manrope', '400', '+0.01em'],
      ['라벨', 'Manrope', '400', '0'],
      ['버튼과 링크', 'Manrope', '500', '0'],
      ['Hex, 토큰, 스펙과 코드', 'JetBrains Mono', '400', '0'],
    ],
    subhead: '카드와 컬럼 서브헤드',
    bodyStart: '배포 계획을 검토하고 계속하기 전에 ',
    bodyStrong: '빌드 상태를 확인하세요',
    bodyEnd: '.',
    captionNote: '선택한 시간대에 마지막으로 배포되었습니다.',
    serviceName: '서비스 이름',
    deployPreview: '배포 미리보기',
    headingNote:
      'HTML heading 레벨은 문서 구조를 정합니다. Heading size prop은 시각적 역할을 정합니다. 제목과 본문 텍스트는 Manrope를 사용하며, 크기와 굵기로 계층을 만듭니다. 라벨과 캡션은 400을 사용합니다. 본문의 링크, 버튼, 강조는 500을 사용합니다. 공유 스타일은 브라우저 기본 bold가 700으로 렌더링되지 않게 합니다.',
    langNote:
      '한국어는 Pretendard를, 일본어는 Noto Sans JP를 사용합니다. 언어 블록에 lang을 설정하면 라틴 텍스트의 Manrope와 해당 언어의 글리프를 결합할 수 있습니다. 글꼴 파일을 재배포하기 전에 각 패키지의 라이선스를 확인하세요.',
    scaleNote:
      '아래 스케일은 독립적인 UI 역할 토큰 집합입니다. 읽기 밀도(문서, workspace 화면, 데이터 테이블)에 따라 선택하세요.',
  },
}
