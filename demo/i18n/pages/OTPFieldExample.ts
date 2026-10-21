import type { Locale } from '../../i18n'

const en = {
  disableCodes: 'Disable codes',
  readOnly: 'Read only',
  maskCharacters: 'Mask characters',
  rtlPreview: 'RTL preview',
  verification: 'Verification',
  recovery: 'Recovery',
  verificationCode: 'Verification code',
  verificationDescription:
    'Enter 6 digits. This local preview sends no code to a server.',
  character: (prefix: string, index: number) =>
    `${prefix} character ${index + 1} of 6`,
  verifyPreview: 'Verify preview',
  resetCodes: 'Reset codes',
  expireCode: 'Expire code',
  requestNewCode: 'Request new code',
  rejectedExampleCode: 'This example code was rejected. Request a new code.',
  codeExpired: 'Code expired. Request a new code.',
  newLocalCodeRequested:
    'New local code requested. Verification input cleared.',
  noVerificationSubmitted: 'No verification submitted.',
  verificationSubmitted: (hasRecovery: boolean) =>
    `Verification submitted. Recovery code included: ${hasRecovery ? 'yes' : 'no'}.`,
  recoveryCode: 'Recovery code',
  recoveryDescription:
    'A controlled value of uppercase letters and digits. This field belongs to the form above.',
  cancelCodeChanges: 'Cancel code changes',
  cancelReset: 'Cancel reset',
  submitWhenComplete: 'Submit when complete',
  status: (result: string, complete: number, rejected: number) =>
    `${result} Completion events: ${complete}. Rejected input events: ${rejected}.`,
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    disableCodes: '코드 비활성화',
    readOnly: '읽기 전용',
    maskCharacters: '문자 마스킹',
    rtlPreview: 'RTL 미리보기',
    verification: '검증',
    recovery: '복구',
    verificationCode: '검증 코드',
    verificationDescription:
      '6자리 숫자를 입력하세요. 이 로컬 미리보기는 서버로 코드를 보내지 않습니다.',
    character: (prefix: string, index: number) =>
      `${prefix} ${index + 1}번째 문자 (총 6자)`,
    verifyPreview: '미리보기 검증',
    resetCodes: '코드 초기화',
    expireCode: '코드 만료 처리',
    requestNewCode: '새 코드 요청',
    rejectedExampleCode: '이 예시 코드는 거부되었습니다. 새 코드를 요청하세요.',
    codeExpired: '코드가 만료되었습니다. 새 코드를 요청하세요.',
    newLocalCodeRequested:
      '새 로컬 코드를 요청했습니다. 검증 입력을 지웠습니다.',
    noVerificationSubmitted: '제출된 검증이 없습니다.',
    verificationSubmitted: (hasRecovery: boolean) =>
      `검증이 제출되었습니다. 복구 코드 포함: ${hasRecovery ? '예' : '아니요'}.`,
    recoveryCode: '복구 코드',
    recoveryDescription:
      '대문자와 숫자로 이루어진 제어 값입니다. 이 필드는 위 폼에 속합니다.',
    cancelCodeChanges: '코드 변경 취소',
    cancelReset: '초기화 취소',
    submitWhenComplete: '완료 시 제출',
    status: (result: string, complete: number, rejected: number) =>
      `${result} 완료 이벤트: ${complete}. 거부된 입력 이벤트: ${rejected}.`,
  },
}
