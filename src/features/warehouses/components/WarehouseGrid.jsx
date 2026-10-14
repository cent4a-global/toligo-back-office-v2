import { useNavigate } from 'react-router-dom'
import { Warehouse, UsersRound, Archive, MapPin, Building2, MoreVertical, Pencil, Info } from 'lucide-react'
import Dropdown from '../../../components/ui/Dropdown'
import Button from '../../../components/ui/Button'
import Skeleton from '../../../components/ui/Skeleton'

export default function WarehouseGrid({ warehouses = [], loading = false, onEdit }) {
    const navigate = useNavigate()
    if (loading) return (
        <div className="warehouse-grid" aria-busy="true" aria-label="Chargement des entrepôts">
            {Array.from({ length: 6 }, (_, index) => <div className="warehouse-tile warehouse-tile-skeleton" key={index}><Skeleton height={42} /><Skeleton height={70} /><Skeleton height={32} /></div>)}
        </div>
    )
    if (!warehouses.length) return <div className="warehouse-grid-empty">Aucun entrepôt disponible.</div>
    return (
        <div className="warehouse-grid">
            {warehouses.map(warehouse => {
                const name = warehouse.nom ?? warehouse.name ?? 'Entrepôt'
                const adminCount = warehouse.admins_count ?? warehouse.admins?.length ?? (warehouse.admin ? 1 : 0)
                const boxes = warehouse.boxesCount ?? warehouse.caisses_count ?? warehouse.boxes?.length
                const locality = warehouse.commune?.nom ?? warehouse.locality?.name ?? (typeof warehouse.locality === 'string' ? warehouse.locality : null)
                const status = warehouse.statut ?? warehouse.status
                const active = status === 'active' || status === 'actif'
                return (
                    <article className="warehouse-tile" key={warehouse.id}>
                        <div className="warehouse-tile-header">
                            <div className="warehouse-tile-heading">
                                <span className="warehouse-tile-symbol"><Warehouse size={21} strokeWidth={1.7} aria-hidden="true" /></span>
                                <div className="warehouse-tile-name"><h2 title={name}>{name}</h2><p>{warehouse.code ?? 'Code non renseigné'}</p></div>
                                <Dropdown trigger={open => <button type="button" className="warehouse-tile-menu" aria-label={`Actions de ${name}`} aria-expanded={open}><MoreVertical size={22} aria-hidden="true" /></button>}
                                    items={[
                                        { label: 'Détails', icon: <Info size={16} />, onClick: () => navigate(`/warehouses/${warehouse.id}`) },
                                        { label: 'Gérer les admins', icon: <UsersRound size={16} />, onClick: () => navigate(`/warehouses/${warehouse.id}/admins`) },
                                        { label: 'Gérer les caisses', icon: <Archive size={16} />, onClick: () => navigate(`/warehouses/${warehouse.id}/boxes`) },
                                    ]} />
                            </div>
                            <div className="warehouse-tile-badges">
                                <span className="warehouse-tile-badge warehouse-tile-badge-admin"><UsersRound size={14} aria-hidden="true" />{adminCount} administrateur{adminCount > 1 ? 's' : ''}</span>
                                <span className="warehouse-tile-badge warehouse-tile-badge-box"><Archive size={14} aria-hidden="true" />{boxes ?? '—'} caisse{boxes > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                        <div className="warehouse-tile-body">
                            <div className="warehouse-tile-info"><span className="warehouse-tile-info-icon"><MapPin size={16} aria-hidden="true" /></span><div><span>Adresse</span><p>{warehouse.adresse ?? warehouse.address ?? 'Non renseignée'}</p></div></div>
                            <div className="warehouse-tile-info"><span className="warehouse-tile-info-icon"><Building2 size={16} aria-hidden="true" /></span><div><span>Zone</span><p>{locality ?? 'Non renseignée'}</p></div></div>
                        </div>
                        <div className="warehouse-tile-footer">
                            <span className={`warehouse-tile-status${active ? ' is-active' : ''}`}><span />{active ? 'Actif' : status === 'inactive' || status === 'inactif' ? 'Inactif' : status ?? 'Statut non renseigné'}</span>
                            <Button variant="secondary" onClick={() => onEdit(warehouse)}><Pencil size={16} aria-hidden="true" />Modifier</Button>
                        </div>
                    </article>
                )
            })}
        </div>
    )
}
