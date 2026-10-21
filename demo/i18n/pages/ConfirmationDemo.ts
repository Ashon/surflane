import type { Locale } from '../../i18n'

const en = {
  heading: 'Confirmation',
  intro:
    "Confirm important decisions in a small dialog. Confirm lightweight actions next to their button. This preview doesn't affect real data.",
  discardTrigger: 'Preview discard confirmation',
  discardTitle: 'Discard this draft?',
  discardDescription:
    "Discards the preview draft in progress. Real tests and environments aren't affected.",
  keepDraft: 'Keep draft',
  discardPreviewDraft: 'Discard preview draft',
  resetTrigger: 'Preview reset confirmation',
  resetTitle: 'Reset preview filters?',
  resetDescription: 'Resets the selected filters to their defaults.',
  keepFilters: 'Keep filters',
  resetPreviewFilters: 'Reset preview filters',
  noActionTaken: 'No preview action taken.',
  draftDiscarded: 'Preview draft discarded.',
  filtersReset: 'Preview filters reset.',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    heading: '확인',
    intro:
      '중요한 결정은 작은 대화상자에서 확인하세요. 가벼운 작업은 버튼 옆에서 확인하세요. 이 미리보기는 실제 데이터에 영향을 주지 않습니다.',
    discardTrigger: '미리보기 초안 삭제 확인',
    discardTitle: '이 초안을 삭제할까요?',
    discardDescription:
      '진행 중인 미리보기 초안을 삭제합니다. 실제 테스트와 환경에는 영향을 주지 않습니다.',
    keepDraft: '초안 유지',
    discardPreviewDraft: '미리보기 초안 삭제',
    resetTrigger: '미리보기 초기화 확인',
    resetTitle: '미리보기 필터를 초기화할까요?',
    resetDescription: '선택한 필터를 기본값으로 초기화합니다.',
    keepFilters: '필터 유지',
    resetPreviewFilters: '미리보기 필터 초기화',
    noActionTaken: '실행된 미리보기 작업이 없습니다.',
    draftDiscarded: '미리보기 초안이 삭제되었습니다.',
    filtersReset: '미리보기 필터가 초기화되었습니다.',
  },
}
