import type { DocKo } from './types'

export const fileUploadDocsKo: Record<string, DocKo> = {
  'file-upload': {
    usage: [
      '선택 상태 하나로 파일을 고르고, 끌어다 놓고, 제거하세요.',
      '네이티브 파일 입력은 Field.Control 로 등록되므로 공유 Form 이 required 검증, 서버 오류, 실제 File 제출을 유지합니다.',
      '전송은 자동으로 시작되지 않습니다. 제공한 transport 가 파일마다 실행됩니다.',
      '드롭 영역은 점선 테두리가 아닌 표면입니다. 파일을 그 위로 끌면 배경이 강조됩니다.',
      '고른 파일은 드롭 영역에 이어 선으로 나뉜 행으로 놓입니다. 그래서 필드가 한 면으로 읽히고, 목록 위에 놓아도 파일이 추가됩니다.',
      'choose 버튼의 키보드 포커스와 필드 오류 표시가 유지됩니다.',
    ],
    avoid: [
      'accept 를 검증으로 취급하지 마세요. 선택 힌트일 뿐이며, 클라이언트 검증은 서버 검증을 대체하지 않습니다.',
      'FileUpload 가 디렉터리 업로드, 청크 전송, 재개, 서명된 URL 정책을 처리하길 기대하지 마세요. transport 나 제품에서 처리하세요.',
      '서버에 이미 업로드된 파일을 로컬 File 처럼 미리 채우지 마세요. 따로 나열하세요.',
      'Form.onFormSubmit 의 문자열 모델에서 실제 파일을 읽지 마세요. 대신 onSubmit 에서 FormData 를 읽으세요.',
    ],
    keyboard:
      '네이티브 파일 입력으로 Tab 하면 choose 버튼에 포커스 링이 표시됩니다. Enter 나 Space 는 파일 선택기를 엽니다. 파일 목록에서 Tab 은 Upload, Cancel, Retry, Remove 버튼에 도달합니다. Enter 나 Space 로 활성화하세요. 모든 파일 선택은 끌기 없이 동작합니다. disabled 는 선택과 제출을 막고 진행 중인 전송을 취소합니다.',
    props: {
      'label / description': '보이는 접근 가능한 라벨과 안내',
      'files / defaultFiles / onFilesChange':
        'controlled / uncontrolled File[]; cancel() 은 변경을 거부할 수 있음',
      'accept / capture / multiple / maxFiles / maxFileSize':
        '확장자/MIME 규칙; 네이티브 카메라 힌트; 선택 개수/바이트 제한',
      onReject: '파일별 타입/크기/개수/중복 거부',
      transport:
        '(file, { signal, onProgress }) => Promise<void>; 파일별 명시적 업로드',
      getUploadError: 'transport 오류를 사용자용 문자열로 매핑',
      'name / form / required':
        '네이티브 FileList 와 폼 소유권; 공유 Form 검증에는 React Form 컨텍스트도 필요',
      disabled: '선택, 제거, 제출을 막고 활성 전송을 취소',
      labels: '현지화된 액션/상태/거부/공지 텍스트',
      'Field.Root props / ref / className':
        'Field 를 소유; Form.errors/검증과 실제 div ref 지원',
    },
  },
}
