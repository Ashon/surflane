import type { DocKo } from './types'

export const navigationDocsKo: Record<string, DocKo> = {
  tabs: {
    usage:
      '같은 컨텍스트에서 관련 패널을 전환하세요. 선택된 탭은 전체 둥근 표면으로 표시됩니다. Panel.keepMounted를 설정해 입력을 보존하세요.',
    avoid:
      '탭 상태로 별도 페이지 사이의 내비게이션을 흉내 내지 마세요. 대신 링크를 사용하세요. 화살표 키 포커스에 느린 콘텐츠를 로드하지 마세요. 기본 수동 활성화를 유지하세요.',
    keyboard:
      'Tab은 활성 탭으로 포커스를 이동합니다. 화살표 키, Home, End는 탭 사이를 이동합니다. 기본 수동 모드에서는 Enter나 Space가 포커스된 탭을 활성화합니다. List.activateOnFocus=true에서는 탭이 포커스를 받으면 활성화됩니다. 비활성 탭은 포커스를 받지만 활성화되지는 않습니다.',
    props: {
      'Root.value / defaultValue / onValueChange': '선택된 탭 값과 변경 콜백',
      'List.activateOnFocus': '화살표 키 포커스 시 탭 활성화',
      'Panel.keepMounted': '비활성 패널을 DOM에 유지',
    },
  },
  accordion: {
    usage:
      '제목 아래에서 관련 세부 정보를 펼치세요. 단일 항목 모드에서는 닫히는 패널과 열리는 패널이 높이 및 페이드 전환으로 교체됩니다. 닫히는 패널은 inert가 되어 전환 중에 입력을 사용할 수 없습니다. reduced motion에서는 패널이 즉시 전환됩니다.',
    avoid:
      '접힌 패널에 필수 정보를 모두 숨기지 마세요. 핵심 사실은 바깥에 보이게 유지하세요. Trigger 안에 버튼이나 링크를 중첩하지 마세요. 대신 Panel에 배치하세요.',
    keyboard:
      'Tab과 Shift+Tab은 각 Trigger와 열린 패널의 입력을 이동합니다. Enter나 Space는 패널을 펼칩니다. Base UI 1.9는 Accordion의 화살표 키 로빙 포커스를 제거했습니다.',
    props: {
      'Root.value / defaultValue': '펼쳐진 항목 값의 배열',
      'Root.multiple / keepMounted': '여러 항목 허용 / 닫힌 콘텐츠 마운트 유지',
      'Trigger.indicator': '커스텀 ReactNode; false는 기본 SVG 숨김',
    },
  },
  collapsible: {
    usage:
      '보충 정보 한 그룹을 제자리에서 펼치세요. Trigger와 Panel은 같은 가로 패딩을 공유합니다.',
    avoid:
      '여러 관련 섹션에는 Accordion을 사용하세요. Escape가 모달처럼 닫으리라 기대하지 마세요. 대신 Trigger로 닫으세요.',
    keyboard:
      'Tab으로 Trigger에 이동합니다. Enter나 Space는 Panel을 열고 닫습니다. keepMounted에서는 닫힌 Panel이 입력 상태를 유지합니다.',
    props: {
      'Root.open / defaultOpen / onOpenChange': '제어/비제어 상태',
      'Root.disabled': 'Trigger 비활성화',
      'Panel.keepMounted / hiddenUntilFound':
        '닫힌 동안 상태 유지 / 브라우저 찾기에서 표시',
    },
  },
  avatar: {
    usage:
      '사용자 이미지를 보여주세요. 이미지가 없거나 로드에 실패하면 이니셜이나 SVG가 fallback으로 표시됩니다. alt 텍스트나 Root name을 설정해 가까운 이름이 두 번 읽히지 않게 하세요. Status는 이미지와 분리된 장식 배지입니다. 실제 상태는 Root의 aria-description이나 인접 텍스트로 노출하세요.',
    avoid:
      'Avatar span 자체를 계정 메뉴로 만들지 마세요. 이름이 있는 button이나 Popover.Trigger로 감싸세요.',
    keyboard:
      '정적 Avatar는 Tab 순서에 없습니다. button 안에서는 button이 포커스와 동작을 제공합니다.',
    props: {
      'Fallback.delay': 'fallback 전 밀리초',
      Status:
        '장식 코너 마커; aria-hidden 설정하고 Root 또는 인접 텍스트에서 가용성 설명',
    },
  },
  badge: {
    usage:
      'StatusBadge로 짧은 상태를 보여주세요. 각 tone에 의미 있는 SVG를 추가합니다. 일반 라벨이나 개수에는 중립 표면에서 Badge를 사용하세요. Badge는 테두리가 없습니다. 상태 배지는 badge 배경 토큰의 밝은 tone 표면과 텍스트, 아이콘을 짝지으며 InlineMessage와 분리됩니다. 작은 상태 라벨은 12px, medium(500) weight를 사용해 가독성을 유지합니다.',
    avoid:
      '색이나 아이콘만으로 상태를 전달하지 마세요. 항상 텍스트 라벨을 포함하세요. 액션에는 Button을 사용하고 배지를 버튼처럼 꾸미지 마세요. 변경 사항은 role=status 문장 하나에서 알리고, 모든 배지에 live role을 두지 마세요.',
    keyboard:
      '배지는 정적 span이며 Tab 순서에 없습니다. 상태 변경을 알리려면 role=status를 문장 하나에 두세요.',
    props: {
      icon: '커스텀 ReactNode; false는 아이콘 숨김',
      children: '보이는 상태 라벨 또는 개수',
    },
  },
  separator: {
    usage:
      '콘텐츠에서 가로 또는 세로로 의미 있는 경계를 표시하세요. 바깥 간격은 부모 Stack이나 Inline이 설정합니다.',
    avoid:
      '모든 행 사이에 선을 반복하지 마세요. 대신 간격을 사용하세요. 순수 장식 선에는 CSS나 aria-hidden을 사용하세요.',
    keyboard:
      'Separator는 비대화형이며 Tab 순서에 없습니다. aria-orientation이 방향을 전달합니다.',
    props: {
      inset: 'space-4만큼 가로 인셋',
    },
  },
  link: {
    usage:
      '실제 href로 목적지에 이동하세요. 밑줄과 포커스 링이 이동을 보여줍니다.',
    avoid:
      '액션에 href 없는 링크를 사용하지 마세요. 대신 Button을 사용하세요. 링크가 새 탭을 열 때는 텍스트에 밝히고 rel을 설정하세요.',
    keyboard:
      'Tab으로 링크에 이동하고 Enter로 엽니다. 보조 키 클릭, 새 탭, 다운로드, 해시 내비게이션은 브라우저 기본값을 유지합니다.',
    props: {
      'href / target / rel / download': '네이티브 anchor props',
    },
  },
  breadcrumbs: {
    usage:
      '최상위에서 현재 위치까지의 경로를 순서 목록으로 보여주세요. 긴 경로는 접히지 않고 줄바꿈되어 읽는 순서가 유지됩니다.',
    avoid:
      '스크린 리더가 경로 구분자를 읽지 않게 하세요. 대신 장식 Separator를 사용하세요. 현재 위치는 aria-current=page로 표시하세요. 라우터 로직은 제품에 유지하세요.',
    keyboard:
      'Tab으로 상위 링크에 이동하고 Enter로 엽니다. 현재 위치는 Tab 정지점이 아닙니다.',
    props: {
      'Root.aria-label': '접근 가능한 내비게이션 이름',
      Link: '공유 네이티브 Link',
      Current: 'aria-current=page가 있는 span',
    },
  },
}
