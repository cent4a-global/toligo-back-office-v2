import { useMemo, useState } from 'react'
import { Mail, Search, UserMinus, UserPlus, UsersRound } from 'lucide-react'
import { useParams } from 'react-router-dom'

import Button from '../../../components/ui/Button'
import { useInternalUsers } from '../../users/hooks/useUsers'
import WarehouseManagementLayout from '../components/WarehouseManagementLayout'
import { useAssignWarehouseAdmins } from '../hooks/useWarehouses'
import { getAdminUuid, getAssignedAdmins, getAssignedAdminUuids } from '../utils/adminUuid'

const normalize = value =>
    String(value ?? '')
        .toLocaleLowerCase('fr')
        .trim()
const nameOf = admin => admin?.nom_complet ?? admin?.name ?? admin?.nom ?? 'Administrateur'

function AdminRow({ admin, action, actionLabel, actionIcon, actionVariant = 'secondary' }) {
    const name = nameOf(admin)
    return (
        <div className="warehouse-admin-management-row">
            <span className="warehouse-admin-avatar" aria-hidden="true">
                {name.slice(0, 1).toLocaleUpperCase('fr')}
            </span>
            <div className="warehouse-admin-management-identity">
                <strong>{name}</strong>
                <span>
                    <Mail size={13} aria-hidden="true" />
                    {admin?.email ?? 'E-mail non renseigné'}
                </span>
            </div>
            <Button size="sm" variant={actionVariant} onClick={action}>
                {actionIcon}
                {actionLabel}
            </Button>
        </div>
    )
}

function WarehouseAdminsContent({ warehouse, warehouseId }) {
    const mutation = useAssignWarehouseAdmins()
    const query = useInternalUsers({ page: 1, perPage: 100 })
    const [search, setSearch] = useState('')
    const initialIds = getAssignedAdminUuids(warehouse)
    const [selectedIds, setSelectedIds] = useState(() => initialIds)
    const initialKey = [...initialIds].sort().join(',')
    const selectedKey = [...selectedIds].sort().join(',')
    const hasChanges = initialKey !== selectedKey

    const allAdmins = useMemo(() => query.data?.items ?? [], [query.data?.items])
    const knownAdmins = useMemo(() => {
        const entries = [...getAssignedAdmins(warehouse), ...allAdmins]
        return new Map(entries.map(admin => [getAdminUuid(admin), admin]).filter(([uuid]) => uuid))
    }, [warehouse, allAdmins])

    const assigned = selectedIds.map(
        uuid => knownAdmins.get(uuid) ?? { uuid, name: 'Administrateur' },
    )
    const available = allAdmins.filter(admin => {
        const uuid = getAdminUuid(admin)
        if (!uuid || selectedIds.includes(uuid)) return false
        const queryValue = normalize(search)
        return (
            !queryValue || normalize(`${nameOf(admin)} ${admin.email ?? ''}`).includes(queryValue)
        )
    })

    const assign = admin => {
        const uuid = getAdminUuid(admin)
        if (uuid) setSelectedIds(previous => [...new Set([...previous, uuid])])
    }
    const remove = admin => {
        const uuid = getAdminUuid(admin)
        if (uuid) setSelectedIds(previous => previous.filter(value => value !== uuid))
    }
    const save = async () => {
        if (!hasChanges || mutation.isPending) return
        await mutation.mutateAsync({ id: warehouseId, adminIds: selectedIds })
    }

    return (
        <>
            <div className="warehouse-admin-management-grid">
                <section className="warehouse-admin-management-card">
                    <div className="warehouse-admin-management-heading">
                        <h2>Affectés ({assigned.length})</h2>
                    </div>
                    <div className="warehouse-admin-management-list">
                        {assigned.length ? (
                            assigned.map((admin, index) => (
                                <AdminRow
                                    key={getAdminUuid(admin) ?? index}
                                    admin={admin}
                                    action={() => remove(admin)}
                                    actionLabel="Retirer"
                                    actionIcon={<UserMinus size={14} aria-hidden="true" />}
                                    actionVariant="danger"
                                />
                            ))
                        ) : (
                            <div className="warehouse-admin-management-empty">
                                <UsersRound size={28} aria-hidden="true" />
                                <p>
                                    Aucun administrateur affecté. Choisissez-en un dans la liste des
                                    disponibles.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="warehouse-admin-management-card">
                    <div className="warehouse-admin-management-heading">
                        <h2>Disponibles</h2>
                    </div>
                    <label className="warehouse-admin-management-search">
                        <Search size={18} aria-hidden="true" />
                        <input
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                            placeholder="Rechercher un administrateur"
                        />
                    </label>
                    <div className="warehouse-admin-management-list">
                        {query.isPending ? (
                            <p className="warehouse-admin-management-message" role="status">
                                Chargement des administrateurs…
                            </p>
                        ) : query.isError ? (
                            <div className="warehouse-admin-management-message" role="alert">
                                {query.error.message}{' '}
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => query.refetch()}>
                                    Réessayer
                                </Button>
                            </div>
                        ) : available.length ? (
                            available.map((admin, index) => (
                                <AdminRow
                                    key={getAdminUuid(admin) ?? admin.id ?? index}
                                    admin={admin}
                                    action={() => assign(admin)}
                                    actionLabel="Affecter"
                                    actionIcon={<UserPlus size={14} aria-hidden="true" />}
                                    actionVariant="primary"
                                />
                            ))
                        ) : (
                            <p className="warehouse-admin-management-message">
                                {search
                                    ? 'Aucun administrateur ne correspond à votre recherche.'
                                    : 'Tous les administrateurs chargés sont déjà affectés.'}
                            </p>
                        )}
                    </div>
                </section>
            </div>

            <div className="warehouse-admin-savebar">
                <span>
                    {hasChanges
                        ? 'Modifications non enregistrées.'
                        : 'Aucune modification en attente.'}
                </span>
                <Button
                    variant="secondary"
                    disabled={!hasChanges || mutation.isPending}
                    onClick={() => setSelectedIds(initialIds)}>
                    Annuler les changements
                </Button>
                <Button disabled={!hasChanges} loading={mutation.isPending} onClick={save}>
                    Enregistrer
                </Button>
            </div>
        </>
    )
}

export default function WarehouseAdminsPage() {
    const { id } = useParams()
    return (
        <WarehouseManagementLayout>
            {warehouse => (
                <WarehouseAdminsContent key={warehouse.id} warehouse={warehouse} warehouseId={id} />
            )}
        </WarehouseManagementLayout>
    )
}
