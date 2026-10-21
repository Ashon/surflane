import type { DocKo } from './types'

export const formWorkflowDocsKo: Record<string, DocKo> = {
  'form-workflow': {
    usage:
      'Form, Field, Fieldset, 메시지로 검증, 제출 대기, 필드 오류, 요청 실패, 접근 제한, 성공을 연결하세요. 입력 값은 controlled 상태로 유지하세요. 결과는 제출 시점에 복사한 값으로 설명하세요. 예시는 응답을 수동으로 확정합니다. Complete preview request 로 각 상태를 확인하세요.',
    avoid: [
      '서비스 호출이나 권한 정책을 프리미티브 안에 숨기지 마세요. 제품에 두세요.',
      '오류를 빈 성공으로 보여주지 마세요. 필드 오류, 요청 실패, 접근 제한을 각각의 상태로 보여주세요.',
      '취소가 서버를 롤백한다고 약속하지 마세요. 취소는 요청을 멈추고 초안을 보존합니다.',
      '클라이언트 검사만 믿지 마세요. 제품 API에도 서버 검증, 권한 확인, 멱등성, 중복 요청 방지가 필요합니다.',
      '예시는 접근 복원을 로컬에서 시뮬레이션합니다.',
    ],
    keyboard: [
      'Base UI Form 은 제출 전 검증을 실행하고 첫 번째 오류 입력에 포커스를 둡니다.',
      '대기 중에는 중복 제출이 차단되고 포커스가 Cancel 로 이동합니다.',
      '서버 필드 오류는 errors 의 Field.name 키로 필드에 매핑됩니다. 필드 오류는 해당 입력으로, 요청 오류는 Retry 로, 성공은 결과 제목으로 포커스를 이동합니다.',
      '취소하거나 초기화하면 포커스가 name 입력으로 돌아갑니다.',
      'Field 는 각 설명과 오류를 컨트롤에 연결합니다. 색만으로 의미를 전달하지 않습니다.',
    ],
    props: {
      'Form.onFormSubmit': '검증된 이름 있는 필드; 제품 소유의 요청 콜백',
      'Form.errors': '서버 검증을 Field.name 에 매핑',
      'Fieldset.disabled': '대기 중이거나 권한 제한 시 초안 편집을 잠금',
      'Cancel / reset':
        '취소는 초안을 보존하고, 초기화는 초기 controlled 값을 명시적으로 복원',
      'Preview completion':
        'AbortController 와 identity 가드로 수동 확정하는 Promise; 서비스 요청 없음',
    },
  },
}
