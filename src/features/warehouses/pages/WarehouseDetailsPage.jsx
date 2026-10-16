import { useState } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import {
    Building2,
    Copy,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    Pencil,
    RotateCcw,
    UsersRound,
} from 'lucide-react'
import toast from 'react-hot-toast'

import Button from '../../../components/ui/Button'
import ErrorState from '../../../components/ui/ErrorState'
import PageSkeleton from '../../../components/ui/PageSkeleton'
import Skeleton from '../../../components/ui/Skeleton'
import { notifyError } from '../../../lib/notifications'
import { useAuth } from '../../auth/hooks/useAuth'
import WarehouseFormModal from '../components/WarehouseFormModal'
import WarehouseDetailsMap from '../components/WarehouseDetailsMap'
import { useBoxes } from '../hooks/useBoxes'
import { useTtlockCredentials, useTtlockResetPassword } from '../hooks/useTtlock'
import { useUpdateWarehouse, useWarehouse } from '../hooks/useWarehouses'
import { getAssignedAdmins } from '../utils/adminUuid'

function DetailField({ label, children }) {
    return (
        <div className="warehouse-detail-field">
            <dt>{label}</dt>
            <dd>{children ?? 'Non renseigné'}</dd>
        </div>
    )
}

function formatDate(value) {
    if (!value) return 'Non renseignée'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'Non renseignée'
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'Africa/Abidjan',
    }).format(date)
}

function TtlockDetails({ id }) {
    const [visible, setVisible] = useState(false)
    const [requested, setRequested] = useState(false)
    const { role } = useAuth()
    const query = useTtlockCredentials(id, { enabled: requested })
    const reset = useTtlockResetPassword()
    const credentials = query.credentials
    const username = credentials?.ttlock_username
    const password = credentials?.ttlock_password

    const copy = async value => {
        try {
            await navigator.clipboard.writeText(value)
            toast.success('Identifiant copié.')
        } catch {
            notifyError(new Error('Impossible de copier cet identifiant.'))
        }
    }

    const resetPassword = async () => {
        if (role !== 'superadmin') return
        setVisible(false)
        try {
            await reset.resetPasswordAsync(id)
        } catch (error) {
            notifyError(error)
        }
    }

    return (
        <section className="warehouse-overview-card warehouse-ttlock-card">
            <div className="warehouse-overview-card-heading">
                <div>
                    <h2><LockKeyhole size={18} aria-hidden="true" />Accès TTLock</h2>
                    <p>Compte utilisé pour piloter les serrures de cet entrepôt.</p>
                </div>
                {requested && credentials && (
                    <Button variant="secondary" size="sm" onClick={() => setVisible(value => !value)} disabled={query.isLoading || reset.isResetting} aria-pressed={visible}>
                        {visible ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
                        {visible ? 'Masquer' : 'Afficher'}
                    </Button>
                )}
            </div>

            <div className="warehouse-overview-card-body">
                {!requested ? (
                    <Button variant="secondary" onClick={() => setRequested(true)}>Charger les identifiants</Button>
                ) : query.isLoading ? (
                    <p role="status">Chargement des identifiants…</p>
                ) : query.isError ? (
                    <div role="alert">{query.error.message} <Button variant="secondary" size="sm" onClick={() => query.refetch()}>Réessayer</Button></div>
                ) : !credentials ? (
                    <p>Aucun compte TTLock disponible pour cet entrepôt.</p>
                ) : (
                    <>
                        <dl className="warehouse-detail-fields warehouse-detail-kv">
                            <DetailField label="Identifiant">
                                {username == null ? 'Non renseigné' : (
                                    <span className="ttlock-credential-value">
                                        <span>{visible ? username : '••••••••••••'}</span>
                                        <Button size="sm" variant="link" aria-label="Copier le nom d’utilisateur" title="Copier le nom d’utilisateur" onClick={() => copy(username)}><Copy size={16} aria-hidden="true" /></Button>
                                    </span>
                                )}
                            </DetailField>
                            <DetailField label="Mot de passe">
                                {password == null ? 'Non renseigné' : (
                                    <span className="ttlock-credential-value">
                                        <span>{visible ? password : '••••••••••••'}</span>
                                        <Button size="sm" variant="link" aria-label="Copier le mot de passe" title="Copier le mot de passe" onClick={() => copy(password)}><Copy size={16} aria-hidden="true" /></Button>
                                    </span>
                                )}
                            </DetailField>
                        </dl>
                        {role === 'superadmin' && (
                            <Button className="warehouse-ttlock-reset" variant="secondary" onClick={resetPassword} loading={reset.isResetting}>
                                <RotateCcw size={15} aria-hidden="true" />Réinitialiser le mot de passe
                            </Button>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}

export default function WarehouseDetailsPage() {
    const { id } = useParams()
    const [editing, setEditing] = useState(false)
    const update = useUpdateWarehouse()
    const query = useWarehouse(id)
    const boxesQuery = useBoxes(id)

    if (query.isLoading) return <PageSkeleton />
    if (query.isError) return <ErrorState title="Impossible de charger l'entrepôt" description={query.error.message} action={<Button onClick={() => query.refetch()}>Réessayer</Button>} />

    const warehouse = query.data?.data
    if (!warehouse) return <ErrorState title="Entrepôt introuvable" />

    const name = warehouse.nom ?? warehouse.name ?? 'Entrepôt'
    const locality = warehouse.commune?.nom ?? warehouse.locality?.name ?? (typeof warehouse.locality === 'string' ? warehouse.locality : null)
    const city = warehouse.commune?.ville?.nom ?? warehouse.ville?.nom
    const address = warehouse.adresse ?? warehouse.address
    const boxes = boxesQuery.data ?? []
    const normalizeStatus = box => String(box.statut ?? box.status ?? '').toLocaleLowerCase('fr')
    const freeBoxes = boxes.filter(box => normalizeStatus(box) === 'libre').length
    const unavailableStatuses = ['occupée', 'occupee', 'occupé', 'occupe', 'réservée', 'reservee', 'réservé', 'reserve']
    const unavailableBoxes = boxes.filter(box => unavailableStatuses.includes(normalizeStatus(box))).length
    const admins = getAssignedAdmins(warehouse)
    const adminName = admin => admin.nom_complet ?? admin.name ?? admin.nom ?? 'Administrateur'
    const boxStat = value => boxesQuery.isPending ? <Skeleton width={42} height={28} /> : boxesQuery.isError ? '—' : value

    return (
        <div className="warehouse-details-page">
            <header className="warehouse-details-page-header">
                <div className="warehouse-details-heading">
                    <div className="warehouse-details-breadcrumb">
                        <Link to="/warehouses">Entrepôts</Link><span>/</span><span>{name}</span>
                    </div>
                    <h1>{name}</h1>
                    <p>{[locality, address].filter(Boolean).join(' · ') || 'Informations de l’entrepôt'}</p>
                </div>
                <Button variant="secondary" size="md" onClick={() => setEditing(true)}><Pencil size={16} aria-hidden="true" />Modifier</Button>
            </header>

            <section className="warehouse-detail-shell">
                <nav className="warehouse-detail-tabs" aria-label="Gestion de l’entrepôt">
                    <NavLink end to={`/warehouses/${id}`}>Aperçu</NavLink>
                    <NavLink to={`/warehouses/${id}/boxes`}>Caisses ({boxesQuery.isPending ? '…' : boxes.length})</NavLink>
                    <NavLink to={`/warehouses/${id}/admins`}>Administrateurs ({admins.length})</NavLink>
                </nav>

                <div className="warehouse-detail-content">
                    <div className="warehouse-detail-kpis" aria-label="Statistiques de l’entrepôt">
                        <article><span>Caisses</span><strong>{boxStat(boxes.length)}</strong></article>
                        <article><span>Libres</span><strong>{boxStat(freeBoxes)}</strong></article>
                        <article><span>Occupées ou réservées</span><strong>{boxStat(unavailableBoxes)}</strong></article>
                        <article><span>Administrateurs</span><strong>{admins.length}</strong></article>
                    </div>

                    {boxesQuery.isError && (
                        <div className="warehouse-detail-inline-error" role="alert">
                            Statistiques des caisses indisponibles. <Button variant="link" onClick={() => boxesQuery.refetch()}>Réessayer</Button>
                        </div>
                    )}

                    <div className="warehouse-detail-grid">
                        <section className="warehouse-overview-card">
                            <div className="warehouse-overview-card-heading"><h2>Informations</h2></div>
                            <div className="warehouse-overview-card-body">
                                <dl className="warehouse-detail-fields warehouse-detail-kv">
                                    <DetailField label="Nom">{name}</DetailField>
                                    <DetailField label="Commune">{[locality, city].filter(Boolean).join(' · ') || 'Non renseignée'}</DetailField>
                                    <DetailField label="Adresse">{address}</DetailField>
                                    <DetailField label="Description">{warehouse.description || 'Aucune description'}</DetailField>
                                    <DetailField label="Création">{formatDate(warehouse.created_at ?? warehouse.createdAt)}</DetailField>
                                    <DetailField label="Modification">{formatDate(warehouse.updated_at ?? warehouse.updatedAt)}</DetailField>
                                </dl>
                            </div>
                        </section>

                        <section className="warehouse-overview-card warehouse-location-card">
                            <div className="warehouse-overview-card-heading"><h2>Localisation</h2></div>
                            <WarehouseDetailsMap warehouse={warehouse} />
                            <div className="warehouse-location-caption">
                                <Building2 size={17} aria-hidden="true" />
                                <div><strong>{[locality, city].filter(Boolean).join(' · ') || 'Localité non renseignée'}</strong><span>{address || 'Adresse non renseignée'}</span></div>
                            </div>
                        </section>

                        <TtlockDetails key={id} id={id} />

                        <section className="warehouse-overview-card warehouse-admins-card">
                            <div className="warehouse-overview-card-heading">
                                <h2>Administrateurs affectés</h2>
                                <Link className="btn btn-secondary btn-sm" to={`/warehouses/${id}/admins`}>Gérer</Link>
                            </div>
                            <div className="warehouse-admins-list">
                                {admins.length ? admins.map((admin, index) => {
                                    const fullName = adminName(admin)
                                    return (
                                        <div className="warehouse-admin-row" key={admin.uuid ?? admin.id ?? index}>
                                            <span className="warehouse-admin-avatar">{fullName.slice(0, 1).toLocaleUpperCase('fr')}</span>
                                            <div><strong>{fullName}</strong><span><Mail size={13} aria-hidden="true" />{admin.email ?? 'E-mail non renseigné'}</span></div>
                                        </div>
                                    )
                                }) : (
                                    <div className="warehouse-admins-empty"><UsersRound size={28} aria-hidden="true" /><p>Aucun administrateur affecté.</p><Link to={`/warehouses/${id}/admins`}>Affecter un administrateur</Link></div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </section>

            {editing && (
                <WarehouseFormModal
                    open
                    warehouse={warehouse}
                    loading={update.isPending}
                    onClose={() => { if (!update.isPending) setEditing(false) }}
                    onSubmit={async data => {
                        await update.mutateAsync({ id, data })
                        setEditing(false)
                    }}
                />
            )}
        </div>
    )
}
