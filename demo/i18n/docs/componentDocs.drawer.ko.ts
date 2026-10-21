import type { DocKo } from './types'

export const docKo: Record<string, DocKo> = {
  drawer: {
    usage:
      '모바일에서 스와이프로 닫히는 작업 패널을 표시하세요. 키보드 지원과 닫기 버튼도 제공하세요.',
    avoid:
      '닫기 제스처를 완료나 저장으로 취급하지 마세요. 그 동작은 Footer의 명시적 버튼에 두세요. 드래그로만 동작하는 UI를 만들지 마세요. 키보드와 버튼 경로도 제공하세요.',
    keyboard:
      '포커스는 패널 안에 유지됩니다. Escape 또는 닫기 버튼이 패널을 닫습니다. 스와이프로 닫은 후에는 포커스가 Trigger로 돌아갑니다.',
    props: {
      'Root.side': 'left | right | top | bottom; 스와이프 방향을 결정합니다',
      'Content.closeLabel': '접근성 있는 X 레이블',
    },
  },
}
