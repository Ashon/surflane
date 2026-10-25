import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '현재 목록을 벗어나지 않고 리소스 상세나 설정을 확인하세요. 긴 콘텐츠는 Body에 넣으세요. Body는 독립적으로 스크롤됩니다.',
  avoid:
    '겹쳐진 패널에 같은 콘텐츠를 반복하지 마세요. 각 상세 정보는 한 패널에만 두세요.',
  keyboard:
    '포커스 트래핑, Escape, 포커스 복원은 Dialog에서처럼 동작합니다. 패널 안의 Select가 먼저 닫힙니다.',
  props: {
    'Content.closeLabel': '접근성 있는 X 레이블',
    'Content.focusBoundaryLabel':
      '가장자리 포커스 가드의 이름입니다. 스크린 리더가 마지막 컨트롤을 지나면 만납니다.',
  },
}
