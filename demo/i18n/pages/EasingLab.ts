import type { Locale } from '../../i18n'

const en = {
  title: 'Easing: time and progress',
  intro:
    'Duration is the total time. Easing is how fast the change progresses over that time. Two 200ms transitions can still differ in speed at the start and end. In the curve below, the horizontal axis is time and the vertical axis is movement progress.',
  easingRole: 'Easing role',
  stateFeedback: 'State feedback',
  panelMovement: 'Panel movement',
  toastStack: 'Toast stack',
  accelerationComparison: 'Acceleration comparison',
  linearComparison: 'Linear comparison',
  previewDuration: 'Preview duration',
  slowPreviewSuffix: ' (slow preview)',
  reducedMotionStatus: 'Reduced motion: static preview',
  motionPreviewEnabled: 'Motion preview enabled',
  graphTitle: 'Time to movement progress curve',
  graphDescription:
    'Horizontal axis: elapsed time from 0 to 100 percent. Vertical axis: movement progress from 0 to 100 percent. The marker follows the preview time slider.',
  timeAxisLabel: '100% time',
  previewTime: 'Preview time',
  readoutTime: 'Time',
  readoutProgress: 'Progress',
  playPreview: 'Play easing preview',
  resetPreview: 'Reset easing preview',
  playbackStatusLabel: 'Easing playback status',
  tableLabel: 'Easing progress samples',
  caption: 'Progress at the same fraction of total time',
  elapsedTimeHeader: 'Elapsed time',
  movementProgressHeader: 'Movement progress',
  curveTitle: 'How the curve works',
  curveIntro:
    " builds a curve from (0, 0) to (1, 1) with two control points. To read it, find the point on the curve that matches time x, then use that point's y as progress. Don't use the curve's internal parameter u as time. It gives wrong results.",
  curveParagraph2:
    'A steep slope means fast change. A shallow slope means slow change. State feedback responds quickly, then decelerates. Panel movement travels faster early on. Toast stack decelerates more gently because several cards move together. Linear compares constant speed, and Acceleration compares a curve that keeps speeding up.',
  curveParagraph3:
    "In CSS, control point x values must stay within 0\u20131. The y values can go outside that range to create overshoot. This example compares only the system's non-overshooting curves. 600ms is a slow playback for observation, not a product default. The animation runs through the browser's Web Animations API, and the curve display computes the same easing.",
  curveParagraph4:
    "With reduced motion, playback completes immediately and the time slider shows static positions. Completion is announced only when the playback state changes. Progress isn't read out on every frame. Never treat animation completion as completion of a network task.",
  referencesLabel: 'References:',
  cssEasingLink: 'W3C CSS Easing Functions',
  webAnimationsLink: 'Web Animations',
  phaseLabels: {
    Ready: 'Ready',
    'Completed without motion': 'Completed without motion',
    'Paused at preview time': 'Paused at preview time',
    Playing: 'Playing',
    Completed: 'Completed',
  },
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    title: 'Easing: 시간과 진행률',
    intro:
      'Duration은 총 시간입니다. Easing은 그 시간 동안 변경이 진행되는 속도입니다. 200ms 전환 두 개도 시작과 끝에서 속도가 다를 수 있습니다. 아래 곡선에서 가로축은 시간, 세로축은 이동 진행률입니다.',
    easingRole: 'Easing 역할',
    stateFeedback: '상태 피드백',
    panelMovement: '패널 이동',
    toastStack: 'Toast 스택',
    accelerationComparison: '가속 비교',
    linearComparison: '선형 비교',
    previewDuration: '미리보기 Duration',
    slowPreviewSuffix: ' (느린 미리보기)',
    reducedMotionStatus: '모션 축소: 정적 미리보기',
    motionPreviewEnabled: '모션 미리보기 활성화됨',
    graphTitle: '시간 대 이동 진행률 곡선',
    graphDescription:
      '가로축: 0~100퍼센트의 경과 시간. 세로축: 0~100퍼센트의 이동 진행률. 마커는 미리보기 시간 슬라이더를 따라갑니다.',
    timeAxisLabel: '시간 100%',
    previewTime: '미리보기 시간',
    readoutTime: '시간',
    readoutProgress: '진행률',
    playPreview: 'Easing 미리보기 재생',
    resetPreview: 'Easing 미리보기 초기화',
    playbackStatusLabel: 'Easing 재생 상태',
    tableLabel: 'Easing 진행률 샘플',
    caption: '총 시간의 같은 비율에서의 진행률',
    elapsedTimeHeader: '경과 시간',
    movementProgressHeader: '이동 진행률',
    curveTitle: '곡선의 원리',
    curveIntro:
      '는 (0, 0)에서 (1, 1)까지 두 개의 제어점으로 곡선을 만듭니다. 읽으려면 시간 x에 해당하는 곡선 위 점을 찾아 그 점의 y를 진행률로 사용하세요. 곡선의 내부 매개변수 u를 시간으로 쓰지 마세요. 틀린 결과가 나옵니다.',
    curveParagraph2:
      '가파른 기울기는 빠른 변경을 뜻합니다. 완만한 기울기는 느린 변경을 뜻합니다. 상태 피드백은 빠르게 반응한 뒤 감속합니다. 패널 이동은 초반에 더 빠르게 진행됩니다. Toast 스택은 여러 카드가 함께 움직이므로 더 부드럽게 감속합니다. Linear는 일정한 속도를 비교하고, Acceleration은 계속 빨라지는 곡선을 비교합니다.',
    curveParagraph3:
      'CSS에서 제어점 x 값은 0–1 범위 안에 있어야 합니다. y 값은 오버슈트를 만들기 위해 그 범위 밖으로 갈 수 있습니다. 이 예시는 시스템의 오버슈트 없는 곡선만 비교합니다. 600ms는 관찰을 위한 느린 재생이며 제품 기본값이 아닙니다. 애니메이션은 브라우저의 Web Animations API를 통해 실행되고, 곡선 표시는 동일한 easing을 계산합니다.',
    curveParagraph4:
      '모션 축소 시 재생은 즉시 완료되고 시간 슬라이더는 정적 위치를 보여줍니다. 완료는 재생 상태가 바뀔 때만 알립니다. 진행률은 매 프레임 읽어주지 않습니다. 애니메이션 완료를 네트워크 작업 완료로 취급하지 마세요.',
    referencesLabel: '참고 자료:',
    cssEasingLink: 'W3C CSS Easing 함수',
    webAnimationsLink: 'Web Animations',
    phaseLabels: {
      Ready: '준비됨',
      'Completed without motion': '모션 없이 완료됨',
      'Paused at preview time': '미리보기 시간에서 일시 정지됨',
      Playing: '재생 중',
      Completed: '완료됨',
    },
  },
}
