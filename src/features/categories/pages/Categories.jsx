import Icon from '../../../components/ui/Icon'
import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../../components/ui/PageHeader'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Pagination from '../../../components/ui/Pagination'
import ErrorState from '../../../components/ui/ErrorState'
import EmptyState from '../../../components/ui/EmptyState'
import Skeleton from '../../../components/ui/Skeleton'
import Select from '../../../components/ui/Select'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import { useAuth } from '../../auth/hooks/useAuth'
import { useCategories } from '../hooks/useCategorie'
import CategoryFormModal from '../components/CategoryFormModal'

const labelOf = category => category.libelle ?? category.nom ?? category.name ?? 'Catégorie'
const fold = value =>
    String(value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('fr')
const idOf = category => category.id ?? category.uuid
const sorts = [
    { value: 'recent', label: 'Plus récentes' },
    { value: 'oldest', label: 'Plus anciennes' },
    { value: 'az', label: 'Nom : A à Z' },
    { value: 'za', label: 'Nom : Z à A' },
]
const storageKey = 'toligo:categories:preferences'
function readPreferences() {
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey))
        return {
            search: typeof saved?.search === 'string' ? saved.search : '',
            sort: sorts.some(option => option.value === saved?.sort) ? saved.sort : 'recent',
        }
    } catch {
        return { search: '', sort: 'recent' }
    }
}

function Categories() {
    const query = useCategories()
    const [preferences, setPreferences] = useState(readPreferences)
    const { search, sort } = preferences
    const { role } = useAuth()
    const canManage = role === 'superadmin'
    const [selected, setSelected] = useState([])
    const [deleting, setDeleting] = useState(null)
    const [form, setForm] = useState(null)
    const [page, setPage] = useState(1)
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(preferences))
        } catch {
            /* Stockage indisponible. */
        }
    }, [preferences])
    const changePreference = (key, value) => {
        setPreferences(previous => ({ ...previous, [key]: value }))
        setPage(1)
    }
    const filtered = useMemo(
        () =>
            query.categories
                .filter(category => fold(labelOf(category)).includes(fold(search.trim())))
                .sort((a, b) => {
                    if (sort === 'az' || sort === 'za')
                        return (
                            labelOf(a).localeCompare(labelOf(b), 'fr', { sensitivity: 'base' }) *
                            (sort === 'az' ? 1 : -1)
                        )
                    return (
                        ((Date.parse(a.created_at) || 0) - (Date.parse(b.created_at) || 0)) *
                        (sort === 'oldest' ? 1 : -1)
                    )
                }),
        [query.categories, search, sort],
    )
    const totalPages = Math.max(1, Math.ceil(filtered.length / 12))
    const currentPage = Math.min(page, totalPages)
    const visible = filtered.slice((currentPage - 1) * 12, currentPage * 12)
    const validSelection = selected.filter(id =>
        query.categories.some(category => idOf(category) === id),
    )
    const visibleIds = visible.map(idOf).filter(id => id != null)
    const allChecked = visibleIds.length > 0 && visibleIds.every(id => validSelection.includes(id))
    const toggleCategory = category => {
        const id = idOf(category)
        if (!canManage || query.isDeletingMany || id == null) return
        setSelected(previous =>
            previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id],
        )
    }
    const confirmDelete = async () => {
        if (!canManage) return
        try {
            await query.deleteManyAsync(deleting)
            setSelected(previous => previous.filter(id => !deleting.includes(id)))
            setDeleting(null)
        } catch (error) {
            if (error.failedIds) {
                setSelected(error.failedIds)
                setDeleting(null)
            }
        }
    }
    return (
        <section
            className={`page-scaffold${canManage && validSelection.length ? ' categories-has-selection' : ''}`}>
            <PageHeader
                title="Catégories"
                description="Consultez les catégories d’objets disponibles."
                actions={
                    canManage && (
                        <Button size='md'
                            disabled={query.isDeletingMany}
                            onClick={() => setForm({ category: null })}>
                            Créer une catégorie
                        </Button>
                    )
                }
            />
            <div className="categories-toolbar">
                <Input
                    name="category-search"
                    label="Rechercher une catégorie"
                    placeholder="Nom de la catégorie"
                    value={search}
                    onChange={event => changePreference('search', event.target.value)}
                />
                <Select
                    name="category-sort"
                    label="Trier par"
                    value={sort}
                    options={sorts}
                    onChange={event => changePreference('sort', event.target.value)}
                />
            </div>
            {!query.isLoading && !query.error && (
                <div className="categories-selection">
                    <p className="categories-count">
                        Total Catégories : <strong>{filtered.length}</strong>
                    </p>
                    {canManage && (
                        <div className="categories-actions">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    disabled={query.isDeletingMany || !visibleIds.length}
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
                        </div>
                    )}
                </div>
            )}
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
                <div
                    className="categories-grid"
                    aria-label="Chargement des catégories"
                    aria-busy="true">
                    {Array.from({ length: 12 }, (_, index) => (
                        <div className="category-card" key={index}>
                            <Skeleton height={42} width={42} />
                            <Skeleton height={22} width="65%" />
                        </div>
                    ))}
                </div>
            ) : !filtered.length ? (
                <EmptyState
                    title={search ? 'Aucun résultat' : 'Aucune catégorie'}
                    description={
                        search
                            ? 'Essayez un autre nom.'
                            : 'Les catégories apparaîtront ici une fois disponibles.'
                    }
                />
            ) : (
                <div className="categories-grid">
                    {visible.map((category, index) => (
                        <article
                            className={`category-card${validSelection.includes(idOf(category)) ? ' is-selected' : ''}`}
                            key={category.uuid ?? category.id ?? index}
                            onClick={event => {
                                if (!event.target.closest('button, input, a'))
                                    toggleCategory(category)
                            }}>
                            <span className="category-symbol" aria-hidden="true">
                                {typeof category.icon === 'string' && category.icon ? (
                                    <img
                                        src={category.icon}
                                        alt=""
                                        onError={event => {
                                            event.currentTarget.style.display = 'none'
                                        }}
                                    />
                                ) : (
                                    <Icon name="dashboard" />
                                )}
                            </span>
                            <div className="category-card-content">
                                <h2>{labelOf(category)}</h2>
                                {typeof category.description === 'string' &&
                                    category.description && <p>{category.description}</p>}
                                <p>
                                    Créée le{' '}
                                    {category.created_at &&
                                    !Number.isNaN(Date.parse(category.created_at))
                                        ? new Date(category.created_at).toLocaleDateString('fr-FR')
                                        : '—'}
                                </p>
                                {canManage && (
                                    <div className="category-card-actions">
                                        <Button
                                            variant="category-edit"
                                            size="sm"
                                            disabled={
                                                query.isDeletingMany || idOf(category) == null
                                            }
                                            onClick={() => setForm({ category })}>
                                            Modifier
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {canManage && (
                                <input
                                    type="checkbox"
                                    aria-label={`Sélectionner ${labelOf(category)}`}
                                    disabled={query.isDeletingMany || idOf(category) == null}
                                    checked={validSelection.includes(idOf(category))}
                                    onChange={() => toggleCategory(category)}
                                />
                            )}
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
            {canManage && (
                <div
                    className={`categories-bulk-bar${validSelection.length > 0 ? ' is-visible' : ''}`}
                    role="region"
                    aria-label="Actions sur les catégories sélectionnées"
                    aria-hidden={validSelection.length === 0}
                    inert={validSelection.length === 0}>
                    <span aria-live="polite">
                        {validSelection.length} catégorie(s) sélectionnée(s)
                    </span>
                    <div className="categories-actions">
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={query.isDeletingMany}
                            onClick={() => setSelected([])}>
                            Désélectionner
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            loading={query.isDeletingMany}
                            onClick={() => setDeleting(validSelection)}>
                            Supprimer ({validSelection.length})
                        </Button>
                    </div>
                </div>
            )}
            <ConfirmDialog
                open={canManage && Boolean(deleting)}
                title="Supprimer les catégories"
                description={`Supprimer définitivement ${deleting?.length ?? 0} catégorie(s) ?`}
                confirmLabel="Supprimer"
                loading={query.isDeletingMany}
                onConfirm={confirmDelete}
                onClose={() => {
                    if (!query.isDeletingMany) setDeleting(null)
                }}
            />
            {canManage && form && (
                <CategoryFormModal
                    category={form.category}
                    loading={query.isCreating || query.isUpdating}
                    onClose={() => setForm(null)}
                    onSubmit={data =>
                        form.category
                            ? query.updateCategorieAsync({ id: idOf(form.category), data })
                            : query.createCategorieAsync(data)
                    }
                />
            )}
        </section>
    )
}

export default Categories
