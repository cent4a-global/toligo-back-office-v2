import ConfirmDialog from '../../../components/ui/ConfirmDialog'

function DeleteHubDialog({ hub, loading = false, error, onClose, onConfirm }) {
    return (
        <ConfirmDialog
            open={Boolean(hub)}
            title="Supprimer le hub"
            description={<>{hub ? `Voulez-vous vraiment supprimer le hub « ${hub.code} » ?` : ''}{error && <span className="hub-error" role="alert">{error}</span>}</>}
            confirmLabel="Supprimer"
            cancelLabel="Annuler"
            loading={loading}
            onClose={loading ? undefined : onClose}
            onConfirm={onConfirm}
        />
    )
}

export default DeleteHubDialog
