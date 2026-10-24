import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '버튼의 강조도를 의미와 별개로 정하세요. primary는 영역당 핵심 동작 하나를 표시합니다. secondary(테두리 없는 중립 서피스)와 outline(유일한 테두리 변형)은 보조 동작을 표시하고, ghost는 낮은 강조도를 표시합니다. destructive는 어떤 우선순위에서든 위험을 알립니다. variant를 주지 않으면 primary입니다. 예전 이름인 default는 폐기 예정입니다.',
  avoid:
    '페이지 내비게이션에 Button을 사용하지 마세요. 버튼 모양이면서 링크로 남는 LinkButton을 사용하세요. destructive 동작을 색만으로 표시하지 마세요. 라벨 텍스트에 동작을 설명하세요.',
  keyboard:
    'Tab은 포커스를 이동합니다. Enter 또는 Space는 버튼을 활성화합니다. 동작이 진행되는 동안 버튼은 중복 실행을 막고 결과를 알립니다.',
}
