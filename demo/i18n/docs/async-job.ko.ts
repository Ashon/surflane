import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    'queued, running, cancel requested, canceled, partially failed, completed 상태를 구분합니다. 진행률은 완료된 검사 수로 표시합니다. 예상 시간을 약속하지 마세요. List의 각 단계 상태에 로그를 열고 복사하는 명시적 액션을 짝지으세요. 예시에서 업데이트를 수동으로 전달해 각 상태를 살펴보세요.',
  avoid: [
    '취소 요청을 완료된 취소나 롤백으로 보여주지 마세요. worker가 확인한 후에만 canceled로 보고하세요.',
    '부분 실패를 성공으로 보고하지 마세요. 성공한 결과는 만료와 권한을 확인한 후에만 재사용하세요.',
    '프리미티브가 작업을 시작하거나 서버 권한, 멱등성, 이벤트 순서, 재연결, 영속성을 처리하길 기대하지 마세요. 이들은 제품이 소유합니다.',
    '예시는 고정 샘플을 사용하며 제품 요청을 보내지 않습니다.',
  ],
  keyboard: [
    '작업을 시작하면 포커스가 취소 요청 버튼으로 이동합니다. 취소를 요청하면 포커스가 확인 버튼으로 이동합니다.',
    '작업이 끝나면 포커스가 요약 heading으로 이동합니다. 중간 업데이트와 로그 열기는 포커스를 이동시키지 않습니다.',
    '별도 버튼이 로그를 복사합니다.',
    '상태는 role=status에서 텍스트로 알려집니다.',
  ],
  props: {
    'Run identity': '시작/재시도마다 새 ID; 환경과 결과 스냅샷',
    'Update ownership':
      'AbortController + identity + version fence; 동기 중복 가드',
    Retry: '성공한 검사는 source ID와 함께 유지; 미완료 검사는 초기화',
    Logs: '고정된 안전 샘플; 명시적 검사와 복사',
  },
}
