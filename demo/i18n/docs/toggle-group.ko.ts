import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '관련 표시 모드나 필터를 그룹화하세요. multiple=true면 여러 항목이, 아니면 최대 한 항목이 눌립니다. 단일 모드에서도 값은 항상 배열입니다.',
  avoid:
    '폼이 정확히 하나의 선택을 요구하면 RadioGroup을 사용하세요. 눌린 상태는 aria-selected가 아닌 aria-pressed가 전달하게 하세요. 시각적 레이아웃에 맞춰 orientation을 설정하세요.',
  keyboard:
    '그룹은 단일 Tab 정지점입니다. 화살표 키, Home, End는 포커스만 이동합니다. Enter나 Space는 포커스된 항목을 선택합니다. 비활성 항목은 건너뜁니다. RTL에서는 DirectionProvider와 DOM dir을 모두 설정하세요.',
  props: {
    'value / defaultValue': '읽기 전용 string[]; 일반 값 유니온 보존',
    onValueChange: '(values, eventDetails) => void; cancel() 지원',
    multiple: '여러 개의 눌린 항목 허용',
    'orientation / loopFocus': 'horizontal | vertical / 순환 포커스',
    disabled: '모든 토글 비활성화',
    'aria-label / aria-labelledby': '관련 명령 그룹 이름 지정',
  },
}
