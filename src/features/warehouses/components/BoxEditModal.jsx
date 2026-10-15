import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Skeleton from '../../../components/ui/Skeleton'
import ErrorState from '../../../components/ui/ErrorState'
import { useBox, useUpdateBox } from '../hooks/useBoxes'

const fields = [['hauteur', 'Hauteur'], ['largeur', 'Largeur'], ['longueur', 'Longueur'], ['prix_par_heure', 'Prix par heure']]

function EditForm({ box, warehouseId, mutation, onClose, onUpdated }) {
    const [form, setForm] = useState(() => ({
        hauteur: String(box.dimensions?.hauteur ?? ''),
        largeur: String(box.dimensions?.largeur ?? ''),
        longueur: String(box.dimensions?.longueur ?? ''),
        prix_par_heure: String(box.prix_par_heure ?? ''),
    }))
    const [errors, setErrors] = useState({})
    const submit = async event => {
        event.preventDefault()
        if (mutation.isPending) return
        const next = {}
        for (const [name] of fields) {
            const value = Number(form[name])
            if (!form[name].trim() || !Number.isFinite(value) || (name === 'prix_par_heure' ? value < 0 : value <= 0)) {
                next[name] = name === 'prix_par_heure' ? 'Saisissez un prix positif ou nul.' : 'Saisissez une valeur supérieure à zéro.'
            }
        }
        setErrors(next)
        if (Object.keys(next).length) return
        const payload = { entrepot_id: box.entrepot?.id ?? warehouseId, ...Object.fromEntries(Object.entries(form).map(([name, value]) => [name, value.trim()])) }
        try {
            const response = await mutation.mutateAsync({ id: box.id, payload })
            const updated = { ...box, ...response?.data, dimensions: { ...box.dimensions, ...response?.data?.dimensions } }
            onUpdated?.(updated, payload.entrepot_id)
            onClose()
        } catch {
            // The global mutation handler displays API errors and the form stays open.
        }
    }
    return (
        <form className="box-form" onSubmit={submit} noValidate>
            <div className="box-form-grid">
                {fields.map(([name, label]) => <Input key={name} name={name} label={label} type="number" step="any" min="0" required value={form[name]} disabled={mutation.isPending} error={errors[name]} onChange={event => {
                    setForm(previous => ({ ...previous, [name]: event.target.value }))
                    setErrors(previous => ({ ...previous, [name]: undefined }))
                }} />)}
            </div>
            <div className="box-form-actions">
                <Button variant="secondary" onClick={onClose} disabled={mutation.isPending}>Annuler</Button>
                <Button type="submit" loading={mutation.isPending}>Enregistrer</Button>
            </div>
        </form>
    )
}

export default function BoxEditModal({ boxId, warehouseId, onClose, onUpdated }) {
    const query = useBox(boxId)
    const mutation = useUpdateBox()
    return (
        <Modal open title="Modifier la caisse" subtitle={query.data?.data?.numero ?? 'Dimensions et tarif de la caisse.'} onClose={mutation.isPending ? undefined : onClose} closeOnOverlayClick={false}>
            {query.isLoading ? <div className="box-form" role="status" aria-label="Chargement de la caisse">{fields.map(([name]) => <Skeleton key={name} height={64} />)}</div>
                : query.isError ? <ErrorState title="Impossible de charger la caisse" description={query.error.message} action={<Button onClick={() => query.refetch()}>Réessayer</Button>} />
                    : query.data?.data ? <EditForm key={boxId} box={query.data.data} warehouseId={warehouseId} mutation={mutation} onClose={onClose} onUpdated={onUpdated} />
                        : <ErrorState title="Caisse introuvable" description="Aucune information disponible pour cette caisse." />}
        </Modal>
    )
}
