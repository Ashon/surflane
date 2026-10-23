import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '장식용 플레이스홀더로 로딩 콘텐츠의 구조를 미리 봅니다. 부모 영역에 aria-busy와 읽을 수 있는 로딩 메시지를 주세요. 로딩이 끝나면 스켈레톤을 실제 콘텐츠로 교체하세요.',
  avoid:
    '실제 데이터나 입력으로 취급하지 마세요. 예측할 수 없는 구조는 가짜 카드 여러 개 대신 범용 블록 하나를 보여주세요.',
  keyboard:
    'Skeleton은 항상 aria-hidden=true이며 포커스를 받지 않습니다. 부모가 로딩 상태를 한 번 알립니다. reduced motion에서는 펄스가 멈춥니다.',
  props: {
    'style / className': '네이티브 span 레이아웃 재정의',
    'aria-hidden': '항상 true',
  },
}
