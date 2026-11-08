import type { DocKo } from './types'
export const doc: DocKo = {
  usage: [
    '관련 정보와 액션을 한 표면에 모으세요. 기본 24px 패딩이 네 면을 균형 잡고, 간격이 제목·설명·본문·액션의 위계를 만듭니다. 카드 그리드 텍스트를 주변 본문 텍스트와 정렬하려면 Grid.bleed와 Card.Root.padding을 같은 토큰 단계로 설정하세요. 바깥 컨테이너에 확장된 표면과 포커스 표시기를 담을 공간이 있을 때만 이렇게 하세요.',
    '한 줄에서 더 높은 옆 카드에 맞춰 늘어나도 카드는 내용을 위에, Footer를 아래에 둡니다. 그래서 같은 줄 카드의 푸터가 나란히 맞습니다. Meter 같은 막대는 Footer에서 한 줄을 다 씁니다.',
    '항목 상세처럼 무언가를 여는 카드에는 Title 안에 Card.Action을 두세요. 버튼이나 href가 있는 링크가 카드 전체를 덮고, hover, press, focus가 카드 전체에 보입니다. 카드의 다른 컨트롤은 그 위에 남아 제 동작을 그대로 합니다.',
    "비슷한 항목을 모은 컬렉션에서는 패딩을 카드와 밀도에 맡기세요. 그리드를 SizeProvider density='compact'로 감싸면 모든 카드가 한꺼번에 촘촘해집니다. 부분마다 놓을 자리는 레이아웃 파운데이션의 컬렉션 절을 보세요.",
  ],
  avoid: [
    '모든 페이지 구획을 카드로 감싸거나 카드 안에 카드를 쌓지 마세요. 대신 구획을 제목과 간격으로 나누세요. 데이터 패널마다 면이 되는 대시보드는 예외이니 Dashboard.Panel을 쓰세요.',
    '카드 자체를 버튼으로 만들거나 링크로 감싸지 마세요. 대신 Card.Action을 쓰세요. 제목 안에 이름이 있는 대상 하나를 두고, 카드의 다른 컨트롤도 그대로 동작합니다.',
    '카드의 띠, 테두리, 면에 색을 칠해 상태를 나타내지 마세요. 대신 StatusBadge로 상태를 글로 말하세요.',
  ],
  keyboard:
    '액션만 Tab 순서에 들어갑니다. Root는 포커스나 클릭 동작이 없는 일반 div입니다. Card.Action을 쓰면 카드에서 Tab이 멈추는 곳은 그 액션 하나이고, 포커스 링은 카드 전체를 둘러쌉니다. Title.level을 주변 제목 위계에 맞추세요. 카드에 그룹 이름이 필요하면 aria-labelledby로 연결하세요.',
  props: {
    'Root.padding': '공유 Space 토큰 단계',
    'Root.size':
      'small | default | large: SizeProvider처럼 패딩, 제목, 안의 컨트롤 크기를 정합니다',
    'Title.lines':
      '최대 줄 수. 마지막 줄은 말줄임으로 끝나고 Action의 글자도 같이 잘려, 컬렉션의 모든 카드가 제목 높이를 지킵니다',
    Action:
      '카드 위로 퍼지는 버튼, 또는 href가 있는 링크. Sheet.Trigger render={<Card.Action />}처럼 trigger의 render로 쓰면 카드를 눌러 그것을 엽니다',
    'Header / Body / Footer / Description': '네이티브 div 또는 p 속성과 size',
  },
}
