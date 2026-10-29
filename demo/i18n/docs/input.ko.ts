import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '짧은 한 줄 텍스트를 입력하세요. 입력한 뒤에도 라벨이 보이게 유지하세요.',
  avoid:
    'placeholder를 유일한 라벨로 사용하지 마세요. 대신 보이는 라벨을 추가하세요. 오류는 input에 연결된 텍스트로 설명하세요.',
  keyboard:
    'Tab은 포커스를 이동합니다. 네이티브 텍스트 편집과 한글 IME 입력은 계속 동작합니다.',
  props: {
    mono: '식별자, 키, 경로처럼 글자 하나하나 읽는 값을 컨트롤 크기 그대로 코드 서체로 씁니다',
    'name / required / readOnly / disabled': '네이티브 input props',
  },
}
