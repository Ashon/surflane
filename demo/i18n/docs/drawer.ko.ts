import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '모바일에서 스와이프로 닫히는 작업 패널을 표시하세요. 키보드 지원과 닫기 버튼도 제공하세요.',
  avoid:
    '닫기 제스처를 완료나 저장으로 취급하지 마세요. 그 동작은 Footer의 명시적 버튼에 두세요. 드래그로만 동작하는 UI를 만들지 마세요. 키보드와 버튼 경로도 제공하세요.',
  keyboard:
    '포커스는 패널 안에 유지됩니다. Escape 또는 닫기 버튼이 패널을 닫습니다. 스와이프로 닫은 후에는 포커스가 Trigger로 돌아갑니다.',
  props: {
    'Root.side': 'left | right | top | bottom; 스와이프 방향을 결정합니다',
    'Content.size': 'small | default | large: 너비 320 / 440 / 640px와 밀도',
    'Content.closeLabel': '접근성 있는 X 레이블',
    'Content.focusBoundaryLabel':
      '가장자리 포커스 가드의 이름입니다. 스크린 리더가 마지막 컨트롤을 지나면 만납니다.',
  },
}
