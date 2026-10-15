import Flaticon from '../../../components/ui/Flaticon'
import { useState } from 'react'

import Button from '../../../components/ui/Button'
import PageHeader from '../../../components/ui/PageHeader'
import HorizontalStatCard from '../../../components/ui/HorizontalStatCard'
import ErrorState from '../../../components/ui/ErrorState'

import {
    useCreateWarehouse,
    useUpdateWarehouse,
    useWarehouses,
} from '../hooks/useWarehouses'

import WarehouseGrid from '../components/WarehouseGrid'
import WarehouseFormModal from '../components/WarehouseFormModal'
import { useBoxes } from '../hooks/useBoxes'
import Skeleton from '../../../components/ui/Skeleton'

function WarehousesPage() {
    const { data, isLoading, isError, error, refetch } = useWarehouses()
    const boxesQuery = useBoxes()

    const createMutation = useCreateWarehouse()

    const updateMutation = useUpdateWarehouse()


    const [formModal, setFormModal] = useState({
        open: false,
        warehouse: null,
    })


    const warehouses = data?.data ?? []
    const totalBoxes = boxesQuery.data?.length ?? 0
    const availableBoxes = boxesQuery.data?.filter(box => box.statut === 'libre').length ?? 0
    const availablePercent = totalBoxes ? Math.round(availableBoxes / totalBoxes * 100) : 0
    const boxStatValue = value => boxesQuery.isPending ? <Skeleton width={48} height={30} /> : boxesQuery.isError ? '—' : value

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
                    <Button onClick={openCreateModal} size="sm">
                        <Flaticon name="plus" size={16} />
                        Ajouter un entrepôt
                    </Button>
                }
            />

            <div className="warehouses-stats">
                <HorizontalStatCard
                    title="Entrepôts" icon={<Flaticon name="warehouse" size={22} />}
                    value={isLoading ? <Skeleton width={48} height={30} /> : data?.meta?.totalWarehouses ?? warehouses.length}
                    description="Sites de stockage"
                />

                <HorizontalStatCard title="Caisses" icon={<Flaticon name="box" size={22} />} value={boxStatValue(totalBoxes)} description={boxesQuery.isSuccess ? 'Total du parc' : boxesQuery.isError ? 'Données indisponibles' : 'Chargement…'} />

                <HorizontalStatCard title="Disponibles" icon={<Flaticon name="check-circle" size={22} />} value={boxStatValue(availableBoxes)} description={boxesQuery.isSuccess ? `${availablePercent}% du parc` : boxesQuery.isError ? 'Données indisponibles' : 'Chargement…'} />

                <HorizontalStatCard title="Locations actives" icon={<Flaticon name="key" size={22} />} value={isLoading ? <Skeleton width={48} height={30} /> : data?.meta?.activeRentals ?? '—'} description={data?.meta?.activeRentals == null ? 'Données indisponibles' : 'En cours'} />
            </div>
            {boxesQuery.isError && <ErrorState title="Statistiques des caisses indisponibles" description={boxesQuery.error.message} action={<Button onClick={() => boxesQuery.refetch()}>Réessayer</Button>} />}

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
