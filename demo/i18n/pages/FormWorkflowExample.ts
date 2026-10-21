import type { Locale } from '../../i18n'

const en = {
  fieldConflictError:
    'This environment name is already registered. Choose another name.',
  previewResetNotice: 'Preview reset.',
  cancelRequestNotice: 'Request canceled. Your draft is retained.',
  previewResponseLabel: 'Preview response',
  outcomeSuccess: 'Success',
  outcomeFieldConflict: 'Field conflict',
  outcomeRequestFailure: 'Request failure',
  outcomePermissionDenied: 'Permission denied',
  intro:
    'Complete each response by hand below to inspect every submission state. No environment is created.',
  fieldErrorTitle: 'Correct the highlighted field',
  fieldErrorDescription: 'Your other inputs are retained.',
  requestErrorTitle: "The request couldn't be completed",
  requestErrorDescription:
    'Your draft is retained. Change the preview response and retry when ready.',
  permissionTitle: "Registration isn't permitted",
  permissionDescription:
    'This preview account has no registration access. Your inputs are retained.',
  previewAccessRestoredNotice: 'Preview access restored.',
  restorePreviewAccess: 'Restore preview access',
  successTitle: 'Registration preview complete',
  startAnotherPreview: 'Start another preview',
  formAriaLabel: 'Environment registration preview',
  environmentDetails: 'Environment details',
  environmentNameLabel: 'Environment name',
  nameDescription:
    '3–48 lowercase letters, digits, or hyphens. Start with a letter.',
  serviceUrlLabel: 'Service URL',
  urlDescription: 'Use an HTTPS endpoint.',
  clusterLabel: 'Cluster',
  clusterAriaLabel: 'Registration cluster',
  submittingPreview: 'Submitting preview…',
  retryRegistration: 'Retry registration',
  registerPreview: 'Register preview',
  resetPreview: 'Reset preview',
  submittingPreviewTitle: 'Submitting preview request',
  busyDescription:
    'Draft editing is paused. Complete or cancel this local request.',
  completePreviewRequest: 'Complete preview request',
  cancelRequest: 'Cancel request',
  catalogNote: (n: number) =>
    `Preview requests started: ${n}. The product owns request transport, permissions, and idempotency.`,
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    fieldConflictError:
      '이 환경 이름은 이미 등록되어 있습니다. 다른 이름을 선택하세요.',
    previewResetNotice: '미리보기가 초기화되었습니다.',
    cancelRequestNotice: '요청이 취소되었습니다. 초안은 유지됩니다.',
    previewResponseLabel: '미리보기 응답',
    outcomeSuccess: '성공',
    outcomeFieldConflict: '필드 충돌',
    outcomeRequestFailure: '요청 실패',
    outcomePermissionDenied: '권한 거부',
    intro:
      '아래에서 각 응답을 직접 완성해 모든 제출 상태를 확인하세요. 생성되는 환경은 없습니다.',
    fieldErrorTitle: '강조 표시된 필드를 수정하세요',
    fieldErrorDescription: '다른 입력은 유지됩니다.',
    requestErrorTitle: '요청을 완료할 수 없습니다',
    requestErrorDescription:
      '초안은 유지됩니다. 준비되면 미리보기 응답을 변경하고 다시 시도하세요.',
    permissionTitle: '등록이 허용되지 않습니다',
    permissionDescription:
      '이 미리보기 계정에는 등록 액세스 권한이 없습니다. 입력은 유지됩니다.',
    previewAccessRestoredNotice: '미리보기 액세스가 복원되었습니다.',
    restorePreviewAccess: '미리보기 액세스 복원',
    successTitle: '등록 미리보기 완료',
    startAnotherPreview: '다른 미리보기 시작',
    formAriaLabel: '환경 등록 미리보기',
    environmentDetails: '환경 상세',
    environmentNameLabel: '환경 이름',
    nameDescription: '소문자, 숫자, 하이픈 3–48자. 문자로 시작하세요.',
    serviceUrlLabel: '서비스 URL',
    urlDescription: 'HTTPS 엔드포인트를 사용하세요.',
    clusterLabel: '클러스터',
    clusterAriaLabel: '등록 클러스터',
    submittingPreview: '미리보기 제출 중…',
    retryRegistration: '등록 다시 시도',
    registerPreview: '미리보기 등록',
    resetPreview: '미리보기 초기화',
    submittingPreviewTitle: '미리보기 요청 제출 중',
    busyDescription:
      '초안 편집이 일시 중지되었습니다. 이 로컬 요청을 완료하거나 취소하세요.',
    completePreviewRequest: '미리보기 요청 완료',
    cancelRequest: '요청 취소',
    catalogNote: (n: number) =>
      `시작된 미리보기 요청: ${n}개. 요청 전송, 권한, 멱등성은 제품이 담당합니다.`,
  },
}
