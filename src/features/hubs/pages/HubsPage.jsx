import { Network, CircleCheck, Wrench, PackageCheck, CircleOff } from 'lucide-react'
import { notifyError } from '../../../lib/notifications'
import { useState } from 'react'

import PageHeader from '../../../components/ui/PageHeader'
import Button from '../../../components/ui/Button'
import StatCard from '../../../components/ui/StatCard'
import ErrorState from '../../../components/ui/ErrorState'

import { useCreateHub, useDeleteHub, useHubs, useUpdateHub } from '../hooks/useHubs'

import { useStations } from '../../stations/hooks/useStations'

import HubsTable from '../components/HubsTable'
import HubFormModal from '../components/HubFormModal'
import DeleteHubDialog from '../components/DeleteHubDialog'


function HubsPage() {
    const { data, isLoading, isError, error, refetch } = useHubs()

    const stationsQuery = useStations()
    const stationsData = stationsQuery.data

    const createMutation = useCreateHub()

    const updateMutation = useUpdateHub()

    const deleteMutation = useDeleteHub()

    const [formModal, setFormModal] = useState({
        open: false,
        hub: null,
    })

    const [hubToDelete, setHubToDelete] = useState(null)

    const hubs = data?.data ?? []

    const stations = stationsData?.data ?? []

    const openCreateModal = () => {
        setFormModal({
            open: true,
            hub: null,
        })
    }

    const openEditModal = hub => {
        setFormModal({
            open: true,
            hub,
        })
    }

    const closeFormModal = () => {
        if (createMutation.isPending || updateMutation.isPending) return
        setFormModal({
            open: false,
            hub: null,
        })
    }

    const handleSubmit = async formData => {
        if (formModal.hub) {
            await updateMutation.mutateAsync({
                id: formModal.hub.id,

                data: formData,
            })
        } else {
            await createMutation.mutateAsync(formData)
        }

        setFormModal({ open: false, hub: null })
    }

    const handleDelete = async () => {
        if (!hubToDelete || deleteMutation.isPending) {
            return
        }


        try {
            await deleteMutation.mutateAsync(hubToDelete.id)
            setHubToDelete(null)
        } catch (failure) {
            notifyError(failure)
        }
    }


    if (isError) {
        return (
            <ErrorState
                title="Impossible de charger les hubs"
                description={error.message}
                actions={<Button onClick={() => refetch()}>Réessayer</Button>}
            />
        )
    }

    const freeHubs = hubs.filter(hub => hub.statut === 'libre').length

    const maintenanceHubs = hubs.filter(hub => hub.statut === 'maintenance').length

    return (
        <div className="hubs-page">
            <PageHeader
                title="Hubs"
                description="Gérez les plateformes automatisées de décollage, d’atterrissage et de recharge des drones."
                actions={
                    <Button onClick={openCreateModal}>
                        <i className="fi fi-rr-plus"></i>
                        Ajouter un hub
                    </Button>
                }
            />

            <div className="hubs-stats">
                <StatCard title="Hubs" icon={<Network size={20} strokeWidth={1.8} />} value={isLoading ? '—' : hubs.length} />

                <StatCard title="Hubs libres" icon={<CircleCheck size={20} strokeWidth={1.8} />} value={isLoading ? '—' : freeHubs} />

                <StatCard title="En maintenance" icon={<Wrench size={20} strokeWidth={1.8} />} value={isLoading ? '—' : maintenanceHubs} />

                <StatCard title="Hubs occupés" icon={<PackageCheck size={20} strokeWidth={1.8} />} value={isLoading ? '—' : hubs.filter(hub => hub.statut === 'occupe').length} />

                <StatCard title="Indisponibles" icon={<CircleOff size={20} strokeWidth={1.8} />} value={isLoading ? '—' : hubs.filter(hub => hub.statut === 'indisponible').length} />
            </div>

            {stationsQuery.isError && <div className="hub-error" role="alert">{stationsQuery.error.message} <Button variant="secondary" size="sm" onClick={() => stationsQuery.refetch()}>Réessayer les stations</Button></div>}
            <HubsTable
                hubs={hubs}
                loading={isLoading}
                onEdit={openEditModal}
                onDelete={hub => {  setHubToDelete(hub) }}
            />

            {formModal.open && <HubFormModal
                open={formModal.open}
                hub={formModal.hub}
                stations={stations}
                loading={createMutation.isPending || updateMutation.isPending}
                onClose={closeFormModal}
                onSubmit={handleSubmit}
            />}

            <DeleteHubDialog
                hub={hubToDelete}
                loading={deleteMutation.isPending}
                onClose={() => { if (!deleteMutation.isPending) setHubToDelete(null) }}
                onConfirm={handleDelete}
            />
        </div>
    )
}

export default HubsPage
