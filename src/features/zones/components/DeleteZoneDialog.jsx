import ConfirmDialog from '../../../components/ui/ConfirmDialog'

function DeleteZoneDialog({ zone, loading = false, error, onClose, onConfirm }) {
    return (
        <ConfirmDialog
            open={Boolean(zone)}
            title="Supprimer la zone"
            description={<>
                {zone ? `Voulez-vous vraiment supprimer la zone « ${zone.nom} » ?` : ''}
                {error && <span className="zone-error" role="alert">{error}</span>}
            </>}
            confirmLabel="Supprimer"
            cancelLabel="Annuler"
            loading={loading}
            onClose={loading ? undefined : onClose}
            onConfirm={onConfirm}
        />
    )
}

export default DeleteZoneDialog
