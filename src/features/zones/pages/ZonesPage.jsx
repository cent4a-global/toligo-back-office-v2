import { notifyError } from '../../../lib/notifications'
import { useState } from 'react'

import PageHeader from '../../../components/ui/PageHeader'
import Button from '../../../components/ui/Button'
import ErrorState from '../../../components/ui/ErrorState'
import Icon from '../../../components/ui/Icon'

import { useCreateZone, useDeleteZone, useUpdateZone, useZones } from '../hooks/useZones'

import ZonesTable from '../components/ZonesTable'
import ZoneFormModal from '../components/ZoneFormModal'
import DeleteZoneDialog from '../components/DeleteZoneDialog'
import ZonesMap from '../components/ZonesMap'
import ZoneDetailsPanel from '../components/ZoneDetailsPanel'

function ZonesPage() {
    const { data, isLoading, isError, error, refetch } = useZones()

    const createMutation = useCreateZone()

    const updateMutation = useUpdateZone()

    const deleteMutation = useDeleteZone()

    const [formModal, setFormModal] = useState({
        open: false,
        zone: null,
    })

    const [zoneToDelete, setZoneToDelete] = useState(null)
    const [selectedZoneId, setSelectedZoneId] = useState(null)

    const zones = data?.data ?? []
    const selectedZone =
        zones.find(zone => String(zone.id) === String(selectedZoneId)) ?? zones[0] ?? null

    const openCreateModal = () => {
        setFormModal({
            open: true,
            zone: null,
        })
    }

    const openEditModal = zone => {
        setFormModal({
            open: true,
            zone,
        })
    }

    const closeFormModal = () => {
        if (createMutation.isPending || updateMutation.isPending) return
        setFormModal({
            open: false,
            zone: null,
        })
    }

    const handleSubmit = async formData => {
        if (formModal.zone) {
            await updateMutation.mutateAsync({
                id: formModal.zone.id,
                data: formData,
            })
        } else {
            await createMutation.mutateAsync(formData)
        }

        setFormModal({ open: false, zone: null })
    }

    const handleDelete = async () => {
        if (!zoneToDelete || deleteMutation.isPending) {
            return
        }


        try {
            await deleteMutation.mutateAsync(zoneToDelete.id)
            setZoneToDelete(null)
        } catch (failure) {
            notifyError(failure)
        }
    }


    if (isError) {
        return (
            <ErrorState
                title="Impossible de charger les zones"
                description={error.message}
                action={<Button onClick={() => refetch()}>Réessayer</Button>}
            />
        )
    }

    return (
        <div className="zones-page">
            <PageHeader
                title="Zones"
                description="Périmètres opérationnels utilisés pour organiser la couverture du réseau Tôligo."
                actions={
                    <Button size="md" onClick={openCreateModal}>
                        <Icon name="add" />
                        Ajouter une zone
                    </Button>
                }
            />

            <div className="zones-workspace">
                <ZonesMap
                    zones={zones}
                    loading={isLoading}
                    selectedZoneId={selectedZone?.id}
                    onSelect={zone => setSelectedZoneId(zone.id)}
                />
                <ZoneDetailsPanel
                    zone={selectedZone}
                    loading={isLoading}
                    onEdit={openEditModal}
                    onDelete={setZoneToDelete}
                />
            </div>

            <ZonesTable
                zones={zones}
                loading={isLoading}
                selectedZoneId={selectedZone?.id}
                onSelect={zone => setSelectedZoneId(zone.id)}
            />

            {formModal.open && (
                <ZoneFormModal
                    open={formModal.open}
                    zone={formModal.zone}
                    zones={zones}
                    loading={createMutation.isPending || updateMutation.isPending}
                    onClose={closeFormModal}
                    onSubmit={handleSubmit}
                />
            )}

            <DeleteZoneDialog
                zone={zoneToDelete}
                loading={deleteMutation.isPending}
                onClose={() => {
                    if (!deleteMutation.isPending) setZoneToDelete(null)
                }}
                onConfirm={handleDelete}
            />
        </div>
    )
}

export default ZonesPage
