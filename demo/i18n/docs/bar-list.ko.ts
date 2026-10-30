import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '디렉토리별 디스크, 프로젝트별 토큰, 도구별 호출처럼 단위가 같은 이름 붙은 값의 순위를 보여 주세요. 줄마다 이름, 막대, 값이 한 줄에 놓이고, 이름 아래에 경로 같은 detail을 둘 수 있습니다. 막대는 가장 큰 값에, 값들이 같은 한도를 나눠 쓰면 max에 비례합니다. 대시보드 카드 안의 긴 순위에는 maxRows를 주세요. diverging을 주면 섹터별 시장 대비 차이처럼 부호 있는 값이 한 척도로 가운데 선에서 자랍니다. 오르면 줄의 끝 쪽으로 추세의 오름 색, 내리면 시작 쪽으로 내림 색입니다.',
  avoid: [
    '한 목록에 단위를 섞지 마세요. 측정 하나만 순위로 두고, 다른 측정은 따로 목록이나 Table에 두세요.',
    '시간에 따른 변화에는 BarList를 쓰지 마세요. Chart나 Sparkline을 쓰세요.',
    '한도에 대한 측정 하나에는 BarList를 쓰지 마세요. Meter를 쓰세요.',
  ],
  keyboard:
    'BarList는 글로 된 순서 목록입니다. 줄마다 이름, detail, 값을 읽고 막대는 장식입니다. maxRows로 줄인 목록은 포커스를 받는 이름 붙은 영역 안에서 스크롤되어 화살표 키로 움직입니다.',
  props: {
    label: '목록의 이름',
    items:
      '읽기 전용 {id, label, detail?, value, text?}[]. text는 "412 GiB"처럼 값을 씁니다',
    max: '막대가 가득 찰 때의 값. diverging이면 막대 절반이 나타내는 값',
    diverging: '부호 있는 값을 한 척도로 가운데 선에서 그립니다',
    'trend / lowerIsBetter':
      'auto | neutral: diverging 목록의 오름과 내림에 색을 주거나 둘 다 브랜드 표식으로 그립니다 / 내림이 좋은 측정에서 색을 바꿉니다',
    sorted: '가장 큰 값부터 줄을 세웁니다',
    maxRows: '이름 붙은 영역 안에서 스크롤되기 전까지 보이는 줄 수',
    'formatValue / locale': 'text가 없는 값을 쓰는 함수 / Intl 숫자 locale',
  },
}
