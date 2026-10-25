import type { Locale } from '../../i18n'
import type { FileUploadLabels } from '@surflane/ui/file-upload'

const en = {
  chooseOne: 'Choose file',
  dropOne: 'or drop a file here',
  labels: undefined as Partial<FileUploadLabels> | undefined,
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
    chooseOne: '파일 선택',
    dropOne: '또는 여기에 파일을 하나 놓으세요',
    labels: {
      choose: '파일 선택',
      drop: '또는 여기에 파일을 놓으세요',
      upload: '올리기',
      retry: '다시 시도',
      cancel: '취소',
      remove: '빼기',
      status: {
        ready: '준비됨',
        uploading: '올리는 중',
        success: '올림',
        error: '실패',
        canceled: '취소됨',
      },
      rejection: ({ file, reason }) =>
        `${file.name}: ${reason === 'type' ? '받지 않는 파일 형식입니다' : reason === 'size' ? '파일이 너무 큽니다' : reason === 'count' ? '파일 개수 한도에 닿았습니다' : '이미 고른 파일입니다'}.`,
      changed: (count) => `파일 ${count}개를 골랐습니다.`,
      complete: (file) => `${file.name}: 올렸습니다.`,
      canceled: (file) => `${file.name}: 올리기를 취소했습니다.`,
      failed: (file) => `${file.name}: 올리지 못했습니다.`,
      reset: '파일을 비웠습니다.',
      progress: (file) => `${file.name} 올리기 진행`,
      uploadError: '올리지 못했습니다. 다시 시도하세요.',
      fileAction: (action, file) => `${file.name} ${action}`,
    },
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
