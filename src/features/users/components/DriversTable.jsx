import Table from '../../../components/ui/Table'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import '../../../styles/pages/users/DriversTable.css'

const availabilityConfig = { available: { label: 'Disponible', variant: 'success' }, mission: { label: 'En mission', variant: 'warning' }, offline: { label: 'Hors ligne', variant: 'default' } }

function DriversTable({ drivers = [], loading = false, onView }) {
    const columns = [
        { key: 'name', label: 'Livreur', render: item => <div className="driver-identity"><strong>{item.name}</strong>{item.email && <span>{item.email}</span>}</div> },
        { key: 'phone', label: 'Téléphone', render: item => <span className="driver-phone">{item.phone ?? "—"}</span> },
        { key: 'zone', label: 'Zone', render: item => <span className="driver-zone">{item.zone ?? "—"}</span> },
        { key: 'availability', label: 'Disponibilité', render: item => { const availability = availabilityConfig[item.availability] ?? availabilityConfig.offline; return <Badge variant={availability.variant} size="sm">{availability.label}</Badge> } },
        { key: 'missionsToday', label: "Missions aujourd'hui", render: item => <span className="driver-count">{item.missionsToday ?? 0}</span> },
        { key: 'rating', label: 'Note', render: item => <span className="driver-rating">{item.rating != null ? `${item.rating} / 5` : "—"}</span> },
        { key: 'status', label: 'Statut', render: item => <span className={`driver-status ${item.status === 'active' ? 'driver-status-active' : 'driver-status-inactive'}`}>{item.status === 'active' ? 'Actif' : 'Suspendu'}</span> },
        { key: 'actions', label: 'Actions', render: item => <Button variant="link" disabled={!onView} onClick={() => onView?.(item)}>Voir</Button> },
    ]
    return <div className="drivers-table"><Table columns={columns} data={drivers} loading={loading} emptyMessage="Aucun livreur" /></div>
}

export default DriversTable
