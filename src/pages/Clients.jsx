import { useMemo, useState } from 'react'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Modal from '../components/ui/Modal'
import Pagination from '../components/ui/Pagination'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'
import Skeleton from '../components/ui/Skeleton'
import { ClientInformation } from '../features/clients/components/ClientDetailsModal'
import { useClients } from '../features/clients/hooks/useClient'

const sortOptions = [{ value: 'recent', label: 'Plus récents' }, { value: 'oldest', label: 'Plus anciens' }, { value: 'az', label: 'Nom : A à Z' }, { value: 'za', label: 'Nom : Z à A' }]
const normalizeSearch = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr').replace(/[\s().-]/g, '')

function Clients() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('recent')
    const [action, setAction] = useState(null)
    const [motif, setMotif] = useState('')
    const [actionError, setActionError] = useState('')
    const clients = useClients({ all: true })
    const filtered = useMemo(() => {
        const needle = normalizeSearch(search)
        return clients.clients.filter(client => [client.name, client.phone].some(value => normalizeSearch(value).includes(needle))).sort((a, b) => {
            if (sort === 'az' || sort === 'za') return String(a.name ?? '').localeCompare(String(b.name ?? ''), 'fr', { sensitivity: 'base' }) * (sort === 'az' ? 1 : -1)
            return ((Date.parse(a.createdAt) || 0) - (Date.parse(b.createdAt) || 0)) * (sort === 'oldest' ? 1 : -1)
        })
    }, [clients.clients, search, sort])
    const totalPages = Math.max(1, Math.ceil(filtered.length / 12))
    const currentPage = Math.min(page, totalPages)
    const visible = filtered.slice((currentPage - 1) * 12, currentPage * 12)
    const busy = clients.isBlocking || clients.isUnblocking
    const close = () => { if (!busy) { setAction(null); setMotif(''); setActionError('') } }
    const submit = async event => {
        event.preventDefault()
        try {
            if (action.type === 'block') {
                if (!motif.trim()) { setActionError('Indiquez le motif du blocage.'); return }
                await clients.blockClientAsync({ id: action.id, motif: motif.trim() })
            } else await clients.unblockClientAsync(action.id)
            setAction(null); setMotif(''); setActionError('')
        } catch (error) { setActionError(error.message) }
    }
    return <section className="page-scaffold client-page">
        <PageHeader title="Clients" description="Consultez les clients et gérez leurs accès." />
        <div className="client-toolbar">
            <Input name="client-search" label="Rechercher" placeholder="Nom ou téléphone" value={search} onChange={event => { setSearch(event.target.value); setPage(1) }} />
            <Select name="client-sort" label="Trier par" value={sort} options={sortOptions} onChange={event => { setSort(event.target.value); setPage(1) }} />
        </div>
        {!clients.isLoading && !clients.error && <p className="client-counter"><strong>{filtered.length}</strong> client(s){search && ` sur ${clients.clients.length}`}</p>}
        {clients.error ? <ErrorState description={clients.error.message} action={<Button onClick={() => clients.refetch()} loading={clients.isFetching}>Réessayer</Button>} /> : clients.isLoading ? (
            <div className="client-card-grid" aria-busy="true" aria-label="Chargement des clients">{Array.from({ length: 12 }, (_, index) => <div className="client-card" key={index}><Skeleton height={44} /><Skeleton height={20} /><Skeleton height={100} /><Skeleton height={32} /></div>)}</div>
        ) : !filtered.length ? <EmptyState title={search ? 'Aucun résultat' : 'Aucun client'} description={search ? 'Essayez un autre nom ou téléphone.' : 'Les clients apparaîtront ici.'} /> : <div className="client-card-grid">{visible.map((client, index) => {
            const id = client.uuid ?? client.id
            const blocked = client.status === 'blocked'
            const active = client.status === 'active'
            return <article className="client-card" key={id ?? index}>
                <div className="client-card-heading"><div className="client-card-avatar" aria-hidden="true">{(client.name || '?').slice(0, 2).toUpperCase()}</div><h2>{client.name || 'Client'}</h2><Badge variant={active ? 'success' : blocked ? 'danger' : 'default'}>{active ? 'Actif' : blocked ? 'Bloqué' : 'Non renseigné'}</Badge></div>
                <ClientInformation client={client} />
                <div className="client-card-footer">
                    {(blocked || active) && <Button variant={blocked ? 'secondary' : 'danger'} size="sm" disabled={busy || id == null} onClick={() => { setAction({ id, type: blocked ? 'unblock' : 'block', name: client.name ?? client.email }); setActionError(''); setMotif('') }}>{blocked ? 'Débloquer' : 'Bloquer'}</Button>}
                </div>
            </article>
        })}</div>}
        {!clients.error && !clients.isLoading && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />}
        {action && <Modal open title={action.type === 'block' ? 'Bloquer le client' : 'Débloquer le client'} onClose={busy ? undefined : close} closeOnOverlayClick={false}>
            <form className="client-action-form" onSubmit={submit}>
                <p>Confirmer {action.type === 'block' ? 'le blocage' : 'le déblocage'} de {action.name || 'ce client'} ?</p>
                {action.type === 'block' && <Input name="client-block-motif" label="Motif du blocage" value={motif} onChange={event => setMotif(event.target.value)} required disabled={busy} />}
                {actionError && <p role="alert" className="form-error">{actionError}</p>}
                <div className="client-card-footer"><Button variant="secondary" disabled={busy} onClick={close}>Annuler</Button><Button type="submit" variant={action.type === 'block' ? 'danger' : 'primary'} loading={busy}>Confirmer</Button></div>
            </form>
        </Modal>}
    </section>
}

export default Clients
