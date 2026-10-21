import type { DocKo } from './types'

export const contentDocsKo: Record<string, DocKo> = {
  card: {
    usage:
      '관련 정보와 액션을 한 표면에 모으세요. 기본 24px 패딩이 네 면을 균형 잡고, 간격이 제목·설명·본문·액션의 위계를 만듭니다. 카드 그리드 텍스트를 주변 본문 텍스트와 정렬하려면 Grid.bleed와 Card.Root.padding을 같은 토큰 단계로 설정하세요. 바깥 컨테이너에 확장된 표면과 포커스 표시기를 담을 공간이 있을 때만 이렇게 하세요.',
    avoid:
      '모든 페이지 구획을 카드로 감싸거나 카드 안에 카드를 쌓지 마세요. 대신 구획을 제목과 간격으로 나누세요. 카드 전체를 가짜 버튼으로 만들지 마세요. 대신 목적 있는 링크와 버튼을 안에 두세요.',
    keyboard:
      '액션만 Tab 순서에 들어갑니다. Root는 포커스나 클릭 동작이 없는 일반 div입니다. Title.level을 주변 제목 위계에 맞추세요. 카드에 그룹 이름이 필요하면 aria-labelledby로 연결하세요.',
    props: {
      'Root.padding': '공유 Space 토큰 단계',
      'Header / Body / Footer': '네이티브 div 속성',
      Description: '네이티브 p 속성',
    },
  },
  code: {
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
  },
  pagination: {
    usage:
      '같은 종류의 결과를 페이지별로 탐색하게 하세요. 목록 뒤에 배치합니다. 페이지 내 상태에는 onPageChange를, 실제 URL 내비게이션에는 getPageHref를 사용하세요. 현재 페이지는 aria-current=page를 가집니다.',
    avoid: [
      '짧은 목록을 나누지 마세요. 대신 전체 목록을 보여주세요.',
      '단계별 입력 흐름에는 사용하지 마세요. 대신 폼 자체의 Back과 Next 액션을 사용하세요.',
      '필터 변경으로 유효하지 않게 된 페이지를 요청하지 마세요. 대신 page를 새 pageCount로 클램프하세요.',
      '커서 기반 내비게이션이 알 수 없을 때 전체 페이지 수를 지어내지 마세요. 대신 일반 Previous/Next 버튼을 사용하세요.',
    ],
    keyboard: [
      'Tab은 컨트롤 사이를 이동합니다.',
      'Enter는 컨트롤을 활성화하고 버튼은 Space에도 응답합니다. 링크는 새 탭 열기 같은 브라우저 동작을 유지합니다.',
      '페이지가 하나 이하일 때 Pagination은 아무것도 렌더링하지 않습니다. 작은 화면에서는 Previous, Next, 현재/전체 페이지 요약을 보여줍니다.',
      '결과 알림 방식, 로딩 표시, 페이지 변경 후 포커스 위치는 호출하는 쪽이 결정합니다.',
    ],
    props: {
      'page / pageCount': '1부터 시작하는 제어 페이지 / 전체 페이지 수',
      'onPageChange | getPageHref': '상호 배타적인 상태 콜백 또는 URL 빌더',
      disabled: '현재 페이지를 바꾸지 않고 모든 컨트롤 비활성화',
      'aria-label': '내비게이션 랜드마크 이름',
    },
  },
}
