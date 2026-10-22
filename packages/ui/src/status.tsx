'use client'
import { Icon, type IconName } from './icon.js'

export type StatusTone =
  'neutral' | 'info' | 'success' | 'danger' | 'caution' | 'progress'
const statusIcons = {
  neutral: 'minus-circle',
  info: 'info',
  success: 'check',
  danger: 'alert',
  caution: 'warning',
  progress: 'clock',
} as const satisfies Record<StatusTone, IconName>
export function StatusIcon({ tone }: { tone: StatusTone }) {
  return <Icon name={statusIcons[tone]} />
}
