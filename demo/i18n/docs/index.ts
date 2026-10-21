/// <reference types="vite/client" />
import type { DocKo } from './types'
// Every *.ko.ts overlay in this folder, merged by component or pattern id.
const modules = import.meta.glob<Record<string, Record<string, DocKo>>>(
  './*.ko.ts',
  { eager: true },
)
export const docsKo: Record<string, DocKo> = Object.assign(
  {},
  ...Object.values(modules).flatMap((module) => Object.values(module)),
)
