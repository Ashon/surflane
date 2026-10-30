import type { DocKo } from './types'
export const doc: DocKo = {
  usage: [
    '리소스의 속성을 용어와 값으로 보여 주세요. 네이티브 dl이라서 스크린 리더는 이름과 값의 쌍으로 읽습니다. Item 하나에 Term 하나와 그 Value를 둡니다.',
    'inline은 값을 용어 옆, 고유 너비의 용어 열 오른쪽에 두고, 줄이 좁으면 용어 아래로 내립니다. stacked는 모든 값을 용어 아래에 둡니다. columns={2}는 두 열이 들어갈 때 항목을 두 열로 놓습니다.',
    '휴대폰에서는 쌍이 자리를 덜 차지합니다. 내용만큼의 폭인 값은 맞으면 용어 옆에 남고, 긴 식별자처럼 맞지 않는 값은 통째로 용어 아래로 내려갑니다.',
    '줄 높이는 그 크기의 메뉴 줄과 같고, compact 밀도에서는 작은 줄입니다. 줄 사이에 선은 없습니다. 용어 열과 리듬이 구조를 보여 줍니다.',
    '긴 값은 어디서든 줄을 바꿔서 식별자가 레이아웃을 밀어내지 않습니다. truncate는 한 줄로 자르되 값 전체는 글자에, 글자 값이면 title에도 남깁니다. copy는 값 뒤에 복사 동작을 두는데, 줄 여백 안으로 들어가 줄 높이를 지키고, 스크린 리더에 용어 이름을 알립니다.',
    '비어 있는 값은 대시나 0이 아니라 흐린 글자로 Not set이라고 적습니다. labels.empty로 바꾸세요.',
  ],
  avoid: [
    '같은 열을 나누는 표 형태의 기록에는 설명 목록 대신 Table을, 핵심 수치에는 Stat을 쓰세요.',
    '값에 폼 전체를 넣지 마세요. 값에는 링크, Badge, time 요소를 둘 수 있고, 편집은 폼에서 합니다.',
    '전체를 읽거나 비교해야 하는 값을 복사 동작이나 다른 확인 방법 없이 자르지 마세요.',
  ],
  keyboard: [
    '목록은 글자이며 Tab 순서에 없습니다. 값 안의 링크와 복사 동작은 Tab 순서에 있습니다.',
    '복사 동작에서 Enter나 Space를 누르면 값을 복사합니다. 결과는 CopyButton처럼 동작 자리에 나타납니다.',
  ],
  props: {
    'Root.columns': '1 | 2: 두 열이 들어갈 때 항목을 두 열로',
    'Root.density':
      'default | compact. 따로 정하지 않으면 SizeProvider 밀도를 따릅니다',
    'Root.labels':
      '{ empty, copy, copied, copyError }: 빈 값과 복사 동작의 글자',
    'Value.truncate':
      '말줄임표가 붙은 한 줄. 글자 값은 title로 전체를 보여 줍니다',
    'Value.copy': 'true는 값의 글자를, 문자열은 그 문자열을 복사합니다',
    'Root style --surf-description-list-term-width / -value-min-width / -column-min-width':
      '용어 열, 그 옆 값의 최소 너비, 열의 최소 너비',
  },
}
