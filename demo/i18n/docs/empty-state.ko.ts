import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '보여줄 것이 없는 이유를 설명하고 가능한 다음 단계를 제시하세요. 첫 사용, 검색 결과 없음, 권한 부족을 구분하세요. 다른 콘텐츠가 있으면 화면 전체를 대체하지 말고 관련 영역에 상태를 보여주세요.',
  avoid:
    '오류를 빈 성공 상태로 제시하지 마세요. 대신 InlineMessage를 사용하세요. 권한이 없는 것을 만들도록 유도하지 마세요. 수행할 수 없는 액션을 기본 버튼으로 만들지 마세요. 대신 권한 안내를 제공하세요.',
  keyboard:
    '포커스를 받거나 라이브 영역을 만들지 않습니다. Title.level을 주변 제목 위계에 맞게 설정하세요. 검색 지우기, 항목 만들기, 권한 안내를 명확히 이름 붙인 버튼이나 링크로 제공하세요.',
  props: {
    Root: '네이티브 div 속성; 자동 role이나 포커스 없음',
    Title: '네이티브 heading 속성 + level (2–6)',
    Icon: '네이티브 div 속성; 장식 SVG에는 aria-hidden 설정',
    'Description / Actions': '네이티브 p / div 속성',
  },
}
