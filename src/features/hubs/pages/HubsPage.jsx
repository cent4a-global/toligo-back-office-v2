import { Network, CircleCheck, Wrench, PackageCheck } from 'lucide-react'
import { notifyError } from '../../../lib/notifications'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import PageHeader from '../../../components/ui/PageHeader'
import Button from '../../../components/ui/Button'
import StatCard from '../../../components/ui/StatCard'
import ErrorState from '../../../components/ui/ErrorState'

import { useCreateHub, useDeleteHub, useHubs, useUpdateHub } from '../hooks/useHubs'

import { useStation, useStations } from '../../stations/hooks/useStations'

import HubsTable from '../components/HubsTable'
import HubFormModal from '../components/HubFormModal'
import DeleteHubDialog from '../components/DeleteHubDialog'


function HubsPage() {
    const { stationId } = useParams()
    const stationQuery = useStation(stationId)
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

    const allHubs = data?.data ?? []
    const hubs = stationId ? allHubs.filter(hub => String(hub.station_id ?? hub.station?.id) === String(stationId)) : allHubs

    const stations = stationsData?.data ?? []
    const station = stationQuery.data?.data ?? stations.find(item => String(item.id) === String(stationId))

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

    const openReassignModal = hub => setFormModal({ open: true, hub, reassignOnly: true })

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


    if (isError || (stationId && stationQuery.isError)) {
        return (
            <ErrorState
                title="Impossible de charger les hubs"
                description={(error ?? stationQuery.error).message}
                action={<Button onClick={() => { refetch(); if (stationId) stationQuery.refetch() }}>Réessayer</Button>}
            />
        )
    }

    const freeHubs = hubs.filter(hub => hub.statut === 'libre').length

    const maintenanceHubs = hubs.filter(hub => hub.statut === 'maintenance').length

    return (
        <div className="hubs-page">
            {stationId && <Link to="/stations" className="station-hubs-back">← Retour aux stations</Link>}
            <PageHeader
                title={stationId ? `Hubs · ${station?.nom ?? 'Chargement de la station…'}` : 'Hubs'}
                description={stationId ? 'Créez, modifiez, supprimez et réaffectez les hubs de cette station.' : 'Gérez les plateformes automatisées de décollage, d’atterrissage et de recharge des drones.'}
                actions={
                    <div className="hubs-page-actions">
                    <Button onClick={openCreateModal} disabled={Boolean(stationId) && !station}>
                        <i className="fi fi-rr-plus"></i>
                        Ajouter un hub
                    </Button>
                    </div>
                }
            />

            <div className="hubs-stats">
                <StatCard title="Hubs" icon={<Network size={20} strokeWidth={1.8} />} value={isLoading ? '—' : hubs.length} />

                <StatCard title="Hubs libres" iconColor="green" icon={<CircleCheck size={20} strokeWidth={1.8} />} value={isLoading ? '—' : freeHubs} />

                <StatCard title="En maintenance" iconColor="orange" icon={<Wrench size={20} strokeWidth={1.8} />} value={isLoading ? '—' : maintenanceHubs} />

                <StatCard title="Hubs occupés" iconColor="purple" icon={<PackageCheck size={20} strokeWidth={1.8} />} value={isLoading ? '—' : hubs.filter(hub => hub.statut === 'occupe').length} />
            </div>

            {stationsQuery.isError && <div className="hub-error" role="alert">{stationsQuery.error.message} <Button variant="secondary" size="sm" onClick={() => stationsQuery.refetch()}>Réessayer les stations</Button></div>}
            <HubsTable
                hubs={hubs}
                loading={isLoading}
                onEdit={openEditModal}
                onReassign={openReassignModal}
                onDelete={hub => {  setHubToDelete(hub) }}
            />

            {formModal.open && <HubFormModal
                open={formModal.open}
                hub={formModal.hub}
                defaultStation={stationId ? station : undefined}
                reassignOnly={formModal.reassignOnly}
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
