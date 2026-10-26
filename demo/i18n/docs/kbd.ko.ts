import type { DocKo } from './types'
export const doc: DocKo = {
  usage: [
    "키나 단축키는 본문, 툴팁, 안내 줄 어디서든 Kbd로 적으세요. 함께 누르는 키를 넘기면 됩니다. 'mod'는 명령 보조 키라서 ['mod', 'k']는 Apple 플랫폼에서 ⌘K, 그 밖에서는 Ctrl+K로 적힙니다. 보조 키는 플랫폼의 순서대로 놓고, 글자 하나는 키캡처럼 대문자로 적습니다.",
    '키는 놓인 면에서 한 단계 들어간 면 위에, 주변 글자의 87.5% 크기로, 본문 서체로 그려집니다. 툴팁 안에서는 툴팁이 이미 제 면이므로 한 단계 흐린 일반 글자입니다.',
    '⌘, ⇧, 화살표 같은 기호는 화면에 보이지 않는 글자로 스크린 리더에 이름을 알립니다. 보조 키 이름은 어느 나라 키보드에나 영어로 인쇄되어 있으니 영어로 둡니다. 화살표 이름은 labels로 번역하세요.',
  ],
  avoid: [
    "⌘나 Ctrl을 직접 적지 마세요. Mac에서만 맞는 ⌘B는 대부분의 독자에게 틀립니다. 'mod'를 쓰고 Kbd에 맡기세요.",
    'Kbd를 버튼으로 만들거나 단축키를 알리는 유일한 수단으로 쓰지 마세요. 동작은 글로 적고, 단축키가 실행하는 컨트롤에 aria-keyshortcuts를 두세요.',
    'kbd 요소의 aria-label로 키를 알리지 마세요. 이름을 실을 역할이 없습니다.',
  ],
  keyboard: [
    'Kbd는 글자이며 Tab 순서에 없습니다.',
    '서버와 첫 렌더는 Ctrl 형태로 적어 하이드레이션이 맞고, Apple 페이지는 그 직후 ⌘로 바뀝니다.',
  ],
  props: {
    keys: '키 하나, 또는 함께 누르는 키: mod, ctrl, alt, shift, enter, escape, up, down, left, right, 또는 적은 그대로의 키',
    labels:
      '{ command, control, option, shift, up, down, left, right }: 스크린 리더가 기호 대신 읽는 이름',
    platform:
      "서버가 독자의 플랫폼을 알 때 'apple' 또는 'other'. 없으면 브라우저에서 찾습니다",
    'Tooltip.shortcut': 'Kbd가 받는 형태의 키. 라벨 뒤에 보입니다',
  },
}
