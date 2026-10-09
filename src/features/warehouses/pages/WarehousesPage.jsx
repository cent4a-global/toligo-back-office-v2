import { useState } from 'react'

import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
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
    const [deleteError, setDeleteError] = useState('')

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

        setDeleteError('')
        try {
            await deleteMutation.mutateAsync(warehouseToDelete.id)
            setWarehouseToDelete(null)
        } catch (failure) {
            setDeleteError(failure.message)
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
                    title="Entrepôts"
                    value={data?.meta?.totalWarehouses ?? warehouses.length}
                />

                <StatCard title="Caisses" value={data?.meta?.totalBoxes ?? '—'} />

                <StatCard title="Caisses occupées" value={data?.meta?.occupiedBoxes ?? '—'} />

                <StatCard title="Locations actives" value={data?.meta?.activeRentals ?? '—'} />
            </div>

            <Card className="warehouses-table-card">
                <WarehouseTable
                    warehouses={warehouses}
                    loading={isLoading}
                    onEdit={openEditModal}
                    onDelete={setWarehouseToDelete}
                />
            </Card>

            {formModal.open && (
                <WarehouseFormModal
                    open={formModal.open}
                    warehouse={formModal.warehouse}
                    loading={createMutation.isPending || updateMutation.isPending}
                    onClose={closeFormModal}
                    onSubmit={handleSubmit}
                />
            )}
            {deleteError && (
                <p className="warehouse-form-error" role="alert">
                    {deleteError}
                </p>
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
