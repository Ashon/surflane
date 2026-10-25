import type { DocKo } from './types'
export const doc: DocKo = {
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
    language:
      'tsx / jsx / typescript / javascript / css / html / json / bash / yaml / python / sql / markdown / text. ts/js/sh/yml 별칭도 받습니다',
    code: '원본 소스 문자열',
    inline: '코드만 렌더링; 주변 pre/scroll 레이아웃은 호출하는 쪽 소유',
    'label / wrap': '스크롤 영역 이름 / 시각적 줄 바꿈',
    ref: '기본 code HTMLElement',
    'SyntaxHighlighting suspense':
      '블록마다 자체 Suspense 경계에서 토큰을 기다리므로 서버 렌더링이 강조된 HTML을 씁니다.',
  },
}
