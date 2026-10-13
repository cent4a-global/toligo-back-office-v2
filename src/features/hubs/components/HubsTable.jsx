import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import Dropdown from '../../../components/ui/Dropdown'


const statusConfig = {
    libre: {
        label: 'Libre',
        variant: 'success',
    },

    occupe: {
        label: 'Occupé',
        variant: 'warning',
    },

    maintenance: {
        label: 'Maintenance',
        variant: 'danger',
    },

    indisponible: {
        label: 'Indisponible',
        variant: 'default',
    },
}

function HubsTable({ hubs = [], loading = false, onEdit, onDelete }) {
    const columns = [
        {
            key: 'code',
            label: 'Hub',

            render: hub => (
                <div className="hub-identity">
                    <strong>{hub.code}</strong>

                    <span>Hub automatisé</span>
                </div>
            ),
        },

        {
            key: 'station',
            label: 'Station',

            render: hub => (
                <div className="hub-station">
                    <strong>{hub.station?.nom ?? '—'}</strong>

                    {hub.station?.code && <span>{hub.station.code}</span>}
                </div>
            ),
        },

        {
            key: 'statut',
            label: 'Statut',

            render: hub => {
                const status = statusConfig[hub.statut] ?? { label: hub.statut || '—', variant: 'default' }

                return (
                    <Badge variant={status.variant} size="sm">
                        {status.label}
                    </Badge>
                )
            },
        },

        {
            key: 'description',
            label: 'Description',

            render: hub => <span className="hub-description">{hub.description || '—'}</span>,
        },

        {
            key: 'updated_at',
            label: 'Dernière modification',

            render: hub => <span className="hub-date">{formatDate(hub.updated_at)}</span>,
        },

        {
            key: 'actions',
            label: 'Actions',

            render: hub => (
                <Dropdown
                    trigger={
                        <button type="button" className="hub-actions-trigger" aria-label={`Actions pour ${hub.code}`}>
                            <i className="fi fi-rr-menu-dots"></i>
                        </button>
                    }
                    items={[
                        {
                            label: 'Modifier',

                            onClick: () => onEdit?.(hub),
                        },

                        {
                            label: 'Supprimer',
                            danger: true,

                            onClick: () => onDelete?.(hub),
                        },
                    ]}
                />
            ),
        },
    ]

    return (
        <div className="hubs-table">
            <Table
                columns={columns}
                data={hubs}
                loading={loading}
                emptyMessage="Aucun hub disponible"
            />
        </div>
    )
}

function formatDate(date) {
    if (!date || Number.isNaN(new Date(date).getTime())) {
        return '—'
    }

    return new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Africa/Abidjan',
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date))
}

export default HubsTable
