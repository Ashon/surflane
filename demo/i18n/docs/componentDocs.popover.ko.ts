import type { DocKo } from './types'

export const docKo: Record<string, DocKo> = {
  popover: {
    usage:
      '버튼 옆에 간단한 세부 정보나 보조 작업을 표시하세요. Stack gap={1}으로 Title과 Description을 그룹화하세요. Stack gap={4}로 입력과 액션 버튼을 그룹화하세요. Inline gap={2}로 버튼 행을 배치하세요. 기본 자식 여백을 제거해 부모 gap이 간격을 관리하게 하세요.',
    avoid:
      '필수 응답이나 데이터 손실 확인에는 Popover를 사용하지 마세요. 대신 AlertDialog를 사용하세요. Tooltip에 입력을 넣지 마세요. 대신 Popover를 사용하세요.',
    keyboard:
      'Trigger가 popover를 열고 포커스를 안으로 이동시킵니다. Escape 또는 외부 클릭이 popover를 닫고 포커스를 Trigger로 되돌립니다.',
    props: {
      'Content.side / align / sideOffset': 'Base UI positioner props',
      'Root.open / onOpenChange': '제어 popup 상태',
    },
  },
}
