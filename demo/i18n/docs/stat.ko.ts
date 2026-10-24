import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '대시보드의 핵심 수치를 보여 주세요. 무엇을 재는지, 값, 어떻게 움직였는지, 무엇을 기준으로 하는지를 함께 둡니다. Change는 변화를 숫자로 받아 부호와 화살표를 보이고, 추세 토큰으로 방향에 맞는 색을 칠합니다. 값은 formatNumber, formatCurrency, formatPercent로 서식을 맞추면 모든 화면이 숫자를 같은 방식으로 씁니다.',
  avoid: [
    '방향을 색만으로 보여 주지 마세요. Change는 부호와 화살표를 함께 둡니다. 지우지 마세요.',
    "Caption에 긴 문장을 넣지 마세요. '전일 종가 대비'처럼 기간이나 비교 기준만 쓰세요.",
    '여러 행을 비교해야 하는 값에는 Stat을 쓰지 마세요. 대신 numeric 셀을 쓴 Table을 쓰세요.',
  ],
  keyboard:
    'Stat은 정적인 텍스트입니다. 이름표가 값의 이름이 되는 설명 목록이라 Tab 순서에 들어가지 않습니다. 직접 넣은 링크나 버튼은 각자 포커스를 받습니다.',
  props: {
    'Change.value': '숫자. 부호가 방향을 정합니다',
    'Change.format': '(value) => ReactNode',
    'Change.direction': 'up | down | flat',
    'Change.lowerIsBetter': '하락이 좋은 지표에서 색을 맞바꿉니다',
    'Status.tone':
      "임계값에 대한 값의 상태. '30 GiB 미만'처럼 이유를 글로 함께 씁니다. caution과 danger는 값에도 색을 칠합니다",
    'Group.label':
      '묶음 안의 모든 값이 재는 것. 값들 위에 보이고 묶음의 이름이 됩니다. 각 Stat.Label은 노드처럼 값 하나를 가리킵니다',
    'Root / Label / Value / Caption': '네이티브 dl, dt, dd 속성',
  },
}
