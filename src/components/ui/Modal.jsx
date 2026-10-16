import { useId } from 'react'

const Modal = ({ open, onClose, title, subtitle, children, size = 'md', className = '', closeOnOverlayClick = true }) => {
    const titleId = useId()

    if (!open) {
        return null
    }

    const classes = ['modal', `modal-${size}`, className].filter(Boolean).join(' ')

    return (
        <div className="modal-overlay" onClick={closeOnOverlayClick ? onClose : undefined}>
            <div className={classes} role="dialog" aria-modal="true" aria-labelledby={titleId} onClick={event => event.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-heading">
                        <h2 id={titleId} className="modal-title">{title}</h2>
                        {subtitle && <p className="modal-subtitle">{subtitle}</p>}
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        disabled={!onClose}
                        aria-label="Fermer">
                        Fermer
                    </button>
                </div>

                <div className="modal-content">{children}</div>
            </div>
        </div>
    )
}

export default Modal
