import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '제목 아래에서 관련 세부 정보를 펼치세요. 단일 항목 모드에서는 닫히는 패널과 열리는 패널이 높이 및 페이드 전환으로 교체됩니다. 닫히는 패널은 inert가 되어 전환 중에 입력을 사용할 수 없습니다. reduced motion에서는 패널이 즉시 전환됩니다.',
  avoid:
    '접힌 패널에 필수 정보를 모두 숨기지 마세요. 핵심 사실은 바깥에 보이게 유지하세요. Trigger 안에 버튼이나 링크를 중첩하지 마세요. 대신 Panel에 배치하세요.',
  keyboard:
    'Tab과 Shift+Tab은 각 Trigger와 열린 패널의 입력을 이동합니다. Enter나 Space는 패널을 펼칩니다. Base UI 1.9는 Accordion의 화살표 키 로빙 포커스를 제거했습니다.',
  props: {
    'Root.value / defaultValue': '펼쳐진 항목 값의 배열',
    'Root.multiple / keepMounted': '여러 항목 허용 / 닫힌 콘텐츠 마운트 유지',
    'Trigger.indicator': '커스텀 ReactNode; false는 기본 SVG 숨김',
  },
}
