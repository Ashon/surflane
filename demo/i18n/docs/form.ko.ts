import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '여러 Field에 걸쳐 제출 검증과 서버 오류를 조정하세요. onFormSubmit이 이름이 있는 Field에서 값을 수집합니다. 원시 네이티브 제출 값이 필요하면 onSubmit에서 FormData를 읽으세요. 미리보기의 서버 오류 버튼은 로컬 상태만 변경합니다.',
  avoid:
    '비동기 검증이 항상 제출을 막는다고 가정하지 마세요. 실제 요청, 권한, 중복 제출 방지는 제품에서 처리하세요.',
  keyboard:
    'Enter나 제출 버튼이 폼을 검증하고 첫 번째 유효하지 않은 입력으로 포커스를 이동합니다. 입력을 편집하면 서버 오류가 지워집니다. Reset은 초기 값을 복원합니다.',
  props: {
    onFormSubmit: '(values, eventDetails) => void; 네이티브 네비게이션 방지',
    errors: 'Field.Root name으로 키가 지정된 레코드',
  },
}
