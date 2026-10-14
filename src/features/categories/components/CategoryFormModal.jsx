import { useEffect, useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

function CategoryFormModal({ category, loading, onClose, onSubmit }) {
    const [libelle, setLibelle] = useState(category?.libelle ?? '')
    const [icon, setIcon] = useState(null)
    const [preview, setPreview] = useState('')
    const [error, setError] = useState('')
    useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])
    const submit = async event => {
        event.preventDefault()
        const name = libelle.trim().replace(/\s+/g, ' ')
        if (!name) { setError('Renseignez le nom de la catégorie.'); return }
        if (!category && !icon) { setError('Choisissez une icône.'); return }
        const data = new FormData()
        data.append('libelle', name)
        if (icon) data.append('icon', icon)
        try { await onSubmit(data); onClose() }
        catch (error) { setError(error.message) }
    }
    return <Modal open onClose={loading ? undefined : onClose} closeOnOverlayClick={false} title={category ? 'Modifier la catégorie' : 'Créer une catégorie'} subtitle="Renseignez le nom et l’icône du type d’objet.">
        <form className="category-form" onSubmit={submit}>
            <Input name="category-libelle" label="Nom de la catégorie" value={libelle} onChange={event => setLibelle(event.target.value)} required disabled={loading} />
            <div className="category-file-field">
                <label htmlFor="category-icon">Icône{!category && ' *'}</label>
                <input id="category-icon" name="icon" type="file" accept="image/*" required={!category} disabled={loading} onChange={event => { const file = event.target.files?.[0] ?? null; setIcon(file); setPreview(file ? URL.createObjectURL(file) : ''); setError('') }} />
                {category && <p>Laissez ce champ vide pour conserver l’icône actuelle.</p>}
                {(preview || (typeof category?.icon === 'string' && category.icon)) && <img className="category-icon-preview" src={preview || category.icon} alt="Aperçu de l’icône" />}
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="category-form-actions"><Button variant="secondary" disabled={loading} onClick={onClose}>Annuler</Button><Button type="submit" loading={loading}>{category ? 'Enregistrer' : 'Créer la catégorie'}</Button></div>
        </form>
    </Modal>
}

export default CategoryFormModal
