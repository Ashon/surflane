import type { Locale } from '../../i18n'

const en = {
  disableFileControls: 'Disable file controls',
  failUploadPreview: 'Fail upload preview',
  lateResultAfterCancel: 'Late result after cancel',
  cancelSelectionChanges: 'Cancel selection changes',
  cancelReset: 'Cancel reset',
  buildArtifacts: 'Build artifacts',
  buildArtifactsDescription:
    'Choose up to 3 JSON or text files, 1 KB or smaller each. The transport is simulated locally.',
  inspectSubmittedFiles: 'Inspect submitted files',
  showFieldError: 'Show field error',
  resetFileForm: 'Reset file form',
  rejectedByServer: 'These files were rejected by the example server.',
  controlledAttachment: 'Controlled attachment',
  controlledAttachmentDescription:
    'One optional CSV file. The page owns it, and it submits with the form above. Reset keeps this controlled selection.',
  noFileSubmitted: 'No file form submitted.',
}
export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    disableFileControls: '파일 제어 비활성화',
    failUploadPreview: '업로드 미리보기 실패 처리',
    lateResultAfterCancel: '취소 후 지연 결과',
    cancelSelectionChanges: '선택 변경 취소',
    cancelReset: '초기화 취소',
    buildArtifacts: '빌드 산출물',
    buildArtifactsDescription:
      'JSON 또는 텍스트 파일을 최대 3개까지 선택하세요. 각 파일은 1KB 이하여야 합니다. 전송 처리는 로컬에서 시뮬레이션됩니다.',
    inspectSubmittedFiles: '제출된 파일 확인',
    showFieldError: '필드 오류 표시',
    resetFileForm: '파일 폼 초기화',
    rejectedByServer: '이 파일들은 예시 서버에서 거부되었습니다.',
    controlledAttachment: '제어된 첨부 파일',
    controlledAttachmentDescription:
      '선택 사항인 CSV 파일 1개입니다. 이 값은 페이지가 관리하며 위 폼과 함께 제출됩니다. 초기화해도 이 제어된 선택은 유지됩니다.',
    noFileSubmitted: '제출된 파일 폼이 없습니다.',
  },
}
