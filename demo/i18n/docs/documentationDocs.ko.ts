import type { DocKo } from './types'

export const documentationDocsKo: Record<string, DocKo> = {
  documentation: {
    usage: [
      'PageHeader, Prose, CodeBlock, InlineMessage, 네이티브 목차 링크로 문서를 만드세요.',
      '본문은 명시적 읽기 폭을 유지합니다. 보조 목차는 넓은 화면에서 본문 옆에, 좁은 화면에서는 본문 앞에 놓입니다.',
      '각 제목의 안정적인 ID 를 목차 href 에 맞추세요. 공유 문서 스크롤 위치로 현재 항목을 표시하세요.',
      '언어를 바꿔도 섹션 ID 는 유지되고 article.lang, 공지, 복사 메시지가 바뀝니다.',
    ],
    avoid: [
      '문서 전체와 각 섹션에 카드를 중첩하지 마세요.',
      '읽기 폭 제한을 일반 UI 설명 텍스트에 적용하지 마세요. 문서 본문의 Prose 에만 적용하세요.',
      '가로 코드 넘침이 페이지 전체를 스크롤하게 하지 마세요. 공유 ScrollArea 에 두세요.',
      '공지 의미를 색만으로 전달하지 마세요.',
      '예시의 날짜와 설정을 실제 데이터로 취급하지 마세요. 고정된 로컬 콘텐츠이며, 실제 문서의 번역 상태, 서버 문서 로딩, 권한, URL 로케일, 버전 전환은 제품이 소유합니다.',
    ],
    keyboard: [
      '목차 링크는 표준 a href=#id 링크입니다. 대상 제목은 tabIndex=-1 로 포커스를 받을 수 있습니다.',
      '목차 스크롤 추적은 포커스를 이동시키지 않습니다. 언어나 줄 바꿈을 바꿔도 사용 중인 컨트롤에 포커스가 유지됩니다.',
      '가로 코드 영역은 공유 ScrollArea 에서 키보드와 포인터로 스크롤됩니다.',
      '목차는 Collapsible 의 버튼과 aria-expanded 상태로 접힙니다.',
      '제목은 페이지 h1 → 미리보기 h2 → 문서 제목 h3 → 본문 섹션 h4 순서입니다. CodeBlock 은 복사 성공이나 실패를 알립니다.',
    ],
    props: {
      Prose: '문서 콘텐츠의 명시적 읽기 폭, 타이포그래피, 줄 바꿈',
      'Heading IDs / TOC href':
        '번역 전체에서 공유하는 안정적인 시맨틱 섹션 ID',
      'Article.lang': '현지화된 문서 하위 트리의 언어',
      'CodeBlock.wrap': '가로 코드 탐색 또는 긴 줄 바꿈',
      'TOC state': 'Collapsible 공개 상태와 현재 섹션의 aria-current=location',
      'Preview content':
        '현지화된 제목/본문/메시지; 고정 샘플 날짜; 선택적 긴 문서',
    },
  },
}
