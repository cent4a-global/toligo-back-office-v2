import {
    useNavigate,
} from 'react-router-dom'

import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import Dropdown from '../../../components/ui/Dropdown'


function WarehouseTable({
    warehouses = [],
    loading = false,
    onEdit,
    onDelete,
}) {
    const navigate =
        useNavigate()

    const columns = [
        {
            key: 'name',
            label: 'Entrepôt',

            render: warehouse => (
                <div className="warehouse-identity">
                    <strong>
                        {warehouse.name}
                    </strong>

                    {warehouse.address && (
                        <span>
                            {
                                warehouse.address
                            }
                        </span>
                    )}
                </div>
            ),
        },

        {
            key: 'locality',
            label: 'Localité',

            render: warehouse =>
                warehouse.locality?.name ??
                warehouse.locality ??
                '—',
        },

        {
            key: 'admin',
            label: 'Administrateur',

            render: warehouse => {
                const admin =
                    warehouse.admin

                if (!admin) {
                    return (
                        <span className="warehouse-empty">
                            Non affecté
                        </span>
                    )
                }

                return (
                    <div className="warehouse-admin">
                        <strong>
                            {admin.name}
                        </strong>

                        {admin.email && (
                            <span>
                                {admin.email}
                            </span>
                        )}
                    </div>
                )
            },
        },

        {
            key: 'boxes',
            label: 'Caisses',

            render: warehouse => (
                <span className="warehouse-boxes">
                    {warehouse.boxesCount ??
                        warehouse.boxes?.length ??
                        0}
                </span>
            ),
        },

        {
            key: 'occupation',
            label: 'Occupation',

            render: warehouse => {
                const percentage =
                    warehouse.occupationRate ??
                    0

                return (
                    <div className="warehouse-occupation">
                        <div className="warehouse-occupation-track">
                            <div
                                className="warehouse-occupation-value"
                                style={{
                                    width: `${Math.min(100, Math.max(0, Number(percentage) || 0))}%`,
                                }}
                            />
                        </div>

                        <span>
                            {percentage} %
                        </span>
                    </div>
                )
            },
        },

        {
            key: 'status',
            label: 'Statut',

            render: warehouse => (
                <Badge
                    variant={
                        warehouse.status ===
                        'active'
                            ? 'success'
                            : 'default'
                    }
                    size="sm"
                >
                    {warehouse.status ===
                    'active'
                        ? 'Actif'
                        : 'Inactif'}
                </Badge>
            ),
        },

        {
            key: 'actions',
            label: 'Actions',

            render: warehouse => (
                <Dropdown
                    trigger={
                        <button
                            type="button"
                            className="warehouse-actions-trigger"
                            aria-label="Actions de l’entrepôt"
                        >
                            <i aria-hidden="true" className="fi fi-rr-menu-dots"></i>
                        </button>
                    }
                    items={[
                        {
                            label: 'Voir les détails',
                            onClick: () =>
                                navigate(
                                    `/warehouses/${warehouse.id}`
                                ),
                        },
                        {
                            label: 'Modifier',
                            onClick: () =>
                                onEdit?.(
                                    warehouse
                                ),
                        },
                        {
                            label: 'Supprimer',
                            danger: true,
                            onClick: () =>
                                onDelete?.(
                                    warehouse
                                ),
                        },
                    ]}
                />
            ),
        },
    ]

    return (
        <div className="warehouse-table-wrapper">
            <Table
                columns={columns}
                data={warehouses}
                loading={loading}
                emptyMessage="Aucun entrepôt disponible"
            />
        </div>
    )
}

export default WarehouseTable
