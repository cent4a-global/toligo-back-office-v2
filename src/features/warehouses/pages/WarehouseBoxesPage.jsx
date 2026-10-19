import { flushSync } from 'react-dom'
import { notifySuccess } from '../../../lib/notifications'
import { useMemo, useState } from 'react'
import { ArrowLeftRight, MoreVertical, Pencil, Plus, Search, Trash2, RefreshCw } from 'lucide-react'
import { useParams } from 'react-router-dom'

import Button from '../../../components/ui/Button'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import ErrorState from '../../../components/ui/ErrorState'
import Dropdown from '../../../components/ui/Dropdown'
import Skeleton from '../../../components/ui/Skeleton'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import BoxDetailsModal from '../components/BoxDetailsModal'
import BoxEditModal from '../components/BoxEditModal'
import BoxFormModal from '../components/BoxFormModal'
import WarehouseManagementLayout from '../components/WarehouseManagementLayout'
import { useBoxes, useDeleteBox } from '../hooks/useBoxes'
import { useSmartlock } from '../hooks/useSmartlock'

const normalize = value =>
    String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[_-]+/g, ' ')
        .toLocaleLowerCase('fr')
        .trim()

const formatDimension = value => (value == null || value === '' ? '—' : value)

function BoxStatus({ value }) {
    const status = normalize(value)
    const tone =
        status === 'libre'
            ? 'success'
            : status === 'occupee' || status === 'reservee'
              ? 'warning'
              : status === 'hors service'
                ? 'danger'
                : 'muted'
    return (
        <span className={`warehouse-box-status warehouse-box-status-${tone}`}>
            {value || 'Non renseigné'}
        </span>
    )
}

export default function WarehouseBoxesPage() {
    const { id } = useParams()
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const boxesQuery = useBoxes(id)
    const [selectedBox, setSelectedBox] = useState(null)
    const [editingBox, setEditingBox] = useState(null)
    const [deletingBox, setDeletingBox] = useState(null)
    const deleteMutation = useDeleteBox()
    const smartlock = useSmartlock()
    const [selection, setSelection] = useState({ warehouseId: id, ids: [] })
    const [unsyncOpen, setUnsyncOpen] = useState(false)
    const [replacingBox, setReplacingBox] = useState(null)
    const [newLockname, setNewLockname] = useState('')
    const smartlockBusy = smartlock.isSyncing || smartlock.isUnsyncing || smartlock.isReplacing

    const boxes = useMemo(() => boxesQuery.data ?? [], [boxesQuery.data])
    const filteredBoxes = useMemo(() => {
        const query = normalize(search)
        return boxes.filter(box => {
            const matchesSearch =
                !query ||
                normalize(`${box.numero ?? ''} ${box.smart_lock?.lockname ?? ''}`).includes(query)
            return matchesSearch
        })
    }, [boxes, search])

    const selectedIds = selection.warehouseId === id ? selection.ids : []
    const selectedLocks = [
        ...new Set(
            boxes
                .filter(box => selectedIds.includes(box.id))
                .map(box => box.smart_lock?.id)
                .filter(lockId => lockId != null && lockId !== ''),
        ),
    ]
    const selectableBoxes = filteredBoxes.filter(
        box => box.smart_lock?.id != null && box.smart_lock.id !== '',
    )
    const toggleBox = (boxId, checked) =>
        setSelection({
            warehouseId: id,
            ids: checked
                ? [...new Set([...selectedIds, boxId])]
                : selectedIds.filter(value => value !== boxId),
        })
    const confirmUnsync = async () => {
        if (smartlockBusy || !selectedLocks.length) return
        try {
            await smartlock.unsyncSmartLocksAsync(selectedLocks)
            setSelection({ warehouseId: id, ids: [] })
            flushSync(() => setUnsyncOpen(false))
            notifySuccess('Serrures désynchronisées.')
        } catch {
            /* The global mutation handler displays API errors. */
        }
    }
    const submitReplacement = async event => {
        event.preventDefault()
        if (smartlockBusy || !newLockname.trim() || replacingBox?.warehouseId !== id) return
        try {
            await smartlock.replaceSmartLockAsync({
                smartLockId: replacingBox.box.smart_lock.id,
                newLockname: newLockname.trim(),
            })
            flushSync(() => setReplacingBox(null))
            notifySuccess('Serrure remplacée.')
            setNewLockname('')
        } catch {
            /* Keep the form open when replacement fails. */
        }
    }

    const confirmDelete = async () => {
        if (!deletingBox || deleteMutation.isPending) return
        const target = deletingBox
        try {
            await deleteMutation.mutateAsync({ id: target.box.id, warehouseId: target.warehouseId })
            setSelectedBox(previous => (previous?.id === target.box.id ? null : previous))
            setEditingBox(previous => (previous?.id === target.box.id ? null : previous))
            flushSync(() => setDeletingBox(null))
            notifySuccess('Caisse supprimée avec succès.')
        } catch {
            // The global mutation handler displays the error; keep confirmation open.
        }
    }

    return (
        <WarehouseManagementLayout>
            {() => (
                <>
                    <div className="warehouse-boxes-toolbar">
                        <label className="warehouse-boxes-search">
                            <Search size={18} aria-hidden="true" />
                            <input
                                value={search}
                                onChange={event => setSearch(event.target.value)}
                                placeholder="Rechercher un numéro ou une serrure"
                            />
                        </label>
                        <Button
                            variant="secondary"
                            size="sm"
                            loading={smartlock.isSyncing}
                            disabled={smartlockBusy || !id || boxesQuery.isLoading}
                            onClick={() => smartlock.syncSmartLocks(id)}>
                            <RefreshCw size={15} aria-hidden="true" />
                            Synchroniser
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={smartlockBusy || !selectedLocks.length}
                            onClick={() => setUnsyncOpen(true)}>
                            Désynchroniser ({selectedLocks.length})
                        </Button>
                        <Button size="sm" onClick={() => setOpen(true)}>
                            <Plus size={18} aria-hidden="true" />
                            Ajouter une caisse
                        </Button>
                    </div>

                    {boxesQuery.isError ? (
                        <ErrorState
                            title="Impossible de charger les caisses"
                            description={boxesQuery.error.message}
                            action={<Button onClick={() => boxesQuery.refetch()}>Réessayer</Button>}
                        />
                    ) : (
                        <>
                            <label className="warehouse-boxes-select-all">
                                <input
                                    type="checkbox"
                                    disabled={smartlockBusy || !selectableBoxes.length}
                                    checked={
                                        selectableBoxes.length > 0 &&
                                        selectableBoxes.every(box => selectedIds.includes(box.id))
                                    }
                                    onChange={event =>
                                        setSelection({
                                            warehouseId: id,
                                            ids: event.target.checked
                                                ? [
                                                      ...new Set([
                                                          ...selectedIds,
                                                          ...selectableBoxes.map(box => box.id),
                                                      ]),
                                                  ]
                                                : selectedIds.filter(
                                                      boxId =>
                                                          !selectableBoxes.some(
                                                              box => box.id === boxId,
                                                          ),
                                                  ),
                                        })
                                    }
                                />
                                Sélectionner les caisses visibles avec une serrure
                            </label>
                            <div className="warehouse-boxes-grid" aria-busy={boxesQuery.isLoading}>
                                {boxesQuery.isLoading
                                    ? Array.from({ length: 4 }, (_, index) => (
                                          <div className="warehouse-box-card" key={index}>
                                              <Skeleton width="55%" height={22} />
                                              <Skeleton width="100%" height={190} />
                                              <Skeleton width="100%" height={36} />
                                          </div>
                                      ))
                                    : filteredBoxes.map(box => {
                                          const hasLock =
                                              box.smart_lock?.id != null && box.smart_lock.id !== ''
                                          const syncValue = box.smart_lock?.synchronisee
                                          const synced =
                                              syncValue === true ||
                                              syncValue === 1 ||
                                              syncValue === '1'
                                          const syncKnown = syncValue != null || !hasLock
                                          return (
                                              <article
                                                  key={box.id}
                                                  className={`warehouse-box-card${selectedIds.includes(box.id) ? ' is-selected' : ''}`}>
                                                  <div className="warehouse-box-card-header">
                                                      <label className="warehouse-box-card-title">
                                                          <input
                                                              type="checkbox"
                                                              aria-label={`Sélectionner la caisse ${box.numero ?? box.id}`}
                                                              checked={selectedIds.includes(box.id)}
                                                              disabled={smartlockBusy || !hasLock}
                                                              onChange={event =>
                                                                  toggleBox(
                                                                      box.id,
                                                                      event.target.checked,
                                                                  )
                                                              }
                                                          />
                                                          <strong>{box.numero ?? '—'}</strong>
                                                      </label>
                                                      <Dropdown
                                                          trigger={expanded => (
                                                              <Button
                                                                  variant="ghost"
                                                                  size="sm"
                                                                  aria-label={`Actions de la caisse ${box.numero ?? box.id}`}
                                                                  aria-expanded={expanded}>
                                                                  <MoreVertical
                                                                      size={17}
                                                                      aria-hidden="true"
                                                                  />
                                                              </Button>
                                                          )}
                                                          items={[
                                                              {
                                                                  label: 'Modifier',
                                                                  icon: <Pencil size={15} />,
                                                                  disabled:
                                                                      !box.id || smartlockBusy,
                                                                  onClick: () =>
                                                                      setEditingBox({
                                                                          id: box.id,
                                                                          warehouseId: id,
                                                                      }),
                                                              },
                                                              {
                                                                  label: 'Supprimer',
                                                                  icon: <Trash2 size={15} />,
                                                                  danger: true,
                                                                  disabled:
                                                                      !box.id ||
                                                                      deleteMutation.isPending ||
                                                                      smartlockBusy,
                                                                  onClick: () =>
                                                                      setDeletingBox({
                                                                          box,
                                                                          warehouseId: id,
                                                                      }),
                                                              },
                                                          ]}
                                                      />
                                                  </div>
                                                  <div className="warehouse-box-card-statuses">
                                                      <BoxStatus value={box.statut ?? box.status} />
                                                      <span
                                                          className={`warehouse-box-sync ${synced ? 'is-synced' : syncKnown ? 'is-unsynced' : 'is-unknown'}`}>
                                                          {synced
                                                              ? 'Synchronisée'
                                                              : syncKnown
                                                                ? 'Non synchronisée'
                                                                : 'Synchronisation non renseignée'}
                                                      </span>
                                                  </div>
                                                  <dl className="warehouse-box-card-values">
                                                      <div>
                                                          <dt>Dimensions</dt>
                                                          <dd>
                                                              {formatDimension(
                                                                  box.dimensions?.longueur,
                                                              )}{' '}
                                                              ×{' '}
                                                              {formatDimension(
                                                                  box.dimensions?.largeur,
                                                              )}{' '}
                                                              ×{' '}
                                                              {formatDimension(
                                                                  box.dimensions?.hauteur,
                                                              )}{' '}
                                                              cm
                                                          </dd>
                                                      </div>
                                                      <div>
                                                          <dt>Volume</dt>
                                                          <dd>
                                                              {formatDimension(
                                                                  box.dimensions?.Volume ??
                                                                      box.dimensions?.volume,
                                                              )}{' '}
                                                              L
                                                          </dd>
                                                      </div>
                                                      <div>
                                                          <dt>Poids max</dt>
                                                          <dd>
                                                              {box.poids == null
                                                                  ? '—'
                                                                  : `${box.poids} kg`}
                                                          </dd>
                                                      </div>
                                                      <div>
                                                          <dt>Prix / heure</dt>
                                                          <dd>
                                                              {box.prix_par_heure == null
                                                                  ? '—'
                                                                  : `${new Intl.NumberFormat('fr-FR').format(box.prix_par_heure)} FCFA`}
                                                          </dd>
                                                      </div>
                                                      <div>
                                                          <dt>Verrou</dt>
                                                          <dd>
                                                              {box.smart_lock?.lockname || 'Aucun'}
                                                          </dd>
                                                      </div>
                                                  </dl>
                                                  <div className="warehouse-box-card-actions">
                                                      <Button
                                                          variant="secondary"
                                                          size="sm"
                                                          disabled={!box.id}
                                                          onClick={() =>
                                                              setSelectedBox({
                                                                  id: box.id,
                                                                  warehouseId: id,
                                                              })
                                                          }>
                                                          Détails
                                                      </Button>
                                                      <Button
                                                          variant="secondary"
                                                          size="sm"
                                                          disabled={smartlockBusy || !hasLock}
                                                          onClick={() => {
                                                              setReplacingBox({
                                                                  box,
                                                                  warehouseId: id,
                                                              })
                                                              setNewLockname('')
                                                          }}>
                                                          <ArrowLeftRight
                                                              size={15}
                                                              aria-hidden="true"
                                                          />
                                                          Remplacer la serrure
                                                      </Button>
                                                  </div>
                                              </article>
                                          )
                                      })}
                            </div>
                            {!boxesQuery.isLoading && !filteredBoxes.length && (
                                <p className="warehouse-boxes-info">
                                    {boxes.length
                                        ? 'Aucune caisse ne correspond à ces filtres.'
                                        : 'Aucune caisse associée à cet entrepôt.'}
                                </p>
                            )}
                            {!boxesQuery.isLoading && (
                                <p className="warehouse-boxes-result-count">
                                    {filteredBoxes.length} caisse
                                    {filteredBoxes.length > 1 ? 's' : ''} sur {boxes.length}
                                </p>
                            )}
                        </>
                    )}

                    <ConfirmDialog
                        open={unsyncOpen && selection.warehouseId === id}
                        title="Désynchroniser les serrures"
                        description={`Désynchroniser les ${selectedLocks.length} serrure(s) des caisses sélectionnées ?`}
                        confirmLabel="Désynchroniser"
                        loading={smartlock.isUnsyncing}
                        onClose={smartlockBusy ? undefined : () => setUnsyncOpen(false)}
                        onConfirm={selectedLocks.length ? confirmUnsync : undefined}
                    />
                    <Modal
                        open={replacingBox?.warehouseId === id}
                        title="Remplacer la serrure"
                        subtitle={`Caisse ${replacingBox?.box.numero ?? ''} — serrure actuelle : ${replacingBox?.box.smart_lock?.lockname ?? ''}`}
                        onClose={smartlockBusy ? undefined : () => setReplacingBox(null)}
                        closeOnOverlayClick={false}>
                        <form className="box-form" onSubmit={submitReplacement}>
                            <Input
                                name="new_lockname"
                                label="Nom de la nouvelle serrure"
                                required
                                autoFocus
                                value={newLockname}
                                onChange={event => setNewLockname(event.target.value)}
                                disabled={smartlockBusy}
                            />
                            <div className="box-form-actions">
                                <Button
                                    variant="secondary"
                                    disabled={smartlockBusy}
                                    onClick={() => setReplacingBox(null)}>
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    loading={smartlock.isReplacing}
                                    disabled={smartlockBusy || !newLockname.trim()}>
                                    Remplacer
                                </Button>
                            </div>
                        </form>
                    </Modal>
                    {open && (
                        <BoxFormModal key={id} warehouseId={id} onClose={() => setOpen(false)} />
                    )}
                    {selectedBox?.warehouseId === id && (
                        <BoxDetailsModal
                            key={selectedBox.id}
                            boxId={selectedBox.id}
                            onClose={() => setSelectedBox(null)}
                        />
                    )}
                    {editingBox?.warehouseId === id && (
                        <BoxEditModal
                            key={editingBox.id}
                            boxId={editingBox.id}
                            warehouseId={id}
                            onClose={() => setEditingBox(null)}
                        />
                    )}
                    <ConfirmDialog
                        open={deletingBox?.warehouseId === id}
                        title="Supprimer la caisse"
                        description={`Voulez-vous supprimer la caisse « ${deletingBox?.box.numero ?? deletingBox?.box.id ?? ''} » ? Cette action est définitive.`}
                        confirmLabel="Supprimer"
                        loading={deleteMutation.isPending}
                        onClose={deleteMutation.isPending ? undefined : () => setDeletingBox(null)}
                        onConfirm={confirmDelete}
                    />
                </>
            )}
        </WarehouseManagementLayout>
    )
}
