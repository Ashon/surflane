import type { Locale } from '../../i18n'

const en = {
  findRun: 'Find run',
  searchRunNames: 'Search run names',
  pagedPipelineRuns: 'Paged pipeline runs',
  pipelineRunName: (n: string) => `Pipeline run ${n}`,
  localRecord: (id: number) =>
    `Local record / run-${String(id).padStart(2, '0')}`,
  inspectRun: (id: number) => `Inspect run ${id}`,
  inspected: (name: string) => `${name} inspected.`,
  pipelineRunPages: 'Pipeline run pages',
  noMatchingRuns: 'No matching runs.',
  status: (page: number, pageCount: number, total: number) =>
    `Page ${page} of ${pageCount}. ${total} runs.`,
  enablePagination: 'Enable pagination',
  disablePagination: 'Disable pagination',
  goToLastPage: 'Go to last page',
  urlNavigation: 'URL navigation',
  urlNavigationParagraph:
    'These links keep native browser navigation. In this local example, the URL fragment holds the current page.',
  documentationPages: 'Documentation pages',
  platformApiEnvironment: 'Platform API environment',
  cardBodyText:
    'Three services are ready to deploy. The environment administrator manages credentials.',
  configured: 'Configured',
  environmentPreviewOpened: 'Environment preview opened. No remote action ran.',
  inspectEnvironment: 'Inspect environment',
  cardFooterText:
    'A single surface groups related information. Use a plain section for page structure, or List for repeated resources.',
  keepSourceLineBreaks: 'Keep source line breaks',
  wrapLongLines: 'Wrap long lines',
  changeSource: 'Change source',
  runnerTask: 'Runner task',
  unavailableClipboardExample: 'Unavailable clipboard example',
  tryUnavailableClipboard: 'Try unavailable clipboard',
  deniedInLocalExample: 'Denied in local example',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    findRun: '실행 찾기',
    searchRunNames: '실행 이름 검색',
    pagedPipelineRuns: '페이지별 파이프라인 실행',
    pipelineRunName: (n: string) => `파이프라인 실행 ${n}`,
    localRecord: (id: number) =>
      `로컬 레코드 / run-${String(id).padStart(2, '0')}`,
    inspectRun: (id: number) => `실행 ${id} 검사`,
    inspected: (name: string) => `${name} 검사됨.`,
    pipelineRunPages: '파이프라인 실행 페이지',
    noMatchingRuns: '일치하는 실행이 없습니다.',
    status: (page: number, pageCount: number, total: number) =>
      `${page} / ${pageCount} 페이지. 실행 ${total}건.`,
    enablePagination: '페이지네이션 활성화',
    disablePagination: '페이지네이션 비활성화',
    goToLastPage: '마지막 페이지로 이동',
    urlNavigation: 'URL 내비게이션',
    urlNavigationParagraph:
      '이 링크는 브라우저 기본 내비게이션을 유지합니다. 이 로컬 예시에서 URL 프래그먼트가 현재 페이지를 보관합니다.',
    documentationPages: '문서 페이지',
    platformApiEnvironment: 'Platform API 환경',
    cardBodyText:
      '세 개의 서비스가 배포 준비 상태입니다. 환경 관리자가 자격 증명을 관리합니다.',
    configured: '구성됨',
    environmentPreviewOpened:
      '환경 미리보기가 열렸습니다. 원격 작업은 실행되지 않았습니다.',
    inspectEnvironment: '환경 검사',
    cardFooterText:
      '하나의 표면이 관련 정보를 그룹화합니다. 페이지 구조에는 일반 섹션을, 반복 리소스에는 List를 사용하세요.',
    keepSourceLineBreaks: '소스 줄 바꿈 유지',
    wrapLongLines: '긴 줄 바꾸기',
    changeSource: '소스 변경',
    runnerTask: '러너 작업',
    unavailableClipboardExample: '클립보드 사용 불가 예시',
    tryUnavailableClipboard: '사용 불가 클립보드 시도',
    deniedInLocalExample: '로컬 예시에서 거부됨',
  },
}
