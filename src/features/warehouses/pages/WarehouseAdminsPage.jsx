import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Search, UsersRound, UserCheck, Mail } from 'lucide-react'
import WarehouseAdminsModal from '../components/WarehouseAdminsModal'
import { useWarehouse, useAssignWarehouseAdmins } from '../hooks/useWarehouses'
import { getAssignedAdmins, getAdminUuid } from '../utils/adminUuid'
import Button from '../../../components/ui/Button'
import PageSkeleton from '../../../components/ui/PageSkeleton'
import ErrorState from '../../../components/ui/ErrorState'

export default function WarehouseAdminsPage() {
    const { id } = useParams()
    const query = useWarehouse(id)
    const mutation = useAssignWarehouseAdmins()
    const [assigning, setAssigning] = useState(false)
    const [search, setSearch] = useState('')
    if (query.isLoading) return <PageSkeleton />
    if (query.isError) return <ErrorState title="Impossible de charger l'entrepôt" description={query.error.message}
        action={<Button onClick={() => query.refetch()}>Réessayer</Button>} />
    const warehouse = query.data?.data
    if (!warehouse) return <ErrorState title="Entrepôt introuvable" />
    const assigned = getAssignedAdmins(warehouse)
    const nameOf = admin => admin.nom_complet ?? admin.name ?? admin.nom ?? 'Administrateur'
    const filtered = assigned.filter(admin => `${nameOf(admin)} ${admin.email ?? ''}`.toLocaleLowerCase('fr').includes(search.trim().toLocaleLowerCase('fr')))
    const assignButton = <Button onClick={() => setAssigning(true)}><Plus size={17} aria-hidden="true" />Affecter des admins</Button>
    return (
        <section className="warehouse-admins-page">
            <header className="warehouse-admins-page-header">
                <Link to="/warehouses" className="warehouse-admins-back" aria-label="Retour aux entrepôts"><ArrowLeft size={20} /></Link>
                <div className="warehouse-admins-page-heading"><span className="warehouse-admins-eyebrow">ADMINISTRATEURS · ENTREPÔT</span>
                    <h1>{warehouse.nom ?? warehouse.name ?? 'Entrepôt'}</h1>
                    <p>Gérez les administrateurs affectés à cet entrepôt.</p>
                </div>
                {assignButton}
            </header>
            <div className="warehouse-admins-search">
                <Search size={19} aria-hidden="true" />
                <input type="search" aria-label="Rechercher parmi les administrateurs affectés" placeholder="Rechercher un administrateur par nom ou e-mail..."
                    value={search} onChange={event => setSearch(event.target.value)} />
            </div>
            <section className="warehouse-assigned-panel" aria-labelledby="warehouse-assigned-title">
                <div className="warehouse-assigned-header">
                    <span className="warehouse-assigned-symbol"><UserCheck size={22} aria-hidden="true" /></span>
                    <div><h2 id="warehouse-assigned-title">Administrateurs affectés</h2><p>{assigned.length} administrateur(s) affecté(s)</p></div>
                    <span className="warehouse-assigned-total">{assigned.length}</span>
                </div>
                {filtered.length ? (
                    <div className="warehouse-assigned-grid">
                        {filtered.map((admin, index) => (
                            <article key={getAdminUuid(admin) ?? admin.id ?? index} className="warehouse-assigned-card">
                                <span className="warehouse-assigned-avatar" aria-hidden="true">{nameOf(admin).slice(0, 1).toLocaleUpperCase('fr')}</span>
                                <div><h3>{nameOf(admin)}</h3><p><Mail size={13} aria-hidden="true" />{admin.email ?? 'E-mail non renseigné'}</p><span className="warehouse-assigned-tag"><UserCheck size={12} aria-hidden="true" />Affecté à cet entrepôt</span></div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="warehouse-assigned-empty">
                        <span><UsersRound size={30} strokeWidth={1.6} aria-hidden="true" /></span>
                        <h3>{assigned.length ? 'Aucun résultat' : 'Aucun administrateur affecté'}</h3>
                        <p>{assigned.length ? 'Essayez un autre nom ou une autre adresse e-mail.' : 'Affectez des administrateurs pour leur donner accès à la gestion de cet entrepôt.'}</p>
                        {!assigned.length && assignButton}
                    </div>
                )}
            </section>
            {assigning && <WarehouseAdminsModal key={id} warehouse={warehouse} loading={mutation.isPending}
                onClose={() => { if (!mutation.isPending) setAssigning(false) }}
                onSubmit={async adminIds => { await mutation.mutateAsync({ id, adminIds }); setAssigning(false) }} />}
        </section>
    )
}
