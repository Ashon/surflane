import type { Locale } from '../../i18n'

const en = {
  instantBeforeSpringDst: 'Before spring DST change',
  instantAfterSpringDst: 'After spring DST change',
  instantFirstAutumn: 'First autumn 01:30',
  instantSecondAutumn: 'Second autumn 01:30',
  copyExamples: [
    {
      context: 'Action',
      review: 'Name the specific action and object.',
    },
    {
      context: 'Progress',
      review: "Don't describe work in progress as complete.",
    },
    {
      context: 'Empty result',
      review: 'Distinguish no data from no matching results.',
    },
    {
      context: 'Permission',
      review: 'State the cause and a recovery path the user can take.',
    },
    {
      context: 'Partial failure',
      review:
        "State the scope and the next step so it isn't mistaken for full success.",
    },
  ],
  tocOnThisPage: 'On this page',
  tocPrinciples: 'Principles',
  tocFormatting: 'Formatting',
  tocLanguageDirection: 'Language Direction',
  tocWriting: 'Writing',
  tocApplication: 'Application',
  principlesHeading: 'Meaning before formatting',
  principlesIntro:
    'Use one term for each action, state, and object across every screen. Lead with the outcome the user needs, then the next step. Keep internal error codes, stack traces, and implementation terms in reviewable details. Translate whole sentences as units. Never build word order or plurals by joining word fragments.',
  principlesProductBefore: "The product sets the document's base ",
  principlesProductAfter:
    ", the user's language and time zone settings, and the message translations. Pass translated labels, errors, and close button names to shared components. Changing the browser language doesn't translate product copy.",
  formattingHeading: 'One value, explicit locale and time zone',
  formattingIntro:
    "The locale sets number and date formats. The time zone sets the local time of an instant. The settings below apply only to this example. Currency stays USD and isn't converted when the locale changes. Compare the skipped and repeated times around DST changes with the UTC source and offset.",
  formattingLocaleLabel: 'Formatting locale',
  displayTimeZoneLabel: 'Display time zone',
  sourceInstantLabel: 'Source instant (UTC)',
  runCountLabel: 'Recorded run count',
  localizedFormatPreview: 'Localized format preview',
  sourceNoteBefore: 'Source: ',
  sourceNoteAfter:
    ". The relative time is a local example and doesn't follow the current time. In a real service, manage the refresh interval, reference time, and server–client clock difference separately.",
  displayContractNote:
    "The code above is a display contract. Validate invalid dates, NaN, infinity, and unsupported locales or time zones at the data boundary. Handle them as errors. Don't substitute zero or the current time for an empty value. Date-only values, scheduled local times, durations, and UTC instants are different domain values. Never parse a display string back.",
  languageDirectionHeading: 'Language and direction are separate',
  languageDirectionLangAfter: ' sets the language, and ',
  languageDirectionDirAfter:
    ' sets the base reading direction. Isolate user-entered names with ',
  languageDirectionAutoAfter: ' and stable Latin-script identifiers with ',
  languageDirectionBdiAfter:
    ". The RTL preview only checks layout. It doesn't mean an Arabic translation is provided.",
  rtlPreview: 'RTL preview',
  resourceNameLabel: 'Resource name preview',
  resourceNameDescription:
    'Try a long name, Korean or Arabic text, or text that looks like HTML. Input is shown only as text and is never submitted.',
  mixedDirectionPreview: 'Mixed direction preview',
  previewProject: 'Project:',
  untitledPreview: 'Untitled preview',
  previewResourceId: 'Resource ID:',
  truncationNote:
    "Prefer wrapping and logical (start/end) spacing. In errors and confirmations, don't hide names, amounts, or key identifiers behind an ellipsis or a hover-only tooltip. When a table truncates, keep the full text reachable by keyboard and touch.",
  writingHeading: 'Write the outcome and a useful next step',
  writingTableLabel: 'Interface writing examples',
  writingTableCaption: 'The same complete sentences in English and Korean',
  writingColumns: ['Context', 'English', 'Korean sample', 'Review'],
  writingErrorNote:
    'A recoverable error connects the cause, the fix, and the preserved input. Keep Field.Error, InlineMessage, and result records persistently visible. Never rely on a Toast alone to report a failure or a recovery path. Report success only when the work has actually completed.',
  applicationHeading: 'Content implementation rules',
  implementationRules: [
    'Preserve user-entered names and identifiers exactly as entered. Show occurrence times with the selected time zone and offset.',
    'Keep identifiers, quantities, and units distinct. Zero and an unknown quantity are different states.',
    'Preserve the content language and proper names. Localize date formats and link purpose.',
    'Pass the same locale and time zone to SSR and the client, so the first render matches.',
  ],
  seeAlsoIntro: 'See also the shared guidance on',
  seeAlsoTypography: 'typography',
  seeAlsoAccessibility: 'label, error, and focus contracts',
  seeAlsoNumberField: 'Number Field locale',
  seeAlsoAnd: 'and',
  seeAlsoToast: 'persistent recovery paths',
  seeAlsoOutro:
    ". This page doesn't mean the whole product is translated, external services are connected, or production rollout is complete.",
  referencesLabel: 'References:',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    instantBeforeSpringDst: '봄 DST 변경 전',
    instantAfterSpringDst: '봄 DST 변경 후',
    instantFirstAutumn: '가을 첫 번째 01:30',
    instantSecondAutumn: '가을 두 번째 01:30',
    copyExamples: [
      {
        context: '액션',
        review: '구체적인 액션과 대상의 이름을 명시하세요.',
      },
      {
        context: '진행 상태',
        review: '진행 중인 작업을 완료된 것처럼 표현하지 마세요.',
      },
      {
        context: '빈 결과',
        review: '데이터가 없는 경우와 일치하는 결과가 없는 경우를 구분하세요.',
      },
      {
        context: '권한',
        review: '원인과 사용자가 취할 수 있는 복구 방법을 명시하세요.',
      },
      {
        context: '부분 실패',
        review: '전체 성공으로 오해하지 않도록 범위와 다음 단계를 명시하세요.',
      },
    ],
    tocOnThisPage: '이 페이지 목차',
    tocPrinciples: '원칙',
    tocFormatting: '표기 형식',
    tocLanguageDirection: '언어 방향',
    tocWriting: '문구 작성',
    tocApplication: '적용',
    principlesHeading: '형식보다 의미가 먼저',
    principlesIntro:
      '모든 화면에서 액션, 상태, 대상마다 하나의 용어를 사용하세요. 사용자가 필요한 결과를 먼저 알리고 다음 단계를 안내하세요. 내부 오류 코드, 스택 트레이스, 구현 용어는 검토 가능한 상세 정보에만 두세요. 문장 전체를 하나의 단위로 번역하세요. 단어 조각을 이어 붙여 어순이나 복수를 만들지 마세요.',
    principlesProductBefore: '제품이 문서의 기본 ',
    principlesProductAfter:
      ' 값, 사용자의 언어와 시간대 설정, 메시지 번역을 결정합니다. 번역된 레이블, 오류, 닫기 버튼 이름을 공용 컴포넌트에 전달하세요. 브라우저 언어를 바꿔도 제품 문구는 번역되지 않습니다.',
    formattingHeading: '값은 하나, 로케일과 시간대는 명시적으로',
    formattingIntro:
      '로케일이 숫자와 날짜 형식을 정합니다. 시간대가 순간의 현지 시각을 정합니다. 아래 설정은 이 예시에만 적용됩니다. 통화는 USD를 유지하며 로케일이 바뀌어도 변환되지 않습니다. DST 변경 전후에 건너뛰어지거나 반복되는 시각을 UTC 원본과 오프셋과 함께 비교해 보세요.',
    formattingLocaleLabel: '표기 형식 로케일',
    displayTimeZoneLabel: '표시 시간대',
    sourceInstantLabel: '원본 순간 (UTC)',
    runCountLabel: '기록된 실행 수',
    localizedFormatPreview: '현지화된 표기 형식 미리보기',
    sourceNoteBefore: '원본: ',
    sourceNoteAfter:
      '입니다. 상대 시간은 로컬 예시이며 현재 시각을 따르지 않습니다. 실제 서비스에서는 새로고침 주기, 기준 시각, 서버와 클라이언트 간 시계 차이를 따로 관리하세요.',
    displayContractNote:
      '위 코드는 표시 계약입니다. 잘못된 날짜, NaN, 무한대, 지원되지 않는 로케일이나 시간대는 데이터 경계에서 검증하고 오류로 처리하세요. 빈 값 대신 0이나 현재 시각을 대입하지 마세요. 날짜만 있는 값, 예약된 현지 시각, 기간, UTC 순간은 서로 다른 도메인 값입니다. 표시용 문자열을 다시 파싱하지 마세요.',
    languageDirectionHeading: '언어와 방향은 별개입니다',
    languageDirectionLangAfter: '이 언어를 지정하고, ',
    languageDirectionDirAfter:
      '이 기본 읽기 방향을 지정합니다. 사용자가 입력한 이름은 ',
    languageDirectionAutoAfter: '로, 안정적인 라틴 문자 식별자는 ',
    languageDirectionBdiAfter:
      '으로 격리하세요. RTL 미리보기는 레이아웃만 확인합니다. 아랍어 번역이 제공된다는 의미는 아닙니다.',
    rtlPreview: 'RTL 미리보기',
    resourceNameLabel: '리소스 이름 미리보기',
    resourceNameDescription:
      '긴 이름, 한국어 또는 아랍어 텍스트, HTML처럼 보이는 텍스트를 입력해 보세요. 입력은 텍스트로만 표시되며 제출되지 않습니다.',
    mixedDirectionPreview: '혼합 방향 미리보기',
    previewProject: '프로젝트:',
    untitledPreview: '제목 없는 미리보기',
    previewResourceId: '리소스 ID:',
    truncationNote:
      '줄 바꿈과 논리적(start/end) 간격을 우선하세요. 오류와 확인 문구에서 이름, 금액, 핵심 식별자를 말줄임표나 호버 시에만 보이는 툴팁으로 숨기지 마세요. 표에서 텍스트가 잘릴 때 키보드와 터치로 전체 텍스트에 도달할 수 있게 하세요.',
    writingHeading: '결과와 유용한 다음 단계를 작성하세요',
    writingTableLabel: '인터페이스 문구 예시',
    writingTableCaption: '영어와 한국어로 작성한 동일한 완전한 문장',
    writingColumns: ['상황', '영어', '한국어 예시', '검토'],
    writingErrorNote:
      '복구 가능한 오류는 원인, 수정 방법, 보존된 입력을 연결합니다. Field.Error, InlineMessage, 결과 기록을 계속 보이게 두세요. 실패나 복구 경로를 알릴 때 Toast에만 의존하지 마세요. 작업이 실제로 완료된 경우에만 성공을 보고하세요.',
    applicationHeading: '콘텐츠 구현 규칙',
    implementationRules: [
      '사용자가 입력한 이름과 식별자는 입력된 그대로 보존하세요. 발생 시각은 선택한 시간대와 오프셋과 함께 표시하세요.',
      '식별자, 수량, 단위를 명확히 구분하세요. 0과 알 수 없는 수량은 서로 다른 상태입니다.',
      '콘텐츠 언어와 고유명사는 보존하세요. 날짜 형식과 링크의 목적은 현지화하세요.',
      '최초 렌더링이 일치하도록 SSR과 클라이언트에 동일한 로케일과 시간대를 전달하세요.',
    ],
    seeAlsoIntro: '다음 공통 가이드도 참고하세요:',
    seeAlsoTypography: '타이포그래피',
    seeAlsoAccessibility: '레이블, 오류, 포커스 계약',
    seeAlsoNumberField: 'Number Field 로케일',
    seeAlsoAnd: '그리고',
    seeAlsoToast: '계속 보이는 복구 경로',
    seeAlsoOutro:
      '. 이 페이지는 제품 전체가 번역되었거나 외부 서비스가 연결되었거나 프로덕션 배포가 완료되었음을 의미하지 않습니다.',
    referencesLabel: '참고 자료:',
  },
}
