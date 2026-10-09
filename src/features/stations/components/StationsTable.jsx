import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import Dropdown from '../../../components/ui/Dropdown'
import Card from '../../../components/ui/Card'

function StationsTable({ stations = [], loading = false, onEdit, onDelete }) {
    const columns = [
        {
            key: 'nom',
            label: 'Station',

            render: station => (
                <div className="station-identity">
                    <strong>{station.nom}</strong>

                    {station.code && <span>{station.code}</span>}
                </div>
            ),
        },

        {
            key: 'commune',
            label: 'Commune',
            render: station => station.commune?.nom ?? '—',
        },

        {
            key: 'adresse',
            label: 'Adresse',

            render: station => <span className="station-address">{station.adresse || '—'}</span>,
        },

        {
            key: 'repere',
            label: 'Repère',
            render: station => station.repere || '—',
        },

        {
            key: 'statut',
            label: 'Statut',

            render: station => (
                <Badge
                    variant={
                        {
                            operationnelle: 'success',
                            maintenance: 'warning',
                            indisponible: 'danger',
                        }[station.statut] ?? 'default'
                    }
                    size="sm">
                    {{
                        operationnelle: 'Opérationnelle',
                        maintenance: 'Maintenance',
                        indisponible: 'Indisponible',
                    }[station.statut] ??
                        station.statut ??
                        '—'}
                </Badge>
            ),
        },

        {
            key: 'actions',
            label: 'Actions',

            render: station => (
                <Dropdown
                    trigger={
                        <button
                            type="button"
                            className="station-actions-trigger"
                            aria-label={`Actions pour ${station.nom}`}>
                            <i className="fi fi-rr-menu-dots"></i>
                        </button>
                    }
                    items={[
                        {
                            label: 'Modifier',

                            onClick: () => onEdit?.(station),
                        },

                        {
                            label: 'Supprimer',
                            danger: true,

                            onClick: () => onDelete?.(station),
                        },
                    ]}
                />
            ),
        },
    ]

    return (
        <Card>
            <div className="stations-table">
                <Table
                    columns={columns}
                    data={stations}
                    loading={loading}
                    emptyMessage="Aucune station disponible"
                />
            </div>
        </Card>
    )
}

export default StationsTable
