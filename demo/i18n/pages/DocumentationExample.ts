import type { Locale } from '../../i18n'

const en = {
  documentLanguage: 'Document language',
  english: 'English',
  korean: 'Korean',
  longDocument: 'Long document',
  wrapSampleCode: 'Wrap sample code',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    documentLanguage: '문서 언어',
    english: '영어',
    korean: '한국어',
    longDocument: '긴 문서',
    wrapSampleCode: '샘플 코드 줄바꿈',
  },
}
