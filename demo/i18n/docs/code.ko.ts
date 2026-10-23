import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '공백과 줄바꿈을 유지한 채 코드, 설정, 긴 식별자를 보여주고 선택·복사할 수 있게 하세요. 복사 버튼은 결과를 제자리에 표시합니다: Copied 또는 Copy unavailable. 콘텐츠는 기본적으로 가로로 스크롤됩니다. 문서에서는 wrap을 설정해 긴 줄만 줄바꿈되게 하세요.',
  avoid: [
    '구문 강조를 구문 검증이나 실행 결과로 오해하지 않게 하세요. 그런 결과는 따로 알리세요.',
    '코드를 HTML로 주입하거나 실행하지 마세요. 대신 일반 소스 문자열을 code로 전달하세요.',
    '거부된 클립보드 쓰기를 성공으로 취급하지 마세요. 실패 시 사용자 지정 onCopy가 throw하거나 reject하게 두면 버튼이 Copy unavailable을 표시합니다.',
  ],
  keyboard: [
    'Tab은 복사 버튼과 스크롤 영역에 도달합니다.',
    'Enter 또는 Space는 복사합니다. 결과가 버튼 라벨을 제자리에서 교체하므로 다른 것은 움직이지 않습니다: 성공 시 Copied, 실패 시 Copy unavailable.',
    '실패 시 소스가 선택되어 키보드 복사 단축키를 쓸 수 있습니다.',
    '소스를 바꾸면 결과가 지워지고, 늦은 응답이 새 소스의 상태를 덮어쓰지 않습니다.',
    '라벨은 polite 라이브 영역이며 2초 후 액션으로 돌아갑니다.',
  ],
  props: {
    code: '일반 소스 문자열',
    'label / language':
      '스크롤 영역 이름 / Shiki 문법과 표시 언어 힌트; 알 수 없는 언어는 일반 텍스트로 렌더링',
    wrap: '긴 소스 줄을 시각적으로 줄바꿈',
    onCopy: '선택적 클립보드 작성자 (text) => void | Promise<void>',
    'copyLabel / copiedLabel / copyErrorLabel':
      '현지화된 액션 라벨과 버튼 안의 짧은 결과',
  },
}
