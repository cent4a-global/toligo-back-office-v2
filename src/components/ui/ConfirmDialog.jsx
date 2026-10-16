import { useEffect, useId, useRef } from 'react'
import { TriangleAlert } from 'lucide-react'

import Button from './Button'

const ConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    title = "Confirmer l'action",
    description = 'Êtes-vous sûr de vouloir continuer ?',
    confirmLabel = 'Confirmer',
    cancelLabel = 'Annuler',
    loading = false,
}) => {
    const titleId = useId()
    const descriptionId = useId()
    const panelRef = useRef(null)

    useEffect(() => {
        if (!open) return
        const previouslyFocused = document.activeElement
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        panelRef.current?.focus()

        const handleKeyDown = event => {
            if (event.key === 'Escape' && !loading && onClose) onClose()
        }
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', handleKeyDown)
            previouslyFocused?.focus?.()
        }
    }, [loading, onClose, open])

    if (!open) return null

    return (
        <div className="confirm-dialog-overlay">
            <section
                className="confirm-dialog-panel"
                ref={panelRef}
                tabIndex={-1}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}>
                <div className="confirm-dialog-icon" aria-hidden="true">
                    <TriangleAlert size={22} strokeWidth={2} />
                </div>

                <div className="confirm-dialog-content">
                    <h2 id={titleId} className="confirm-dialog-title">{title}</h2>
                    <p id={descriptionId} className="confirm-dialog-description">{description}</p>
                </div>

                <div className="confirm-dialog-actions">
                    <Button variant="secondary" size="md" onClick={onClose} disabled={loading || !onClose}>
                        {cancelLabel}
                    </Button>
                    <Button variant="danger" size="md" onClick={onConfirm} loading={loading} disabled={!onConfirm}>
                        {confirmLabel}
                    </Button>
                </div>
            </section>
        </div>
    )
}

export default ConfirmDialog
