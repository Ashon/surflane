import type { DocKo } from './types'
export const doc: DocKo = {
  usage: [
    '기간, 거래 방향, 정렬처럼 짧은 옵션 2~5개 중 값 하나를 고르세요. 값은 배열이 아니라 문자열입니다. aria-label로 묶음의 이름을 붙이세요.',
    '세그먼트 하나는 늘 골라져 있고, 다시 눌러도 그대로입니다. required={false}면 고른 세그먼트를 다시 눌러 필터처럼 선택을 풀 수 있고, 값은 null이 됩니다.',
    "width='fill'은 시트에서처럼 트랙을 컨테이너 너비로 늘리고 세그먼트가 너비를 나눕니다. 세그먼트는 CSS 전용 .surf-control-group과 같아서 React가 없는 페이지와도 맞습니다.",
  ],
  avoid: [
    '콘텐츠 패널을 바꿀 때는 Tabs를, 폼이 제출하는 선택에는 RadioGroup을, 서로 독립인 옵션 여러 개에는 ToggleGroup을 쓰세요.',
    '세그먼트를 5개보다 많이 두거나 레이블을 길게 쓰지 마세요. 대신 Select를 쓰세요.',
  ],
  keyboard: [
    '묶음은 Tab 정지점 하나입니다. 화살표 키, Home, End로 포커스를 옮기고, Enter나 Space로 포커스된 세그먼트를 고릅니다.',
    '각 세그먼트는 눌렸는지를 알리는 버튼입니다.',
  ],
  props: {
    'Root.value / defaultValue': '고른 값, 문자열. 아무것도 고르지 않으면 null',
    'Root.onValueChange':
      '(value) => void. required인 동안 null이 오지 않습니다',
    'Root.required': 'false면 고른 세그먼트를 다시 눌러 선택을 풉니다',
    'Root.size / disabled': 'small | default | large / 모든 세그먼트 비활성화',
    'Item.value': '세그먼트가 고르는 문자열',
  },
}
