import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '검증 또는 복구 코드처럼 짧고 고정 길이의 값을 입력하세요. 각 슬롯은 실제 입력입니다. 한 번에 도착하는 붙여넣기나 자동 완성 값은 슬롯 전체에 채워집니다. Field.Label이 첫 슬롯을 이름 짓습니다. 나머지 슬롯은 위치별 aria-label로 이름을 지으세요.',
  avoid: [
    '일반 비밀번호나 긴 식별자를 슬롯으로 나누지 마세요. 대신 단일 Input을 사용하세요.',
    '완료된 입력을 성공적인 검증으로 취급하지 마세요. 서버 검증, 만료, 재전송을 제품에서 처리하세요.',
    '로그나 상태 메시지에 실제 코드를 반복하지 마세요. 값이 아닌 상태를 보고하세요.',
    'mask를 암호화로 취급하지 마세요. 값만 시각적으로 숨길 뿐 제출된 값을 암호화하지 않습니다.',
  ],
  keyboard:
    '입력하면 다음 슬롯으로 이동합니다. 화살표 키, Home, End는 슬롯 사이를 이동합니다. Backspace와 Delete는 편집합니다. 전체 코드 붙여넣기와 IME 조합이 작동합니다. 방향은 DirectionProvider와 DOM dir을 모두 설정하세요. disabled는 편집과 제출에서 필드를 제외합니다. readOnly는 읽기 가능하고 제출된 상태로 유지합니다.',
  props: {
    'Root.length': '양의 정수; 정확히 이 개수의 Input 파트 렌더링',
    'Root.value / defaultValue / onValueChange':
      '문자열 상태; event.cancel()이 변경을 거부',
    'Root.validationType / normalizeValue':
      'numeric | alpha | alphanumeric | none; 멱등 정규화기',
    'Root.onValueInvalid / onValueComplete':
      '거부 문자 / 완료 항목 콜백; 인증 결과가 아님',
    'Root.autoComplete / inputMode': '첫 슬롯과 검증 입력 힌트',
    'Root.autoSubmit': '완료 시 소유 폼의 requestSubmit() 호출; 명시적 옵트인',
    'Root.name / form / required':
      '단일 제출 값; 외부 폼 소유권; 네이티브 검증',
    'Root.disabled / readOnly / mask':
      '비활성 / 편집 불가 / 시각적 문자 마스킹',
    'Input.aria-label': '첫 슬롯 이후 슬롯의 위치별 라벨',
    'Group / Separator':
      '선택적 flex 그룹화; 장식 Separator는 aria-hidden=true',
    'render / ref / className': '실제 DOM ref와 Base UI 상태 콜백',
  },
}
