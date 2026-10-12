import ErrorState from '../../../components/ui/ErrorState'
import { useState } from 'react'
import { usePackageFormats } from '../hooks/usePackageFormats'
import PackageFormatFormModal from './PackageFormatFormModal'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import Table from '../../../components/ui/Table'
import Tabs from '../../../components/ui/Tabs'


function PackageFormatsSection() {
    const { data: formats = [], isLoading, isError, error, refetch } = usePackageFormats()
    const [editor, setEditor] = useState(null)
    const columns = [
        { key: 'icone', label: 'Image', render: format => <div className="package-format-image">{format.icone || (format.est_actif ? <i className="fi fi-rr-box-open" aria-hidden="true" /> : <span className="package-format-image-empty" />)}</div> },
        { key: 'libelle', label: 'Libellé · code', render: format => <div className="package-format-name"><strong>{format.libelle}</strong><span>{format.code}</span></div> },
        { key: 'description', label: 'Repère', render: format => format.description || '—' },
        { key: 'dimensions_max_cm', label: 'Dimensions max', render: format => `${['longueur', 'largeur', 'hauteur'].map(key => format.dimensions_max_cm?.[key] ?? '—').join(' × ')} cm` },
        { key: 'poids_max_kg', label: 'Poids max', render: format => `${format.poids_max_kg} kg` },
        { key: 'prix', label: 'Prix', render: format => <span className="package-format-price">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: /^[A-Z]{3}$/.test(format.devise) ? format.devise : 'XOF' }).format(format.prix)}</span> },
        { key: 'est_actif', label: 'Statut', render: format => <span className={`package-format-status package-format-status-${format.est_actif ? 'active' : 'archived'}`}>{format.archive_le ? 'Archivé' : format.est_actif ? 'Actif' : 'Inactif'}</span> },
        { key: 'actions', label: 'Actions', render: format => <div className="package-format-actions"><button type="button" onClick={() => setEditor({ format })}>Modifier</button></div> },
    ]
    const tabs = [
        { value: 'all', label: 'Tous', rows: formats },
        { value: 'active', label: 'Actifs', rows: formats.filter(format => format.est_actif) },
        { value: 'inactive', label: 'Inactifs', rows: formats.filter(format => !format.est_actif) },
    ].map(tab => ({
        value: tab.value,
        label: `${tab.label} (${tab.rows.length})`,
        content: <Table columns={columns} data={tab.rows} loading={isLoading} errorContent={isError ? <ErrorState title="Impossible de charger les formats de colis" description={error?.message} action={<Button onClick={() => refetch()}>R?essayer</Button>} /> : null} emptyMessage="Aucun format de colis." />,
    }))
    return (
        <Card padding="none" className="settings-card package-formats-card">
            <div className="settings-card-header settings-card-header-space">
                <div>
                    <h2>Formats de colis</h2>
                    <p>Prix final, identique par route ou par drone. Un changement de prix ne touche pas les commandes déjà passées.</p>
                </div>

                <Button className="package-format-add" onClick={() => setEditor({ format: null })}>
                    <i className="fi fi-rr-plus"></i>
                    Nouveau format
                </Button>
            </div>

            <div className="package-formats-table-wrapper">
                <Tabs tabs={tabs} defaultTab="all" />
            </div>
            {editor && <PackageFormatFormModal format={editor.format} onClose={() => setEditor(null)} />}
        </Card>
    )
}

export default PackageFormatsSection
