import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { useCreateBox } from '../hooks/useBoxes'

const fields = [['hauteur', 'Hauteur'], ['largeur', 'Largeur'], ['longueur', 'Longueur'], ['poids', 'Poids'], ['prix_par_heure', 'Prix par heure']]

export default function BoxFormModal({ warehouseId, onClose, onCreated }) {
    const [form, setForm] = useState({ hauteur: '', largeur: '', longueur: '', poids: '', prix_par_heure: '', lockname: '' })
    const [errors, setErrors] = useState({})
    const mutation = useCreateBox()
    const change = event => {
        const { name, value } = event.target
        setForm(previous => ({ ...previous, [name]: value }))
        setErrors(previous => ({ ...previous, [name]: undefined }))
    }
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
        if (!form.lockname.trim()) next.lockname = 'Renseignez le nom de la serrure.'
        setErrors(next)
        if (Object.keys(next).length) return
        try {
            const response = await mutation.mutateAsync({ entrepot_id: warehouseId, ...Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()])) })
            if (response?.data?.id) onCreated?.(response.data, warehouseId)
            onClose()
        } catch {
            // API errors are displayed by the global mutation handler.
        }
    }
    return (
        <Modal open title="Ajouter une caisse" subtitle="Dimensions, tarif et serrure associée." onClose={mutation.isPending ? undefined : onClose} closeOnOverlayClick={false}>
            <form className="box-form" onSubmit={submit} noValidate>
                <div className="box-form-grid">
                    {fields.map(([name, label]) => <Input key={name} name={name} label={label} type="number" step="any" min="0" required value={form[name]} onChange={change} error={errors[name]} disabled={mutation.isPending} />)}
                </div>
                <Input name="lockname" label="Nom de la serrure" placeholder="Ex. S1-KM_f74ea7" required value={form.lockname} onChange={change} error={errors.lockname} disabled={mutation.isPending} />
                <div className="box-form-actions">
                    <Button variant="secondary" onClick={onClose} disabled={mutation.isPending}>Annuler</Button>
                    <Button type="submit" loading={mutation.isPending}>Créer la caisse</Button>
                </div>
            </form>
        </Modal>
    )
}
