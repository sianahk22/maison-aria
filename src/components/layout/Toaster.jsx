import { Link } from 'react-router'
import { dismissToast, toastStore } from '../../lib/toast'
import { useStore } from '../../lib/useStore'
import { Icon } from '../ui/Icon'

// Zone « live » : les lecteurs d'écran annoncent chaque nouvelle notification.
export function Toaster() {
  const toasts = useStore(toastStore)

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex w-full max-w-sm animate-fade-up items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm text-ivory shadow-float"
        >
          <Icon name="check" className="h-5 w-5 shrink-0 text-sage" />
          <p className="flex-1">{toast.message}</p>
          {toast.action && (
            <Link
              to={toast.action.to}
              onClick={() => dismissToast(toast.id)}
              className="font-medium whitespace-nowrap underline underline-offset-4"
            >
              {toast.action.label}
            </Link>
          )}
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="-mr-1 inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-ivory/10"
          >
            <Icon name="close" className="h-4 w-4" />
            <span className="sr-only">Fermer la notification</span>
          </button>
        </div>
      ))}
    </div>
  )
}
