import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '관련 정보와 액션을 한 표면에 모으세요. 기본 24px 패딩이 네 면을 균형 잡고, 간격이 제목·설명·본문·액션의 위계를 만듭니다. 카드 그리드 텍스트를 주변 본문 텍스트와 정렬하려면 Grid.bleed와 Card.Root.padding을 같은 토큰 단계로 설정하세요. 바깥 컨테이너에 확장된 표면과 포커스 표시기를 담을 공간이 있을 때만 이렇게 하세요.',
  avoid:
    '모든 페이지 구획을 카드로 감싸거나 카드 안에 카드를 쌓지 마세요. 대신 구획을 제목과 간격으로 나누세요. 카드 전체를 가짜 버튼으로 만들지 마세요. 대신 목적 있는 링크와 버튼을 안에 두세요.',
  keyboard:
    '액션만 Tab 순서에 들어갑니다. Root는 포커스나 클릭 동작이 없는 일반 div입니다. Title.level을 주변 제목 위계에 맞추세요. 카드에 그룹 이름이 필요하면 aria-labelledby로 연결하세요.',
  props: {
    'Root.padding': '공유 Space 토큰 단계',
    'Header / Body / Footer': '네이티브 div 속성',
    Description: '네이티브 p 속성',
  },
}
