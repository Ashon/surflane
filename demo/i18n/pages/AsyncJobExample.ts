import type { Locale } from '../../i18n'

const en = {
  names: ['Resolve build', 'Check health', 'Collect logs'],
  intro: 'Updates arrive only when you deliver them. No real job runs.',
  nextRunEnvironment: 'Next run environment',
  fieldDescription:
    'In this preview, retries keep the original environment and reuse successful checks.',
  nextRunResult: 'Next run result',
  scenarioSuccess: 'Success',
  scenarioPartial: 'Partial failure',
  scenarioFailure: 'Blocking failure',
  startPreviewRun: 'Start preview run',
  retryUnfinishedSteps: 'Retry unfinished steps',
  requestCancellation: 'Request cancellation',
  acknowledgeCancellation: 'Acknowledge cancellation',
  deliverNextPreviewUpdate: 'Deliver next preview update',
  runDetailsLabel: 'Run details',
  runSummary: 'Run summary',
  runStatusLabel: 'Run status',
  phaseLabels: {
    queued: 'Queued',
    running: 'Running',
    'cancel-requested': 'Cancellation requested',
    canceled: 'Canceled',
    success: 'Completed',
    partial: 'Partially completed',
    failed: 'Failed',
  },
  stepStateLabels: {
    waiting: 'waiting',
    running: 'running',
    succeeded: 'succeeded',
    failed: 'failed',
    skipped: 'skipped',
    canceled: 'canceled',
  },
  reusedChecks: (n: number) =>
    `${n} successful ${n === 1 ? 'check' : 'checks'} reused. Their logs keep the original run ID.`,
  checksFinished: (n: number) => `${n} of 3 checks finished`,
  finishedChecksLabel: 'Finished checks',
  progressValue: (n: number) => `${n} / 3`,
  cancelRequestedDescription:
    'Waiting for the worker to acknowledge. Completed work stays recorded.',
  canceledDescription:
    'The worker acknowledged cancellation. Completed checks are kept, and nothing is rolled back.',
  partialDescription:
    'Review the failed check logs. Retry creates a new run for unfinished checks.',
  runStepsLabel: 'Run steps',
  logsFrom: (source: string) => `Logs from ${source}`,
  inspectStep: (name: string) => `Inspect ${name}`,
  stepOutput: (name: string) => `${name} output`,
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    intro:
      '업데이트는 직접 전달할 때만 도착합니다. 실제 작업은 실행되지 않습니다.',
    names: ['Resolve build', 'Check health', 'Collect logs'],
    nextRunEnvironment: '다음 실행 환경',
    fieldDescription:
      '이 미리보기에서 재시도는 원래 환경을 유지하고 성공한 검사를 재사용합니다.',
    nextRunResult: '다음 실행 결과',
    scenarioSuccess: '성공',
    scenarioPartial: '부분 실패',
    scenarioFailure: '차단 실패',
    startPreviewRun: '미리보기 실행 시작',
    retryUnfinishedSteps: '완료되지 않은 단계 재시도',
    requestCancellation: '취소 요청',
    acknowledgeCancellation: '취소 확인',
    deliverNextPreviewUpdate: '다음 미리보기 업데이트 전달',
    runDetailsLabel: '실행 상세',
    runSummary: '실행 요약',
    runStatusLabel: '실행 상태',
    phaseLabels: {
      queued: '대기 중',
      running: '실행 중',
      'cancel-requested': '취소 요청됨',
      canceled: '취소됨',
      success: '완료됨',
      partial: '부분 완료됨',
      failed: '실패함',
    },
    stepStateLabels: {
      waiting: '대기 중',
      running: '실행 중',
      succeeded: '성공',
      failed: '실패',
      skipped: '건너뜀',
      canceled: '취소됨',
    },
    reusedChecks: (n: number) =>
      `${n}개의 성공한 검사가 재사용되었습니다. 로그는 원래 실행 ID를 유지합니다.`,
    checksFinished: (n: number) => `${n} / 3개 검사 완료`,
    finishedChecksLabel: '완료된 검사',
    progressValue: (n: number) => `${n} / 3`,
    cancelRequestedDescription:
      '작업자가 취소를 확인할 때까지 기다립니다. 완료된 작업은 기록에 남습니다.',
    canceledDescription:
      '작업자가 취소를 확인했습니다. 완료된 검사는 유지되며 롤백되는 것은 없습니다.',
    partialDescription:
      '실패한 검사 로그를 검토하세요. 재시도는 완료되지 않은 검사에 대해 새 실행을 만듭니다.',
    runStepsLabel: '실행 단계',
    logsFrom: (source: string) => `로그 출처: ${source}`,
    inspectStep: (name: string) => `${name} 검사`,
    stepOutput: (name: string) => `${name} 출력`,
  },
}
