import { useState } from 'react'
import PageHeader from '../../../components/ui/PageHeader'
import Card from '../../../components/ui/Card'
import UsersTabs from '../components/UsersTabs'
import InternalUsersTable from '../components/InternalUsersTable'
import DriversTable from '../components/DriversTable'
import ClientsTable from '../components/ClientsTable'
import CompaniesTable from '../components/CompaniesTable'
import RolePermissionsTable from '../components/RolePermissionsTable'
import ErrorState from '../../../components/ui/ErrorState'
import EmptyState from '../../../components/ui/EmptyState'
import Button from '../../../components/ui/Button'
import Pagination from '../../../components/ui/Pagination'
import { useInternalUsers, useDrivers, useClients, useCompanies } from '../hooks/useUsers'
import { DRIVERS_ENDPOINT } from '../api/drivers.api'
import { COMPANIES_ENDPOINT } from '../api/companies.api'

function UsersRolesPage({
    permissions = [],
    onEditUser,
    onReactivateUser,
    onViewDriver,
    onViewClient,
    onViewCompany,
    onEditPermissions,
}) {
    const [activeTab, setActiveTab] = useState('internal')
    const [pages, setPages] = useState({ internal: 1, drivers: 1, clients: 1, companies: 1 })
    const internalQuery = useInternalUsers({
        enabled: activeTab === 'internal',
        page: pages.internal,
    })
    const driversQuery = useDrivers({ enabled: activeTab === 'drivers', page: pages.drivers })
    const clientsQuery = useClients({ enabled: activeTab === 'clients', page: pages.clients })
    const companiesQuery = useCompanies({
        enabled: activeTab === 'companies',
        page: pages.companies,
    })
    const queries = {
        internal: internalQuery,
        drivers: driversQuery,
        clients: clientsQuery,
        companies: companiesQuery,
    }
    const query = queries[activeTab]
    const counts = Object.fromEntries(
        Object.entries(queries).map(([key, value]) => [key, value.data?.total]),
    )
    const rows = query.data?.items ?? []
    const unavailable =
        (activeTab === 'drivers' && !DRIVERS_ENDPOINT) ||
        (activeTab === 'companies' && !COMPANIES_ENDPOINT)
    const loading = query.isPending

    return (
        <section className="page-scaffold">
            <PageHeader
                title="Utilisateurs et rôles"
                description="Consultez les utilisateurs et les droits de votre réseau."
            />
            <UsersTabs activeTab={activeTab} onChange={setActiveTab} counts={counts} />
            <Card>
                {unavailable ? (
                    <EmptyState
                        title="Données indisponibles"
                        description="Cet onglet sera disponible une fois sa connexion configurée."
                    />
                ) : query.error ? (
                    <ErrorState
                        description={query.error.message}
                        action={
                            <Button onClick={() => query.refetch()} loading={query.isFetching}>
                                Réessayer
                            </Button>
                        }
                    />
                ) : (
                    <>
                        {activeTab === 'internal' && (
                            <InternalUsersTable
                                users={rows}
                                loading={loading}
                                onEdit={onEditUser}
                                onReactivate={onReactivateUser}
                            />
                        )}
                        {activeTab === 'drivers' && (
                            <DriversTable drivers={rows} loading={loading} onView={onViewDriver} />
                        )}
                        {activeTab === 'clients' && (
                            <ClientsTable clients={rows} loading={loading} onView={onViewClient} />
                        )}
                        {activeTab === 'companies' && (
                            <CompaniesTable
                                companies={rows}
                                loading={loading}
                                onView={onViewCompany}
                            />
                        )}
                        {!loading && (
                            <Pagination
                                currentPage={query.data?.currentPage ?? pages[activeTab]}
                                totalPages={query.data?.totalPages ?? 1}
                                onPageChange={page =>
                                    setPages(previous => ({ ...previous, [activeTab]: page }))
                                }
                            />
                        )}
                    </>
                )}
            </Card>
            <RolePermissionsTable permissions={permissions} onEdit={onEditPermissions} />
        </section>
    )
}

export default UsersRolesPage
