import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Package, MoreHorizontal, Info, Pencil, Trash2 } from 'lucide-react'
import WarehouseManagementLayout from '../components/WarehouseManagementLayout'
import BoxFormModal from '../components/BoxFormModal'
import BoxDetailsModal from '../components/BoxDetailsModal'
import BoxEditModal from '../components/BoxEditModal'
import Button from '../../../components/ui/Button'
import Table from '../../../components/ui/Table'
import Dropdown from '../../../components/ui/Dropdown'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import { useBoxes, useDeleteBox } from '../hooks/useBoxes'
import ErrorState from '../../../components/ui/ErrorState'

const columns = [
    { key: 'numero', label: 'Numéro' },
    { key: 'lockname', label: 'Serrure', render: box => box.smart_lock?.lockname ?? '—' },
    { key: 'hauteur', label: 'Hauteur', render: box => box.dimensions?.hauteur ?? '—' },
    { key: 'largeur', label: 'Largeur', render: box => box.dimensions?.largeur ?? '—' },
    { key: 'longueur', label: 'Longueur', render: box => box.dimensions?.longueur ?? '—' },
    { key: 'volume', label: 'Volume', render: box => box.dimensions?.Volume ?? box.dimensions?.volume ?? '—' },
    { key: 'poids', label: 'Poids' },
    { key: 'prix_par_heure', label: 'Prix / heure' },
    { key: 'statut', label: 'Statut', render: box => box.statut ?? 'Non renseigné' },
    { key: 'synchronisee', label: 'Serrure synchronisée', render: box => box.smart_lock?.synchronisee == null ? '—' : box.smart_lock.synchronisee ? 'Oui' : 'Non' },
]

export default function WarehouseBoxesPage() {
    const { id } = useParams()
    const [open, setOpen] = useState(false)
    const boxesQuery = useBoxes(id)
    const [selectedBox, setSelectedBox] = useState(null)
    const [editingBox, setEditingBox] = useState(null)
    const [deletingBox, setDeletingBox] = useState(null)
    const deleteMutation = useDeleteBox()
    const confirmDelete = async () => {
        if (!deletingBox || deleteMutation.isPending) return
        const target = deletingBox
        try {
            await deleteMutation.mutateAsync({ id: target.box.id, warehouseId: target.warehouseId })
            setSelectedBox(previous => previous?.id === target.box.id ? null : previous)
            setEditingBox(previous => previous?.id === target.box.id ? null : previous)
            setDeletingBox(null)
        } catch {
            // The global mutation handler displays the error; keep confirmation open.
        }
    }
    const tableColumns = [...columns, {
        key: 'actions', label: 'Actions',
        render: box => <Dropdown
            trigger={expanded => <Button variant="secondary" size="sm" aria-label={`Actions de la caisse ${box.numero ?? box.id}`} aria-haspopup="true" aria-expanded={expanded}><MoreHorizontal size={18} aria-hidden="true" /></Button>}
            items={[
                { label: 'Voir les infos', icon: <Info size={16} />, disabled: !box.id, onClick: () => setSelectedBox({ id: box.id, warehouseId: id }) },
                { label: 'Modifier', icon: <Pencil size={16} />, disabled: !box.id, onClick: () => setEditingBox({ id: box.id, warehouseId: id }) },
                { label: 'Supprimer', icon: <Trash2 size={16} />, danger: true, disabled: !box.id || deleteMutation.isPending, onClick: () => setDeletingBox({ box, warehouseId: id }) },
            ]}
        />,
    }]
    return (
        <WarehouseManagementLayout title="Gérer les caisses" description="Dimensions, tarification et serrures des caisses.">
            {() => (
                <>
                    <div className="warehouse-boxes-toolbar">
                        <div><Package size={22} aria-hidden="true" /><h2>Caisses de l’entrepôt</h2></div>
                        <Button onClick={() => setOpen(true)}><Plus size={18} aria-hidden="true" /> Ajouter une caisse</Button>
                    </div>
                    {boxesQuery.isError ? (
                        <ErrorState title="Impossible de charger les caisses" description={boxesQuery.error.message} action={<Button onClick={() => boxesQuery.refetch()}>Réessayer</Button>} />
                    ) : <Table columns={tableColumns} data={boxesQuery.data ?? []} loading={boxesQuery.isLoading} emptyMessage="Aucune caisse associée à cet entrepôt." />}
                    {open && <BoxFormModal key={id} warehouseId={id} onClose={() => setOpen(false)} />}
                    {selectedBox?.warehouseId === id && <BoxDetailsModal key={selectedBox.id} boxId={selectedBox.id} onClose={() => setSelectedBox(null)} />}
                    {editingBox?.warehouseId === id && <BoxEditModal key={editingBox.id} boxId={editingBox.id} warehouseId={id} onClose={() => setEditingBox(null)} />}
                    <ConfirmDialog open={deletingBox?.warehouseId === id} title="Supprimer la caisse" description={`Voulez-vous supprimer la caisse « ${deletingBox?.box.numero ?? deletingBox?.box.id ?? ''} » ? Cette action est définitive.`} confirmLabel="Supprimer" loading={deleteMutation.isPending} onClose={deleteMutation.isPending ? undefined : () => setDeletingBox(null)} onConfirm={confirmDelete} />
                </>
            )}
        </WarehouseManagementLayout>
    )
}
