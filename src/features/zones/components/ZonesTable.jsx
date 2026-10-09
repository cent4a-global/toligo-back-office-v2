import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import Dropdown from '../../../components/ui/Dropdown'
import Card from '../../../components/ui/Card'

function ZonesTable({ zones = [], loading = false, onEdit, onDelete }) {
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
            render: zone => zone.communes?.map(commune => commune.nom).join(', ') || '—',
        },
        {
            key: 'polygone',
            label: 'Contour',
            render: zone => <span className="zone-count">{zone.polygone?.length ?? 0} points</span>,
        },

        {
            key: 'est_active',
            label: 'Statut',

            render: zone => (
                <Badge variant={zone.est_active ? 'success' : 'default'} size="sm">
                    {zone.est_active ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },

        {
            key: 'actions',
            label: 'Actions',

            render: zone => (
                <Dropdown
                    trigger={
                        <button
                            type="button"
                            className="zone-actions-trigger"
                            aria-label={`Actions pour ${zone.nom}`}>
                            <i className="fi fi-rr-menu-dots" aria-hidden="true"></i>
                        </button>
                    }
                    items={[
                        {
                            label: 'Modifier',
                            onClick: () => onEdit?.(zone),
                        },
                        {
                            label: 'Supprimer',
                            danger: true,
                            onClick: () => onDelete?.(zone),
                        },
                    ]}
                />
            ),
        },
    ]

    return (
        <Card className="zones-table-card">
            <div className="zones-table">
                <Table
                    columns={columns}
                    data={zones}
                    loading={loading}
                    emptyMessage="Aucune zone disponible"
                />
            </div>
        </Card>
    )
}

export default ZonesTable
