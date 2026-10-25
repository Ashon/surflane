import type { DocKo } from './types'
export const doc: DocKo = {
  usage:
    '경로, 제목, 설명, 관련 액션과 함께 페이지를 엽니다. size는 운영 화면에서 workspace, 밀집 목록에서 page, 읽기 화면에서 document로 설정하세요. 카탈로그의 페이지 헤더도 같은 프리미티브를 사용합니다. 미리보기에서 공유 테두리는 헤더 예시만 감쌉니다. 제품 프로필이나 미리보기 옵션은 감싸지 않습니다.',
  avoid:
    '제목은 전체로 표시하고, 시각적 크기는 heading level이 아닌 size로 정하세요. 어떤 액션이 보일지와 실행 상태는 제품이 로딩, 오류, 권한을 기준으로 결정합니다. 사용할 수 없는 액션을 숨길 때는 이유를 설명하세요. 헤더는 중첩 카드나 별도 배경 없이 페이지에 직접 배치하세요.',
  keyboard:
    '정적 헤더에 키보드 동작을 추가하지 마세요. 링크는 Enter, 버튼은 Enter나 Space로 실행됩니다. SPA 내비게이션 후에는 headingProps의 id와 tabIndex=-1로 제목에 포커스를 이동하세요. 브레드크럼에 이름 있는 내비게이션 landmark를 주고, 현재 페이지를 aria-current=page로 표시하세요.',
  props: {
    'title / description / breadcrumb / actions': 'ReactNode; 보조 슬롯은 선택',
    level: '1–6; 의미론적 heading 순위',
    variant:
      'display | title | page | section | subsection: 제목의 글자 역할. Heading의 variant와 같습니다',
    lead: '설명을 reading 역할과 읽기 폭으로 둡니다. 설명으로 시작하는 문서에 씁니다',
    headingProps: 'id와 tabIndex를 포함한 heading HTML 속성',
    actionsLabel: '선택적 접근성 그룹 이름',
  },
}
