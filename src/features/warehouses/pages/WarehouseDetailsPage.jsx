import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Warehouse, Building2, MapPin, FileText, CalendarDays, Clock3, KeyRound, Eye, EyeOff, RotateCcw, ArrowLeft, Pencil, Copy } from 'lucide-react'
import Button from '../../../components/ui/Button'
import PageSkeleton from '../../../components/ui/PageSkeleton'
import ErrorState from '../../../components/ui/ErrorState'
import WarehouseFormModal from '../components/WarehouseFormModal'
import { useWarehouse, useUpdateWarehouse } from '../hooks/useWarehouses'
import { useTtlockCredentials, useTtlockResetPassword } from '../hooks/useTtlock'
import { notifyError } from '../../../lib/notifications'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'

function DetailField({ icon: Icon, label, children }) {
    return <div className="warehouse-detail-field"><Icon size={18} aria-hidden="true" /><div><dt>{label}</dt><dd>{children ?? 'Non renseigné'}</dd></div></div>
}

function formatDate(value) {
    if (!value) return 'Non renseignée'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'Non renseignée'
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Africa/Abidjan' }).format(date)
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
        try { await navigator.clipboard.writeText(value); toast.success('Identifiant copié.') }
        catch { notifyError(new Error('Impossible de copier cet identifiant.')) }
    }
    const resetPassword = async () => {
        if (role !== 'superadmin') return
        setVisible(false)
        try { await reset.resetPasswordAsync(id) } catch (error) { notifyError(error) }
    }
    return (
        <section className="warehouse-detail-section">
            <div className="warehouse-detail-section-heading"><h2>Identifiants TTLock</h2>
                <div className="warehouse-detail-actions">
                    {role === 'superadmin' && <Button variant="secondary" onClick={resetPassword} loading={reset.isResetting}><RotateCcw size={15} aria-hidden="true" />Réinitialiser</Button>}
                    <Button variant="secondary" onClick={() => setVisible(value => !value)} disabled={query.isLoading || query.isError || !credentials || reset.isResetting} aria-pressed={visible}>
                        {visible ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}{visible ? 'Masquer' : 'Afficher'}
                    </Button>
                </div>
            </div>
            <div className="warehouse-detail-panel">
                {!requested ? <Button variant="secondary" onClick={() => setRequested(true)}>Charger les identifiants</Button> : query.isLoading ? <p role="status">Chargement des identifiants...</p> : query.isError ? (
                    <div role="alert">{query.error.message} <Button variant="secondary" onClick={() => query.refetch()}>Réessayer</Button></div>
                ) : !credentials ? <p>Aucun compte TTLock disponible pour cet entrepôt.</p> : (
                    <dl className="warehouse-detail-fields">
                        <DetailField icon={KeyRound} label="Nom d'utilisateur">{username == null ? 'Non renseigné' : <span className="ttlock-credential-value"><span>{visible ? username : '••••••••'}</span><Button size="sm" variant="link" aria-label="Copier le nom d’utilisateur" title="Copier le nom d’utilisateur" onClick={() => copy(username)}><Copy size={16} aria-hidden="true" /></Button></span>}</DetailField>
                        <DetailField icon={KeyRound} label="Mot de passe">{password == null ? 'Non renseigné' : <span className="ttlock-credential-value"><span>{visible ? password : '••••••••'}</span><Button size="sm" variant="link" aria-label="Copier le mot de passe" title="Copier le mot de passe" onClick={() => copy(password)}><Copy size={16} aria-hidden="true" /></Button></span>}</DetailField>
                    </dl>
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
    if (query.isLoading) return <PageSkeleton />
    if (query.isError) return <ErrorState title="Impossible de charger l'entrepôt" description={query.error.message} action={<Button onClick={() => query.refetch()}>Réessayer</Button>} />
    const warehouse = query.data?.data
    if (!warehouse) return <ErrorState title="Entrepôt introuvable" />
    const locality = warehouse.commune?.nom ?? warehouse.locality?.name ?? (typeof warehouse.locality === 'string' ? warehouse.locality : null)
    const city = warehouse.commune?.ville?.nom ?? warehouse.ville?.nom
    /* Section Coordonnées géographiques masquée.
    const latitude = warehouse.latitude
    const longitude = warehouse.longitude
    const hasCoordinates = latitude != null && longitude != null && String(latitude).trim() !== '' && String(longitude).trim() !== ''
        && Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude))
        && Math.abs(Number(latitude)) <= 90 && Math.abs(Number(longitude)) <= 180
    */
    return (
        <div className="warehouse-details-page">
            <header className="warehouse-details-page-header">
                <Link to="/warehouses" className="warehouse-back"><ArrowLeft size={18} aria-hidden="true" />Entrepôts</Link>
                <Button variant="secondary" onClick={() => setEditing(true)}><Pencil size={15} aria-hidden="true" />Modifier</Button>
            </header>
            <article className="warehouse-detail-sheet">
                <div className="warehouse-detail-sheet-header"><span><Warehouse size={22} aria-hidden="true" /></span><div><h1>Détails de l'entrepôt</h1><p>Informations complètes</p></div></div>
                <div className="warehouse-detail-content">
                    <div className="warehouse-detail-identity"><span><Warehouse size={32} strokeWidth={1.6} aria-hidden="true" /></span><h2>{warehouse.nom ?? warehouse.name}</h2>{warehouse.code && <p>{warehouse.code}</p>}</div>
                    <section className="warehouse-detail-section"><h2>Informations générales</h2><dl className="warehouse-detail-panel warehouse-detail-fields">
                        <DetailField icon={Building2} label="Commune / Ville">{[locality, city].filter(Boolean).join(' - ') || 'Non renseignée'}</DetailField>
                        <DetailField icon={MapPin} label="Adresse">{warehouse.adresse ?? warehouse.address}</DetailField>
                        <DetailField icon={FileText} label="Description">{warehouse.description || 'Aucune description'}</DetailField>
                    </dl></section>
                    {/* <section className="warehouse-detail-section"><h2>Coordonnées géographiques</h2><div className="warehouse-detail-panel">
                        <dl className="warehouse-detail-coordinates"><div><dt>Latitude</dt><dd>{latitude ?? 'Non renseignée'}</dd></div><div><dt>Longitude</dt><dd>{longitude ?? 'Non renseignée'}</dd></div></dl>
                        {hasCoordinates && <a className="warehouse-detail-map-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${latitude},${longitude}`)}`} target="_blank" rel="noopener noreferrer"><Navigation size={17} aria-hidden="true" />Voir sur Google Maps</a>}
                    </div></section> */}
                    <section className="warehouse-detail-section"><h2>Système d'information</h2><dl className="warehouse-detail-panel warehouse-detail-fields">
                        <DetailField icon={CalendarDays} label="Date de création">{formatDate(warehouse.created_at ?? warehouse.createdAt)}</DetailField>
                        <DetailField icon={Clock3} label="Dernière modification">{formatDate(warehouse.updated_at ?? warehouse.updatedAt)}</DetailField>
                    </dl></section>
                    <TtlockDetails key={id} id={id} />
                </div>
            </article>
            {editing && <WarehouseFormModal open warehouse={warehouse} loading={update.isPending} onClose={() => { if (!update.isPending) setEditing(false) }}
                onSubmit={async data => { await update.mutateAsync({ id, data }); setEditing(false) }} />}
        </div>
    )
}
