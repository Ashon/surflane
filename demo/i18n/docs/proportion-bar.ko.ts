import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '긍정·부정·중립 뉴스, 시장별 포트폴리오, 팀별 GPU 시간처럼 전체 하나를 부분으로 나누세요. 부분은 차트의 범주 색을 순서대로 받습니다. 방향으로 읽히는 부분에는 tone을 주세요. up과 down은 추세 색을, flat은 조용한 중립 표식을 씁니다. 범례는 각 부분의 이름과 함께 비율, 값 또는 둘 다를 씁니다.',
  avoid: [
    '합쳐서 전체가 되지 않는 값에는 ProportionBar를 쓰지 마세요. BarList로 순위를 보여 주세요.',
    '읽는 사람이 구별할 수 있는 수, 여섯 개 남짓보다 많이 나누지 마세요. 작은 부분은 기타처럼 하나로 묶으세요.',
    '한도에 대한 값 하나에는 ProportionBar를 쓰지 마세요. Meter를 쓰세요.',
  ],
  keyboard:
    'ProportionBar는 글 목록을 담은 이름 붙은 그룹입니다. 항목마다 부분의 이름과 값을 읽습니다. 막대는 장식이므로 부분을 색만으로 구별하게 하지 않습니다. legendHidden이어도 범례는 보조 기술에 남습니다.',
  props: {
    label: '전체의 이름',
    segments:
      '읽기 전용 {id, label, value, text?, tone?, color?}[]. tone은 up | down | flat, color는 var(--surf-brand-mark) 같은 직접 고른 색입니다',
    show: 'value | share | both: 범례가 각 부분에 쓰는 내용',
    legendHidden:
      '막대 주변 글이 이미 말할 때 범례를 숨깁니다. 보조 기술은 그대로 읽습니다',
    'formatValue / locale': 'text가 없는 값을 쓰는 함수 / Intl 숫자 locale',
  },
}
