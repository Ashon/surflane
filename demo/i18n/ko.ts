// Korean interface text and catalog data. This module is its own chunk, loaded only
// when a reader chooses Korean, so English readers never download it.
export { ko as messages } from './messages.ko'
export { catalogKo } from './catalog.ko'
export { koLabels as componentLabels } from '@surflane/ui/labels-ko'
