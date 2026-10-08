import Table from '../../../components/ui/Table'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import '../../../styles/pages/users/InternalUsersTable.css'

const roleConfig = {
    superadmin: { label: 'Superadmin', variant: 'dark' },
    operator: { label: 'Opérateur', variant: 'default' },
    station_manager: { label: 'Gestionnaire de station', variant: 'success' },
    warehouse_admin: { label: 'Admin entrepôt', variant: 'warning' },
}

function InternalUsersTable({ users = [], loading = false, onEdit, onReactivate }) {
    const columns = [
        {
            key: 'name',
            label: 'Nom',
            render: item => (
                <div className="internal-user-identity">
                    <strong>{item.name}</strong>
                    {item.email && <span>{item.email}</span>}
                </div>
            ),
        },
        {
            key: 'role',
            label: 'Rôle',
            render: item => {
                const role = roleConfig[item.role] ?? {
                    label: item.role || '—',
                    variant: 'default',
                }
                return (
                    <Badge variant={role.variant} size="sm">
                        {role.label}
                    </Badge>
                )
            },
        },
        {
            key: 'scope',
            label: 'Périmètre',
            render: item => <span className="internal-user-scope">{item.scope ?? '—'}</span>,
        },
        {
            key: 'lastLogin',
            label: 'Dernière connexion',
            render: item => (
                <span className="internal-user-lastLogin">{item.lastLogin ?? '—'}</span>
            ),
        },
        {
            key: 'status',
            label: 'Statut',
            render: item => (
                <span
                    className={`internal-user-status ${item.status === 'active' ? 'internal-user-status-active' : 'internal-user-status-inactive'}`}>
                    {item.status === 'active' ? 'Actif' : 'Accès révoqué'}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: item =>
                item.status === 'active' ? (
                    <Button variant="link" disabled={!onEdit} onClick={() => onEdit?.(item)}>
                        Modifier
                    </Button>
                ) : (
                    <Button
                        variant="link"
                        disabled={!onReactivate}
                        onClick={() => onReactivate?.(item)}>
                        Réactiver
                    </Button>
                ),
        },
    ]
    return (
        <div className="users-table">
            <Table
                columns={columns}
                data={users}
                loading={loading}
                emptyMessage="Aucun membre interne"
            />
        </div>
    )
}

export default InternalUsersTable
