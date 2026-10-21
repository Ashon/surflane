import type { Locale } from '../../i18n'
import type { StatusTone } from '@surflane/ui'

type BadgeState = {
  value: string
  label: string
  tone: StatusTone
  description: string
}

const en = {
  tabOrientation: 'Tab orientation',
  horizontal: 'Horizontal',
  vertical: 'Vertical',
  activateOnFocus: 'Activate on focus',
  preventTabChanges: 'Prevent tab changes',
  deploymentSections: 'Deployment sections',
  overview: 'Overview',
  logs: 'Logs',
  unavailable: 'Unavailable',
  history: 'History',
  reviewEnvironmentAndDeploymentScope:
    'Review the environment and deployment scope.',
  previewNote: 'Preview note',
  noteRetainedAcrossTabs: 'Note retained across tabs',
  reviewBuildLogsForSelectedPipelineRun:
    'Review the build logs for the selected pipeline run.',
  passed: 'Passed',
  reviewRecentRunsAndChangeHistory: 'Review recent runs and change history.',
  allowMultipleSections: 'Allow multiple sections',
  identityControls: 'Identity controls',
  checkServiceAccountPermissionsAndTeamIsolation:
    'Check service account permissions and team isolation.',
  caseNote: 'Case note',
  retainedWhileCollapsed: 'Retained while collapsed',
  environmentAccess: 'Environment access',
  compareAccessForAllowedAndBlockedEnvironments:
    'Compare access for allowed and blocked environments.',
  notRun: 'Not run',
  unavailablePolicy: 'Unavailable policy',
  unavailablePreview: 'Unavailable preview.',
  disableDisclosure: 'Disable disclosure',
  technicalDetails: 'Technical details',
  reviewDeploymentResultsAndRedactedBuildLogs:
    'Review deployment results and redacted build logs.',
  buildNote: 'Build note',
  previewProfile: 'Preview profile',
  online: 'Online',
  documentationPreviewUser: 'Documentation preview user',
  unknownPreviewUser: 'Unknown preview user',
  restorePreviewImage: 'Restore preview image',
  previewBrokenImage: 'Preview broken image',
  imageStatus: (loading: string) => `Image status: ${loading}`,
  badgeStates: [
    {
      value: 'passed',
      label: 'Passed',
      tone: 'success',
      description: 'All checks passed.',
    },
    {
      value: 'error',
      label: 'Error',
      tone: 'danger',
      description: 'Review the error and try again.',
    },
    {
      value: 'warning',
      label: 'Warning',
      tone: 'caution',
      description: 'Needs further review.',
    },
    {
      value: 'running',
      label: 'Running',
      tone: 'progress',
      description: 'Deployment is in progress.',
    },
    {
      value: 'pending',
      label: 'Not run',
      tone: 'neutral',
      description: 'Not run yet.',
    },
  ] as BadgeState[],
  threeEnvironments: '3 environments',
  statusPreview: 'Status preview',
  useInsetSeparator: 'Use inset separator',
  environmentOverview: 'Environment overview',
  deploymentDetails: 'Deployment details',
  staging: 'Staging',
  production: 'Production',
  inspectPreviewDestination: 'Inspect preview destination',
  baseUIDocumentationOpensInNewTab:
    'Base UI documentation (opens in a new tab)',
  previewDestinationNativeAnchorsKeepBrowserBehavior:
    'Preview destination. Native anchors keep their browser behavior.',
  projectBreadcrumb: 'Project breadcrumb',
  platformServices: 'Platform services',
  projects: 'Projects',
  showsProjectPathAsOrderedList:
    'Shows the project path as an ordered list. The current location can stay unlinked.',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    tabOrientation: '탭 방향',
    horizontal: '가로',
    vertical: '세로',
    activateOnFocus: '포커스 시 활성화',
    preventTabChanges: '탭 변경 방지',
    deploymentSections: '배포 섹션',
    overview: '개요',
    logs: '로그',
    unavailable: '사용 불가',
    history: '기록',
    reviewEnvironmentAndDeploymentScope: '환경과 배포 범위를 검토하세요.',
    previewNote: '미리보기 메모',
    noteRetainedAcrossTabs: '탭 간에 유지되는 메모',
    reviewBuildLogsForSelectedPipelineRun:
      '선택한 파이프라인 실행의 빌드 로그를 검토하세요.',
    passed: '통과',
    reviewRecentRunsAndChangeHistory: '최근 실행과 변경 기록을 검토하세요.',
    allowMultipleSections: '여러 섹션 허용',
    identityControls: 'ID 컨트롤',
    checkServiceAccountPermissionsAndTeamIsolation:
      '서비스 계정 권한과 팀 격리를 확인하세요.',
    caseNote: '사례 메모',
    retainedWhileCollapsed: '접힌 동안 유지되는 메모',
    environmentAccess: '환경 접근',
    compareAccessForAllowedAndBlockedEnvironments:
      '허용 및 차단된 환경의 접근을 비교하세요.',
    notRun: '실행 안 됨',
    unavailablePolicy: '사용 불가 정책',
    unavailablePreview: '사용 불가 미리보기입니다.',
    disableDisclosure: '공개 비활성화',
    technicalDetails: '기술 세부정보',
    reviewDeploymentResultsAndRedactedBuildLogs:
      '배포 결과와 수정된 빌드 로그를 검토하세요.',
    buildNote: '빌드 메모',
    previewProfile: '프로필 미리보기',
    online: '온라인',
    documentationPreviewUser: '문서 미리보기 사용자',
    unknownPreviewUser: '알 수 없는 미리보기 사용자',
    restorePreviewImage: '미리보기 이미지 복원',
    previewBrokenImage: '깨진 이미지 미리보기',
    imageStatus: (loading: string) => `이미지 상태: ${loading}`,
    badgeStates: [
      {
        value: 'passed',
        label: '통과',
        tone: 'success',
        description: '모든 검사가 통과했습니다.',
      },
      {
        value: 'error',
        label: '오류',
        tone: 'danger',
        description: '오류를 검토하고 다시 시도하세요.',
      },
      {
        value: 'warning',
        label: '경고',
        tone: 'caution',
        description: '추가 검토가 필요합니다.',
      },
      {
        value: 'running',
        label: '실행 중',
        tone: 'progress',
        description: '배포가 진행 중입니다.',
      },
      {
        value: 'pending',
        label: '실행 안 됨',
        tone: 'neutral',
        description: '아직 실행되지 않았습니다.',
      },
    ] as BadgeState[],
    threeEnvironments: '환경 3개',
    statusPreview: '상태 미리보기',
    useInsetSeparator: '인셋 구분선 사용',
    environmentOverview: '환경 개요',
    deploymentDetails: '배포 세부정보',
    staging: 'Staging',
    production: 'Production',
    inspectPreviewDestination: '미리보기 대상 검사',
    baseUIDocumentationOpensInNewTab: 'Base UI 문서 (새 탭에서 열림)',
    previewDestinationNativeAnchorsKeepBrowserBehavior:
      '미리보기 대상입니다. 네이티브 앵커는 브라우저 동작을 유지합니다.',
    projectBreadcrumb: '프로젝트 브레드크럼',
    platformServices: '플랫폼 서비스',
    projects: '프로젝트',
    showsProjectPathAsOrderedList:
      '프로젝트 경로를 정렬된 목록으로 표시합니다. 현재 위치는 연결되지 않은 채로 유지할 수 있습니다.',
  },
}
