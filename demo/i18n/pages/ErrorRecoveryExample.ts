import type { Locale } from '../../i18n'

const en = {
  previewRecoveryState: 'Preview recovery state',
  nextRetryResult: 'Next retry result',
  previewRequestLabel: 'Preview request label',
  draftStaysLocal: 'Your draft stays local during recovery.',
  requestFailedTitle: 'The resource request failed',
  connectionUnavailableTitle: 'Connection unavailable',
  retryingTitle: 'Retrying resource request',
  errorDescription:
    'Retry the request or inspect the safe preview details. Your draft is retained.',
  offlineDescription:
    'Cached data may be outdated. Reconnect to request fresh data.',
  pendingDescription:
    'Complete the local response by hand. Canceling keeps your draft.',
  cancelRetry: 'Cancel retry',
  completeRecoveryResponse: 'Complete recovery response',
  retryPreview: 'Retry preview',
  reconnectPreview: 'Reconnect preview',
  accessRequiredTitle: 'Resource access required',
  accessRequiredDescription:
    'Cached resource data was cleared. Restore preview access to load it again.',
  restorePreviewAccess: 'Restore preview access',
  accessRestoredNotice: 'Preview access restored. Load data to check access.',
  notFoundTitle: 'Resource not found',
  notFoundDescription:
    'This address may be stale. Choose a resource from the list instead of retrying it.',
  browseResourceExamples: 'Browse resource examples',
  refreshPreview: 'Refresh preview',
  loadPreview: 'Load preview',
  savedPreviewLabel: 'Saved resource preview',
  lastSavedPreview: 'Last saved preview',
  revision: (n: number) => `Revision ${n}`,
  currentPreview: 'Current preview',
  mayBeOutdated: 'May be outdated',
  previewRequestDetails: 'Preview request details',
  safePreviewDetailsLabel: 'Safe preview request details',
  copyPreviewDetails: 'Copy preview details',
  recoveryResultLabel: 'Recovery result',
  requestsStarted: (n: number) => `Preview requests started: ${n}.`,
  refreshedNotice: 'Preview refreshed. No product resource was changed.',
  canceledNotice: 'Retry canceled. Your draft is retained.',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    previewRecoveryState: '미리보기 복구 상태',
    nextRetryResult: '다음 재시도 결과',
    previewRequestLabel: '미리보기 요청 라벨',
    draftStaysLocal: '복구 중 초안은 로컬에 유지됩니다.',
    requestFailedTitle: '리소스 요청 실패',
    connectionUnavailableTitle: '연결 사용 불가',
    retryingTitle: '리소스 요청 재시도 중',
    errorDescription:
      '요청을 다시 시도하거나 안전한 미리보기 상세를 확인하세요. 초안은 유지됩니다.',
    offlineDescription:
      '캐시된 데이터는 오래되었을 수 있습니다. 새 데이터를 요청하려면 다시 연결하세요.',
    pendingDescription:
      '로컬 응답을 직접 완료하세요. 취소해도 초안은 유지됩니다.',
    cancelRetry: '재시도 취소',
    completeRecoveryResponse: '복구 응답 완료',
    retryPreview: '미리보기 재시도',
    reconnectPreview: '미리보기 다시 연결',
    accessRequiredTitle: '리소스 액세스 필요',
    accessRequiredDescription:
      '캐시된 리소스 데이터가 지워졌습니다. 다시 로드하려면 미리보기 액세스를 복원하세요.',
    restorePreviewAccess: '미리보기 액세스 복원',
    accessRestoredNotice:
      '미리보기 액세스가 복원되었습니다. 데이터를 로드하여 액세스를 확인하세요.',
    notFoundTitle: '리소스를 찾을 수 없음',
    notFoundDescription:
      '이 주소는 오래되었을 수 있습니다. 재시도하는 대신 목록에서 리소스를 선택하세요.',
    browseResourceExamples: '리소스 예시 둘러보기',
    refreshPreview: '미리보기 새로고침',
    loadPreview: '미리보기 로드',
    savedPreviewLabel: '저장된 리소스 미리보기',
    lastSavedPreview: '마지막으로 저장된 미리보기',
    revision: (n: number) => `리비전 ${n}`,
    currentPreview: '현재 미리보기',
    mayBeOutdated: '오래되었을 수 있음',
    previewRequestDetails: '미리보기 요청 상세',
    safePreviewDetailsLabel: '안전한 미리보기 요청 상세',
    copyPreviewDetails: '미리보기 상세 복사',
    recoveryResultLabel: '복구 결과',
    requestsStarted: (n: number) => `시작된 미리보기 요청: ${n}.`,
    refreshedNotice:
      '미리보기가 새로고침되었습니다. 변경된 제품 리소스는 없습니다.',
    canceledNotice: '재시도가 취소되었습니다. 초안은 유지됩니다.',
  },
}
