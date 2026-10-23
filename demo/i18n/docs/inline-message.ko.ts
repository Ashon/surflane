import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '현재 작업에 대한 안내, 오류, 경고를 원인과 다음 단계와 함께 설명하세요. 정적 메시지는 라이브 영역이 아닙니다. 비동기 변경만 알리세요. role=status를 쓰고, 긴급할 때는 role=alert를 쓰세요.',
  avoid: [
    '톤을 색으로만 구분하지 마세요. 대신 Title과 Description에 상태를 밝히세요.',
    '페이지 로드 시 모든 메시지를 alert로 알리지 마세요. 정적 메시지는 알리지 않은 채 두세요.',
    '재시도가 실제 결과를 보장한다고 암시하지 마세요. 대신 재시도가 무엇을 시도하는지 말하세요.',
  ],
  keyboard:
    '메시지는 포커스를 받지 않습니다. Tab은 액션 버튼에 도달하고 Enter 또는 Space가 이를 활성화합니다. Icon은 장식입니다. Title과 Description이 상태를 전달합니다. Root.role은 호출하는 쪽이 설정합니다.',
  props: {
    'Root.role': '네이티브 role; 라이브 알림을 신중히 선택하세요',
    'Icon.children': '사용자 지정 장식 아이콘',
    'Title / Description / Actions': '네이티브 strong / p / div 속성',
  },
}
