import type { DocKo } from './types'
export const doc: DocKo = {
  usage: [
    '사용자 이미지를 보여주세요. 이미지가 없거나 로드에 실패하면 이니셜이나 SVG가 fallback으로 표시됩니다. alt 텍스트나 Root name을 설정해 가까운 이름이 두 번 읽히지 않게 하세요. Status는 이미지와 분리된 장식 배지입니다. 실제 상태는 Root의 aria-description이나 인접 텍스트로 노출하세요.',
    '프로젝트, 세션, 호스트처럼 사진이 없는 대상에는 category={categoryFor(name)}을 설정하세요. 같은 이름은 12가지 카테고리 색 중 늘 같은 색을 받고, 그 색이 이니셜 뒤를 옅게 채웁니다. 이니셜은 잉크색 그대로입니다.',
    'Status.tone은 StatusBadge의 톤으로 마커를 칠합니다. live는 지금 작업 중인 세션처럼 일이 진행되는 동안 마커를 맥동시키고, 모션 줄이기 설정에서는 멈춥니다. 상태는 이름 옆의 StatusBadge처럼 글로도 알려 주세요. 묶음의 개수 옆처럼 아바타가 없는 곳에는 같은 점을 StatusDot으로 따로 둡니다.',
  ],
  avoid: [
    'Avatar span 자체를 계정 메뉴로 만들지 마세요. 이름이 있는 button이나 Popover.Trigger로 감싸세요.',
    '카테고리 색을 손으로 고르거나 상태에 따라 바꾸지 마세요. categoryFor를 쓰면 어느 화면에서든 같은 이름이 같은 색을 지킵니다. 상태는 Status와 StatusBadge로 나타내세요.',
  ],
  keyboard:
    '정적 Avatar는 Tab 순서에 없습니다. button 안에서는 button이 포커스와 동작을 제공합니다.',
  props: {
    'Root.category':
      '1–12: fallback 뒤의 카테고리 색. categoryFor(name)이 이름에서 하나를 고릅니다',
    'Image.onLoadingStatusChange': 'idle | loading | loaded | error 콜백',
    'Fallback.delay': 'fallback 전 밀리초',
    Status:
      '보조 기술에 보이지 않는 장식용 모서리 마커입니다. 상태는 Root나 인접 글로 설명하세요',
    'Status.tone': 'neutral | info | success | danger | caution | progress',
    'Status.live': '작업이 진행되는 동안 마커를 맥동시킵니다',
  },
}
