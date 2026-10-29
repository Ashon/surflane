import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '여러 줄 설명과 메모를 입력하세요. 텍스트는 위에서 시작합니다. 사용자는 필드를 세로로 크기 조절할 수 있습니다. Field.Root 안에서는 필드의 라벨, 설명, 오류를 그대로 받습니다.',
  avoid:
    '대량의 코드를 편집하는 데 사용하지 마세요. 전용 코드 편집기를 사용하세요.',
  keyboard:
    'Enter는 줄 바꿈을 삽입합니다. Tab은 다음 입력으로 이동합니다. 네이티브 텍스트 편집과 한국어 IME 입력이 계속 작동합니다.',
  props: {
    mono: 'Markdown이나 JSON 같은 소스를 CodeBlock처럼 코드 서체와 code 역할로 씁니다. 터치에서는 16px을 유지합니다',
    'rows / maxLength / required / disabled / readOnly':
      '네이티브 textarea props',
    variant:
      'default | embedded: embedded는 테두리 없이 담긴 면을 채우고, 포커스는 안쪽 링으로 보입니다',
  },
}
