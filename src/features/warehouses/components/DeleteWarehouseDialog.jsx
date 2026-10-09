import ConfirmDialog from '../../../components/ui/ConfirmDialog'


function DeleteWarehouseDialog({
    warehouse,
    loading = false,
    onClose,
    onConfirm,
}) {
    return (
        <ConfirmDialog
            open={Boolean(warehouse)}
            title="Supprimer l'entrepôt"
            description={
                warehouse
                    ? `Voulez-vous vraiment supprimer l'entrepôt « ${warehouse.name} » ? Cette action peut être impossible si des caisses ou des locations y sont encore associées.`
                    : ''
            }
            confirmLabel="Supprimer"
            cancelLabel="Annuler"
            loading={loading}
            onClose={loading ? undefined : onClose}
            onConfirm={onConfirm}
        />
    )
}

export default DeleteWarehouseDialog
