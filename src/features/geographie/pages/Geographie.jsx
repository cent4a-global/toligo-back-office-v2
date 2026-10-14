import CommunesModal from '../components/CommunesModal'
import { nameOf, idOf } from '../utils/geographie'
import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../../components/ui/PageHeader'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'
import StatCard from '../../../components/ui/StatCard'
import Skeleton from '../../../components/ui/Skeleton'
import ErrorState from '../../../components/ui/ErrorState'
import EmptyState from '../../../components/ui/EmptyState'
import Pagination from '../../../components/ui/Pagination'
import { useVilles } from '../hooks/useGeo'

const storageKey = 'toligo:localites:preferences'
function readPreferences() {
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey))
        return {
            search: typeof saved?.search === 'string' ? saved.search : '',
            sort: saved?.sort === 'za' ? 'za' : 'az',
        }
    } catch {
        return { search: '', sort: 'az' }
    }
}
function Geographie() {
    const query = useVilles()
    const [preferences, setPreferences] = useState(readPreferences)
    const [page, setPage] = useState(1)
    const [ville, setVille] = useState(null)
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(preferences))
        } catch {
            /* Stockage indisponible. */
        }
    }, [preferences])
    const filtered = useMemo(() => {
        const fold = value =>
            value
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLocaleLowerCase('fr')
        return query.villes
            .filter(row => fold(nameOf(row)).includes(fold(preferences.search.trim())))
            .sort(
                (a, b) =>
                    nameOf(a).localeCompare(nameOf(b), 'fr', { sensitivity: 'base' }) *
                    (preferences.sort === 'az' ? 1 : -1),
            )
    }, [query.villes, preferences])
    const change = (key, value) => {
        setPreferences(previous => ({ ...previous, [key]: value }))
        setPage(1)
    }
    const totalPages = Math.max(1, Math.ceil(filtered.length / 12))
    const currentPage = Math.min(page, totalPages)
    const counts = query.villes.map(row =>
        Array.isArray(row.communes) ? row.communes.length : row.communes_count,
    )
    const totalCommunes = counts.every(value => value != null && Number.isFinite(Number(value)))
        ? counts.reduce((total, value) => total + Number(value), 0)
        : null
    return (
        <section className="page-scaffold">
            <PageHeader title="Localités" description="Consultez les villes et leurs communes." />
            <div className="geo-stats">
                <StatCard
                    title="Total des villes"
                    value={
                        query.isLoading ? (
                            <Skeleton height={30} />
                        ) : query.error ? (
                            '—'
                        ) : (
                            query.villes.length
                        )
                    }
                />
                <StatCard
                    title="Total des communes"
                    value={
                        query.isLoading ? (
                            <Skeleton height={30} />
                        ) : query.error ? (
                            '—'
                        ) : (
                            (totalCommunes ?? '—')
                        )
                    }
                    description={
                        totalCommunes == null && !query.isLoading && !query.error
                            ? 'Total non fourni par la liste des villes'
                            : undefined
                    }
                />
            </div>
            <div className="geo-toolbar">
                <Input
                    label="Rechercher une ville"
                    name="geo-search"
                    value={preferences.search}
                    onChange={event => change('search', event.target.value)}
                    placeholder="Nom de la ville"
                />
                <Select
                    label="Trier par"
                    name="geo-sort"
                    value={preferences.sort}
                    onChange={event => change('sort', event.target.value)}
                    options={[
                        { value: 'az', label: 'Nom : A à Z' },
                        { value: 'za', label: 'Nom : Z à A' },
                    ]}
                />
            </div>
            {query.error ? (
                <ErrorState
                    description={query.error.message}
                    action={
                        <Button onClick={() => query.refetch()} loading={query.isFetching}>
                            Réessayer
                        </Button>
                    }
                />
            ) : query.isLoading ? (
                <div className="geo-grid" aria-busy="true">
                    {Array.from({ length: 12 }, (_, i) => (
                        <div className="geo-card" key={i}>
                            <Skeleton height={25} />
                            <Skeleton height={32} />
                        </div>
                    ))}
                </div>
            ) : !filtered.length ? (
                <EmptyState
                    title="Aucune ville"
                    description="Aucune ville ne correspond à votre recherche."
                />
            ) : (
                <div className="geo-grid">
                    {filtered.slice((currentPage - 1) * 12, currentPage * 12).map((row, index) => (
                        <article className="geo-card" key={idOf(row) ?? index}>
                            <h2>
                                <i className="fi fi-rr-marker" aria-hidden="true" />
                                {nameOf(row)}
                            </h2>
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={idOf(row) == null}
                                onClick={() => setVille(row)}>
                                Voir les communes
                            </Button>
                        </article>
                    ))}
                </div>
            )}
            {!query.isLoading && !query.error && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            )}
            {ville && <CommunesModal ville={ville} onClose={() => setVille(null)} />}
        </section>
    )
}
export default Geographie
