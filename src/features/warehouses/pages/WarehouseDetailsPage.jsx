import { useState } from 'react'
import WarehouseFormModal from '../components/WarehouseFormModal'
import {
    useNavigate,
    useParams,
} from 'react-router-dom'

import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Card from '../../../components/ui/Card'
import Spinner from '../../../components/ui/Spinner'
import ErrorState from '../../../components/ui/ErrorState'

import {
    useWarehouse,
    useUpdateWarehouse,
} from '../hooks/useWarehouses'


function WarehouseDetailsPage() {
    const [editing, setEditing] = useState(false)
    const updateMutation = useUpdateWarehouse()
    const { id } =
        useParams()

    const navigate =
        useNavigate()

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useWarehouse(id)

    if (isLoading) {
        return (
            <div className="warehouse-details-loading">
                <Spinner />
            </div>
        )
    }

    if (isError) {
        return (
            <ErrorState
                title="Impossible de charger l'entrepôt"
                description={error.message}
                action={<Button onClick={() => refetch()}>Réessayer</Button>}
            />
        )
    }

    const warehouse =
        data?.data

    if (!warehouse) {
        return (
            <ErrorState
                title="Entrepôt introuvable"
                description="Cet entrepôt n'existe pas ou n'est plus disponible."
            />
        )
    }

    return (
        <div className="warehouse-details-page">
            <div className="warehouse-details-top">
                <div>
                    <button
                        type="button"
                        className="warehouse-back"
                        onClick={() =>
                            navigate(
                                '/warehouses'
                            )
                        }
                    >
                        <i aria-hidden="true" className="fi fi-rr-arrow-left"></i>

                        Entrepôts
                    </button>

                    <div className="warehouse-details-title">
                        <h1>
                            {warehouse.name}
                        </h1>

                        <Badge
                            variant={
                                warehouse.status ===
                                'active'
                                    ? 'success'
                                    : 'default'
                            }
                        >
                            {warehouse.status ===
                            'active'
                                ? 'Actif'
                                : 'Inactif'}
                        </Badge>
                    </div>

                    <p>
                        {warehouse.address}
                    </p>
                </div>

                <Button variant="secondary" onClick={() => setEditing(true)}>
                    Modifier
                </Button>
            </div>

            <div className="warehouse-details-stats">
                <Card>
                    <span className="warehouse-detail-label">
                        Localité
                    </span>

                    <strong>
                        {warehouse.locality
                            ?.name ??
                            warehouse.locality ??
                            '—'}
                    </strong>
                </Card>

                <Card>
                    <span className="warehouse-detail-label">
                        Administrateur
                    </span>

                    <strong>
                        {warehouse.admin
                            ?.name ??
                            'Non affecté'}
                    </strong>
                </Card>

                <Card>
                    <span className="warehouse-detail-label">
                        Caisses
                    </span>

                    <strong>
                        {warehouse.boxesCount ??
                            0}
                    </strong>
                </Card>

                <Card>
                    <span className="warehouse-detail-label">
                        Locations actives
                    </span>

                    <strong>
                        {warehouse.activeRentals ??
                            0}
                    </strong>
                </Card>
            </div>

            <div className="warehouse-details-sections">
                <Card className="warehouse-details-card">
                    <div className="warehouse-section-header">
                        <div>
                            <h2>
                                Caisses
                            </h2>

                            <p>
                                Gérez les caisses de cet entrepôt.
                            </p>
                        </div>

                        <Button
                            variant="secondary"
                            disabled
                            title="La gestion des caisses sera disponible prochainement"
                            onClick={() =>
                                navigate(
                                    `/warehouses/${id}/boxes`
                                )
                            }
                        >
                            Gérer les caisses
                        </Button>
                    </div>
                </Card>

                <Card className="warehouse-details-card">
                    <div className="warehouse-section-header">
                        <div>
                            <h2>
                                Administrateurs
                            </h2>

                            <p>
                                Gérez les administrateurs affectés à cet entrepôt.
                            </p>
                        </div>

                        <Button
                            variant="secondary"
                            disabled
                            title="La gestion des affectations sera disponible prochainement"
                            onClick={() =>
                                navigate(
                                    `/warehouses/${id}/admins`
                                )
                            }
                        >
                            Gérer les admins
                        </Button>
                    </div>
                </Card>
            </div>
            {editing && (
                <WarehouseFormModal
                    open
                    warehouse={warehouse}
                    loading={updateMutation.isPending}
                    onClose={() => { if (!updateMutation.isPending) setEditing(false) }}
                    onSubmit={async formData => {
                        await updateMutation.mutateAsync({ id, data: formData })
                        setEditing(false)
                    }}
                />
            )}
        </div>
    )
}

export default WarehouseDetailsPage
