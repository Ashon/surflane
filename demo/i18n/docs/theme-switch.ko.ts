import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '라이트, 다크, 기기 설정을 버튼 하나로 차례로 고르게 하세요. 버튼은 이름과 툴팁에 지금 테마와 다음 테마를 말합니다. 스위치는 페이지의 루트 요소, 또는 범위 테마라면 target에 테마 크로스페이드와 함께 data-theme을 정하고, 선택을 data-theme-mode에 두고, persist 이름으로 기억합니다. 시스템은 기기 설정에 따라 라이트나 다크로 정해지고, 설정이 바뀌면 따라갑니다. variant=\'group\'은 설정 화면처럼 셋을 나란히 보여 주고, 이름이 들어가지 않으면 아이콘만 보입니다. AppShell 사이드바 안에서는 링크와 같은 줄("Theme: System" 같은)이 되고 접힌 레일에서는 이름이 툴팁이 되며, 그룹은 사이드바가 펼쳐 있을 때만 셋을 보여 줍니다.',
  avoid: [
    '기기 설정이 중요한 곳에서 라이트와 다크만 두지 마세요. 기본은 시스템입니다.',
    '같은 때에 다른 곳에서 data-theme을 정하지 마세요. 서버가 첫 화면에 읽는 쿠키처럼 직접 가진 상태로 움직이려면 value와 onValueChange를 주세요.',
  ],
  keyboard: [
    '버튼은 지금 테마와 누르면 바뀔 테마를 이름으로 말하고, 툴팁에도 같은 내용을 보여 줍니다. Enter나 Space로 다음 테마로 바꿉니다.',
    "variant='group'은 segmented control입니다. Tab으로 들어가고, 화살표 키로 라이트, 다크, 시스템 사이를 옮기고, Enter나 Space로 고릅니다. 고른 것이 눌린 상태이고, 자리가 없어 숨긴 이름은 보조 기술에 남습니다.",
    '테마는 크로스페이드로 바뀌고, 동작 줄이기에서는 바로 바뀝니다.',
  ],
  props: {
    'value / defaultValue / onValueChange':
      'light | dark | system. 기억된 선택, 그다음 페이지의 data-theme-mode가 defaultValue보다 앞섭니다',
    variant: 'cycle | group',
    target: '미리보기처럼 테마를 적용할 요소의 ref',
    persist:
      '스위치가 스스로 가진 선택을 기억하는 localStorage 키. false면 세션 동안만 둡니다. value를 주면 직접 가진 상태가 기억합니다',
    labels: 'label, light, dark, system, next(current, next)',
  },
}
