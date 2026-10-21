import type { DocKo } from './types'
export const richContentDocsKo: Record<string, DocKo> = {
  'syntax-highlighter': {
    usage:
      'Platform Quiet에서 소스 코드를 강조합니다. 중립 표면과 저채도 OKLCH 색을 쓰는 전용 코드 테마입니다. 키워드는 보라색, 문자열은 세이지, 함수와 타입은 파란색, 숫자는 앰버입니다. 속성과 구두점은 중립을 유지하고 주석은 이탤릭이나 흐린 불투명도 없이 읽기 쉽게 유지합니다. 복사 액션은 이 하이라이터를 공유하는 CodeBlock을 사용하세요.',
    avoid: [
      '강조를 코드 검증이나 실행 결과로 제시하지 마세요. 별도로 보고하세요.',
      'HTML을 주입하거나 소스를 실행하지 마세요. 일반 코드 문자열로 전달하세요.',
      '공백, 줄 바꿈, 한글 텍스트를 제거하거나 자동 수정하지 마세요. 원본 소스를 그대로 전달하세요.',
      '모든 소스가 강조되길 기대하지 마세요. 지원하지 않는 언어, 엔진 로드 실패, 50,000자 초과 소스는 일반 텍스트로 유지됩니다.',
    ],
    keyboard:
      '소스는 기본 텍스트 선택과 복사를 유지합니다. ScrollArea에서 가로로 스크롤됩니다. wrap을 설정하면 소스를 바꾸지 않고 시각적으로 줄을 끊습니다. 색은 두 테마 모두에서 최소 4.5:1을 충족하고 강제 색 모드에서는 시스템 텍스트 색을 사용합니다.',
    props: {
      code: '원본 소스 문자열',
      inline: '코드만 렌더링; 주변 pre/scroll 레이아웃은 호출하는 쪽 소유',
      'label / wrap': '스크롤 영역 이름 / 시각적 줄 바꿈',
      ref: '기본 code HTMLElement',
    },
  },
  markdown: {
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
  },
}
