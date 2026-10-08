import Table from '../../../components/ui/Table'
import Button from '../../../components/ui/Button'
import '../../../styles/pages/users/CompaniesTable.css'


function CompaniesTable({ companies = [], loading = false, onView }) {
    const columns = [
        { key: 'name', label: 'Entreprise', render: item => <div className="company-identity"><strong>{item.name}</strong>{item.email && <span>{item.email}</span>}</div> },
        { key: 'contactName', label: 'Contact principal', render: item => <span className="company-contactName">{item.contactName ?? "—"}</span> },
        { key: 'phone', label: 'Téléphone', render: item => <span className="company-phone">{item.phone ?? "—"}</span> },
        { key: 'email', label: 'Email', render: item => <span className="company-email">{item.email ?? "—"}</span> },
        { key: 'ordersCount', label: 'Commandes', render: item => <span className="company-count">{item.ordersCount ?? 0}</span> },
        { key: 'totalSpent', label: 'Dépenses', render: item => <span className="company-totalSpent">{item.totalSpent ?? "—"}</span> },
        { key: 'status', label: 'Statut', render: item => <span className={`company-status ${item.status === 'active' ? 'company-status-active' : 'company-status-inactive'}`}>{item.status === 'active' ? 'Active' : 'Suspendue'}</span> },
        { key: 'actions', label: 'Actions', render: item => <Button variant="link" disabled={!onView} onClick={() => onView?.(item)}>Voir</Button> },
    ]
    return <div className="companies-table"><Table columns={columns} data={companies} loading={loading} emptyMessage="Aucune entreprise" /></div>
}

export default CompaniesTable
