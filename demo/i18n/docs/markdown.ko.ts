import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    'CommonMark 문서와 GFM 테이블, 작업 목록, 취소선, 각주를 공유 읽기 스타일로 렌더링합니다. 코드 펜스는 CodeBlock의 강조, 복사 액션, 가로 스크롤을 재사용합니다.',
  avoid:
    'MDX나 실행 가능한 HTML을 렌더링하지 마세요. CommonMark나 GFM 소스를 전달하세요. 작업 목록은 읽기 전용이므로 폼 입력으로 사용하지 마세요. Checkbox를 사용하세요. 원격 문서 가져오기, 권한, 링크 대상, 이미지 표시 여부는 호출하는 화면이 결정합니다.',
  keyboard:
    'Tab은 링크와 복사 버튼에 도달하고 Enter는 기본적으로 실행합니다. heading은 기본적으로 h2에서 시작합니다. 각 인스턴스의 내부 링크는 자신의 ID를 가리킵니다. HTML은 제외되고 기본 URL 정책은 안전하지 않은 URL을 차단합니다. 긴 테이블과 코드는 문서를 넘치게 하지 않고 각각 스크롤됩니다.',
  props: {
    source: 'CommonMark + GitHub flavored Markdown 문자열',
    label: 'article과 중첩 code/table 영역 이름',
    headingLevel:
      'Markdown h1을 이 의미 수준으로 렌더링; 더 깊은 heading은 h6으로 제한',
    codeWrap: '복사된 텍스트를 바꾸지 않고 펜스 코드를 시각적으로 줄 바꿈',
    'ref / className': '루트 HTMLDivElement / 추가 클래스',
  },
}
