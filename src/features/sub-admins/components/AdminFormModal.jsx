import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'

function AdminFormModal({ admin, roles, onClose, onSubmit, loading }) {
    const editing = Boolean(admin)
    const [form, setForm] = useState({ nom_complet: '', email: '', telephone: '', role: admin?.role ?? '', create_ttlock_account: true })
    const [confirming, setConfirming] = useState(false)
    const [error, setError] = useState('')
    const change = event => {
        const { name, value, checked, type } = event.target
        setForm(previous => ({ ...previous, [name]: type === 'checkbox' ? checked : value }))
        setError('')
    }
    const save = async () => {
        if (loading) return
        const payload = editing ? { role: form.role } : {
            nom_complet: form.nom_complet.trim(),
            email: form.email.trim(),
            telephone: form.telephone.trim(),
            role: form.role,
            create_ttlock_account: form.create_ttlock_account,
        }
        if (!editing && (!payload.nom_complet || !payload.email || !payload.telephone)) {
            setError('Renseignez le nom, l’e-mail et le téléphone.')
            return
        }
        try {
            await onSubmit(payload)
            onClose()
        } catch (error) { setError(error.message) }
    }
    const submit = event => {
        event.preventDefault()
        if (loading) return
        if (editing) { setError(''); setConfirming(true); return }
        void save()
    }
    if (confirming) return (
        <ConfirmDialog
            open
            title="Confirmer le changement de rôle"
            description={`Changer le rôle de ${admin.name ?? admin.email} vers ${roles.find(role => role.value === form.role)?.label ?? form.role} ?`}
            confirmLabel="Confirmer le changement"
            confirmVariant="primary"
            cancelLabel="Retour"
            loading={loading}
            onClose={() => setConfirming(false)}
            onConfirm={save}>
            {error && <p role="alert" className="form-error">{error}</p>}
        </ConfirmDialog>
    )
    return (
        <Modal open onClose={loading ? undefined : onClose} closeOnOverlayClick={false} title={editing ? 'Modifier le rôle' : 'Créer un administrateur'} subtitle={editing ? admin.name ?? admin.email : 'Renseignez les coordonnées et les accès du nouveau compte.'}>
            <form className="sub-admin-form" onSubmit={submit}>
                <>
                    {!editing && <>
                        <Input label="Nom complet" name="nom_complet" value={form.nom_complet} onChange={change} required disabled={loading} autoComplete="name" />
                        <Input label="E-mail" name="email" type="email" value={form.email} onChange={change} required disabled={loading} autoComplete="email" />
                        <Input label="Téléphone" name="telephone" type="tel" value={form.telephone} onChange={change} required disabled={loading} autoComplete="tel" />
                    </>}
                    <Select label="Rôle" name="role" value={form.role} onChange={change} options={roles} required disabled={loading} />
                    {!editing && <label className="sub-admin-ttlock"><input name="create_ttlock_account" type="checkbox" checked={form.create_ttlock_account} onChange={change} disabled={loading} /><span><strong>Créer un compte TTLock</strong><small>Activer la création du compte TTLock pour cet administrateur.</small></span></label>}
                </>
                {error && <p role="alert" className="form-error">{error}</p>}
                <div className="sub-admin-form-actions">
                    <Button variant="secondary" disabled={loading} onClick={onClose}>Annuler</Button>
                    <Button type="submit" loading={loading} disabled={editing && form.role === admin.role}>{editing ? 'Continuer' : 'Créer l’administrateur'}</Button>
                </div>
            </form>
        </Modal>
    )
}

export default AdminFormModal
