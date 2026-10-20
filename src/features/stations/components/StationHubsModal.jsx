import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Table from '../../../components/ui/Table'
import ErrorState from '../../../components/ui/ErrorState'
import { useHubs, useUpdateHub } from '../../hubs/hooks/useHubs'
import { notifyError } from '../../../lib/notifications'

function stationId(hub) {
    return hub.station_id ?? hub.station?.id
}

export default function StationHubsModal({ station, onClose }) {
    const query = useHubs()
    const assignment = useUpdateHub()
    const [search, setSearch] = useState('')
    const [hubToAssign, setHubToAssign] = useState(null)
    const hubs = query.data?.data ?? []
    const isAssigned = hub => stationId(hub) != null && String(stationId(hub)) === String(station.id)
    const filtered = hubs.filter(hub =>
        `${hub.code ?? ''} ${hub.station?.nom ?? ''} ${hub.station?.code ?? ''}`
            .toLocaleLowerCase('fr').includes(search.trim().toLocaleLowerCase('fr')),
    )
    const columns = [
        { key: 'code', label: 'Hub' },
        {
            key: 'station', label: 'Station actuelle',
            render: hub => hub.station?.nom ?? (stationId(hub) != null ? `Station ${stationId(hub)}` : 'Non affecté'),
        },
        {
            key: 'statut', label: 'Statut',
            render: hub => ({ libre: 'Libre', occupe: 'Occupé', maintenance: 'Maintenance', indisponible: 'Indisponible' }[hub.statut] ?? hub.statut ?? '—'),
        },
        {
            key: 'actions', label: 'Affectation',
            render: hub => isAssigned(hub) ? <Badge variant="success" size="sm">Déjà affecté</Badge> : (
                <Button size="sm" variant="secondary" disabled={assignment.isPending || query.isFetching}
                    onClick={() => setHubToAssign(hub)}>
                    {stationId(hub) != null ? 'Réaffecter' : 'Affecter'}
                </Button>
            ),
        },
    ]

    async function assign() {
        if (!hubToAssign || assignment.isPending || query.isFetching || query.isError) return
        try {
            await assignment.mutateAsync({
                id: hubToAssign.id,
                data: {
                    code: hubToAssign.code,
                    statut: hubToAssign.statut,
                    description: hubToAssign.description ?? '',
                    station_id: station.id,
                },
            })
            setHubToAssign(null)
        } catch (error) {
            notifyError(error)
        }
    }

    if (hubToAssign) return (
        <ConfirmDialog
            open
            title="Confirmer l’affectation"
            description={`Affecter le hub ${hubToAssign.code} à ${station.nom} ?${stationId(hubToAssign) != null ? ` Il sera retiré de ${hubToAssign.station?.nom ?? `la station ${stationId(hubToAssign)}`}.` : ''}`}
            confirmLabel="Confirmer l’affectation"
            confirmVariant="primary"
            loading={assignment.isPending}
            onClose={() => setHubToAssign(null)}
            onConfirm={query.isFetching || query.isError ? undefined : assign}
        />
    )

    return (
        <Modal open title="Gérer les hubs" subtitle={`Affectez les hubs à la station ${station.nom}.`}
            onClose={assignment.isPending ? undefined : onClose} closeOnOverlayClick={false}>
            <div className="station-hubs-panel">
                <Input label="Rechercher un hub" name="station-hub-search" placeholder="Code du hub ou station actuelle"
                    value={search} onChange={event => setSearch(event.target.value)} disabled={assignment.isPending} />
                <p className="station-hubs-count" role="status">
                    {hubs.filter(isAssigned).length} hub(s) affecté(s) à cette station
                </p>
                {query.isError ? (
                    <ErrorState title="Impossible de charger les hubs" description={query.error.message}
                        action={<Button variant="secondary" onClick={() => query.refetch()}>Réessayer</Button>} />
                ) : (
                    <Table key={search} columns={columns} data={filtered} loading={query.isPending} emptyMessage="Aucun hub trouvé" />
                )}
                <div className="station-hubs-actions">
                    <Button variant="secondary" onClick={onClose} disabled={assignment.isPending}>Fermer</Button>
                </div>
            </div>
        </Modal>
    )
}
