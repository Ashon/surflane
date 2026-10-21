import type { DocKo } from './types'

export const appShellDocsKo: Record<string, DocKo> = {
  'app-shell': {
    usage: [
      '워크스페이스 레이아웃을 사용해 메인 콘텐츠와 사이드바를 짝지으세요. 사이드바에는 브랜드, 접기 토글, 하단 계정이 들어갑니다. 전역 상단 레일이 필요한 문서 사이트에는 기본 header 레이아웃을 사용하세요.',
      'AppShell은 레이아웃과 네이티브 링크 스타일을 제공합니다. 접힘 상태, 라우트, 계정, 테마는 호출하는 쪽이 소유합니다.',
      '워크스페이스 사이드바는 224px에서 72px로 접히며 아이콘은 위치를 유지합니다. 24px 제품 마크를 내비게이션 아이콘 열에 중앙 정렬하세요.',
      '제품 이름은 subsection 역할(Manrope 500, 16/24, --ink, 기본 tracking)로 한 줄에 설정하세요. 링크 라벨 줄에서 시작합니다. 긴 이름은 줄임표로 잘리고 전체 텍스트를 title에 유지합니다.',
      '선택적 두 번째 줄은 caption 역할(12/18, --ink-muted)로 워크스페이스 이름을 표시합니다. 계정 행은 24px Avatar와 body weight 이름으로 브랜드를 반영합니다.',
      '브랜드와 계정은 고정되어 있고, 메뉴와 메인 콘텐츠는 별도 ScrollArea에서 스크롤됩니다. 콘텐츠 표면이 전체 스크롤 콘텐츠를 덮으므로 하단 모서리 반경은 끝에서만 나타납니다.',
      '메인 콘텐츠는 문서와 함께 스크롤될 수도 있습니다. 뒤에 페이지가 없는 전체 뷰포트 셸에서는 scrollChain="contain"을 설정해 가장자리 스크롤이 페이지를 바운스하지 않게 하세요.',
      '고정 값을 쌓는 대신 각 내부 반경을 max(0px, 외부 반경 - inset)로 파생하세요. 예시는 콘텐츠 표면에 --radius-md(10px)에서 시작해 셸은 22px(+12px inset), 경계는 26px(+3px padding, +1px border)로 파생합니다.',
      '예시는 페이지의 고정 높이 프레임에 있으므로 ScrollArea는 기본 scrollChain="auto"를 유지하고 가장자리에서 휠을 페이지에 넘깁니다. Overflow 내비게이션과 Long workspace content를 켜면 별도 스크롤을 볼 수 있습니다.',
      '제품 선택과 미리보기 옵션은 예시 경계 밖에 있고, 테마 스위치는 계정 메뉴에 있습니다. 예시의 아이콘 접기는 제품 선택이며, 실제 문서 사이트의 사이드바는 텍스트 우선입니다.',
    ],
    avoid: [
      '모든 제품에 아이콘 사이드바를 강요하지 마세요. 문서 사이드바는 텍스트 우선으로 유지할 수 있습니다.',
      '링크에 menu 역할을 주지 마세요. 현재 페이지는 aria-expanded가 아닌 aria-current로 표시하세요.',
      '다른 내비게이션 없이 모바일에서 데스크톱 사이드바를 숨기지 마세요. 하단 Sheet 같은 대체재를 제공하세요.',
      '레이아웃 모듈이 권한이나 로그인을 처리하리라 기대하지 마세요. 애플리케이션에서 처리하세요.',
      '텍스트를 흐리게 하는 블러로 사이드바 가장자리를 페이드하지 마세요.',
    ],
    keyboard: [
      'Tab과 Shift+Tab은 네이티브 링크와 버튼에 도달합니다. Enter는 링크를 따릅니다.',
      '모바일 하단 Sheet는 현재 목적지에서 열립니다. 목적지를 선택하면 Sheet가 닫히고 포커스가 새 콘텐츠 heading으로 이동합니다.',
      'Base UI가 Sheet의 열기 버튼, Escape, 포커스 트래핑, 닫힘 시 포커스 복원을 처리합니다. 실제 제품에서는 라우터가 내비게이션, 뒤로 가기, 스크롤 복원을 소유합니다.',
      '토글은 aria-expanded와 aria-controls를 설정합니다. 링크는 접혀 있어도 명확한 접근성 이름을 유지합니다.',
    ],
    props: {
      'Root style --app-shell-radius / --app-shell-inset':
        '외부 표면 반경과 간격; 내부 반경 = max(0, radius - inset)',
      'Root.layout':
        'header(전역 레일) / workspace(사이드바 브랜드, 모바일 전용 header)',
      'Root.collapsed': '제어된 사이드바 너비; 라벨은 접근 가능하게 유지',
      'Root style --app-shell-sidebar-width':
        '펼친 너비; header: 216px / 64px; workspace: 224px / 72px',
      'Header / Sidebar / Content / Footer':
        '네이티브 속성, className, refs를 가진 레이아웃 슬롯',
      Link: '네이티브 anchor: href, icon, label, aria-current, ref, 이벤트 핸들러',
      Label: '펼침 시 줄임표; 접힘 시 시각적으로 숨김',
      'Mobile navigation':
        '호출자가 제공한 Sheet(≤760px); 데스크톱 Sidebar는 숨김',
    },
  },
}
