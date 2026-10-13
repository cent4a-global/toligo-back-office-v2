import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Pagination from '../../../components/ui/Pagination'
import { useInternalUsers } from '../../users/hooks/useUsers'
import { notifyError } from '../../../lib/notifications'
import { getAdminUuid } from '../utils/adminUuid'

export default function WarehouseAdminsModal({ warehouse, onClose, onSubmit, loading = false }) {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState(() =>
        (warehouse.admins ?? (warehouse.admin ? [warehouse.admin] : [])).map(getAdminUuid).filter(Boolean),
    )
    const query = useInternalUsers({ page, perPage: 10 })
    const admins = query.data?.items ?? []
    const filtered = admins.filter(admin =>
        `${admin.name ?? ''} ${admin.email ?? ''}`.toLocaleLowerCase('fr').includes(search.trim().toLocaleLowerCase('fr')),
    )

    const toggle = id => setSelected(previous => previous.includes(id)
        ? previous.filter(value => value !== id) : [...previous, id])

    const submit = async event => {
        event.preventDefault()
        if (!onSubmit || loading || query.isError || query.isPending) return
        try {
            await onSubmit(selected)
        } catch (error) {
            notifyError(error)
        }
    }

    return (
        <Modal open title="Gérer les admins" subtitle={`Sélectionnez les administrateurs de ${warehouse.name ?? warehouse.nom ?? 'cet entrepôt'}.`}
            closeOnOverlayClick={false} onClose={loading ? undefined : onClose}>
            <form className="warehouse-admins-form" onSubmit={submit}>
                <Input label="Filtrer cette page" name="warehouse-admin-search" placeholder="Nom ou adresse e-mail"
                    value={search} onChange={event => setSearch(event.target.value)} disabled={loading} />
                <p className="warehouse-admins-count" role="status">{selected.length} administrateur(s) sélectionné(s)</p>
                {query.isPending ? <p role="status">Chargement des administrateurs…</p> : query.isError ? (
                    <div role="alert">{query.error.message} <Button type="button" variant="secondary" onClick={() => query.refetch()}>Réessayer</Button></div>
                ) : (
                    <>
                        <div className="warehouse-admins-list">
                            {filtered.map((admin, index) => {
                                const uuid = getAdminUuid(admin)
                                return (
                                <label key={uuid ?? admin.id ?? index} className={`warehouse-admin-option${uuid && selected.includes(uuid) ? ' is-selected' : ''}`}>
                                    <input type="checkbox" checked={Boolean(uuid && selected.includes(uuid))}
                                        onChange={() => toggle(uuid)} disabled={loading || !uuid} />
                                    <span className="warehouse-admin-avatar" aria-hidden="true">{(admin.name ?? admin.email ?? '?').slice(0, 1).toLocaleUpperCase('fr')}</span>
                                    <span className="warehouse-admin-identity"><strong>{admin.name ?? 'Administrateur'}</strong><small>{admin.email}</small>
                                        {!uuid && <small>UUID absent ou invalide dans les données reçues.</small>}
                                    </span>
                                </label>
                                )
                            })}
                            {!filtered.length && <p className="warehouse-admins-empty">Aucun administrateur trouvé.</p>}
                        </div>
                        <Pagination currentPage={query.data?.currentPage ?? page} totalPages={query.data?.totalPages ?? 1}
                            onPageChange={value => { setPage(value); setSearch('') }} />
                    </>
                )}
                <div className="warehouse-admins-form-actions">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Annuler</Button>
                    <Button type="submit" loading={loading} disabled={!onSubmit || query.isPending || query.isError}>Valider la sélection</Button>
                </div>
            </form>
        </Modal>
    )
}
