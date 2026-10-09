import { useState } from 'react'

import PageHeader from '../../../components/ui/PageHeader'
import Button from '../../../components/ui/Button'
import ErrorState from '../../../components/ui/ErrorState'

import { useCreateZone, useDeleteZone, useUpdateZone, useZones } from '../hooks/useZones'

import ZonesTable from '../components/ZonesTable'
import ZoneFormModal from '../components/ZoneFormModal'
import DeleteZoneDialog from '../components/DeleteZoneDialog'
import ZonesMap from '../components/ZonesMap'

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
    const [deleteError, setDeleteError] = useState('')

    const zones = data?.data ?? []

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

        setDeleteError('')
        try {
            await deleteMutation.mutateAsync(zoneToDelete.id)
            setZoneToDelete(null)
        } catch (failure) {
            setDeleteError(failure.message || 'Impossible de supprimer cette zone.')
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
                description="Gérez les zones géographiques couvertes par Tôligo."
                actions={
                    <Button onClick={openCreateModal}>
                        <i className="fi fi-rr-plus"></i>
                        Ajouter une zone
                    </Button>
                }
            />

            <ZonesMap zones={zones} loading={isLoading} onEdit={openEditModal} />

            <ZonesTable
                zones={zones}
                loading={isLoading}
                onEdit={openEditModal}
                onDelete={zone => {
                    setDeleteError('')
                    setZoneToDelete(zone)
                }}
            />

            {formModal.open && (
                <ZoneFormModal
                    open={formModal.open}
                    zone={formModal.zone}
                    loading={createMutation.isPending || updateMutation.isPending}
                    onClose={closeFormModal}
                    onSubmit={handleSubmit}
                />
            )}

            <DeleteZoneDialog
                zone={zoneToDelete}
                loading={deleteMutation.isPending}
                error={deleteError}
                onClose={() => {
                    if (!deleteMutation.isPending) setZoneToDelete(null)
                }}
                onConfirm={handleDelete}
            />
        </div>
    )
}

export default ZonesPage
