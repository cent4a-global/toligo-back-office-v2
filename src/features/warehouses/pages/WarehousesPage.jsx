import { Warehouse, Package, PackageCheck, KeyRound } from 'lucide-react'
import { useState } from 'react'

import Button from '../../../components/ui/Button'
import PageHeader from '../../../components/ui/PageHeader'
import StatCard from '../../../components/ui/StatCard'
import ErrorState from '../../../components/ui/ErrorState'

import {
    useCreateWarehouse,
    useUpdateWarehouse,
    useWarehouses,
} from '../hooks/useWarehouses'

import WarehouseGrid from '../components/WarehouseGrid'
import WarehouseFormModal from '../components/WarehouseFormModal'

function WarehousesPage() {
    const { data, isLoading, isError, error, refetch } = useWarehouses()

    const createMutation = useCreateWarehouse()

    const updateMutation = useUpdateWarehouse()


    const [formModal, setFormModal] = useState({
        open: false,
        warehouse: null,
    })


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

            <div className="warehouses-grid-section">
                <WarehouseGrid
                    warehouses={warehouses}
                    loading={isLoading}
                    onEdit={openEditModal}
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


        </div>
    )
}

export default WarehousesPage
