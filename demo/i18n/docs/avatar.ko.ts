import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '사용자 이미지를 보여주세요. 이미지가 없거나 로드에 실패하면 이니셜이나 SVG가 fallback으로 표시됩니다. alt 텍스트나 Root name을 설정해 가까운 이름이 두 번 읽히지 않게 하세요. Status는 이미지와 분리된 장식 배지입니다. 실제 상태는 Root의 aria-description이나 인접 텍스트로 노출하세요.',
  avoid:
    'Avatar span 자체를 계정 메뉴로 만들지 마세요. 이름이 있는 button이나 Popover.Trigger로 감싸세요.',
  keyboard:
    '정적 Avatar는 Tab 순서에 없습니다. button 안에서는 button이 포커스와 동작을 제공합니다.',
  props: {
    'Fallback.delay': 'fallback 전 밀리초',
    Status:
      '장식 코너 마커; aria-hidden 설정하고 Root 또는 인접 텍스트에서 가용성 설명',
  },
}
