import ConfirmDialog from '../../../components/ui/ConfirmDialog'

function DeleteStationDialog({ station, loading = false, error, onClose, onConfirm }) {
    return (
        <ConfirmDialog
            open={Boolean(station)}
            title="Supprimer la station"
            description={<>
                {station ? `Voulez-vous vraiment supprimer la station « ${station.nom} » ?` : ''}
                {error && <span className="station-error" role="alert">{error}</span>}
            </>}
            confirmLabel="Supprimer"
            cancelLabel="Annuler"
            loading={loading}
            onClose={loading ? undefined : onClose}
            onConfirm={onConfirm}
        />
    )
}

export default DeleteStationDialog
