import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import Icon from '../../../components/ui/Icon'
import Skeleton from '../../../components/ui/Skeleton'

export default function ZoneDetailsPanel({ zone, loading = false, onEdit, onDelete }) {
    if (loading) {
        return (
            <aside className="zone-details-panel" aria-label="Chargement de la zone" aria-busy="true">
                <Skeleton height={28} />
                <Skeleton height={90} />
                <Skeleton height={90} />
                <Skeleton height={39} />
            </aside>
        )
    }

    if (!zone) {
        return (
            <aside className="zone-details-panel zone-details-empty">
                <Icon name="location_on" size={28} />
                <p>Sélectionnez une zone sur la carte ou dans le tableau.</p>
            </aside>
        )
    }

    const communes = zone.communes?.map(commune => commune.nom).filter(Boolean) ?? []
    const stationCount = zone.stations_count ?? zone.stations?.length

    return (
        <aside className="zone-details-panel" aria-labelledby="selected-zone-title">
            <header className="zone-details-header">
                <div>
                    <span className="zone-details-eyebrow">Zone sélectionnée</span>
                    <h2 id="selected-zone-title">{zone.nom}</h2>
                    <span>{zone.code || 'Code non renseigné'}</span>
                </div>
                <Badge variant={zone.est_active ? 'success' : 'default'} size="sm">
                    {zone.est_active ? 'Active' : 'Inactive'}
                </Badge>
            </header>

            <dl className="zone-details-list">
                <div>
                    <dt>Communes</dt>
                    <dd>{communes.join(', ') || 'Aucune commune rattachée'}</dd>
                </div>
                <div>
                    <dt>Stations</dt>
                    <dd>{stationCount ?? '—'}</dd>
                </div>
                <div>
                    <dt>Contour</dt>
                    <dd>{zone.polygone?.length ?? 0} points</dd>
                </div>
            </dl>

            <footer className="zone-details-actions">
                <Button size="sm" onClick={() => onEdit?.(zone)}>Modifier</Button>
                <Button size="sm" variant="danger" onClick={() => onDelete?.(zone)}>Supprimer</Button>
            </footer>
        </aside>
    )
}
