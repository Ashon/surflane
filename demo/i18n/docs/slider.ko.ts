import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '경계 안에서 근삿값이나 범위를 조정하세요. 값을 단위와 함께 표시하세요. 정밀 조정에는 NumberField와 함께 쓰세요.',
  avoid: [
    '정확한 값이 중요한데 드래그만 경로로 두지 마세요. 대신 NumberField를 추가하세요.',
    '범위의 두 엄지에 같은 이름을 주지 마세요. 각 Thumb에 별도의 aria-label을 설정하세요.',
    '현재 값을 색으로만 전달하지 마세요. Value에 단위와 함께 표시하세요.',
  ],
  keyboard: [
    'Tab은 각 Thumb의 range input으로 이동합니다.',
    '화살표 키는 step만큼, Page Up과 Page Down은 largeStep만큼 이동합니다. Home과 End는 경계로 점프합니다.',
    '기본 thumbAlignment=edge는 엄지를 컨트롤 안에 유지합니다.',
    '폼 초기화는 uncontrolled 값만 복원합니다. controlled 값은 유지하고, 취소된 초기화를 존중합니다.',
    '각 범위 엄지에 고유한 이름과 단위를 주세요.',
  ],
  props: {
    'Root.value / defaultValue':
      '제네릭이 보존된 number 또는 readonly number[]',
    'Root.min / max / step / largeStep': '숫자 경계와 키보드 증가분',
    'Root.minStepsBetweenValues / thumbCollisionBehavior':
      '최소 범위 간격 / push | swap | none',
    'Root.onValueChange / onValueCommitted':
      '취소 가능한 변경 / 완료된 인터랙션 콜백',
    'Root.name / form / disabled': '네이티브 폼 소유권과 비활성 상태',
    'Thumb.index / aria-label / getAriaValueText':
      '범위 엄지 순서, 접근 가능 이름, 단위',
  },
}
