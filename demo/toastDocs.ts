import type { ComponentDoc } from './componentDocs'
export const toastDocs: Record<string, ComponentDoc> = {
  toast: {
    usage: [
      'Announce short, non-blocking results: a finished task, a copied value, or an undoable change.',
      'Render one Provider and one Viewport for the app. For feedback beside a button, use a separate Provider with Viewport.layout=anchored and a Positioner.',
      'Calling add with an existing ID updates that toast.',
      'The stack overlaps and expands on hover or focus. Set Viewport.layout=list to keep it expanded.',
      "Toasts are borderless, opaque surfaces with a shadow, and Root's tone colors the status icon.",
    ],
    avoid:
      "Don't put critical errors, input validation, or task history only in a disappearing toast. Keep them in an inline message, field error, or result screen. Announce work as finished only after it runs. Use high priority only when something needs immediate attention.",
    anatomy:
      'Provider → caller controls + Portal → Viewport(region) → Root(non-modal dialog) → Content → Icon + Text(Title / Description / Action) + Close',
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
    code: `import { Toast } from '@surflane/ui'

function NotificationList() {
  const { toasts } = Toast.useToastManager()
  return (
    <Toast.Portal>
      <Toast.Viewport aria-label='Notifications'>
        {toasts.map((toast) => (
          <Toast.Root key={toast.id} toast={toast}>
            <Toast.Content>
              <Toast.Icon />
              <Toast.Text>
                <Toast.Title />
                <Toast.Description />
                <Toast.Action />
              </Toast.Text>
              <Toast.Close />
            </Toast.Content>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  )
}

function App() {
  return (
    <Toast.Provider timeout={5000} limit={3}>
      <YourPage />
      <NotificationList />
    </Toast.Provider>
  )
}
// Inside YourPage:
// const manager = Toast.useToastManager()
// manager.add({ id: 'export', title: 'Export ready', type: 'success' })`,
    props: [
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
  },
}
