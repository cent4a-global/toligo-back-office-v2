import { Link, NavLink, useParams } from 'react-router-dom'

import Button from '../../../components/ui/Button'
import ErrorState from '../../../components/ui/ErrorState'
import PageSkeleton from '../../../components/ui/PageSkeleton'
import { useBoxes } from '../hooks/useBoxes'
import { useWarehouse } from '../hooks/useWarehouses'
import { getAssignedAdmins } from '../utils/adminUuid'

export default function WarehouseManagementLayout({ children }) {
    const { id } = useParams()
    const query = useWarehouse(id)
    const boxesQuery = useBoxes(id)

    if (query.isLoading) return <PageSkeleton />
    if (query.isError) {
        return (
            <ErrorState
                title="Impossible de charger l’entrepôt"
                description={query.error.message}
                action={<Button onClick={() => query.refetch()}>Réessayer</Button>}
            />
        )
    }

    const warehouse = query.data?.data
    if (!warehouse) return <ErrorState title="Entrepôt introuvable" />

    const name = warehouse.nom ?? warehouse.name ?? 'Entrepôt'
    const locality = warehouse.commune?.nom ?? warehouse.locality?.name ?? (typeof warehouse.locality === 'string' ? warehouse.locality : null)
    const address = warehouse.adresse ?? warehouse.address
    const admins = getAssignedAdmins(warehouse)

    return (
        <section className="warehouse-management-page">
            <header className="warehouse-details-page-header">
                <div className="warehouse-details-heading">
                    <div className="warehouse-details-breadcrumb">
                        <Link to="/warehouses">Entrepôts</Link><span>/</span><span>{name}</span>
                    </div>
                    <h1>{name}</h1>
                    <p>{[locality, address].filter(Boolean).join(' · ') || 'Informations de l’entrepôt'}</p>
                </div>
            </header>

            <section className="warehouse-detail-shell">
                <nav className="warehouse-detail-tabs" aria-label="Gestion de l’entrepôt">
                    <NavLink end to={`/warehouses/${id}`}>Aperçu</NavLink>
                    <NavLink to={`/warehouses/${id}/boxes`}>Caisses ({boxesQuery.isPending ? '…' : (boxesQuery.data?.length ?? 0)})</NavLink>
                    <NavLink to={`/warehouses/${id}/admins`}>Administrateurs ({admins.length})</NavLink>
                </nav>
                <div className="warehouse-management-content">
                    {children(warehouse)}
                </div>
            </section>
        </section>
    )
}
