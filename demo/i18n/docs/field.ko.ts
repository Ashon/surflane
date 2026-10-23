import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '라벨, 설명, 오류를 입력에 연결하세요. 같은 Field 안에서는 공유 Input이나 Select가 Field.Control을 대체할 수 있습니다.',
  avoid:
    '플레이스홀더를 라벨 대신 사용하지 마세요. Field.Label을 사용하세요. 색만으로 오류를 보여주지 마세요. Field.Error에 메시지를 작성하세요.',
  keyboard:
    '라벨을 클릭하면 입력에 포커스가 갑니다. 폼 제출 시 첫 번째 유효하지 않은 입력으로 포커스가 이동합니다. aria-describedby가 설명과 오류를 입력에 연결합니다.',
  props: {
    'Root.name / disabled / invalid': 'Base UI 필드 상태',
  },
}
