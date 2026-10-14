import Modal from '../../../components/ui/Modal'
import PageSkeleton from '../../../components/ui/PageSkeleton'
import ErrorState from '../../../components/ui/ErrorState'
import Button from '../../../components/ui/Button'
import { useClientById } from '../hooks/useClient'

function formatClientDate(value) {
    const date = value ? new Date(value) : null
    return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('fr-FR') : '—'
}

export function ClientInformation({ client }) {
    return <dl className="client-card-information">
        <dt>Téléphone</dt><dd>{client.phone || '—'}</dd>
        <dt>Inscription</dt><dd>{formatClientDate(client.createdAt)}</dd>
        {client.status === 'blocked' && client.blocked_reason && <><dt>Motif</dt><dd>{client.blocked_reason}</dd></>}
    </dl>
}

function ClientDetailsModal({ id, onClose }) {
    const query = useClientById(id)
    return <Modal open onClose={onClose} title="Détails du client" subtitle={query.data?.name}>
        {query.isPending ? <PageSkeleton /> : query.error ? <ErrorState description={query.error.message} action={<Button onClick={() => query.refetch()} loading={query.isFetching}>Réessayer</Button>} /> : <>
            <ClientInformation client={query.data} />
            <p className="client-detail-status">Statut : {query.data.status === 'active' ? 'Actif' : query.data.status === 'blocked' ? 'Bloqué' : 'Non renseigné'}</p>
        </>}
    </Modal>
}

export default ClientDetailsModal
