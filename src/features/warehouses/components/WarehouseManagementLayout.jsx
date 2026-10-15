import Icon from '../../../components/ui/Icon'
import { Link, useParams } from 'react-router-dom'
import { useWarehouse } from '../hooks/useWarehouses'
import PageHeader from '../../../components/ui/PageHeader'
import PageSkeleton from '../../../components/ui/PageSkeleton'
import ErrorState from '../../../components/ui/ErrorState'
import Button from '../../../components/ui/Button'

export default function WarehouseManagementLayout({ title, description, children }) {
    const { id } = useParams()
    const query = useWarehouse(id)
    if (query.isLoading) return <PageSkeleton />
    if (query.isError) return <ErrorState title="Impossible de charger l’entrepôt" description={query.error.message}
        action={<Button onClick={() => query.refetch()}>Réessayer</Button>} />
    const warehouse = query.data?.data
    if (!warehouse) return <ErrorState title="Entrepôt introuvable" />
    return (
        <section className="warehouse-management-page">
            <Link className="warehouse-back" to="/warehouses"><Icon name="arrow_back" /> Entrepôts</Link>
            <PageHeader title={title} description={`${warehouse.name ?? warehouse.nom ?? 'Entrepôt'} — ${description}`} />
            {children(warehouse)}
        </section>
    )
}
