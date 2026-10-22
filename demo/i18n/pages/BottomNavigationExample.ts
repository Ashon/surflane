import type { Locale } from '../../i18n'

const en = {
  showBadges: 'Show badges',
  rtlPreview: 'RTL preview',
  phoneScreen: 'Phone screen preview',
  primary: 'Primary',
  runs: 'Runs',
  schedule: 'Schedule',
  activity: 'Activity',
  account: 'Account',
  unread: (count: number) => `${count} unread`,
  accountNeedsAttention: 'needs attention',
  rows: {
    runs: [
      'Deploy platform-api',
      'Rebuild search index',
      'Rotate staging keys',
    ],
    schedule: [
      'Nightly backup, 02:00',
      'Weekly report, Monday',
      'Key rotation, day 1',
    ],
    activity: [
      'Kim approved a deploy',
      'A run failed on staging',
      'Lee joined the team',
    ],
    account: ['Profile', 'Notifications', 'Sessions'],
  },
  rowDescription: (n: number) => `Local record ${n}`,
  current: (label: string) => `Current destination: ${label}`,
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    showBadges: '배지 표시',
    rtlPreview: 'RTL 미리보기',
    phoneScreen: '휴대폰 화면 미리보기',
    primary: '주 메뉴',
    runs: '실행',
    schedule: '일정',
    activity: '활동',
    account: '계정',
    unread: (count: number) => `읽지 않음 ${count}개`,
    accountNeedsAttention: '확인 필요',
    rows: {
      runs: ['platform-api 배포', '검색 색인 다시 빌드', '스테이징 키 교체'],
      schedule: [
        '야간 백업, 02:00',
        '주간 보고서, 월요일',
        '키 교체, 매월 1일',
      ],
      activity: [
        '김 님이 배포를 승인함',
        '스테이징에서 실행 실패',
        '이 님이 팀에 합류함',
      ],
      account: ['프로필', '알림', '세션'],
    },
    rowDescription: (n: number) => `로컬 기록 ${n}`,
    current: (label: string) => `현재 목적지: ${label}`,
  },
}
