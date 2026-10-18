import type { ComponentDoc } from './componentDocs'
export const toastDocs: Record<string, ComponentDoc> = {
  toast: {
    usage:
      "Announces short results that don't block the current screen, such as a finished task, a copy, or an undoable change. Place a shared Provider and a notification Viewport in the app; calling add with an existing ID updates that notification. Cards have no border and are distinguished by an opaque surface and shadow, and Root's tone sets the status icon color. The default stack overlaps the cards and expands on hover or when focus enters. For an always-expanded list, set Viewport.layout=list. For feedback next to a button, use a separate Provider with Viewport.layout=anchored and a Positioner.",
    avoid:
      "Don't put critical errors, input validation, or task history only in a disappearing Toast. Keep the information in an inline message, field error, or result screen, and don't announce work as finished when it didn't run. Use high priority only when immediate attention is required.",
    anatomy:
      'Provider → caller controls + Portal → Viewport(region) → Root(non-modal dialog) → Content → Icon + Text(Title / Description / Action) + Close',
    keyboard:
      "Notifications don't steal focus when they open. F6 moves into the notification region, and Tab moves through actions and the close button. Escape closes the focused notification. Timers pause on hover, on focus, and while the window is inactive. Swipe is a secondary way to dismiss; keep the Close button.",
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
        'default dismissal ms; 0 persists; visible notification limit',
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
        'Base UI toast object; neutral | success | danger | caution | progress',
        'required / neutral',
      ],
      [
        'Root.swipeDirection',
        'direction(s), empty array disables swipe',
        'down + right',
      ],
      [
        'Action / toast.actionProps',
        'native button props; handler explicitly closes after executing if desired',
        '—',
      ],
      [
        'Close',
        'SVG close button; override accessible label for localization',
        'Dismiss notification',
      ],
      [
        'Viewport',
        'layout=stack: compact cards expanding on hover/focus; layout=list: always expanded; layout=anchored: Positioner canvas',
        'Notifications',
      ],
      [
        'Root[data-limited]',
        'overflow items stay inert/mounted but styled display:none',
        'limit=3',
      ],
      [
        'render / ref / className',
        'actual DOM refs, custom element composition and state callbacks',
        '—',
      ],
    ],
  },
}
