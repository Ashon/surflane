import type { DocKo } from './types'

export const docKo: Record<string, DocKo> = {
  tooltip: {
    usage:
      '호버와 키보드 포커스 시 짧은 보조 설명을 표시하세요. 포커스 가능한 Trigger 하나를 감싸세요.',
    avoid:
      'Base UI 1.9에서 Tooltip은 시각적 보조 레이블입니다. 접근 가능한 이름에 의존하지 마세요. 이름은 Trigger 자체에 지정하세요. 필수 설명이나 인터랙티브 요소를 넣지 마세요. 대신 페이지 콘텐츠나 Popover를 사용하세요.',
    keyboard:
      'Trigger에 포커스하면 Tooltip이 표시됩니다. Escape로 닫습니다. Tooltip은 절대 포커스를 받지 않습니다.',
    props: {},
  },
}
