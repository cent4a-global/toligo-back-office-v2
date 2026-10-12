import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { useSavePackageFormat } from '../hooks/usePackageFormats'

function PackageFormatFormModal({ format, onClose }) {
    const [values, setValues] = useState(() => ({
        libelle: format?.libelle ?? '',
        description: format?.description ?? '',
        longueur: format?.longueur_max_cm ?? format?.dimensions_max_cm?.longueur ?? '',
        largeur: format?.largeur_max_cm ?? format?.dimensions_max_cm?.largeur ?? '',
        hauteur: format?.hauteur_max_cm ?? format?.dimensions_max_cm?.hauteur ?? '',
        poids_max_kg: format?.poids_max_kg ?? '',
        prix: format?.prix ?? '',
        est_actif: format?.est_actif ?? true,
    }))
    const mutation = useSavePackageFormat()
    const change = event => setValues(previous => ({ ...previous, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }))
    const submit = async event => {
        event.preventDefault()
        if (mutation.isPending) return
        const payload = {
            libelle: values.libelle.trim(),
            description: values.description.trim(),
            longueur_max_cm: Number(values.longueur),
            largeur_max_cm: Number(values.largeur),
            hauteur_max_cm: Number(values.hauteur),
            poids_max_kg: Number(values.poids_max_kg),
            prix: Number(values.prix),
            est_actif: values.est_actif,
        }
        try {
            await mutation.mutateAsync({ id: format?.id, payload })
            onClose()
        } catch { /* Mutation error is displayed below. */ }
    }
    return (
        <Modal open title={format ? 'Modifier le format' : 'Nouveau format'} size="lg" onClose={mutation.isPending ? undefined : onClose} closeOnOverlayClick={false}>
            <form onSubmit={submit} className="package-format-form">
                <fieldset disabled={mutation.isPending} className="package-format-form-grid">
                    <Input label="Libellé" name="libelle" value={values.libelle} onChange={change} required />
                    {['longueur', 'largeur', 'hauteur'].map(name => <Input key={name} label={`${name[0].toUpperCase()}${name.slice(1)} max (cm)`} name={name} type="number" min="0.01" step="any" value={values[name]} onChange={change} required />)}
                    <Input label="Poids max (kg)" name="poids_max_kg" type="number" min="0.01" step="any" value={values.poids_max_kg} onChange={change} required />
                    <Input label="Prix (FCFA)" name="prix" type="number" min="0" step="any" value={values.prix} onChange={change} required />
                    <div className="form-field package-format-form-wide">
                        <label htmlFor="format-description" className="form-label">Description</label>
                        <textarea id="format-description" name="description" className="form-input" rows={3} value={values.description} onChange={change} />
                    </div>
                    <label className="package-format-switch"><input type="checkbox" role="switch" name="est_actif" checked={values.est_actif} onChange={change} />Actif</label>
                </fieldset>
                {mutation.isError && <p className="settings-feedback settings-feedback-error" role="alert">{mutation.error.message}</p>}
                <div className="package-format-form-actions">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={mutation.isPending}>Annuler</Button>
                    <Button type="submit" loading={mutation.isPending}>Enregistrer</Button>
                </div>
            </form>
        </Modal>
    )
}

export default PackageFormatFormModal
