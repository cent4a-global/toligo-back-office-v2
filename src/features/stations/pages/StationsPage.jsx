import { MapPin, CircleCheck, Wrench, CircleOff } from 'lucide-react'
import { notifyError } from '../../../lib/notifications'
import { useState } from 'react'

import PageHeader from '../../../components/ui/PageHeader'
import Button from '../../../components/ui/Button'
import StatCard from '../../../components/ui/StatCard'
import ErrorState from '../../../components/ui/ErrorState'

import { useCreateStation, useDeleteStation, useUpdateStation, useStations } from '../hooks/useStations'

import StationsTable from '../components/StationsTable'
import StationFormModal from '../components/StationFormModal'
import DeleteStationDialog from '../components/DeleteStationDialog'
import StationsMap from '../components/StationsMap'

function StationsPage() {
    const { data, isLoading, isError, error, refetch } = useStations()

    const createMutation = useCreateStation()

    const updateMutation = useUpdateStation()

    const deleteMutation = useDeleteStation()

    const [formModal, setFormModal] = useState({
        open: false,
        station: null,
    })

    const [stationToDelete, setStationToDelete] = useState(null)

    const stations = data?.data ?? []

    const openCreateModal = () => {
        setFormModal({
            open: true,
            station: null,
        })
    }

    const openEditModal = station => {
        setFormModal({
            open: true,
            station,
        })
    }

    const closeFormModal = () => {
        if (createMutation.isPending || updateMutation.isPending) return
        setFormModal({
            open: false,
            station: null,
        })
    }

    const handleSubmit = async formData => {
        if (formModal.station) {
            await updateMutation.mutateAsync({
                id: formModal.station.id,
                data: formData,
            })
        } else {
            await createMutation.mutateAsync(formData)
        }

        setFormModal({ open: false, station: null })
    }

    const handleDelete = async () => {
        if (!stationToDelete || deleteMutation.isPending) {
            return
        }


        try {
            await deleteMutation.mutateAsync(stationToDelete.id)
            setStationToDelete(null)
        } catch (failure) {
            notifyError(failure)
        }
    }


    if (isError) {
        return (
            <ErrorState
                title="Impossible de charger les stations"
                description={error.message}
                action={<Button onClick={() => refetch()}>Réessayer</Button>}
            />
        )
    }

    return (
        <div className="stations-page">
            <PageHeader
                title="Stations"
                description="Gérez les stations accueillant les hubs automatisés de Tôligo."
                actions={
                    <Button onClick={openCreateModal}>
                        <i className="fi fi-rr-plus"></i>
                        Ajouter une station
                    </Button>
                }
            />


            <div className="stations-stats">
                <StatCard title="Stations" icon={<MapPin size={20} strokeWidth={1.8} />} value={isLoading ? '—' : stations.length} />
                <StatCard title="Opérationnelles" icon={<CircleCheck size={20} strokeWidth={1.8} />} value={isLoading ? '—' : stations.filter(station => station.statut === 'operationnelle').length} />
                <StatCard title="Maintenance" icon={<Wrench size={20} strokeWidth={1.8} />} value={isLoading ? '—' : stations.filter(station => station.statut === 'maintenance').length} />
                <StatCard title="Indisponibles" icon={<CircleOff size={20} strokeWidth={1.8} />} value={isLoading ? '—' : stations.filter(station => station.statut === 'indisponible').length} />
            </div>
            <StationsMap stations={stations} loading={isLoading} onEdit={openEditModal} />
            <StationsTable
                stations={stations}
                loading={isLoading}
                onEdit={openEditModal}
                onDelete={station => {

                    setStationToDelete(station)
                }}
            />

            {formModal.open && (
                <StationFormModal
                    open={formModal.open}
                    station={formModal.station}
                    loading={createMutation.isPending || updateMutation.isPending}
                    onClose={closeFormModal}
                    onSubmit={handleSubmit}
                />
            )}

            <DeleteStationDialog
                station={stationToDelete}
                loading={deleteMutation.isPending}
                onClose={() => {
                    if (!deleteMutation.isPending) setStationToDelete(null)
                }}
                onConfirm={handleDelete}
            />
        </div>
    )
}

export default StationsPage
