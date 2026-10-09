const Modal = ({ open, onClose, title, children, size = 'md', className = '', closeOnOverlayClick = true }) => {
    if (!open) {
        return null
    }

    const classes = ['modal', `modal-${size}`, className].filter(Boolean).join(' ')

    return (
        <div className="modal-overlay" onClick={closeOnOverlayClick ? onClose : undefined}>
            <div className={classes} onClick={event => event.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Fermer">
                        ×
                    </button>
                </div>

                <div className="modal-content">{children}</div>
            </div>
        </div>
    )
}

export default Modal
