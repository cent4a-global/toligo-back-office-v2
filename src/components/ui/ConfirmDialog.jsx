import Modal from './Modal'
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
    return (
        <Modal open={open} onClose={onClose} title={title} size="sm">
            <div className="confirm-dialog">
                <p className="confirm-dialog-description">{description}</p>

                <div className="confirm-dialog-actions">
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        {cancelLabel}
                    </Button>

                    <Button variant="danger" onClick={onConfirm} loading={loading}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default ConfirmDialog
