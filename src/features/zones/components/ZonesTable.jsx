import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'

function ZonesTable({ zones = [], loading = false, selectedZoneId, onSelect }) {
    const columns = [
        {
            key: 'nom',
            label: 'Zone',

            render: zone => (
                <div className="zone-identity">
                    <strong>{zone.nom}</strong>

                    {zone.code && <span>{zone.code}</span>}
                </div>
            ),
        },

        {
            key: 'communes',
            label: 'Communes',
            render: zone => (
                <span className="zone-communes-cell">
                    {zone.communes?.map(commune => commune.nom).filter(Boolean).join(', ') || '—'}
                </span>
            ),
        },
        {
            key: 'stations',
            label: 'Stations',
            render: zone => zone.stations_count ?? zone.stations?.length ?? '—',
        },
        {
            key: 'polygone',
            label: 'Contour',
            render: zone => <span className="zone-count">{zone.polygone?.length ?? 0} points</span>,
        },
        {
            key: 'est_active',
            label: 'État',
            render: zone => (
                <Badge variant={zone.est_active ? 'success' : 'default'} size="sm">
                    {zone.est_active ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
    ]

    return (
        <div className="zones-table-section">
            <div className="zones-table">
                <Table
                    columns={columns}
                    data={zones}
                    loading={loading}
                    emptyMessage="Aucune zone disponible"
                    getRowProps={zone => ({
                        className: `zone-table-row${String(zone.id) === String(selectedZoneId) ? ' is-selected' : ''}`,
                        tabIndex: 0,
                        'aria-selected': String(zone.id) === String(selectedZoneId),
                        onClick: () => onSelect?.(zone),
                        onKeyDown: event => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault()
                                onSelect?.(zone)
                            }
                        },
                    })}
                />
            </div>
        </div>
    )
}

export default ZonesTable
