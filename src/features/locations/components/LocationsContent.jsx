import { useMemo, useState } from 'react'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Modal from '../../../components/ui/Modal'
import Table from '../../../components/ui/Table'
import StatCard from '../../../components/ui/StatCard'
import Pagination from '../../../components/ui/Pagination'
import Skeleton from '../../../components/ui/Skeleton'
import ErrorState from '../../../components/ui/ErrorState'
import EmptyState from '../../../components/ui/EmptyState'
import { dateTime, money, statusLabel, isCompleted, filterLocations } from '../utils/locations'

function LocationDetails({ location, onClose }) {
    const box = location.box
    const payments = Array.isArray(location.paiements) ? location.paiements : []
    const fields = [
        ['Statut', statusLabel(location.statut)], ['Client', location.client?.nom_complet], ['Téléphone', location.client?.telephone],
        ['Objet', location.objet?.nom], ['Catégorie', location.objet?.type_objet?.libelle], ['Caisse', box?.numero], ['Entrepôt', box?.entrepot?.nom],
        ['Commune', typeof box?.entrepot?.commune === 'string' ? box.entrepot.commune : box?.entrepot?.commune?.nom],
        ['Ville', typeof box?.entrepot?.ville === 'string' ? box.entrepot.ville : box?.entrepot?.ville?.nom],
        ['Dimensions', box?.dimensions ? `${box.dimensions.longueur ?? '—'} × ${box.dimensions.largeur ?? '—'} × ${box.dimensions.hauteur ?? '—'}` : null],
        ['Prix par heure', money(box?.prix_par_heure)], ['Début', dateTime(location.date_debut)], ['Fin', dateTime(location.date_fin)],
        ['Durée', location.duree_heures == null ? null : `${location.duree_heures} h`], ['Total', money(location.montant_total)], ['Code d’accès', location.access_code_status], ['Création', dateTime(location.created_at)],
    ]
    return <Modal open onClose={onClose} title="Détails de la location" subtitle={location.client?.nom_complet} size="lg">
        <div className="location-details"><dl className="location-info">{fields.map(([label, value]) => <div className="location-info-row" key={label}><dt>{label}</dt><dd>{value ?? '—'}</dd></div>)}</dl>
            <h3>Paiements</h3>
            <Table data={payments} emptyMessage="Aucun paiement renseigné" columns={[
                { key: 'montant', label: 'Montant', render: row => money(row.montant) }, { key: 'statut', label: 'Statut' }, { key: 'mode', label: 'Mode' }, { key: 'date', label: 'Date', render: row => dateTime(row.date) },
            ]} />
        </div>
    </Modal>
}

function LocationsContent({ query }) {
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('')
    const [sort, setSort] = useState('recent')
    const [page, setPage] = useState(1)
    const [selected, setSelected] = useState(null)
    const rows = query.locations
    const filtered = useMemo(() => filterLocations(rows, search, status, sort), [rows, search, status, sort])
    const totalPages = Math.max(1, Math.ceil(filtered.length / 12))
    const currentPage = Math.min(page, totalPages)
    const selectedLocation = selected == null ? null : rows.find((row, index) => (row.uuid ?? row.id ?? index) === selected)
    if (query.error) return <ErrorState description={query.error.message} action={<Button onClick={() => query.refetch()} loading={query.isFetching}>Réessayer</Button>} />
    return <>
        <div className="location-stats">{[
            ['Total', rows.length], ['Actives', rows.filter(row => row.statut === 'active').length], ['Terminées', rows.filter(isCompleted).length], ['Revenu total', money(rows.reduce((total, row) => total + (Number(row.montant_total) || 0), 0))],
        ].map(([title, value]) => <StatCard key={title} title={title} description={title === 'Revenu total' ? 'Somme des montants des locations' : undefined} value={query.isLoading ? <Skeleton height={30} /> : value} />)}</div>
        <div className="location-toolbar">
            <Input name="location-search" label="Rechercher" placeholder="Client, caisse, objet ou entrepôt" value={search} onChange={event => { setSearch(event.target.value); setPage(1) }} />
            <Select name="location-status" label="Statut" placeholder="Tous les statuts" value={status} options={[...new Set(rows.map(row => row.statut).filter(Boolean))].map(value => ({ value, label: statusLabel(value) }))} onChange={event => { setStatus(event.target.value); setPage(1) }} />
            <Select name="location-sort" label="Trier par" value={sort} options={[{ value: 'recent', label: 'Plus récentes' }, { value: 'oldest', label: 'Plus anciennes' }]} onChange={event => { setSort(event.target.value); setPage(1) }} />
        </div>
        {!query.isLoading && <p className="location-result-count">{filtered.length} location(s)</p>}
        {query.isLoading ? <div className="location-grid" aria-busy="true" aria-label="Chargement des locations">{Array.from({ length: 12 }, (_, index) => <div className="location-card" key={index}><Skeleton height={25} /><Skeleton height={90} /><Skeleton height={32} /></div>)}</div> : !filtered.length ? <EmptyState title="Aucune location" description="Aucune location ne correspond à cette sélection." /> : <div className="location-grid">{filtered.slice((currentPage - 1) * 12, currentPage * 12).map(location => {
            const key = location.uuid ?? location.id ?? rows.indexOf(location)
            return <article className="location-card" key={key}>
                <div className="location-card-heading"><h2>{location.client?.nom_complet ?? 'Client non renseigné'}</h2><Badge variant={location.statut === 'active' ? 'success' : 'default'}>{statusLabel(location.statut)}</Badge></div>
                <p className="location-phone">{location.client?.telephone ?? '—'}</p>
                <dl className="location-info"><dt>Objet</dt><dd>{location.objet?.nom ?? '—'}</dd><dt>Caisse</dt><dd>{location.box?.numero ?? '—'}</dd><dt>Entrepôt</dt><dd>{location.box?.entrepot?.nom ?? '—'}</dd><dt>Début</dt><dd>{dateTime(location.date_debut)}</dd><dt>Fin</dt><dd>{dateTime(location.date_fin)}</dd></dl>
                <div className="location-card-footer"><strong>{money(location.montant_total)}</strong><Button size="sm" variant="secondary" onClick={() => setSelected(key)}>Voir les détails</Button></div>
            </article>
        })}</div>}
        {!query.isLoading && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />}
        {selectedLocation && <LocationDetails location={selectedLocation} onClose={() => setSelected(null)} />}
    </>
}

export default LocationsContent
