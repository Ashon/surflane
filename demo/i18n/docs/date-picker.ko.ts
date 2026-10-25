import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '로케일 형식으로 날짜, 날짜 범위, 또는 시간을 입력하거나 캘린더에서 선택하세요. React Aria의 분할 입력, 캘린더 그리드, 범위 선택을 공유 폼 표면에서 구성합니다. DateLocaleProvider가 로케일 형식을 설정합니다. 예시는 한국어, 영어, RTL을 다룹니다. 최소/최대, 사용 불가 날짜, 필수 값, 폼 제출, 리셋이 검증됩니다.',
  avoid: [
    '날짜 타입을 서로 바꿔 쓰지 마세요. 캘린더 날짜에는 CalendarDate, 로컬 날짜-시간에는 CalendarDateTime, 인스턴트에는 ZonedDateTime, 벽시계 시간에는 Time을 사용하세요.',
    '날짜 전용 값을 UTC 자정으로 변환하지 마세요. CalendarDate로 유지하세요.',
    'IANA 시간대와 명시적 DST 정책 없이 실제 실행 시간을 저장하지 마세요.',
    '모호하거나 존재하지 않는 로컬 시간에 대해 사용자 대신 이전/이후를 선택하지 마세요. 기본적으로 예시는 이러한 시간을 거부합니다.',
    '이 라이브러리를 Temporal이나 서버 측 일정·권한 검증의 대체재로 취급하지 마세요.',
    '날짜 객체를 변경하지 마세요. 불변으로 유지하고 같은 타입을 쓰세요.',
    '폼 리셋이 제어된 값을 복원하리라 기대하지 마세요. onReset에서 직접 리셋하세요.',
  ],
  keyboard: [
    'Tab, Shift+Tab, 왼쪽·오른쪽 화살표 키가 세그먼트 사이를 이동합니다.',
    '숫자를 입력해 세그먼트를 채우세요. 위·아래 화살표는 값을 늘리고 줄이며, Home, End, Backspace, Delete는 편집합니다.',
    '캘린더에서 화살표 키는 일 단위로, Page Up과 Page Down은 월 단위로 이동합니다. Shift+Page Up과 Shift+Page Down은 연 단위로 이동합니다.',
    '캘린더 버튼에서 Enter 또는 Space를 누르면 캘린더가 열립니다. 캘린더에서 Enter 또는 Space는 날짜, 또는 범위의 시작과 끝을 선택합니다.',
    'Escape는 캘린더를 닫고 포커스를 트리거로 돌려보냅니다.',
    '비활성 값은 편집할 수 없습니다. 읽기 전용 값은 탐색하고 읽을 수 있지만 변경할 수는 없습니다.',
    '팝업은 충돌을 피하고 터치 선택이 동작합니다.',
    '각 날짜·시간 세그먼트는 spinbutton입니다.',
  ],
  props: {
    'DatePicker / DateRangePicker / TimeField':
      '일반 날짜/시간 값; label 문자열 필수',
    'value / defaultValue / onValueChange':
      'CalendarDate, CalendarDateTime, ZonedDateTime; TimeField는 Time도 허용; 범위는 {start,end} 사용',
    'DateLocaleProvider.locale':
      '로케일 + 선택적 캘린더 확장; 필드 값은 원래 캘린더를 유지',
    'minValue / maxValue / isDateUnavailable':
      '타입이 지정된 값 경계; 날짜/날짜-범위의 unavailable 콜백; 기본적으로 범위는 사용 불가 날짜를 건너지 못함',
    'name / startName / endName':
      '네이티브 ISO 폼 값; 범위는 별도의 start/end 이름 사용',
    'required / invalid / validate / validationBehavior':
      'required, 호출자/서버 오류 플래그, 사용자 지정 검증; 네이티브 제출 검증 또는 aria 모드',
    'disabled / readOnly':
      'disabled는 인터랙션을 막고; read-only는 접근 가능한 값을 유지',
    size: 'small | default | large: 필드와 캘린더의 크기. react-aria의 isDisabled, isReadOnly, isRequired, isInvalid, isOpen, onChange도 동작하지만 폐기 예정입니다',
    'description / errorMessage':
      '연결된 도움말과 검증 오류; error는 ValidationResult를 렌더할 수 있음',
    'granularity / hourCycle / hideTimeZone':
      '일/시/분/초; 12 또는 24; zoned 값은 영역을 표시 유지',
    'calendarLabel / open / onOpenChange':
      '캘린더 다이얼로그 이름은 필드 label로 기본 설정; 제어된 오버레이 지원',
    'ref / className': '루트 div ref; 문자열 또는 업스트림 상태 렌더 함수',
  },
}
