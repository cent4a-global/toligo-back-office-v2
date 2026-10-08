import Table from '../../../components/ui/Table'
import Button from '../../../components/ui/Button'
import '../../../styles/pages/users/RolePermissionsTable.css'

function RolePermissionsTable({ permissions = [], loading = false, onEdit }) {
    const columns = [
        { key: 'permission', label: 'Droit' },
        {
            key: 'superadmin',
            label: 'Superadmin',
            render: item => <PermissionValue value={item.superadmin} />,
        },
        {
            key: 'operator',
            label: 'Opérateur',
            render: item => <PermissionValue value={item.operator} />,
        },
        {
            key: 'stationManager',
            label: 'Gestionnaire de station',
            render: item => <PermissionValue value={item.stationManager} />,
        },
        {
            key: 'warehouseAdmin',
            label: 'Admin entrepôt',
            render: item => <PermissionValue value={item.warehouseAdmin} />,
        },
    ]
    return (
        <section className="role-permissions">
            <div className="role-permissions-header">
                <h2>Droits par rôle</h2>
                <Button variant="link" disabled={!onEdit} onClick={onEdit}>
                    Modifier les droits
                </Button>
            </div>
            <Table
                columns={columns}
                data={permissions}
                loading={loading}
                emptyMessage="Aucun droit configuré"
            />
        </section>
    )
}

function PermissionValue({ value }) {
    const isAllowed = value === 'Oui' || value === true
    const label = typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : value || '—'
    return (
        <span className={`permission-value${isAllowed ? ' permission-value-allowed' : ''}`}>
            {label}
        </span>
    )
}

export default RolePermissionsTable
