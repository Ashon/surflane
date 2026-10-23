import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '최상위에서 현재 위치까지의 경로를 순서 목록으로 보여주세요. 긴 경로는 접히지 않고 줄바꿈되어 읽는 순서가 유지됩니다.',
  avoid:
    '스크린 리더가 경로 구분자를 읽지 않게 하세요. 대신 장식 Separator를 사용하세요. 현재 위치는 aria-current=page로 표시하세요. 라우터 로직은 제품에 유지하세요.',
  keyboard:
    'Tab으로 상위 링크에 이동하고 Enter로 엽니다. 현재 위치는 Tab 정지점이 아닙니다.',
  props: {
    'Root.aria-label': '접근 가능한 내비게이션 이름',
    Link: '공유 네이티브 Link',
    Current: 'aria-current=page가 있는 span',
  },
}
