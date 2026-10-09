import Table from '../../../components/ui/Table'
import Button from '../../../components/ui/Button'

function ClientsTable({ clients = [], loading = false, onView }) {
    const columns = [
        {
            key: 'name',
            label: 'Client',
            render: item => (
                <div className="client-identity">
                    <strong>{item.name}</strong>
                    {item.email && <span>{item.email}</span>}
                </div>
            ),
        },
        {
            key: 'phone',
            label: 'Téléphone',
            render: item => <span className="client-phone">{item.phone ?? '—'}</span>,
        },
        {
            key: 'email',
            label: 'Email',
            render: item => <span className="client-email">{item.email ?? '—'}</span>,
        },
        {
            key: 'ordersCount',
            label: 'Commandes',
            render: item => <span className="client-count">{item.ordersCount ?? 0}</span>,
        },
        {
            key: 'rentalsCount',
            label: 'Locations',
            render: item => <span className="client-count">{item.rentalsCount ?? 0}</span>,
        },
        {
            key: 'createdAt',
            label: 'Inscription',
            render: item => <span className="client-createdAt">{item.createdAt ?? '—'}</span>,
        },
        {
            key: 'status',
            label: 'Statut',
            render: item => (
                <span
                    className={`client-status ${item.status === 'active' ? 'client-status-active' : 'client-status-inactive'}`}>
                    {item.status === 'active' ? 'Actif' : 'Bloqué'}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: item => (
                <Button variant="link" disabled={!onView} onClick={() => onView?.(item)}>
                    Voir
                </Button>
            ),
        },
    ]
    return (
        <div className="clients-table">
            <Table columns={columns} data={clients} loading={loading} emptyMessage="Aucun client" />
        </div>
    )
}

export default ClientsTable
