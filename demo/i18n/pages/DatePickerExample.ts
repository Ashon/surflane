import type { Locale } from '../../i18n'

const en = {
  locale: 'Locale',
  disableDateControls: 'Disable date controls',
  readOnly: 'Read only',
  unavailableWeekends: 'Unavailable weekends',
  dateTimePreview: 'Date and time preview',
  noLocalFormSubmitted: 'No local form submitted.',
  formReset: 'Form reset. This example restores the controlled values.',
  zonedInstant: (instant: string) => `zoned instant: ${instant}`,
  none: 'none',
  runDate: 'Run date',
  runDateDescription:
    'October–December 2026. Enter segments or open the calendar.',
  runDateError:
    'Choose an available date between October 1 and December 31, 2026.',
  releaseWindow: 'Release window',
  releaseWindowDescription:
    'Start and end are inclusive. Unavailable days cannot be crossed.',
  releaseWindowError:
    'Choose an ordered, available date range within October–December 2026.',
  startTime: 'Start time',
  startTimeDescription:
    '09:00–18:00. Wall-clock time, with no assumed date or time zone.',
  startTimeError: 'Enter a time from 09:00 through 18:00.',
  zonedExecution: 'Zoned execution',
  zonedExecutionDescription:
    'The time-zone abbreviation stays visible. Changing the display zone keeps the instant.',
  submitLocalDates: 'Submit local dates',
  resetLocalDates: 'Reset local dates',
  clearRunDate: 'Clear run date',
  changeDisplayZone: 'Change display zone',
  dateFormResult: 'Date form result',
  runDateStatus: (date: string, range: string) =>
    `Run date: ${date}; range: ${range}`,
  zonedValueStatus: (value: string, instant: string) =>
    `${value}; instant: ${instant}`,
  noZonedDate: 'No zoned date',
  resolveLocalTimeHeading: 'Resolve a local time explicitly',
  resolveLocalTimeIntro:
    "A calendar date isn't an instant. A local date and time needs an IANA zone. DST gaps and repeated times need a stated policy.",
  timeZone: 'Time zone',
  dstDisambiguation: 'DST disambiguation',
  rejectGapsOverlaps: 'Reject gaps and overlaps',
  explicitEarlierInstant: 'Explicit earlier instant',
  explicitLaterInstant: 'Explicit later instant',
  localWallTime: 'Local wall time',
  localWallTimeDescription:
    'No time zone is assumed while editing these segments.',
  enterCompleteLocalDateTime: 'Enter a complete local date and time.',
  dstAmbiguousError:
    'This local time is skipped or occurs twice in this zone. Choose an explicit earlier or later policy, or another local time.',
  resolveLocalTime: 'Resolve local time',
  dstOverlap: 'DST overlap',
  dstGap: 'DST gap',
  normalLocalTime: 'Normal local time',
  localTimeNeedsDecision: 'Local time needs a decision',
  resolvedLocalTime: 'Resolved local time',
  resolvedInstantStatus: (value: string, instant: string) =>
    `${value} | instant: ${instant}`,
  noInstantResolved: 'No instant resolved.',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    locale: '로케일',
    disableDateControls: '날짜 컨트롤 비활성화',
    readOnly: '읽기 전용',
    unavailableWeekends: '주말 사용 불가',
    dateTimePreview: '날짜 및 시간 미리보기',
    noLocalFormSubmitted: '제출된 로컬 폼이 없습니다.',
    formReset: '폼이 초기화되었습니다. 이 예시는 제어된 값을 복원합니다.',
    zonedInstant: (instant: string) => `절대 시각: ${instant}`,
    none: '없음',
    runDate: '실행 날짜',
    runDateDescription:
      '2026년 10월~12월입니다. 세그먼트에 입력하거나 캘린더를 여세요.',
    runDateError:
      '2026년 10월 1일부터 12월 31일 사이의 사용 가능한 날짜를 선택하세요.',
    releaseWindow: '출시 기간',
    releaseWindowDescription:
      '시작일과 종료일 모두 포함됩니다. 사용 불가 날짜는 범위에 포함할 수 없습니다.',
    releaseWindowError:
      '2026년 10월부터 12월까지 사이에 있고 시작일이 종료일보다 앞서는 사용 가능한 날짜 범위를 선택하세요.',
    startTime: '시작 시간',
    startTimeDescription:
      '09:00–18:00입니다. 날짜나 시간대를 가정하지 않는 벽시각입니다.',
    startTimeError: '09:00부터 18:00까지의 시간을 입력하세요.',
    zonedExecution: '시간대 지정 실행',
    zonedExecutionDescription:
      '시간대 약어가 계속 표시됩니다. 표시 시간대를 바꾸어도 절대 시각은 유지됩니다.',
    submitLocalDates: '로컬 날짜 제출',
    resetLocalDates: '로컬 날짜 초기화',
    clearRunDate: '실행 날짜 지우기',
    changeDisplayZone: '표시 시간대 변경',
    dateFormResult: '날짜 폼 결과',
    runDateStatus: (date: string, range: string) =>
      `실행 날짜: ${date}; 범위: ${range}`,
    zonedValueStatus: (value: string, instant: string) =>
      `${value}; 절대 시각: ${instant}`,
    noZonedDate: '시간대 지정 날짜 없음',
    resolveLocalTimeHeading: '로컬 시각을 명시적으로 확정하기',
    resolveLocalTimeIntro:
      '캘린더 날짜는 절대 시각이 아닙니다. 로컬 날짜와 시간에는 IANA 시간대가 필요합니다. DST로 빠지거나 반복되는 시각에는 명시적인 정책이 필요합니다.',
    timeZone: '시간대',
    dstDisambiguation: 'DST 모호성 처리',
    rejectGapsOverlaps: '빠지거나 반복되는 시각 거부',
    explicitEarlierInstant: '명시적으로 앞선 절대 시각 선택',
    explicitLaterInstant: '명시적으로 늦은 절대 시각 선택',
    localWallTime: '로컬 벽시각',
    localWallTimeDescription:
      '이 세그먼트를 편집하는 동안에는 시간대를 가정하지 않습니다.',
    enterCompleteLocalDateTime: '로컬 날짜와 시간을 모두 입력하세요.',
    dstAmbiguousError:
      '이 로컬 시각은 해당 시간대에서 빠지거나 두 번 발생합니다. 명시적으로 앞선 시각이나 늦은 시각 중 하나를 선택하는 정책을 고르거나 다른 로컬 시각을 사용하세요.',
    resolveLocalTime: '로컬 시각 확정',
    dstOverlap: 'DST 중복 시각',
    dstGap: 'DST 누락 시각',
    normalLocalTime: '일반 로컬 시각',
    localTimeNeedsDecision: '로컬 시각 결정 필요',
    resolvedLocalTime: '확정된 로컬 시각',
    resolvedInstantStatus: (value: string, instant: string) =>
      `${value} | 절대 시각: ${instant}`,
    noInstantResolved: '확정된 절대 시각이 없습니다.',
  },
}
