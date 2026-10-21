import type { DocKo } from './types'

export const formDocsKo: Record<string, DocKo> = {
  field: {
    usage:
      '라벨, 설명, 오류를 입력에 연결하세요. 같은 Field 안에서는 공유 Input이나 Select가 Field.Control을 대체할 수 있습니다.',
    avoid:
      '플레이스홀더를 라벨 대신 사용하지 마세요. Field.Label을 사용하세요. 색만으로 오류를 보여주지 마세요. Field.Error에 메시지를 작성하세요.',
    keyboard:
      '라벨을 클릭하면 입력에 포커스가 갑니다. 폼 제출 시 첫 번째 유효하지 않은 입력으로 포커스가 이동합니다. aria-describedby가 설명과 오류를 입력에 연결합니다.',
    props: {
      'Root.name / disabled / invalid': 'Base UI 필드 상태',
    },
  },
  fieldset: {
    usage:
      '한 주제의 입력을 Legend 아래에 그룹화하세요. 그룹의 비활성 상태가 하위 Field로 전달됩니다.',
    avoid:
      '시각적 테두리만 그리려고 사용하지 마세요. Card를 사용하세요. 각 입력에 개별 라벨을 유지하세요.',
    keyboard:
      'Tab은 입력의 자연스러운 순서를 따릅니다. 비활성 그룹은 상호작용과 폼 제출에서 제외됩니다. Legend가 그룹의 접근 가능한 이름을 제공합니다.',
    props: {
      'Root.disabled': 'boolean; 중첩 필드로 전파',
      Legend: '접근 가능한 그룹 이름',
    },
  },
  form: {
    usage:
      '여러 Field에 걸쳐 제출 검증과 서버 오류를 조정하세요. onFormSubmit이 이름이 있는 Field에서 값을 수집합니다. 원시 네이티브 제출 값이 필요하면 onSubmit에서 FormData를 읽으세요. 미리보기의 서버 오류 버튼은 로컬 상태만 변경합니다.',
    avoid:
      '비동기 검증이 항상 제출을 막는다고 가정하지 마세요. 실제 요청, 권한, 중복 제출 방지는 제품에서 처리하세요.',
    keyboard:
      'Enter나 제출 버튼이 폼을 검증하고 첫 번째 유효하지 않은 입력으로 포커스를 이동합니다. 입력을 편집하면 서버 오류가 지워집니다. Reset은 초기 값을 복원합니다.',
    props: {
      onFormSubmit: '(values, eventDetails) => void; 네이티브 네비게이션 방지',
      errors: 'Field.Root name으로 키가 지정된 레코드',
    },
  },
  textarea: {
    usage:
      '여러 줄 설명과 메모를 입력하세요. 텍스트는 위에서 시작합니다. 사용자는 필드를 세로로 크기 조절할 수 있습니다. Field에 연결하려면 Field.Control의 render prop으로 합성하세요.',
    avoid:
      '대량의 코드를 편집하는 데 사용하지 마세요. 전용 코드 편집기를 사용하세요.',
    keyboard:
      'Enter는 줄 바꿈을 삽입합니다. Tab은 다음 입력으로 이동합니다. 네이티브 텍스트 편집과 한국어 IME 입력이 계속 작동합니다.',
    props: {
      'rows / maxLength / required / disabled / readOnly':
        '네이티브 textarea props',
    },
  },
  checkbox: {
    usage:
      '독립 옵션을 선택하세요. 혼합 상태는 대시 SVG를 보여줍니다. 읽기 전용과 비활성 상태는 구분되어 보입니다.',
    avoid:
      '상호 배타적 옵션 중 하나를 고를 때 사용하지 마세요. RadioGroup을 사용하세요. 상태를 색으로만 구분하지 마세요. Indicator 아이콘도 상태를 보여주게 하세요.',
    keyboard:
      'Tab은 체크박스에 포커스를 줍니다. Space가 토글합니다. Base UI의 숨겨진 input이 라벨 클릭, 폼 제출, 리셋을 처리합니다.',
    props: {
      'Root.checked / defaultChecked': '제어/비제어 boolean',
      'Root.indeterminate / readOnly / disabled': '혼합 또는 사용 불가 상태',
      'Root.name / value / uncheckedValue': '네이티브 폼 값',
    },
  },
  'checkbox-group': {
    usage:
      '한 주제의 여러 선택을 관리하세요. 그룹이 부모 전체 선택 체크박스의 혼합 상태를 구동합니다. 모든 하위 값을 allValues로 전달하세요.',
    avoid:
      '부모 체크박스 상태를 하위와 분리해 저장하지 마세요. 대신 allValues를 하위 값과 동기화하세요.',
    keyboard:
      'Tab은 각 체크박스로 이동합니다. Space가 토글합니다. 부모가 모든 항목을 선택하거나 지웁니다. 일부만 선택되면 혼합으로 표시됩니다.',
    props: {
      'value / defaultValue / onValueChange': 'string[] 및 변경 콜백',
      allValues: '모든 하위 값; 부모 체크박스에 필수',
      disabled: '그룹 비활성화',
    },
  },
  'radio-group': {
    usage:
      '상호 배타적 옵션 중 하나를 선택하세요. 그룹과 각 항목에 이름을 주세요.',
    avoid:
      '이름 없는 단독 Radio를 두지 마세요. 각 Radio를 이름 있는 RadioGroup에 넣으세요. 선택 변경을 전체 폼 제출로 취급하지 마세요. 제출은 폼의 제출 버튼에 맡기세요.',
    keyboard:
      'Tab은 선택된 항목에 포커스를 줍니다. 화살표 키가 선택을 이동하고 비활성 항목을 건너뜁니다.',
    props: {
      'value / defaultValue / onValueChange': '일반 값 및 변경 콜백',
      'name / required / readOnly / disabled': '그룹 폼 및 상호작용 상태',
      'Radio.Root.value': '옵션 값',
    },
  },
  switch: {
    usage:
      '즉시 적용되는 설정을 토글하세요. 엄지 위치와 배경이 함께 변경됩니다. 두 상태 모두 라벨은 동일하게 유지됩니다. 읽기 전용 모드에서는 값이 보이지만 변경할 수 없습니다.',
    avoid:
      '액션 버튼 대신 사용하지 마세요. Button을 사용하세요. 다중 선택 목록에 사용하지 마세요. CheckboxGroup을 사용하세요.',
    keyboard:
      'Tab은 스위치에 포커스를 줍니다. Space가 토글합니다. 폼에서는 name, value, uncheckedValue props가 명시적 값을 제출합니다.',
    props: {
      'checked / defaultChecked / onCheckedChange':
        '제어/비제어 boolean 및 콜백',
      'readOnly / disabled': '상호작용 방지',
      'name / value / uncheckedValue': '폼 페이로드',
    },
  },
}
