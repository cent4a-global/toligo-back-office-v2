import { useState } from 'react'

import Button from './components/ui/Button'
import Input from './components/ui/Input'
import Select from './components/ui/Select'
import Card from './components/ui/Card'
import Badge from './components/ui/Badge'
import Modal from './components/ui/Modal'
import Table from './components/ui/Table'
import Spinner from './components/ui/Spinner'
import EmptyState from './components/ui/EmptyState'
import ErrorState from './components/ui/ErrorState'
import PageHeader from './components/ui/PageHeader'
import StatCard from './components/ui/StatCard'
import Tabs from './components/ui/Tabs'
import Dropdown from './components/ui/Dropdown'
import Pagination from './components/ui/Pagination'
import ConfirmDialog from './components/ui/ConfirmDialog'

const App = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [page, setPage] = useState(1)

    const clients = [
        {
            id: 1,
            name: 'Michel Kouassi',
            email: 'michel@example.com',
            status: 'Actif',
        },
        {
            id: 2,
            name: 'Jean Koffi',
            email: 'jean@example.com',
            status: 'Actif',
        },
        {
            id: 3,
            name: 'Aya Traoré',
            email: 'aya@example.com',
            status: 'En attente',
        },
    ]

    const columns = [
        {
            key: 'name',
            label: 'Nom',
        },
        {
            key: 'email',
            label: 'Email',
        },
        {
            key: 'status',
            label: 'Statut',
            render: client => (
                <Badge variant={client.status === 'Actif' ? 'success' : 'warning'}>
                    {client.status}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: () => (
                <Dropdown
                    trigger={
                        <Button variant="ghost" size="sm">
                            Actions
                        </Button>
                    }
                    items={[
                        {
                            label: 'Voir',
                            onClick: () => console.log('Voir'),
                        },
                        {
                            label: 'Modifier',
                            onClick: () => console.log('Modifier'),
                        },
                        {
                            label: 'Supprimer',
                            danger: true,
                            onClick: () => setConfirmOpen(true),
                        },
                    ]}
                />
            ),
        },
    ]

    const tabs = [
        {
            value: 'general',
            label: 'Informations générales',
            content: (
                <Card>
                    <h3>Informations générales</h3>

                    <p>Informations principales du client.</p>
                </Card>
            ),
        },
        {
            value: 'activity',
            label: 'Activité',
            content: (
                <Card>
                    <h3>Activité</h3>

                    <p>Historique des activités du client.</p>
                </Card>
            ),
        },
        {
            value: 'deliveries',
            label: 'Livraisons',
            content: (
                <Card>
                    <h3>Livraisons</h3>

                    <p>Historique des livraisons.</p>
                </Card>
            ),
        },
    ]

    return (
        <main className="ui-demo">
            {/* ========================================
                PAGE HEADER
            ======================================== */}

            <PageHeader
                title="Bibliothèque UI"
                description="Présentation des composants de l'application Tôligo."
                actions={<Button onClick={() => setModalOpen(true)}>Nouvelle action</Button>}
            />

            {/* ========================================
                STAT CARDS
            ======================================== */}

            <section className="ui-demo-section">
                <h2>Statistiques</h2>

                <div className="ui-demo-stats">
                    <StatCard
                        title="Clients"
                        value="1 248"
                        trend="+12,5 %"
                        trendType="success"
                        description="vs. mois dernier"
                    />

                    <StatCard
                        title="Livraisons"
                        value="856"
                        trend="+8,2 %"
                        trendType="success"
                        description="vs. mois dernier"
                    />

                    <StatCard
                        title="En attente"
                        value="42"
                        trend="+4,8 %"
                        trendType="warning"
                        description="vs. mois dernier"
                    />

                    <StatCard
                        title="Annulations"
                        value="18"
                        trend="+2,4 %"
                        trendType="danger"
                        description="vs. mois dernier"
                    />
                </div>
            </section>

            {/* ========================================
                BUTTONS
            ======================================== */}

            <section className="ui-demo-section">
                <h2>Buttons</h2>

                <Card>
                    <div className="ui-demo-row">
                        <Button variant="primary">Primary</Button>

                        <Button variant="secondary">Secondary</Button>

                        <Button variant="outline">Outline</Button>

                        <Button variant="ghost">Ghost</Button>

                        <Button variant="success">Success</Button>

                        <Button variant="danger">Danger</Button>

                        <Button variant="warning">Warning</Button>

                        <Button variant="soft-success">Soft success</Button>

                        <Button variant="soft-danger">Soft danger</Button>

                        <Button variant="soft-warning">Soft warning</Button>

                        <Button variant="link">Link</Button>
                    </div>
                </Card>
            </section>

            {/* ========================================
                FORM
            ======================================== */}

            <section className="ui-demo-section">
                <h2>Formulaires</h2>

                <Card>
                    <div className="ui-demo-grid">
                        <Input label="Nom" name="name" placeholder="Entrez le nom" />

                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="exemple@email.com"
                            required
                        />

                        <Select
                            label="Mode de livraison"
                            name="delivery"
                            options={[
                                {
                                    value: 'vehicle',
                                    label: 'Véhicule',
                                },
                                {
                                    value: 'drone',
                                    label: 'Drone',
                                },
                            ]}
                        />

                        <Select
                            label="Statut"
                            name="status"
                            options={[
                                {
                                    value: 'pending',
                                    label: 'En attente',
                                },
                                {
                                    value: 'validated',
                                    label: 'Validé',
                                },
                                {
                                    value: 'cancelled',
                                    label: 'Annulé',
                                },
                            ]}
                        />
                    </div>
                </Card>
            </section>

            {/* ========================================
                BADGES
            ======================================== */}

            <section className="ui-demo-section">
                <h2>Badges</h2>

                <Card>
                    <div className="ui-demo-row">
                        <Badge>Default</Badge>

                        <Badge variant="success">Validé</Badge>

                        <Badge variant="warning">En attente</Badge>

                        <Badge variant="danger">Refusé</Badge>

                        <Badge variant="dark">Traité</Badge>

                        <Badge variant="outline">Brouillon</Badge>
                    </div>
                </Card>
            </section>

            {/* ========================================
                TABLE
            ======================================== */}

            <section className="ui-demo-section">
                <h2>Table</h2>

                <Card padding="none">
                    <Table columns={columns} data={clients} />

                    <div className="ui-demo-pagination">
                        <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
                    </div>
                </Card>
            </section>

            {/* ========================================
                TABS
            ======================================== */}

            <section className="ui-demo-section">
                <h2>Tabs</h2>

                <Tabs
                    tabs={tabs}
                    defaultTab="general"
                    onChange={value => console.log('Tab :', value)}
                />
            </section>

            {/* ========================================
                DROPDOWN
            ======================================== */}

            <section className="ui-demo-section">
                <h2>Dropdown</h2>

                <Card>
                    <Dropdown
                        trigger={<Button variant="secondary">Options</Button>}
                        items={[
                            {
                                label: 'Voir les détails',
                                onClick: () => console.log('Détails'),
                            },
                            {
                                label: 'Modifier',
                                onClick: () => console.log('Modifier'),
                            },
                            {
                                label: 'Supprimer',
                                danger: true,
                                onClick: () => setConfirmOpen(true),
                            },
                        ]}
                    />
                </Card>
            </section>

            {/* ========================================
                SPINNER
            ======================================== */}

            <section className="ui-demo-section">
                <h2>Spinner</h2>

                <Card>
                    <div className="ui-demo-row ui-demo-center">
                        <Spinner size="sm" />
                        <Spinner size="md" />
                        <Spinner size="lg" />
                    </div>
                </Card>
            </section>

            {/* ========================================
                EMPTY STATE
            ======================================== */}

            <section className="ui-demo-section">
                <h2>Empty State</h2>

                <Card padding="none">
                    <EmptyState
                        title="Aucun client"
                        description="Les clients enregistrés apparaîtront ici."
                        action={<Button>Ajouter un client</Button>}
                    />
                </Card>
            </section>

            {/* ========================================
                ERROR STATE
            ======================================== */}

            <section className="ui-demo-section">
                <h2>Error State</h2>

                <Card padding="none">
                    <ErrorState
                        title="Impossible de charger les clients"
                        description="Une erreur est survenue lors de la récupération des données."
                        action={<Button variant="secondary">Réessayer</Button>}
                    />
                </Card>
            </section>

            {/* ========================================
                MODAL
            ======================================== */}

            <section className="ui-demo-section">
                <h2>Modal</h2>

                <Card>
                    <Button onClick={() => setModalOpen(true)}>Ouvrir la modal</Button>
                </Card>
            </section>

            {/* ========================================
                CONFIRM DIALOG
            ======================================== */}

            <section className="ui-demo-section">
                <h2>Confirm Dialog</h2>

                <Card>
                    <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                        Supprimer
                    </Button>
                </Card>
            </section>

            {/* ========================================
                MODAL
            ======================================== */}

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Nouvelle demande"
                size="md">
                <div className="ui-demo-modal-content">
                    <Input label="Nom du client" name="client" placeholder="Entrez le nom" />

                    <div className="ui-demo-modal-actions">
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                            Annuler
                        </Button>

                        <Button variant="primary" onClick={() => setModalOpen(false)}>
                            Enregistrer
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* ========================================
                CONFIRM DIALOG
            ======================================== */}

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => {
                    console.log('Suppression confirmée')
                    setConfirmOpen(false)
                }}
                title="Supprimer le client ?"
                description="Cette action est irréversible. Le client sera définitivement supprimé."
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
            />
        </main>
    )
}

export default App
