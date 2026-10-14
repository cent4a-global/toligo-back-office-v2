import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import ErrorState from '../../../components/ui/ErrorState'
import Skeleton from '../../../components/ui/Skeleton'
import { useClients } from '../../clients/hooks/useClient'

function ClientPicker({ selected, onChange, disabled }) {
    const query = useClients({ all: true })
    const [search, setSearch] = useState('')
    const needle = search.trim().toLocaleLowerCase('fr')
    const filtered = query.clients.filter(client => [client.name, client.phone].some(value => String(value ?? '').toLocaleLowerCase('fr').includes(needle)))
    return <div className="push-client-picker">
        <Input name="push-client-search" label="Rechercher un client" value={search} onChange={event => setSearch(event.target.value)} placeholder="Nom ou téléphone" disabled={disabled} />
        <p className="push-field-help">{selected.length} client(s) sélectionné(s)</p>
        {query.error ? <ErrorState description={query.error.message} action={<Button onClick={() => query.refetch()} loading={query.isFetching}>Réessayer</Button>} /> : query.isLoading ? <Skeleton height={120} /> : <div className="push-client-list">{!filtered.length ? <p>Aucun client trouvé.</p> : filtered.map((client, index) => {
            const id = typeof client.uuid === 'string' && client.uuid.trim() ? client.uuid : null
            return <label key={id ?? index}><input type="checkbox" disabled={disabled || id == null} checked={selected.includes(id)} onChange={() => onChange(selected.includes(id) ? selected.filter(value => value !== id) : [...selected, id])} /><span><strong>{client.name || 'Client'}</strong><small>{client.phone || 'Téléphone non renseigné'}</small></span></label>
        })}</div>}
    </div>
}
export default ClientPicker
