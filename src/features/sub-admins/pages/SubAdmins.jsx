import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../../components/ui/PageHeader'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Pagination from '../../../components/ui/Pagination'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import ErrorState from '../../../components/ui/ErrorState'
import EmptyState from '../../../components/ui/EmptyState'
import Skeleton from '../../../components/ui/Skeleton'
import Dropdown from '../../../components/ui/Dropdown'
import { KeyRound, Mail, MoreVertical, Phone, ShieldBan, UserRoundCheck } from 'lucide-react'
import { useAddAdmin } from '../hooks/useAddAdmin'
import AdminFormModal from '../components/AdminFormModal'

const preferenceKey = 'toligo:sub-admins:preferences'
const sorts = [
    { value: 'recent', label: 'Plus récents' },
    { value: 'oldest', label: 'Plus anciens' },
    { value: 'az', label: 'Nom : A à Z' },
    { value: 'za', label: 'Nom : Z à A' },
]
function readPreferences() {
    try {
        const value = JSON.parse(localStorage.getItem(preferenceKey))
        return {
            search: typeof value?.search === 'string' ? value.search : '',
            sort: sorts.some(sort => sort.value === value?.sort) ? value.sort : 'recent',
        }
    } catch {
        return { search: '', sort: 'recent' }
    }
}
const idOf = admin => admin.uuid ?? admin.id
const fold = value =>
    String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('fr')
        .trim()
const dateOf = value => {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}
const roleLabels = {
    superadmin: 'Superadmin',
    operator: 'Opérateur',
    station_manager: 'Gestionnaire de station',
    warehouse_admin: 'Admin entrepôt',
}

function SubAdmins() {
    const admins = useAddAdmin({ all: true })
    const [preferences, setPreferences] = useState(readPreferences)
    const [page, setPage] = useState(1)
    const [selected, setSelected] = useState([])
    const [confirmation, setConfirmation] = useState(null)
    const [formModal, setFormModal] = useState(null)
    const busy =
        admins.isTogglingBlock ||
        admins.isResettingPassword ||
        admins.isDeletingMany ||
        admins.isCreating ||
        admins.isUpdatingRole
    const roles = [
        ...new Set([
            'superadmin',
            ...admins.admins
                .map(admin => admin.role)
                .filter(role => typeof role === 'string' && role),
        ]),
    ].map(value => ({ value, label: roleLabels[value] ?? value }))
    useEffect(() => {
        try {
            localStorage.setItem(preferenceKey, JSON.stringify(preferences))
        } catch {
            /* Le stockage peut être indisponible. */
        }
    }, [preferences])
    const filtered = useMemo(() => {
        const search = fold(preferences.search)
        return admins.admins
            .filter(admin =>
                [admin.name, admin.email, admin.phone].some(value => fold(value).includes(search)),
            )
            .sort((a, b) => {
                if (preferences.sort === 'az' || preferences.sort === 'za')
                    return (
                        String(a.name ?? '').localeCompare(String(b.name ?? ''), 'fr', {
                            sensitivity: 'base',
                        }) * (preferences.sort === 'az' ? 1 : -1)
                    )
                return (
                    (dateOf(a.createdAt) - dateOf(b.createdAt)) *
                    (preferences.sort === 'oldest' ? 1 : -1)
                )
            })
    }, [admins.admins, preferences])
    const totalPages = Math.max(1, Math.ceil(filtered.length / 12))
    const currentPage = Math.min(page, totalPages)
    const visible = filtered.slice((currentPage - 1) * 12, currentPage * 12)
    const validSelection = selected.filter(id => admins.admins.some(admin => idOf(admin) === id))
    const visibleIds = visible.map(idOf).filter(id => id != null)
    const allChecked = visibleIds.length > 0 && visibleIds.every(id => validSelection.includes(id))
    const changePreference = (key, value) => {
        setPreferences(previous => ({ ...previous, [key]: value }))
        setPage(1)
    }
    const toggle = id =>
        setSelected(previous =>
            previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id],
        )
    const confirm = async () => {
        try {
            if (confirmation.action === 'delete') {
                await admins.deleteManyAsync(confirmation.ids)
                setSelected([])
            } else if (confirmation.action === 'reset')
                await admins.resetPasswordAsync(confirmation.id)
            else await admins.toggleBlockAsync({ id: confirmation.id, action: confirmation.action })
            setConfirmation(null)
        } catch (error) {
            if (error.failedIds) {
                setSelected(error.failedIds)
                setConfirmation(null)
            }
        }
    }
    const labels = {
        block: 'Bloquer cet administrateur',
        unblock: 'Débloquer cet administrateur',
        reset: 'Réinitialiser le mot de passe',
        delete: 'Supprimer les administrateurs sélectionnés',
    }
    return (
        <section className="page-scaffold sub-admin-page">
            <PageHeader
                title="Sous-administrateurs"
                description="Gérez les comptes et les accès de votre équipe."
                actions={
                    <Button
                        size="md"
                        disabled={busy}
                        onClick={() => setFormModal({ mode: 'create' })}>
                        Créer un administrateur
                    </Button>
                }
            />
            <div className="sub-admin-toolbar">
                <Input
                    name="admin-search"
                    label="Rechercher"
                    placeholder="Nom, e-mail ou téléphone"
                    value={preferences.search}
                    onChange={event => changePreference('search', event.target.value)}
                />
                <Select
                    name="admin-sort"
                    label="Trier par"
                    value={preferences.sort}
                    options={sorts}
                    onChange={event => changePreference('sort', event.target.value)}
                />
            </div>
            <div className="sub-admin-selection">
                <div>
                    <strong>{filtered.length}</strong> administrateur(s)
                    {preferences.search && ` sur ${admins.admins.length}`} · {validSelection.length}{' '}
                    sélectionné(s)
                </div>
                <div className="sub-admin-actions">
                    <label>
                        <input
                            type="checkbox"
                            checked={allChecked}
                            disabled={busy || !visibleIds.length}
                            onChange={() =>
                                setSelected(previous =>
                                    allChecked
                                        ? previous.filter(id => !visibleIds.includes(id))
                                        : [...new Set([...previous, ...visibleIds])],
                                )
                            }
                        />{' '}
                        Sélectionner cette page
                    </label>
                    <Button
                        variant="danger"
                        size="sm"
                        disabled={busy || !validSelection.length}
                        onClick={() => setConfirmation({ action: 'delete', ids: validSelection })}>
                        Supprimer ({validSelection.length})
                    </Button>
                </div>
            </div>
            {admins.error ? (
                <ErrorState
                    description={admins.error.message}
                    action={
                        <Button onClick={() => admins.refetch()} loading={admins.isFetching}>
                            Réessayer
                        </Button>
                    }
                />
            ) : admins.isLoading ? (
                <div
                    className="sub-admin-grid"
                    aria-label="Chargement des administrateurs"
                    aria-busy="true">
                    {Array.from({ length: 12 }, (_, index) => (
                        <div className="sub-admin-card" key={index}>
                            <Skeleton height={40} />
                            <Skeleton height={20} />
                            <Skeleton height={20} />
                            <Skeleton height={50} />
                        </div>
                    ))}
                </div>
            ) : !filtered.length ? (
                <EmptyState
                    title={preferences.search ? 'Aucun résultat' : 'Aucun administrateur'}
                    description={
                        preferences.search
                            ? 'Essayez un autre nom, e-mail ou téléphone.'
                            : 'Les administrateurs apparaîtront ici.'
                    }
                />
            ) : (
                <div className="sub-admin-grid">
                    {visible.map((admin, index) => {
                        const id = idOf(admin)
                        const blocked = admin.status === 'blocked'
                        const active = admin.status === 'active'
                        const station =
                            admin.station?.nom ?? admin.station?.name ?? admin.station_name
                        const role = roleLabels[admin.role] ?? admin.role ?? 'Rôle non renseigné'
                        return (
                            <article
                                className={`sub-admin-card${validSelection.includes(id) ? ' is-selected' : ''}`}
                                key={id ?? index}>
                                <div className="sub-admin-card-heading">
                                    <input
                                        type="checkbox"
                                        aria-label={`Sélectionner ${admin.name ?? admin.email ?? 'cet administrateur'}`}
                                        checked={validSelection.includes(id)}
                                        disabled={busy || id == null}
                                        onChange={() => toggle(id)}
                                    />
                                    <div className="sub-admin-avatar" aria-hidden="true">
                                        {(admin.name ?? admin.email ?? '?')
                                            .split(' ')
                                            .filter(Boolean)
                                            .slice(0, 2)
                                            .map(part => part[0])
                                            .join('')
                                            .toUpperCase()}
                                    </div>
                                    <div className="sub-admin-card-identity">
                                        <h2>{admin.name || 'Administrateur'}</h2>
                                        <span>{[role, station].filter(Boolean).join(' · ')}</span>
                                    </div>
                                    <Dropdown
                                        trigger={open => (
                                            <button
                                                type="button"
                                                className="sub-admin-card-menu"
                                                aria-label={`Actions de ${admin.name ?? admin.email ?? 'cet administrateur'}`}
                                                aria-expanded={open}>
                                                <MoreVertical size={21} aria-hidden="true" />
                                            </button>
                                        )}
                                        items={[
                                            ...(blocked || active
                                                ? [
                                                      {
                                                          label: blocked ? 'Débloquer' : 'Bloquer',
                                                          icon: blocked ? (
                                                              <UserRoundCheck size={16} />
                                                          ) : (
                                                              <ShieldBan size={16} />
                                                          ),
                                                          disabled: busy || id == null,
                                                          onClick: () =>
                                                              setConfirmation({
                                                                  action: blocked
                                                                      ? 'unblock'
                                                                      : 'block',
                                                                  id,
                                                                  name: admin.name ?? admin.email,
                                                              }),
                                                      },
                                                  ]
                                                : []),
                                            {
                                                label: 'Réinitialiser le mot de passe',
                                                icon: <KeyRound size={16} />,
                                                disabled: busy || id == null,
                                                onClick: () =>
                                                    setConfirmation({
                                                        action: 'reset',
                                                        id,
                                                        name: admin.name ?? admin.email,
                                                    }),
                                            },
                                        ]}
                                    />
                                </div>
                                <dl className="sub-admin-contact">
                                    <div>
                                        <Mail size={16} aria-hidden="true" />
                                        <dt className="sr-only">E-mail</dt>
                                        <dd>{admin.email || '—'}</dd>
                                    </div>
                                    <div>
                                        <Phone size={16} aria-hidden="true" />
                                        <dt className="sr-only">Téléphone</dt>
                                        <dd>{admin.phone || '—'}</dd>
                                    </div>
                                </dl>
                                <div className="sub-admin-card-footer">
                                    <div className="sub-admin-card-meta">
                                        <span
                                            className={`sub-admin-status${active ? ' is-active' : blocked ? ' is-blocked' : ''}`}>
                                            <span />
                                            {active
                                                ? 'Actif'
                                                : blocked
                                                  ? 'Bloqué'
                                                  : 'Statut non renseigné'}
                                        </span>
                                        <span>
                                            Ajouté le{' '}
                                            {admin.createdAt && dateOf(admin.createdAt)
                                                ? new Date(admin.createdAt).toLocaleDateString(
                                                      'fr-FR',
                                                  )
                                                : '—'}
                                        </span>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="md"
                                        disabled={busy || id == null}
                                        onClick={() => setFormModal({ mode: 'role', admin })}>
                                        Modifier le rôle
                                    </Button>
                                </div>
                            </article>
                        )
                    })}
                </div>
            )}
            {!admins.error && !admins.isLoading && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            )}
            {formModal && (
                <AdminFormModal
                    admin={formModal.admin}
                    roles={roles}
                    loading={admins.isCreating || admins.isUpdatingRole}
                    onClose={() => setFormModal(null)}
                    onSubmit={payload =>
                        formModal.mode === 'create'
                            ? admins.createAdminAsync(payload)
                            : admins.updateRoleAsync({
                                  id: idOf(formModal.admin),
                                  roleData: payload,
                              })
                    }
                />
            )}
            <ConfirmDialog
                open={Boolean(confirmation)}
                title={labels[confirmation?.action]}
                description={
                    confirmation?.action === 'delete'
                        ? `Supprimer définitivement ${confirmation.ids.length} administrateur(s) ? Cette action est irréversible.`
                        : `Confirmer cette action pour ${confirmation?.name ?? 'cet administrateur'} ?`
                }
                loading={busy}
                onClose={() => {
                    if (!busy) setConfirmation(null)
                }}
                onConfirm={confirm}
            />
        </section>
    )
}

export default SubAdmins
