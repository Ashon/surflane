import type { Locale } from '../../i18n'

const en = {
  cycleNote:
    'One button steps light, dark and system. This frame follows it and keeps the choice after a reload; system follows the device as it changes.',
  groupNote:
    "variant='group' shows the three side by side, for a settings page. Where they don't fit, only the icons show. The button beside it drives the same frame, and onThemeChange reports the theme that applies, such as for theme-color.",
  applied: (theme: string, mode: string) => `Applied: ${theme} (${mode})`,
  mode: { light: 'light', dark: 'dark', system: 'system' },
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    cycleNote:
      '버튼 하나가 라이트, 다크, 시스템을 차례로 바꿉니다. 이 틀은 버튼을 따르고, 새로 고쳐도 선택을 기억합니다. 시스템은 기기 설정이 바뀌면 따라갑니다.',
    groupNote:
      "variant='group'은 셋을 나란히 보여 줍니다. 설정 화면에 맞습니다. 다 들어가지 않으면 아이콘만 보입니다. 옆의 버튼도 같은 틀을 바꾸고, onThemeChange는 theme-color처럼 실제로 적용된 테마를 알려 줍니다.",
    applied: (theme: string, mode: string) => `적용됨: ${theme} (${mode})`,
    mode: { light: '라이트', dark: '다크', system: '시스템' },
  },
}
