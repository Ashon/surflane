import type { Locale } from '../../i18n'

const en = {
  principles: [
    [
      'Use one term for each thing.',
      'An action, state, or object keeps its name on every screen, so two words never seem to mean two things.',
    ],
    [
      'Lead with the outcome, then the next step.',
      'Readers act on the first words they see, so keep error codes and internal terms in details.',
    ],
    [
      'Translate whole sentences.',
      'Word order and plurals differ by language, so never build a sentence from fragments.',
    ],
    [
      "Format values in the reader's locale and time zone.",
      'Pass both to Intl explicitly, with the same values on the server and the client, so the first render matches.',
    ],
  ],
  sections: {
    writing: 'Interface text',
    formatting: 'Numbers, dates, and time zones',
    direction: 'Language and direction',
    labels: 'Component labels',
  },
  writingTableLabel: 'Interface writing examples',
  writingTableCaption: 'The same complete sentences in English and Korean',
  writingColumns: ['Context', 'English', 'Korean sample', 'Check'],
  copyExamples: [
    { context: 'Action', review: 'The specific action and object' },
    { context: 'Progress', review: 'Not described as done' },
    { context: 'Empty result', review: 'No data told apart from no matches' },
    {
      context: 'Permission',
      review: 'The cause and a path the reader can take',
    },
    {
      context: 'Partial failure',
      review: 'The scope and the next step, not mistaken for success',
    },
  ],
  writingErrorBefore:
    'A recoverable error names the cause and the fix, and keeps what the reader entered. Report success only when the work is done. ',
  writingErrorLink: 'Accessibility',
  writingErrorAfter: ' covers where results stay and how they are announced.',
  writingKorean:
    'Korean copy describes with -합니다 and instructs with -하세요, attaches a counter to its numeral (검사 2개), and avoids translationese such as -에 대한 and -을 통해.',
  formattingIntro:
    "The locale sets number and date formats, and the time zone sets an instant's local time. Change both below, and compare the times around a DST change with the UTC source. Currency stays USD.",
  formattingLocaleLabel: 'Formatting locale',
  localeEnglish: 'English / United States',
  localeKorean: 'Korean / South Korea',
  displayTimeZoneLabel: 'Display time zone',
  sourceInstantLabel: 'Source instant (UTC)',
  instantBeforeSpringDst: 'Before spring DST change',
  instantAfterSpringDst: 'After spring DST change',
  instantFirstAutumn: 'First autumn 01:30',
  instantSecondAutumn: 'Second autumn 01:30',
  runCountLabel: 'Recorded run count',
  localizedFormatPreview: 'Localized format preview',
  sourceNoteBefore: 'Source: ',
  sourceNoteAfter:
    '. The relative time uses a fixed reference, not the current time.',
  formattingRules:
    "Validate invalid dates, NaN, and unsupported locales at the data boundary, and treat them as errors. Don't show zero or the current time for a missing value. Never parse a display string back into a value.",
  codeLabel: 'Locale-aware formatting',
  directionIntro:
    'lang sets the language, and dir sets the reading direction. Isolate names that readers enter with dir="auto", and Latin identifiers with bdi dir="ltr". The RTL preview checks layout only.',
  rtlPreview: 'RTL preview',
  resourceNameLabel: 'Resource name preview',
  resourceNameDescription:
    'Try a long name, Korean or Arabic text, or text that looks like HTML. It shows as text and is never sent.',
  mixedDirectionPreview: 'Mixed direction preview',
  previewProject: 'Project:',
  untitledPreview: 'Untitled preview',
  previewResourceId: 'Resource ID:',
  truncationNote:
    "Wrap text instead of truncating it, and use start and end spacing. Don't hide names, amounts, or identifiers behind an ellipsis in errors and confirmations.",
  ecma402: 'ECMA-402 — Intl formatting',
  w3cLanguage: 'W3C — Language declarations',
  w3cDirection: 'W3C — Text direction',
  labelsIntro:
    "Components write some text of their own: the names of close and copy buttons, the announcements of an upload, a chart's data table. Translate it once for the app with LabelsProvider, instead of on every instance. KoreanLabels from @surflane/ui/labels-ko writes all of it in Korean.",
  labelsCodeLabel: 'Translating component labels',
  labelsOrder:
    "A component's own props win over the provider's labels, and those over the component's English defaults. A provider inside another changes the groups it names and keeps the rest.",
  labelsServer:
    'KoreanLabels takes no functions, so a Server Component can render it. Breadcrumbs and Spinner render on the server and take their names as props.',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    principles: [
      [
        '하나에는 용어 하나만 쓰세요.',
        '동작, 상태, 대상의 이름이 모든 화면에서 같아야 두 단어가 서로 다른 것처럼 보이지 않습니다.',
      ],
      [
        '결과를 먼저, 다음 단계를 이어서 쓰세요.',
        '읽는 사람은 첫머리를 보고 움직이므로 오류 코드와 내부 용어는 세부 정보에 두세요.',
      ],
      [
        '문장 단위로 번역하세요.',
        '어순과 복수 표현은 언어마다 다르므로 조각을 이어 문장을 만들지 마세요.',
      ],
      [
        '값은 사용자의 로케일과 시간대로 표시하세요.',
        '첫 렌더링이 일치하도록 서버와 클라이언트 모두 Intl에 둘을 명시해 전달하세요.',
      ],
    ],
    sections: {
      writing: '인터페이스 문구',
      formatting: '숫자, 날짜, 시간대',
      direction: '언어와 방향',
      labels: '컴포넌트 레이블',
    },
    writingTableLabel: '인터페이스 문구 예시',
    writingTableCaption: '영어와 한국어로 쓴 같은 완전한 문장',
    writingColumns: ['상황', '영어', '한국어 예시', '확인할 것'],
    copyExamples: [
      { context: '동작', review: '구체적인 동작과 대상' },
      { context: '진행 중', review: '완료처럼 쓰지 않음' },
      { context: '빈 결과', review: '데이터 없음과 결과 없음의 구분' },
      { context: '권한', review: '원인과 사용자가 할 수 있는 방법' },
      { context: '부분 실패', review: '범위와 다음 단계, 성공으로 오해 없음' },
    ],
    writingErrorBefore:
      '복구할 수 있는 오류는 원인과 해결 방법을 알리고 입력값을 유지합니다. 성공은 작업이 실제로 끝났을 때만 알리세요. 결과를 어디에 남기고 어떻게 알릴지는 ',
    writingErrorLink: '접근성',
    writingErrorAfter: '에서 다룹니다.',
    writingKorean:
      '한국어 문구는 설명에 -합니다, 안내에 -하세요를 쓰고, 단위는 숫자에 붙이며(검사 2개), -에 대한이나 -을 통해 같은 번역투를 피합니다.',
    formattingIntro:
      '로케일은 숫자와 날짜 형식을, 시간대는 순간의 현지 시각을 정합니다. 아래에서 둘을 바꾸고 DST 변경 전후 시각을 UTC 원본과 비교해 보세요. 통화는 USD로 고정입니다.',
    formattingLocaleLabel: '표기 로케일',
    localeEnglish: '영어 / 미국',
    localeKorean: '한국어 / 대한민국',
    displayTimeZoneLabel: '표시 시간대',
    sourceInstantLabel: '원본 순간 (UTC)',
    instantBeforeSpringDst: '봄 DST 변경 전',
    instantAfterSpringDst: '봄 DST 변경 후',
    instantFirstAutumn: '가을 첫 번째 01:30',
    instantSecondAutumn: '가을 두 번째 01:30',
    runCountLabel: '기록된 실행 수',
    localizedFormatPreview: '현지화된 표기 미리보기',
    sourceNoteBefore: '원본: ',
    sourceNoteAfter: '. 상대 시간은 현재 시각이 아닌 고정된 기준을 씁니다.',
    formattingRules:
      '잘못된 날짜, NaN, 지원하지 않는 로케일은 데이터 경계에서 검증하고 오류로 처리하세요. 빈 값을 0이나 현재 시각으로 표시하지 마세요. 표시용 문자열을 다시 값으로 파싱하지 마세요.',
    codeLabel: '로케일을 따르는 표기',
    directionIntro:
      'lang은 언어를, dir은 읽는 방향을 정합니다. 사용자가 입력한 이름은 dir="auto"로, 라틴 문자 식별자는 bdi dir="ltr"로 격리하세요. RTL 미리보기는 레이아웃만 확인합니다.',
    rtlPreview: 'RTL 미리보기',
    resourceNameLabel: '리소스 이름 미리보기',
    resourceNameDescription:
      '긴 이름, 한국어나 아랍어, HTML처럼 보이는 텍스트를 넣어 보세요. 텍스트로만 표시되고 전송되지 않습니다.',
    mixedDirectionPreview: '혼합 방향 미리보기',
    previewProject: '프로젝트:',
    untitledPreview: '제목 없는 미리보기',
    previewResourceId: '리소스 ID:',
    truncationNote:
      '텍스트는 자르지 말고 줄을 바꾸고, 여백은 start와 end 방향으로 주세요. 오류와 확인 문구에서 이름, 금액, 식별자를 말줄임표로 숨기지 마세요.',
    ecma402: 'ECMA-402 — Intl 형식',
    w3cLanguage: 'W3C — 언어 선언',
    w3cDirection: 'W3C — 텍스트 방향',
    labelsIntro:
      '컴포넌트는 닫기·복사 버튼의 이름, 업로드 알림, 차트의 데이터 표처럼 직접 쓰는 글이 있습니다. 인스턴스마다 넘기지 말고 LabelsProvider로 앱에서 한 번 번역하세요. @surflane/ui/labels-ko의 KoreanLabels는 이 글을 모두 한국어로 씁니다.',
    labelsCodeLabel: '컴포넌트 레이블 번역',
    labelsOrder:
      '컴포넌트에 직접 준 속성이 provider의 레이블보다, provider의 레이블이 컴포넌트의 영어 기본값보다 우선합니다. provider 안의 provider는 이름을 준 묶음만 바꾸고 나머지는 그대로 둡니다.',
    labelsServer:
      'KoreanLabels는 함수를 받지 않아서 Server Component에서 렌더링할 수 있습니다. Breadcrumbs와 Spinner는 서버에서 렌더링되므로 이름을 속성으로 받습니다.',
  },
}
