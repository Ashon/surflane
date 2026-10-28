import type { DocKo } from './types'
export const doc: DocKo = {
  usage: [
    '데이터를 기다리는 콘텐츠는 DataState로 감싸서 불러오는 중, 실패, 빈 상태가 같은 모양으로 보이지 않게 하세요. state가 데이터의 상태를 말합니다. 준비되면 콘텐츠가 보이고, 오래된 값이면 주의 아래에 남습니다.',
    'loading은 placeholderHeight 높이의 자리를 그려서 데이터가 와도 아무것도 움직이지 않습니다. error는 message에 무엇이 실패했는지 적고, onRetry가 있으면 다시 시도를 둡니다. 다시 시도한 뒤 포커스는 retryFocus로, 없으면 DataState로 옮겨 갑니다. empty는 왜 비었는지와 다음에 할 일을 적습니다.',
    'refreshing은 새 데이터가 오는 동안 콘텐츠를 흐리게 둔 채 바쁜 상태로 알립니다. Dashboard.Panel은 본문을 DataState로 그리고, 제목 옆에 자체 스피너를 둡니다.',
    'layout의 inline은 다른 글 옆 한 줄에, block은 카드나 영역에 들어갑니다. page는 아직 내용이 없는 페이지 전체 자리를 대신합니다. 로딩, 오류, 빈 상태 안내는 페이지 자리 가운데에 놓이고, ready와 stale 내용은 자기 레이아웃을 그대로 씁니다.',
  ],
  avoid: [
    '데이터만 보고 상태를 정하지 마세요. 빈 결과와 실패 모두 데이터가 없습니다. 요청의 상태에서 가져오세요.',
    '새로 고치는 동안 콘텐츠를 지우거나, 오류를 0으로 보여 주지 마세요.',
    '무엇이 실패했고 독자가 무엇을 할 수 있는지 적으세요. 막연한 실패 문구만 두지 마세요.',
  ],
  keyboard: [
    '다시 시도 버튼은 Tab 순서에 있고, Enter나 Space로 다시 시도합니다.',
    '다시 시도로 버튼이 사라지면 포커스는 페이지가 아니라 retryFocus나 DataState로 옮겨 갑니다.',
  ],
  props: {
    refreshing: '콘텐츠를 흐리게 두고 바쁜 상태로 표시',
    onRetry: '오류나 오래된 값과 함께 다시 시도를 보여 줍니다',
    message: '실패한 이유나 빈 이유',
    placeholderHeight: '불러오는 중 자리의 높이',
    retryFocus: '다시 시도 뒤 포커스가 갈 곳의 ref',
    labels:
      '{ loading, refreshing, error, stale, retry, empty }. LabelsProvider에서도 받습니다',
  },
}
