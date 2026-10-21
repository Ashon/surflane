import type { DocKo } from './types'
export const toastDocsKo: Record<string, DocKo> = {
  toast: {
    usage: [
      '짧고 비차단적인 결과를 알립니다: 완료된 작업, 복사된 값, 되돌릴 수 있는 변경.',
      '앱에 Provider 하나와 Viewport 하나를 렌더링하세요. 버튼 옆 피드백은 Viewport.layout=anchored와 Positioner를 쓴 별도 Provider를 사용하세요.',
      '기존 ID로 add를 호출하면 해당 토스트가 업데이트됩니다.',
      '스택은 호버나 포커스 시 겹치며 확장됩니다. 항상 펼쳐두려면 Viewport.layout=list를 설정하세요.',
      '토스트는 그림자가 있는 테두리 없는 불투명 표면이며, Root의 tone이 상태 아이콘 색을 정합니다.',
    ],
    avoid:
      '치명적 오류, 입력 검증, 작업 이력을 사라지는 토스트에만 넣지 마세요. 인라인 메시지, 필드 오류, 결과 화면에 유지하세요. 작업이 실행된 후에만 완료로 알리세요. high 우선순위는 즉시 주의가 필요할 때만 쓰세요.',
    keyboard: [
      '토스트는 열릴 때 포커스를 받지 않습니다. F6는 Viewport로 포커스를 이동하고, Tab은 Action과 Close 버튼을 순회합니다.',
      'Escape는 포커스된 토스트를 닫습니다. 스와이프는 보조 해제 수단이므로 Close 버튼을 유지하세요.',
      '타이머는 호버, 포커스, 창이 비활성인 동안 일시정지됩니다.',
    ],
    props: {
      'Provider.timeout / limit': '기본 해제 ms(0은 유지); 최대 표시 토스트 수',
      'Provider.toastManager / createToastManager<Data>()':
        'React 외부 호출용 선택적 공유 매니저',
      'add.id / timeout / priority':
        '같은 id는 제자리 업데이트; 토스트별 타이머; low | high',
      'Root.toast / tone':
        'Base UI toast 객체; neutral | success | danger | caution | progress',
      'Root.swipeDirection': '스와이프 방향(들); 빈 배열은 스와이프 비활성화',
      'Action / toast.actionProps':
        '네이티브 button props; 실행 후 닫으려면 핸들러에서 닫으세요',
      Close: 'SVG 닫기 버튼; 현지화하려면 접근성 라벨을 재정의하세요',
      Viewport:
        'layout=stack: 컴팩트, 호버나 포커스 시 확장; layout=list: 항상 확장; layout=anchored: Positioner 캔버스',
      'Root[data-limited]':
        '오버플로 토스트는 마운트된 채 inert 상태로 유지되며 display:none으로 스타일됩니다',
      'render / ref / className': 'DOM 요소 ref, 커스텀 요소 구성, 상태 콜백',
    },
  },
}
