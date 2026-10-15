import Icon from '../../../components/ui/Icon'
import {
    useNavigate,
} from 'react-router-dom'

import Table from '../../../components/ui/Table'
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
                            <Icon name="more_vert" />
                        </button>
                    }
                    items={[
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
                        {
                            label: 'Gérer les admins',
                            onClick: () => navigate(`/warehouses/${warehouse.id}/admins`),
                        },
                        {
                            label: 'Gérer les caisses',
                            onClick: () => navigate(`/warehouses/${warehouse.id}/boxes`),
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
