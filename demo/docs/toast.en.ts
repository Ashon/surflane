import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage: [
    'Announce short, non-blocking results: a finished task, a copied value, or an undoable change.',
    'Put one Toaster in the app and call toast() from anywhere, inside React or out: toast.success, error, warning, info and loading pick the tone, and toast.promise turns a loading toast into success or error. Each call returns an ID for toast.update and toast.dismiss.',
    'To compose toasts yourself, render one Provider and one Viewport for the app. For feedback beside a button, use a separate Provider with Viewport.layout=anchored and a Positioner.',
    'Calling add with an existing ID updates that toast.',
    'The stack overlaps and expands on hover or focus. Set Viewport.layout=list to keep it expanded.',
    "Toasts are borderless, opaque surfaces with a shadow, and Root's tone colors the status icon.",
  ],
  avoid:
    "Don't put critical errors, input validation, or task history only in a disappearing toast. Keep them in an inline message, field error, or result screen. Announce work as finished only after it runs. Use high priority only when something needs immediate attention.",
  anatomy:
    'toast() → Toaster(Provider + Portal + Viewport region) → Root(non-modal dialog) → Content → Icon + Text(Title / Description / Action) + Close',
  keyboard: [
    "Toasts don't take focus when they open. F6 moves focus into the Viewport, and Tab moves through the Action and Close buttons.",
    'Escape closes the focused toast. Swipe is a secondary way to dismiss, so keep the Close button.',
    'Timers pause on hover, on focus, and while the window is inactive.',
  ],
  tokens: [
    '--menu-background',
    '--status-success-fg',
    '--status-danger-fg',
    '--interaction-focus',
    '--radius-lg',
    '--shadow-float',
    '--layer-popup',
    '--toast-enter-duration',
    '--toast-stack-duration',
    '--toast-stack-ease',
  ],
  code: `import { Toaster, toast } from '@surflane/ui'

function App() {
  return (
    <>
      <YourPage />
      <Toaster />
    </>
  )
}

// Anywhere, inside React or out:
toast.success('Export ready', { description: '3 files' })
const id = toast.loading('Deploying')
toast.update(id, { title: 'Deployed', type: 'success', timeout: 5000 })
toast.info('Item archived', {
  timeout: 0,
  action: { label: 'Undo', onClick: restore },
})
await toast.promise(deploy(), {
  loading: 'Deploying',
  success: 'Deployed',
  error: (error) => ({ title: 'Deploy failed', description: error.message }),
})`,
  props: [
    [
      'toast(title, options)',
      'neutral toast; returns its ID. options: description, timeout, priority, id, action {label, onClick}, actionProps, data',
      '—',
    ],
    [
      'toast.success / error / warning / info / loading',
      'success, danger, caution, info and progress tones; loading stays until updated',
      '—',
    ],
    [
      'toast.promise / update / dismiss',
      'loading → success | error with string, options or function steps; change a toast; close one or all',
      '—',
    ],
    [
      'Toaster.limit / timeout / label / layout / swipeDirection',
      'renders the provider, region and toasts of a helper',
      '3 / 5000 / Notifications / stack / down + right',
    ],
    [
      'Toaster.toast / createToaster()',
      'a helper with a manager of its own, for a separate region',
      'the shared toast',
    ],
    [
      'Provider.timeout / limit',
      'default dismissal ms (0 persists); max visible toasts',
      '5000 / 3',
    ],
    [
      'Provider.toastManager / createToastManager<Data>()',
      'optional shared manager for calls outside React',
      '—',
    ],
    ['useToastManager<Data>()', 'toasts, add, update, close, promise', '—'],
    [
      'add.id / timeout / priority',
      'same id updates in place; per-toast timer; low | high',
      'generated / Provider default / low',
    ],
    [
      'Root.toast / tone',
      'Base UI toast object; neutral | info | success | danger | caution | progress',
      'required / neutral',
    ],
    [
      'Root.swipeDirection',
      'swipe direction(s); an empty array disables swipe',
      'down + right',
    ],
    [
      'Action / toast.actionProps',
      'native button props; to close after running, close it in the handler',
      '—',
    ],
    [
      'Close',
      'SVG close button; override the accessible label to localize',
      'Dismiss notification',
    ],
    [
      'Viewport',
      'layout=stack: compact, expands on hover or focus; layout=list: always expanded; layout=anchored: Positioner canvas',
      'Notifications',
    ],
    [
      'Root[data-limited]',
      'overflow toasts stay mounted and inert, styled display:none',
      'limit=3',
    ],
    [
      'render / ref / className',
      'DOM element refs, custom element composition, and state callbacks',
      '—',
    ],
  ],
}
