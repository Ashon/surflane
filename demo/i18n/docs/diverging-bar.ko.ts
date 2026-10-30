import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    "시장 대비 섹터 수익률이나 목표 대비 비중 차이처럼 부호 있는 값을 가운데 선에서 그리세요. 오르면 줄의 끝 쪽으로, 내리면 시작 쪽으로 자랍니다. 나란히 놓인 막대에는 같은 max를 주어 척도를 맞추세요. 오름과 내림은 Stat, Sparkline처럼 추세 색을 받고, 좋고 나쁨이 없는 차이에는 trend='neutral'로 둘 다 브랜드 표식으로 그립니다. 부호 있는 값 여러 개의 순위에는 BarList의 diverging을 쓰세요.",
  avoid: [
    '0 아래로 내려갈 수 없는 값에는 DivergingBar를 쓰지 마세요. Meter나 BarList를 쓰세요.',
    '값을 막대에만 두지 마세요. +4.2%p처럼 부호를 붙여 막대 옆에도 쓰세요.',
  ],
  keyboard:
    'DivergingBar는 이름 붙은 이미지이며 Tab 순서에 없습니다. label은 "반도체, 시장 대비 +4.2%p"처럼 값과 비교 기준을 말합니다. 오른쪽에서 왼쪽으로 쓸 때는 오름이 왼쪽으로 자랍니다.',
  props: {
    value: '부호 있는 값',
    label: '이미지의 이름이자 값을 말하는 글',
    max: '목록에서 가장 큰 차이처럼, 막대 절반이 나타내는 크기',
    trend:
      'auto는 오름과 내림에 색을 주고, neutral은 둘 다 브랜드 표식으로 그립니다',
    lowerIsBetter: '내림이 좋은 측정에서 색을 바꿉니다',
  },
}
