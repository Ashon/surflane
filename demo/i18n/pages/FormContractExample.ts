import type { Locale } from '../../i18n'

const en = {
  noActionTaken: 'No contract action taken.',
  changeCanceledByCaller: 'Change canceled by caller.',
  title: 'Controlled values and external form ownership',
  description:
    "The calling screen owns the values. Native reset doesn't overwrite controlled values. An explicit restore action resets the model.",
  submitContract: 'Submit contract',
  nativeReset: 'Native reset',
  modelRestored: 'Controlled model restored.',
  restoreInitialModel: 'Restore initial model',
  rejectChanges: 'Reject changes',
  controlledCleanup: 'Controlled cleanup',
  controlledRefresh: 'Controlled refresh',
  controlledSource: 'Controlled source',
  live: 'Live',
  simulation: 'Simulation',
  controlledEnvironments: 'Controlled environments',
  allControlledEnvironments: 'All controlled environments',
  controlledStaging: 'Controlled Staging',
  controlledProduction: 'Controlled Production',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    noActionTaken: '실행된 계약 작업이 없습니다.',
    changeCanceledByCaller: '호출하는 쪽이 변경을 취소했습니다.',
    title: '제어 값과 외부 소유 폼',
    description:
      '호출하는 화면이 값을 소유합니다. 네이티브 초기화는 제어 값을 덮어쓰지 않습니다. 명시적 복원 액션이 모델을 초기화합니다.',
    submitContract: '계약 제출',
    nativeReset: '네이티브 초기화',
    modelRestored: '제어 모델이 복원되었습니다.',
    restoreInitialModel: '초기 모델 복원',
    rejectChanges: '변경 거부',
    controlledCleanup: '제어 정리',
    controlledRefresh: '제어 새로고침',
    controlledSource: '제어 소스',
    live: '실시간',
    simulation: '시뮬레이션',
    controlledEnvironments: '제어 환경',
    allControlledEnvironments: '모든 제어 환경',
    controlledStaging: '제어 스테이징',
    controlledProduction: '제어 프로덕션',
  },
}
