import { Archive, Building2, MapPin, Pencil, UsersRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Button from '../../../components/ui/Button'
import Icon from '../../../components/ui/Icon'
import Skeleton from '../../../components/ui/Skeleton'

export default function WarehouseGrid({ warehouses = [], loading = false, onEdit }) {
    const navigate = useNavigate()

    if (loading) {
        return (
            <div className="warehouse-grid" aria-busy="true" aria-label="Chargement des entrepôts">
                {Array.from({ length: 6 }, (_, index) => (
                    <div className="warehouse-tile warehouse-tile-skeleton" key={index}>
                        <Skeleton height={54} />
                        <Skeleton height={76} />
                        <Skeleton height={34} />
                    </div>
                ))}
            </div>
        )
    }

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
                const detailsPath = `/warehouses/${warehouse.id}`

                return (
                    <article
                        className="warehouse-tile"
                        key={warehouse.id}
                        role="link"
                        tabIndex={0}
                        aria-label={`Voir les détails de ${name}`}
                        onClick={() => navigate(detailsPath)}
                        onKeyDown={event => {
                            if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
                                event.preventDefault()
                                navigate(detailsPath)
                            }
                        }}>
                        <div className="warehouse-tile-header">
                            <div className="warehouse-tile-heading">
                                <span className="warehouse-tile-symbol"><Icon name="warehouse" size={24} /></span>
                                <div className="warehouse-tile-name">
                                    <h2 title={name}>{name}</h2>
                                    <p>{warehouse.code ?? 'Code non renseigné'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="warehouse-tile-badges">
                            <span className="warehouse-tile-badge warehouse-tile-badge-admin"><UsersRound size={14} aria-hidden="true" />{adminCount} administrateur{adminCount > 1 ? 's' : ''}</span>
                            <span className="warehouse-tile-badge warehouse-tile-badge-box"><Archive size={14} aria-hidden="true" />{boxes ?? '—'} caisse{boxes > 1 ? 's' : ''}</span>
                        </div>

                        <div className="warehouse-tile-body">
                            <div className="warehouse-tile-info">
                                <span className="warehouse-tile-info-icon"><MapPin size={17} aria-hidden="true" /></span>
                                <div><span>Adresse</span><p title={warehouse.adresse ?? warehouse.address}>{warehouse.adresse ?? warehouse.address ?? 'Non renseignée'}</p></div>
                            </div>
                            <div className="warehouse-tile-info">
                                <span className="warehouse-tile-info-icon"><Building2 size={17} aria-hidden="true" /></span>
                                <div><span>Commune</span><p>{locality ?? 'Non renseignée'}</p></div>
                            </div>
                        </div>

                        <div className="warehouse-tile-footer">
                            <span className={`warehouse-tile-status${active ? ' is-active' : ''}`}>
                                <span />
                                {active ? 'Opérationnel' : status === 'inactive' || status === 'inactif' ? 'Inactif' : status ?? 'Statut non renseigné'}
                            </span>
                            <Button
                                variant="secondary"
                                onClick={event => {
                                    event.stopPropagation()
                                    onEdit?.(warehouse)
                                }}>
                                <Pencil size={16} aria-hidden="true" />Modifier
                            </Button>
                        </div>
                    </article>
                )
            })}
        </div>
    )
}
