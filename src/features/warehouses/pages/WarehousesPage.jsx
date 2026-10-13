import { Warehouse, Package, PackageCheck, KeyRound } from 'lucide-react'
import { notifyError } from '../../../lib/notifications'
import { useState } from 'react'

import Button from '../../../components/ui/Button'
import PageHeader from '../../../components/ui/PageHeader'
import StatCard from '../../../components/ui/StatCard'
import ErrorState from '../../../components/ui/ErrorState'

import {
    useCreateWarehouse,
    useDeleteWarehouse,
    useUpdateWarehouse,
    useWarehouses,
} from '../hooks/useWarehouses'

import WarehouseTable from '../components/WarehouseTable'
import WarehouseFormModal from '../components/WarehouseFormModal'
import DeleteWarehouseDialog from '../components/DeleteWarehouseDialog'

function WarehousesPage() {
    const { data, isLoading, isError, error, refetch } = useWarehouses()

    const createMutation = useCreateWarehouse()

    const updateMutation = useUpdateWarehouse()

    const deleteMutation = useDeleteWarehouse()

    const [formModal, setFormModal] = useState({
        open: false,
        warehouse: null,
    })

    const [warehouseToDelete, setWarehouseToDelete] = useState(null)

    const warehouses = data?.data ?? []

    const openCreateModal = () => {
        setFormModal({
            open: true,
            warehouse: null,
        })
    }

    const openEditModal = warehouse => {
        setFormModal({
            open: true,
            warehouse,
        })
    }

    const closeFormModal = () => {
        if (createMutation.isPending || updateMutation.isPending) return
        setFormModal({
            open: false,
            warehouse: null,
        })
    }

    const handleSubmit = async formData => {
        if (formModal.warehouse) {
            await updateMutation.mutateAsync({
                id: formModal.warehouse.id,
                data: formData,
            })
        } else {
            await createMutation.mutateAsync(formData)
        }

        closeFormModal()
    }

    const handleDelete = async () => {
        if (!warehouseToDelete) {
            return
        }


        try {
            await deleteMutation.mutateAsync(warehouseToDelete.id)
            setWarehouseToDelete(null)
        } catch (failure) {
            notifyError(failure)
        }
    }


    if (isError) {
        return (
            <ErrorState
                title="Impossible de charger les entrepôts"
                description={error.message}
                action={<Button onClick={() => refetch()}>Réessayer</Button>}
            />
        )
    }

    return (
        <div className="warehouses-page">
            <PageHeader
                title="Entrepôts"
                description="Gérez les sites de stockage, leurs capacités et leurs affectations."
                actions={
                    <Button onClick={openCreateModal}>
                        <i aria-hidden="true" className="fi fi-rr-plus add-icon"></i>
                        Ajouter un entrepôt
                    </Button>
                }
            />

            <div className="warehouses-stats">
                <StatCard
                    title="Entrepôts" icon={<Warehouse size={20} strokeWidth={1.8} />}
                    value={data?.meta?.totalWarehouses ?? warehouses.length}
                />

                <StatCard title="Caisses" icon={<Package size={20} strokeWidth={1.8} />} value={data?.meta?.totalBoxes ?? '—'} />

                <StatCard title="Caisses occupées" icon={<PackageCheck size={20} strokeWidth={1.8} />} value={data?.meta?.occupiedBoxes ?? '—'} />

                <StatCard title="Locations actives" icon={<KeyRound size={20} strokeWidth={1.8} />} value={data?.meta?.activeRentals ?? '—'} />
            </div>

            <div className="warehouses-table-section">
                <WarehouseTable
                    warehouses={warehouses}
                    loading={isLoading}
                    onEdit={openEditModal}
                    onDelete={setWarehouseToDelete}
                />
            </div>

            {formModal.open && (
                <WarehouseFormModal
                    open={formModal.open}
                    warehouse={formModal.warehouse}
                    loading={createMutation.isPending || updateMutation.isPending}
                    onClose={closeFormModal}
                    onSubmit={handleSubmit}
                />
            )}

            <DeleteWarehouseDialog
                warehouse={warehouseToDelete}
                loading={deleteMutation.isPending}
                onClose={() => setWarehouseToDelete(null)}
                onConfirm={handleDelete}
            />
        </div>
    )
}

export default WarehousesPage
