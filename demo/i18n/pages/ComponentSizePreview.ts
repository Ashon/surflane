import type { Locale } from '../../i18n'

const en = {
  groupLabel: 'Component preview size',
  previewSize: (label: string) => `Preview size: ${label}`,
  sizeSmall: 'Small',
  sizeDefault: 'Default',
  sizeLarge: 'Large',
  sizeName: 'Size',
  densityName: 'Density',
  descriptionDensity:
    'Compare the same example at each size and table density. Switching keeps input values and selection state.',
  densityGroupLabel: 'Table density',
  previewDensity: (label: string) => `Table density: ${label}`,
  densityDefault: 'Default',
  densityCompact: 'Compact',
  description:
    'Compare the same example at each size. Switching keeps input values and selection state.',
  sizeGuidance: 'Size guidance and comparisons',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    groupLabel: 'Component 미리보기 크기',
    previewSize: (label: string) => `미리보기 크기: ${label}`,
    sizeSmall: 'Small',
    sizeDefault: 'Default',
    sizeLarge: 'Large',
    sizeName: '크기',
    densityName: '밀도',
    descriptionDensity:
      '같은 예시를 각 크기와 표 밀도에서 비교하세요. 전환하면 입력 값과 선택 상태가 유지됩니다.',
    densityGroupLabel: '표 밀도',
    previewDensity: (label: string) => `표 밀도: ${label}`,
    densityDefault: '기본',
    densityCompact: '촘촘하게',
    description:
      '같은 예시를 각 크기에서 비교하세요. 전환하면 입력 값과 선택 상태가 유지됩니다.',
    sizeGuidance: '크기 가이드와 비교',
  },
}
