import type { DocKo } from './types'

export const feedbackDocsKo: Record<string, DocKo> = {
  progress: {
    usage:
      '끝날 작업의 진행률을 표시합니다. 총량을 모를 때는 value=null로 설정하세요. 실제 작업 상태에서 값을 끌어오세요. 완료 결과는 별도로 알리세요.',
    avoid:
      '시간이 지났다고 진행률을 올리지 마세요. 실제 작업에서 업데이트하세요. 사용량 표시에는 Meter를 사용하세요.',
    keyboard:
      'Progress는 상태 표시이며 Tab 순서에 없습니다. Label이 접근 가능한 이름을 제공합니다. min, max, value props는 aria-valuetext와 함께 단위를 전달합니다. 빈번한 값 변경마다 live region으로 알리지 마세요. 대신 완료 결과를 알리세요.',
    props: {
      'Root.locale / format': 'Intl locale / 숫자 형식',
      'Root.aria-valuetext / getAriaValueText': '사람이 읽을 수 있는 단위',
    },
  },
  meter: {
    usage:
      '메모리나 저장소 사용량처럼 알려진 범위 내 측정값을 표시합니다. 값을 단위와 함께 보여주세요.',
    avoid:
      '작업 완료나 길이를 모르는 로딩에는 Meter가 아닌 Progress를 사용하세요. 색만으로 위험을 판단하게 하지 마세요. 텍스트로도 위험을 설명하세요.',
    keyboard:
      'Meter는 읽기 전용 측정이며 Tab 순서에 없습니다. 측정 대상과 단위를 Label과 aria-valuetext에 설명하세요. RTL에서도 채움은 논리적 시작에서 자랍니다.',
    props: {
      'Root.aria-valuetext / getAriaValueText': '사람이 읽을 수 있는 단위',
    },
  },
  spinner: {
    usage:
      '길이를 모르는 짧은 처리 중임을 나타냅니다. 단독으로는 label로 작업을 설명하세요. 상태를 이미 알리는 영역 안에서는 decorative로 설정하세요.',
    avoid:
      '스피너를 무기한으로 보여주지 마세요. 실패, 지연, 취소를 별도로 알리세요. 로딩은 여러 live region이 아닌 하나에서 알리세요.',
    keyboard:
      '기본적으로 Spinner는 role=status와 시각적으로 숨겨진 텍스트를 가집니다. decorative prop은 접근성 트리에서 제거합니다. reduced motion에서는 회전이 멈추지만 정적 표시기와 label은 유지됩니다.',
  },
  skeleton: {
    usage:
      '장식용 플레이스홀더로 로딩 콘텐츠의 구조를 미리 봅니다. 부모 영역에 aria-busy와 읽을 수 있는 로딩 메시지를 주세요. 로딩이 끝나면 스켈레톤을 실제 콘텐츠로 교체하세요.',
    avoid:
      '실제 데이터나 입력으로 취급하지 마세요. 예측할 수 없는 구조는 가짜 카드 여러 개 대신 범용 블록 하나를 보여주세요.',
    keyboard:
      'Skeleton은 항상 aria-hidden=true이며 포커스를 받지 않습니다. 부모가 로딩 상태를 한 번 알립니다. reduced motion에서는 펄스가 멈춥니다.',
    props: {
      'style / className': '네이티브 span 레이아웃 재정의',
      'aria-hidden': '항상 true',
    },
  },
}
