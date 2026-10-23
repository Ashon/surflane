import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '같은 종류의 결과를 페이지별로 탐색하게 하세요. 목록 뒤에 배치합니다. 페이지 내 상태에는 onPageChange를, 실제 URL 내비게이션에는 getPageHref를 사용하세요. 현재 페이지는 aria-current=page를 가집니다.',
  avoid: [
    '짧은 목록을 나누지 마세요. 대신 전체 목록을 보여주세요.',
    '단계별 입력 흐름에는 사용하지 마세요. 대신 폼 자체의 Back과 Next 액션을 사용하세요.',
    '필터 변경으로 유효하지 않게 된 페이지를 요청하지 마세요. 대신 page를 새 pageCount로 클램프하세요.',
    '커서 기반 내비게이션이 알 수 없을 때 전체 페이지 수를 지어내지 마세요. 대신 일반 Previous/Next 버튼을 사용하세요.',
  ],
  keyboard: [
    'Tab은 컨트롤 사이를 이동합니다.',
    'Enter는 컨트롤을 활성화하고 버튼은 Space에도 응답합니다. 링크는 새 탭 열기 같은 브라우저 동작을 유지합니다.',
    '페이지가 하나 이하일 때 Pagination은 아무것도 렌더링하지 않습니다. 작은 화면에서는 Previous, Next, 현재/전체 페이지 요약을 보여줍니다.',
    '결과 알림 방식, 로딩 표시, 페이지 변경 후 포커스 위치는 호출하는 쪽이 결정합니다.',
  ],
  props: {
    'page / pageCount': '1부터 시작하는 제어 페이지 / 전체 페이지 수',
    'onPageChange | getPageHref': '상호 배타적인 상태 콜백 또는 URL 빌더',
    disabled: '현재 페이지를 바꾸지 않고 모든 컨트롤 비활성화',
    'aria-label': '내비게이션 랜드마크 이름',
  },
}
