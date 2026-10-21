import type { Locale } from '../../i18n'

const en = {
  headingRole: 'Heading role',
  optionApplication: 'Application',
  optionPage: 'Page',
  optionReading: 'Reading',
  longTitleLabel: 'Long title',
  supportingContentLabel: 'Supporting content',
  titleLong:
    'Environment and project deployment results / platform-api-abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz',
  titleDocs: 'Getting started',
  titleInventory: 'Registered resources',
  titleWorkspace: 'Deployment workspace',
  breadcrumbLabel: 'Preview page breadcrumb',
  patterns: 'Patterns',
  pageHeader: 'Page header',
  description:
    'Show the current location with a breadcrumb and title. Keep related actions close by. Long content wraps.',
  previewPageActions: 'Preview page actions',
  inspectPreview: 'Inspect preview',
  runPreview: 'Run preview',
  localActionPreview: (count: number) => `Local action preview: ${count}`,
  localPreviewNote: 'Actions update this local preview only.',
  breadcrumbIntro:
    'The breadcrumb is a named navigation that marks the current location. The header follows the',
  waiBreadcrumbGuidance: 'WAI breadcrumb guidance',
  and: 'and',
  headingHierarchy: 'heading hierarchy',
  guidanceOutro: '. It sets text size and heading level independently.',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    headingRole: '제목 역할',
    optionApplication: '애플리케이션',
    optionPage: '페이지',
    optionReading: '읽기',
    longTitleLabel: '긴 제목',
    supportingContentLabel: '보조 콘텐츠',
    titleLong:
      '환경 및 프로젝트 배포 결과 / platform-api-abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz',
    titleDocs: '시작하기',
    titleInventory: '등록된 리소스',
    titleWorkspace: '배포 워크스페이스',
    breadcrumbLabel: '미리보기 페이지 브레드크럼',
    patterns: '패턴',
    pageHeader: '페이지 헤더',
    description:
      '브레드크럼과 제목으로 현재 위치를 표시합니다. 관련 액션은 가까이 두세요. 긴 콘텐츠는 자동으로 줄 바뀝니다.',
    previewPageActions: '미리보기 페이지 액션',
    inspectPreview: '미리보기 검사',
    runPreview: '미리보기 실행',
    localActionPreview: (count: number) => `로컬 액션 미리보기: ${count}`,
    localPreviewNote: '액션은 이 로컬 미리보기만 업데이트합니다.',
    breadcrumbIntro:
      '브레드크럼은 현재 위치를 표시하는 이름 붙은 내비게이션입니다. 헤더는',
    waiBreadcrumbGuidance: 'WAI 브레드크럼 가이드',
    and: '및',
    headingHierarchy: '제목 계층',
    guidanceOutro:
      '을 따릅니다. 텍스트 크기와 제목 수준을 독립적으로 설정합니다.',
  },
}
