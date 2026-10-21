import type { Locale } from '../../i18n'

const en = {
  workspace: 'Workspace',
  workspaceDescription: 'Manage services, pipelines, and deployments.',
  inventory: 'Inventory',
  inventoryDescription: 'Explore the service inventory and its dependencies.',
  documentation: 'Documentation',
  documentationDescription: 'Read shared guides and product documentation.',
  rtlPreview: 'RTL preview',
  verticalNavigation: 'Vertical navigation',
  disableLearn: 'Disable Learn',
  cancelChanges: 'Cancel changes',
  platformNavigation: 'Platform navigation',
  products: 'Products',
  learn: 'Learn',
  deploymentGuide: 'Deployment guide',
  deploymentGuideDescription: 'Understand deployment policies by environment.',
  layoutFoundations: 'Layout foundations',
  layoutFoundationsDescription:
    'Inspect shared spacing, grid, and content widths.',
  guide: 'Guide',
  platformNavigationDestinations: 'Platform navigation destinations',
  status: (section: string, current: string) =>
    `Open section: ${section}. Current product: ${current}.`,
  none: 'none',
  guideSectionDescription:
    'Check which environments a policy allows or blocks. Keep redacted logs.',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    workspace: '워크스페이스',
    workspaceDescription: '서비스, 파이프라인, 배포를 관리하세요.',
    inventory: '인벤토리',
    inventoryDescription: '서비스 인벤토리와 종속성을 탐색하세요.',
    documentation: '문서',
    documentationDescription: '공유 가이드와 제품 문서를 읽으세요.',
    rtlPreview: 'RTL 미리보기',
    verticalNavigation: '세로 내비게이션',
    disableLearn: '학습 비활성화',
    cancelChanges: '변경 취소',
    platformNavigation: '플랫폼 내비게이션',
    products: '제품',
    learn: '학습',
    deploymentGuide: '배포 가이드',
    deploymentGuideDescription: '환경별 배포 정책을 이해하세요.',
    layoutFoundations: '레이아웃 파운데이션',
    layoutFoundationsDescription:
      '공유 스페이싱, 그리드, 콘텐츠 너비를 검사하세요.',
    guide: '가이드',
    platformNavigationDestinations: '플랫폼 내비게이션 대상',
    status: (section: string, current: string) =>
      `열린 섹션: ${section}. 현재 제품: ${current}.`,
    none: '없음',
    guideSectionDescription:
      '정책이 허용하거나 차단하는 환경을 확인하세요. 수정된 로그를 유지하세요.',
  },
}
