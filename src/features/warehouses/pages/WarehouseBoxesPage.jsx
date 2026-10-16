import { useMemo, useState } from 'react'
import { Info, LockKeyhole, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useParams } from 'react-router-dom'

import Button from '../../../components/ui/Button'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import ErrorState from '../../../components/ui/ErrorState'
import Table from '../../../components/ui/Table'
import BoxDetailsModal from '../components/BoxDetailsModal'
import BoxEditModal from '../components/BoxEditModal'
import BoxFormModal from '../components/BoxFormModal'
import WarehouseManagementLayout from '../components/WarehouseManagementLayout'
import { useBoxes, useDeleteBox } from '../hooks/useBoxes'

const statusFilters = [
    { value: 'all', label: 'Toutes' },
    { value: 'libre', label: 'Libres' },
    { value: 'occupee', label: 'Occupées' },
    { value: 'reservee', label: 'Réservées' },
    { value: 'hors service', label: 'Hors service' },
]

const normalize = value =>
    String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[_-]+/g, ' ')
        .toLocaleLowerCase('fr')
        .trim()

const formatDimension = value => (value == null || value === '' ? '—' : value)

function BoxStatus({ value }) {
    const status = normalize(value)
    const tone =
        status === 'libre'
            ? 'success'
            : status === 'occupee' || status === 'reservee'
              ? 'warning'
              : status === 'hors service'
                ? 'danger'
                : 'muted'
    return (
        <span className={`warehouse-box-status warehouse-box-status-${tone}`}>
            {value || 'Non renseigné'}
        </span>
    )
}

export default function WarehouseBoxesPage() {
    const { id } = useParams()
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const boxesQuery = useBoxes(id)
    const [selectedBox, setSelectedBox] = useState(null)
    const [editingBox, setEditingBox] = useState(null)
    const [deletingBox, setDeletingBox] = useState(null)
    const deleteMutation = useDeleteBox()

    const boxes = useMemo(() => boxesQuery.data ?? [], [boxesQuery.data])
    const filteredBoxes = useMemo(() => {
        const query = normalize(search)
        return boxes.filter(box => {
            const status = normalize(box.statut ?? box.status)
            const matchesStatus = statusFilter === 'all' || status === statusFilter
            const matchesSearch =
                !query ||
                normalize(`${box.numero ?? ''} ${box.smart_lock?.lockname ?? ''}`).includes(query)
            return matchesStatus && matchesSearch
        })
    }, [boxes, search, statusFilter])

    const confirmDelete = async () => {
        if (!deletingBox || deleteMutation.isPending) return
        const target = deletingBox
        try {
            await deleteMutation.mutateAsync({ id: target.box.id, warehouseId: target.warehouseId })
            setSelectedBox(previous => (previous?.id === target.box.id ? null : previous))
            setEditingBox(previous => (previous?.id === target.box.id ? null : previous))
            setDeletingBox(null)
        } catch {
            // The global mutation handler displays the error; keep confirmation open.
        }
    }

    const columns = [
        {
            key: 'numero',
            label: 'Caisse',
            render: box => <strong>{box.numero ?? '—'}</strong>,
        },
        {
            key: 'dimensions',
            label: 'Dimensions',
            render: box =>
                `${formatDimension(box.dimensions?.longueur)} × ${formatDimension(box.dimensions?.largeur)} × ${formatDimension(box.dimensions?.hauteur)} cm`,
        },
        {
            key: 'volume',
            label: 'Volume',
            render: box => `${formatDimension(box.dimensions?.Volume ?? box.dimensions?.volume)} L`,
        },
        {
            key: 'poids',
            label: 'Poids',
            render: box => (box.poids == null ? '—' : `${box.poids} kg`),
        },
        {
            key: 'prix_par_heure',
            label: 'Prix / heure',
            render: box => (box.prix_par_heure == null ? '—' : `${box.prix_par_heure} FCFA`),
        },
        {
            key: 'statut',
            label: 'Statut',
            render: box => <BoxStatus value={box.statut ?? box.status} />,
        },
        {
            key: 'lockname',
            label: 'Serrure',
            render: box =>
                box.smart_lock?.lockname ? (
                    <span className="warehouse-box-lock">
                        <LockKeyhole size={14} aria-hidden="true" />
                        {box.smart_lock.lockname}
                    </span>
                ) : (
                    <span className="warehouse-box-muted">Aucune</span>
                ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: box => (
                <div className="warehouse-box-row-actions">
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={!box.id}
                        onClick={() => setSelectedBox({ id: box.id, warehouseId: id })}>
                        <Info size={15} aria-hidden="true" />
                        Détails
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={!box.id}
                        onClick={() => setEditingBox({ id: box.id, warehouseId: id })}>
                        <Pencil size={15} aria-hidden="true" />
                        Modifier
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        disabled={!box.id || deleteMutation.isPending}
                        onClick={() => setDeletingBox({ box, warehouseId: id })}>
                        <Trash2 size={15} aria-hidden="true" />
                        Supprimer
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <WarehouseManagementLayout>
            {() => (
                <>
                    <div className="warehouse-boxes-toolbar">
                        <label className="warehouse-boxes-search">
                            <Search size={18} aria-hidden="true" />
                            <input
                                value={search}
                                onChange={event => setSearch(event.target.value)}
                                placeholder="Rechercher un numéro ou une serrure"
                            />
                        </label>
                        <div
                            className="warehouse-boxes-filters"
                            aria-label="Filtrer les caisses par statut">
                            {statusFilters.map(filter => (
                                <button
                                    key={filter.value}
                                    type="button"
                                    className={statusFilter === filter.value ? 'is-active' : ''}
                                    onClick={() => setStatusFilter(filter.value)}>
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                        <Button size="md" onClick={() => setOpen(true)}>
                            <Plus size={18} aria-hidden="true" />
                            Ajouter une caisse
                        </Button>
                    </div>

                    {boxesQuery.isError ? (
                        <ErrorState
                            title="Impossible de charger les caisses"
                            description={boxesQuery.error.message}
                            action={<Button onClick={() => boxesQuery.refetch()}>Réessayer</Button>}
                        />
                    ) : (
                        <>
                            <Table
                                columns={columns}
                                data={filteredBoxes}
                                loading={boxesQuery.isLoading}
                                paginated={false}
                                emptyMessage={
                                    boxes.length
                                        ? 'Aucune caisse ne correspond à ces filtres.'
                                        : 'Aucune caisse associée à cet entrepôt.'
                                }
                            />
                            {!boxesQuery.isLoading && (
                                <p className="warehouse-boxes-result-count">
                                    {filteredBoxes.length} caisse
                                    {filteredBoxes.length > 1 ? 's' : ''} sur {boxes.length}
                                </p>
                            )}
                        </>
                    )}

                    {open && (
                        <BoxFormModal key={id} warehouseId={id} onClose={() => setOpen(false)} />
                    )}
                    {selectedBox?.warehouseId === id && (
                        <BoxDetailsModal
                            key={selectedBox.id}
                            boxId={selectedBox.id}
                            onClose={() => setSelectedBox(null)}
                        />
                    )}
                    {editingBox?.warehouseId === id && (
                        <BoxEditModal
                            key={editingBox.id}
                            boxId={editingBox.id}
                            warehouseId={id}
                            onClose={() => setEditingBox(null)}
                        />
                    )}
                    <ConfirmDialog
                        open={deletingBox?.warehouseId === id}
                        title="Supprimer la caisse"
                        description={`Voulez-vous supprimer la caisse « ${deletingBox?.box.numero ?? deletingBox?.box.id ?? ''} » ? Cette action est définitive.`}
                        confirmLabel="Supprimer"
                        loading={deleteMutation.isPending}
                        onClose={deleteMutation.isPending ? undefined : () => setDeletingBox(null)}
                        onConfirm={confirmDelete}
                    />
                </>
            )}
        </WarehouseManagementLayout>
    )
}
