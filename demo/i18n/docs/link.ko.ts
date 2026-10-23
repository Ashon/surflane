import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '실제 href로 목적지에 이동하세요. 밑줄과 포커스 링이 이동을 보여줍니다.',
  avoid:
    '액션에 href 없는 링크를 사용하지 마세요. 대신 Button을 사용하세요. 링크가 새 탭을 열 때는 텍스트에 밝히고 rel을 설정하세요.',
  keyboard:
    'Tab으로 링크에 이동하고 Enter로 엽니다. 보조 키 클릭, 새 탭, 다운로드, 해시 내비게이션은 브라우저 기본값을 유지합니다.',
  props: {
    'href / target / rel / download': '네이티브 anchor props',
  },
}
