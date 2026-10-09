import { useEffect, useId, useRef } from 'react'
import { Icon } from './Icon'

// Fenêtre modale basée sur l'élément natif <dialog> : le navigateur gère le piège du focus,
// la touche Échap et le fond assombri, sans bibliothèque.
export function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-3xl bg-white p-0 text-ink shadow-float backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-serif text-2xl leading-snug sm:text-3xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mt-1 -mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-sand"
          >
            <Icon name="close" />
            <span className="sr-only">Fermer</span>
          </button>
        </div>
        {open && <div className="mt-4">{children}</div>}
      </div>
    </dialog>
  )
}
