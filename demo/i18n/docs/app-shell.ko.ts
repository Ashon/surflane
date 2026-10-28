import type { DocKo } from './types'
export const doc: DocKo = {
  usage: [
    '워크스페이스 레이아웃을 사용해 메인 콘텐츠와 사이드바를 짝지으세요. 사이드바에는 브랜드, 접기 토글, 하단 계정이 들어갑니다. 전역 상단 레일이 필요한 문서 사이트에는 기본 header 레이아웃을 사용하세요.',
    'AppShell은 레이아웃과 네이티브 링크 스타일을 제공하고, 라우트, 계정, 테마는 호출하는 쪽이 소유합니다. 접힘 상태는 셸이 직접 관리합니다. SidebarToggle이나 텍스트 입력 밖에서 누른 ⌘B(다른 OS에서는 Ctrl+B)가 사이드바를 접고, persist는 상태를 localStorage에 기억하며, 레일에서는 각 Link가 이름을 툴팁으로 보여 줍니다. 상태를 직접 제어하려면 collapsed와 onCollapsedChange를 주고, 서버 렌더링에서 첫 화면을 맞추려면 쿠키를 읽어 defaultCollapsed로 넘기세요.',
    '워크스페이스 사이드바는 224px에서 72px로 접히며 아이콘은 위치를 유지합니다. Brand는 사이드바의 맨 윗줄입니다. 24px 안팎의 제품 마크를 링크의 아이콘 열 가운데에 두고, SidebarToggle이 링크만 한 높이로 링크와 같은 거리만큼 가장자리에서 떨어져 그 줄 끝에 놓입니다. 레일에서는 Brand가 숨고 접기 단추가 그 자리를 차지합니다. 헤더 안에서는 한 줄로 놓입니다.',
    'Brand는 제품 이름을 subsection 역할(Manrope 500, 16/24, --surf-ink, 기본 tracking)로 둡니다. 링크 라벨 줄에서 시작합니다. 사이드바에서 description이 없는 이름은 브랜드 줄 안에서 두 줄까지 쓰고, 그보다 길거나 헤더 안의 이름은 줄임표로 잘리며 전체 텍스트를 title에 유지합니다. description은 워크스페이스처럼 caption 역할(12/18, --surf-ink-muted)로 쓰는 선택적 두 번째 줄입니다.',
    'Bar는 프로젝트의 페이지를 NavigationMenu 링크로 두는 것처럼 페이지 자신의 탭을 페이지 맨 위에 둡니다. Page의 첫 자식으로 두세요. 높이는 브랜드 줄에서 위아래 셸 간격을 뺀 값(B − 2I, 56px)이고, 안의 컨트롤은 small 크기(32px)를 씁니다. 링크의 패딩과 테두리만큼(X, 13px) 페이지 텍스트 밖으로 블리드합니다. 그래서 탭 글자는 본문과 같은 x에, 탭 가운데는 브랜드 줄의 선에 서고, 탭은 페이지가 셸에서 떨어진 만큼 페이지의 위와 시작에서 떨어집니다(G = P − X, 약 12px). 다른 컨트롤은 자기 패딩에 따라 몇 px 안에서 맞습니다. 페이지와는 선이 아니라 그 아래 여백으로 나뉘고, 현재 탭의 면이 지금 페이지를 표시합니다. compact 밀도와 폰에서는 페이지 패딩에 블리드할 자리가 없어 탭이 본문 텍스트에서 시작하고, 폰에서는 모바일 헤더 아래에 탭 높이만큼 놓입니다.',
    'compact 밀도(셸을 SizeProvider density="compact"로 감쌀 때)에서는 사이드바의 줄과 접기 단추가 32px입니다. 브랜드 줄과 레일은 크기를 유지해 아이콘 열과 브랜드 줄의 선이 그대로입니다. 터치에서는 줄이 대상 크기만큼 커지되 자기 크기보다 작아지지 않습니다.',
    'Nav는 Link를 고른 간격으로 쌓고, 워크스페이스 사이드바에서는 아이콘이 레일에 놓이도록 안쪽 여백을 둡니다. label은 링크 위에 보이고, 레일에서도 줄을 유지하며, 내비게이션의 이름이 됩니다. label이 없으면 Nav에 aria-label을 주세요.',
    "Link는 render를 받습니다. 라우터의 링크를 넘기면 클라이언트 내비게이션이 유지됩니다(예: render={<NextLink href='/resources' />}). 계정 줄은 메뉴의 트리거로 그린 Link입니다(render={<Menu.Trigger />}). 24px Avatar를 아이콘으로 두면 링크와 같은 줄에 맞습니다.",
    '브랜드와 계정은 고정되어 있고, 메뉴와 메인 콘텐츠는 별도 ScrollArea에서 스크롤됩니다. 콘텐츠 표면이 전체 스크롤 콘텐츠를 덮으므로 하단 모서리 반경은 끝에서만 나타납니다.',
    '메인 콘텐츠는 문서와 함께 스크롤될 수도 있습니다. 뒤에 페이지가 없는 전체 뷰포트 셸에서는 scrollChain="contain"을 설정해 가장자리 스크롤이 페이지를 바운스하지 않게 하세요.',
    '셸은 창 전체를 채우고 가장자리가 직각입니다. 창의 가장자리가 곧 셸의 가장자리이기 때문입니다. 둥근 것은 안쪽 페이지 면뿐이며, 반경은 --surf-app-shell-page-radius(기본 8px)로 정합니다. 설치 가이드처럼 문서의 여백을 없애고 배경을 크롬 색으로 칠해, 셸 바깥에 아무것도 보이지 않게 하세요.',
    '휴대폰(≤760px)에서는 틀이 물러납니다. 페이지가 모바일 헤더 아래에서 여백과 둥근 모서리 없이 화면 가장자리까지 닿습니다.',
    '이 예시처럼 페이지 안에 셸을 보여 줄 때는 액자가 셸을 둥글게 잘라 내게 하세요. 여기서는 액자가 22px로 잘라 내고 --surf-app-shell-page-radius를 --surf-radius-md(10px)로 정해, 액자와 잘린 면과 페이지가 26, 22, 10px로 동심을 이룹니다.',
    '예시는 페이지의 고정 높이 프레임에 있으므로 ScrollArea는 기본 scrollChain="auto"를 유지하고 가장자리에서 휠을 페이지에 넘깁니다. Overflow 내비게이션과 Long workspace content를 켜면 별도 스크롤을 볼 수 있습니다.',
    '제품 선택과 미리보기 옵션은 예시 경계 밖에 있고, 테마 스위치는 계정 메뉴에 있습니다. 예시의 아이콘 접기는 제품 선택이며, 실제 문서 사이트의 사이드바는 텍스트 우선입니다.',
  ],
  avoid: [
    '모든 제품에 아이콘 사이드바를 강요하지 마세요. 문서 사이드바는 텍스트 우선으로 유지할 수 있습니다.',
    '링크에 menu 역할을 주지 마세요. 현재 페이지는 aria-expanded가 아닌 aria-current로 표시하세요.',
    '다른 내비게이션 없이 모바일에서 데스크톱 사이드바를 숨기지 마세요. 하단 Sheet나 BottomNavigation 같은 대체재를 제공하세요.',
    '레이아웃 모듈이 권한이나 로그인을 처리하리라 기대하지 마세요. 애플리케이션에서 처리하세요.',
    '텍스트를 흐리게 하는 블러로 사이드바 가장자리를 페이드하지 마세요.',
    '페이지의 탭을 페이지 여백으로 밀어 브랜드 줄에 맞추지 마세요. Page 맨 앞의 Bar에 두세요.',
    '한 페이지의 두 셸에 단축키를 주지 마세요. 모형처럼 보여 주기만 하는 셸에는 shortcut={false}를 주세요.',
  ],
  keyboard: [
    'Tab과 Shift+Tab은 네이티브 링크와 버튼에 도달합니다. Enter는 링크를 따릅니다.',
    '모바일 하단 Sheet는 현재 목적지에서 열립니다. 목적지를 선택하면 Sheet가 닫히고 포커스가 새 콘텐츠 heading으로 이동합니다.',
    'Base UI가 Sheet의 열기 버튼, Escape, 포커스 트래핑, 닫힘 시 포커스 복원을 처리합니다. 실제 제품에서는 라우터가 내비게이션, 뒤로 가기, 스크롤 복원을 소유합니다.',
    'SidebarToggle은 aria-expanded와 aria-controls를 설정하고, 툴팁에 단축키를 보여 줍니다. 텍스트 입력 밖에서는 ⌘B나 Ctrl+B로 사이드바를 접고 폅니다. 접힌 링크는 접근성 이름을 유지하고, 호버와 포커스 때 이름을 툴팁으로 보여 줍니다.',
  ],
  props: {
    'Root style --surf-app-shell-page-radius / --surf-app-shell-inset':
      '페이지 면의 반경과 셸의 간격. 셸 자체는 직각입니다',
    'Root.layout':
      'header(전역 레일) / workspace(사이드바 브랜드, 모바일 전용 header)',
    'Root.collapsed / defaultCollapsed / onCollapsedChange':
      '제어형 또는 비제어형 접힘 상태; 라벨은 접근 가능하게 유지',
    'Root.persist':
      '상태를 기억하는 localStorage 키. 서버 렌더링 앱은 대신 쿠키를 읽어 defaultCollapsed로 넘깁니다',
    'Root.collapseBelow':
      '1280처럼 창 너비를 주면 그보다 좁을 때 사이드바가 레일로 시작합니다. 토글로는 여전히 펼칠 수 있고, 그 너비 위의 상태만 기억합니다',
    'Root.shortcut':
      '텍스트 입력 밖에서 ⌘B나 Ctrl+B로 사이드바를 접고 폅니다. 페이지당 셸 하나만',
    'SidebarToggle.labels':
      '{ collapse, expand, shortcut }: 상태별 버튼 이름이자 툴팁, 그리고 툴팁에 보이는 단축키',
    'Root style --surf-app-shell-rail-width': '접힌 레일의 너비',
    'Root style --surf-app-shell-icon-column / --surf-app-shell-brand-height / --surf-app-shell-mark-size':
      '링크의 아이콘 열(브랜드 마크와 계정이 여기에 맞춰짐), 브랜드 줄의 높이, 마크의 크기',
    'Root style --surf-app-shell-sidebar-width':
      '펼친 너비; header: 216px / 64px; workspace: 224px / 72px',
    MenuTrigger:
      'label(버튼 이름. 무엇을 여는지 쓰세요). 사이드바가 숨는 ≤760px에서만 머리글 끝에 보이는 아이콘 버튼입니다. Sheet.Trigger의 render로 넘기세요',
    'Header / Sidebar / Content / Footer':
      '네이티브 속성, className, refs를 가진 레이아웃 슬롯',
    Bar: 'Page의 첫 자식으로 두는 페이지 자신의 탭. small 컨트롤이 페이지 위쪽에서 브랜드 줄의 선에 서고, 링크 패딩만큼 블리드해 글자가 본문과 맞으며, 아래에 선을 두지 않습니다. compact 밀도와 폰에서는 블리드하지 않습니다',
    'style --surf-app-shell-row-height':
      '사이드바 줄과 접기 단추의 높이. 그 위의 어느 요소에든 둘 수 있고, compact 밀도는 32px로 둡니다',
    Page: 'workspace Content 안의 페이지 표면: 사이드바 쪽을 뺀 모든 면에 셸과 간격을 두고, --surf-app-shell-page-radius로 둥글게 합니다. ≤760px에서는 화면 가장자리까지 닿습니다.',
    Brand:
      'mark(장식, 24px 안팎), name(한 줄, 줄임표, title), description(선택적 두 번째 줄), render(홈 링크 등). 사이드바의 맨 윗줄이며 워크스페이스 레일에서는 숨습니다',
    Nav: 'label: 보이는 묶음 이름이자 내비게이션의 이름. 없으면 aria-label. Link를 고른 간격으로 쌓고 워크스페이스 사이드바에서 안쪽 여백을 둡니다',
    Link: '네이티브 anchor: href, icon, label, aria-current, ref, 이벤트 핸들러. 접힌 레일에서는 label이 툴팁으로도 뜹니다',
    'Link.render':
      '같은 줄 모양의 다른 요소: 라우터 링크는 클라이언트 내비게이션을 유지하고, Menu.Trigger는 계정 줄이 됩니다',
    Label: '펼침 시 줄임표; 접힘 시 시각적으로 숨김',
    'Mobile navigation':
      '호출자가 제공한 Sheet(≤760px); 데스크톱 Sidebar는 숨김',
  },
}
