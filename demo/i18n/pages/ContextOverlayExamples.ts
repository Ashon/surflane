import type { Locale } from '../../i18n'

const en = {
  logPreviewOpened: 'Log preview opened.',
  openLogs: 'Open logs',
  pinLogs: 'Pin logs',
  deleteLogs: 'Delete logs',
  export: 'Export',
  jsonExportPreviewed: 'JSON export previewed.',
  jsonLogs: 'JSON logs',
  noLogActionTaken: 'No log action taken.',
  disableContextMenu: 'Disable context menu',
  rtlPreview: 'RTL preview',
  platformApiBuildLogs: 'Platform API build logs',
  contextHint:
    'Right-click or long-press for actions. The visible menu offers the same actions with keyboard and touch.',
  logContextActions: 'Log context actions',
  logActions: 'Log actions',
  logsPinned: 'Logs pinned.',
  logsUnpinned: 'Logs unpinned.',
  cancelPreviewOpening: 'Cancel preview opening',
  readThe: 'Read the ',
  deploymentPolicyGuide: 'deployment policy guide',
  beforeConfiguringDeploymentChecks: ' before configuring deployment checks.',
  deploymentPolicyGuideTitle: 'Deployment policy guide',
  previewDescription:
    'Check allowed and blocked environments with temporary tokens. Keep redacted logs for each check.',
  destinationRepeatsSummary:
    'The destination repeats this summary. No action or essential information exists only in the preview.',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    logPreviewOpened: '로그 미리보기가 열렸습니다.',
    openLogs: '로그 열기',
    pinLogs: '로그 고정',
    deleteLogs: '로그 삭제',
    export: '내보내기',
    jsonExportPreviewed: 'JSON 내보내기가 미리보기로 실행되었습니다.',
    jsonLogs: 'JSON 로그',
    noLogActionTaken: '실행된 로그 작업이 없습니다.',
    disableContextMenu: '컨텍스트 메뉴 비활성화',
    rtlPreview: 'RTL 미리보기',
    platformApiBuildLogs: 'Platform API 빌드 로그',
    contextHint:
      '마우스 오른쪽 버튼을 클릭하거나 길게 눌러 액션을 확인하세요. 보이는 메뉴는 키보드와 터치로 동일한 액션을 제공합니다.',
    logContextActions: '로그 컨텍스트 액션',
    logActions: '로그 액션',
    logsPinned: '로그가 고정되었습니다.',
    logsUnpinned: '로그가 고정 해제되었습니다.',
    cancelPreviewOpening: '미리보기 열기 취소',
    readThe: '배포 검사를 구성하기 전에 ',
    deploymentPolicyGuide: '배포 정책 가이드',
    beforeConfiguringDeploymentChecks: '를 읽으세요.',
    deploymentPolicyGuideTitle: '배포 정책 가이드',
    previewDescription:
      '임시 토큰으로 허용 및 차단된 환경을 확인하세요. 검사마다 수정된 로그를 유지하세요.',
    destinationRepeatsSummary:
      '대상은 이 요약을 반복합니다. 액션이나 필수 정보가 미리보기에만 존재하지 않습니다.',
  },
}
