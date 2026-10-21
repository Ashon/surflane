import type { Locale } from '../../i18n'

const en = {
  layoutHeadingAll: 'Layout',
  layoutHeadingSplit: 'Workspace and reading',
  layoutIntro:
    'Build structure from content alignment and whitespace, not nested backgrounds. Compare width, spacing, and information density between workspace and documentation screens.',
  layoutProfile: 'Layout profile',
  profileWorkspace: 'Workspace / operations',
  profileReading: 'Reading / documentation',
  profileWide: 'Wide / comparison',
  density: 'Density',
  layoutDensity: 'Layout density',
  densityComfortable: 'Comfortable / 24px',
  densityCompact: 'Compact / 16px',
  layoutBreadcrumb: 'Layout preview breadcrumb',
  platformServices: 'Platform services',
  crumbDocumentation: 'Documentation',
  crumbDeployments: 'Deployments',
  pageHeadingEnvAccess: 'Environment access',
  pageHeadingWorkspace: 'Platform workspace',
  pageDescEnvAccess: 'Read the rules for environment access and deployment.',
  pageDescWorkspace:
    'Select environments, review pipeline runs, and check deployment results.',
  gridGuides: 'Grid guides',
  statEnvironments: 'Environments',
  statEnvironmentsDesc: 'Development, staging, production',
  statServiceChecks: 'Service checks',
  statServiceChecksDesc: 'Checks ready for review',
  statRecentRuns: 'Recent runs',
  statRecentRunsDesc: 'Pipeline runs and build logs',
  statClusters: 'Clusters',
  statClustersDesc: 'Comparison by cluster',
  readingPara1:
    'Documentation and operational tools share one design language but differ in information density. Documentation favors sentence flow and the rhythm of long-form reading.',
  readingHeading: 'How services move between environments',
  readingPara2Intro:
    'Review service permissions with the deployment policy. Korean text uses Pretendard and Latin text uses Manrope. Identifiers such as',
  readingPara2Tail: 'use a monospace font.',
  readingPara3:
    'Read the policy, check the release notes, and confirm who can deploy. This preview keeps the reading measure separate from the workspace width.',
  widthSpec:
    'Reading 52rem / Workspace 75rem / Wide 96rem / Base grid 4 / 6 / 12 columns / Gutter 16 / 24px',
  typographyHeadingAll: 'Typography',
  typographyHeadingSplit: 'Specimens and scale',
  typographyIntro:
    'Manrope / Pretendard / JetBrains Mono. Use weights 400 and 500. Choose the visual role and the HTML heading level separately. Antialiasing, kerning, and optical sizing hints apply everywhere. Faux bold is never synthesized. Actual rendering varies by browser and display.',
  displaySpecimenCaption:
    'Display / Manrope + Pretendard / English and Korean sample',
  bodySpecimenCaption:
    'Body / Manrope + Pretendard / English and Korean sample',
  headingSizingNote:
    'Size headings by role: 30–40px for primary screen titles, 24/32px for page titles, and 32–40px for reading-focused titles. Shared role and profile tokens connect them without forcing one size on every heading. The samples below mix Korean (Hangul) and English to show both scripts at each size.',
  typographyRoles: 'Typography roles',
  roleTitle: 'Title',
  rolePage: 'Page',
  roleSection: 'Section',
  roleSubsection: 'Subsection',
  roleBody: 'Body',
  roleReading: 'Reading',
  roleTable: 'Table',
  roleCaption: 'Caption',
  roleCode: 'Code',
  roleMetric: 'Metric',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    layoutHeadingAll: '레이아웃',
    layoutHeadingSplit: '작업 공간과 읽기',
    layoutIntro:
      '구조는 중첩된 배경이 아니라 콘텐츠 정렬과 여백으로 만듭니다. 작업 공간 화면과 문서 화면의 너비, 간격, 정보 밀도를 비교해 보세요.',
    layoutProfile: '레이아웃 프로필',
    profileWorkspace: '작업 공간 / 운영',
    profileReading: '읽기 / 문서',
    profileWide: '와이드 / 비교',
    density: '밀도',
    layoutDensity: '레이아웃 밀도',
    densityComfortable: '여유 / 24px',
    densityCompact: '촘촘 / 16px',
    layoutBreadcrumb: '레이아웃 미리보기 브레드크럼',
    platformServices: '플랫폼 서비스',
    crumbDocumentation: '문서',
    crumbDeployments: '배포',
    pageHeadingEnvAccess: '환경 접근',
    pageHeadingWorkspace: '플랫폼 작업 공간',
    pageDescEnvAccess: '환경 접근과 배포의 규칙을 읽어 보세요.',
    pageDescWorkspace:
      '환경을 선택하고 파이프라인 실행을 검토한 뒤 배포 결과를 확인하세요.',
    gridGuides: '그리드 가이드',
    statEnvironments: '환경',
    statEnvironmentsDesc: '개발, 스테이징, 프로덕션',
    statServiceChecks: '서비스 점검',
    statServiceChecksDesc: '검토할 준비가 된 점검',
    statRecentRuns: '최근 실행',
    statRecentRunsDesc: '파이프라인 실행과 빌드 로그',
    statClusters: '클러스터',
    statClustersDesc: '클러스터별 비교',
    readingPara1:
      '문서와 운영 도구는 하나의 디자인 언어를 공유하지만 정보 밀도는 다릅니다. 문서는 문장 흐름과 긴 글 읽기의 리듬을 우선합니다.',
    readingHeading: '서비스가 환경을 이동하는 방식',
    readingPara2Intro:
      '배포 정책으로 서비스 권한을 검토하세요. 한국어 텍스트는 Pretendard, 라틴 문자 텍스트는 Manrope을 사용합니다.',
    readingPara2Tail: '같은 식별자는 모노스페이스 글꼴을 사용합니다.',
    readingPara3:
      '정책을 읽고 릴리스 노트를 확인하고 누가 배포할 수 있는지 점검하세요. 이 미리보기는 읽기 폭을 작업 공간 너비와 별도로 유지합니다.',
    widthSpec:
      '읽기 52rem / 작업 공간 75rem / 와이드 96rem / 기본 그리드 4 / 6 / 12열 / 거터 16 / 24px',
    typographyHeadingAll: '타이포그래피',
    typographyHeadingSplit: '견본과 타입 스케일',
    typographyIntro:
      'Manrope / Pretendard / JetBrains Mono. 웨이트는 400과 500을 사용하세요. 시각 역할과 HTML 제목 레벨은 각각 따로 선택하세요. 안티앨리어싱, 커닝, 옵티컬 사이징 힌트가 모든 곳에 적용됩니다. 유사 볼드는 합성하지 않습니다. 실제 렌더링은 브라우저와 디스플레이에 따라 달라집니다.',
    displaySpecimenCaption:
      'Display / Manrope + Pretendard / 영어와 한국어 견본',
    bodySpecimenCaption: 'Body / Manrope + Pretendard / 영어와 한국어 견본',
    headingSizingNote:
      '역할에 따라 제목 크기를 정합니다: 주 화면 제목은 30–40px, 페이지 제목은 24/32px, 읽기 중심 제목은 32–40px입니다. 공유된 역할과 프로필 토큰이 모든 제목에 하나의 크기를 강요하지 않으면서 이들을 연결합니다. 아래 견본은 각 크기에서 두 문자 체계를 모두 보여 주기 위해 한국어(한글)와 영어를 섞었습니다.',
    typographyRoles: '타이포그래피 역할',
    roleTitle: '제목',
    rolePage: '페이지',
    roleSection: '섹션',
    roleSubsection: '하위 섹션',
    roleBody: '본문',
    roleReading: '읽기',
    roleTable: '표',
    roleCaption: '캡션',
    roleCode: '코드',
    roleMetric: '지표',
  },
}
