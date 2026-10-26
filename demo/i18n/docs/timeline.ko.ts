import type { DocKo } from './types'
export const doc: DocKo = {
  usage: [
    '배포 기록, 감사 로그, 작업 단계처럼 시간 순서의 사건을 보여 주세요. 순서 있는 목록이며 aria-label로 이름을 붙입니다. Item 하나가 사건 하나이고, 톤의 아이콘으로 표시합니다.',
    'Item 안에서 Title은 무슨 일이 있었는지, Time은 언제인지를 dateTime이 있는 time 요소로 적습니다. Status는 상태를 톤의 글자색으로 글로 적고, Description은 누가 했는지나 얼마나 걸렸는지를 덧붙입니다. 이 순서로 적으면 스크린 리더가 무엇, 언제, 어떻게 끝났는지를 차례로 읽습니다.',
    '이어 주는 선은 없습니다. 아이콘 열이 순서를 보여 줍니다. current는 지금 진행 중인 단계를 한 단계 들어간 면에 두고 현재 단계로 알립니다.',
    'Detail은 로그, 차이, 변경 목록을 펼침 뒤에 둡니다. 열면 한 단계 들어간 면 위에 놓이고, 레이블은 제목과 줄을 맞춥니다.',
  ],
  avoid: [
    '독자가 정렬하거나 거르는 기록에는 타임라인 대신 Table을 쓰세요.',
    '색이나 아이콘만으로 상태를 전하지 마세요. Status에 글로 적으세요.',
    '5분 전처럼 상대 시간만 적지 마세요. 절대 시각을 dateTime과 글이나 title에 남기세요.',
  ],
  keyboard: [
    '목록은 포커스를 받지 않습니다. Tab은 각 Detail의 펼침 버튼과 사건 안의 링크에 닿습니다.',
    'Enter나 Space로 Detail을 열고 닫습니다.',
  ],
  props: {
    'Item.icon': '톤의 아이콘 대신 쓸 표시. 예: Spinner',
    'Item.current': '지금 진행 중인 단계: 한 단계 들어간 면, aria-current=step',
    'Time.dateTime': '기계가 읽는 시각',
    'Detail.summary / defaultOpen / open / onOpenChange':
      'Collapsible과 같은 펼침의 레이블과 상태',
  },
}
