import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '끝날 작업의 진행률을 표시합니다. 총량을 모를 때는 value=null로 설정하세요. 실제 작업 상태에서 값을 끌어오세요. 완료 결과는 별도로 알리세요.',
  avoid:
    '시간이 지났다고 진행률을 올리지 마세요. 실제 작업에서 업데이트하세요. 사용량 표시에는 Meter를 사용하세요.',
  keyboard:
    'Progress는 상태 표시이며 Tab 순서에 없습니다. Label이 접근 가능한 이름을 제공합니다. min, max, value props는 aria-valuetext와 함께 단위를 전달합니다. 빈번한 값 변경마다 live region으로 알리지 마세요. 대신 완료 결과를 알리세요.',
  props: {
    'Root.locale / format': 'Intl locale / 숫자 형식',
    'Root.aria-valuetext / getAriaValueText': '사람이 읽을 수 있는 단위',
  },
}
