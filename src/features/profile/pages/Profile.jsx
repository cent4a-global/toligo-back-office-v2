import { useState } from 'react'
import Icon from '../../../components/ui/Icon'
import { useProfile, useUpdateProfile, useChangePassword } from '../hooks/useProfile'
import PageSkeleton from '../../../components/ui/PageSkeleton'
import ErrorState from '../../../components/ui/ErrorState'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

function ProfileInformation({ admin }) {
    const initial = { nom_complet: admin.nom_complet ?? '', telephone: admin.telephone ?? '', email: admin.email ?? '' }
    const [form, setForm] = useState(initial)
    const mutation = useUpdateProfile()
    const changed = Object.keys(form).some(key => form[key] !== initial[key])
    const change = event => { const { name, value } = event.target; setForm(previous => ({ ...previous, [name]: value })) }
    const submit = async event => {
        event.preventDefault()
        if (mutation.isPending || !changed) return
        try { await mutation.mutateAsync(Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]))) } catch { /* Global toast displays API errors. */ }
    }
    return (
        <form className="profile-panel" onSubmit={submit}>
            <div className="profile-panel-heading"><span className="profile-section-icon"><Icon name="person" /></span><div><h2>Informations personnelles</h2><p>Vos coordonnées et votre identité professionnelle.</p></div></div>
            <div className="profile-form-grid">
                <Input name="nom_complet" label="Nom complet" autoComplete="name" value={form.nom_complet} onChange={change} required disabled={mutation.isPending} />
                <Input name="telephone" label="Téléphone" type="tel" autoComplete="tel" value={form.telephone} onChange={change} required disabled={mutation.isPending} />
                <Input className="profile-full-width" name="email" label="Adresse e-mail" type="email" autoComplete="email" value={form.email} onChange={change} required disabled={mutation.isPending} />
            </div>
            <div className="profile-panel-footer"><span>Gardez vos coordonnées à jour.</span><div><Button variant="secondary" onClick={() => setForm(initial)} disabled={!changed || mutation.isPending}>Annuler</Button><Button type="submit" loading={mutation.isPending} disabled={!changed}>Enregistrer</Button></div></div>
        </form>
    )
}

const emptyPasswords = { current_password: '', new_password: '', new_password_confirmation: '' }
function PasswordForm() {
    const [form, setForm] = useState(emptyPasswords)
    const [visible, setVisible] = useState(false)
    const [error, setError] = useState('')
    const mutation = useChangePassword()
    const change = event => { const { name, value } = event.target; setForm(previous => ({ ...previous, [name]: value })); setError('') }
    const submit = async event => {
        event.preventDefault()
        if (mutation.isPending) return
        if (form.new_password !== form.new_password_confirmation) { setError('Les mots de passe ne correspondent pas.'); return }
        try { await mutation.mutateAsync(form); setForm(emptyPasswords); setVisible(false); setError('') } catch { /* Preserve fields on API failure. */ }
    }
    return (
        <form className="profile-panel" onSubmit={submit}>
            <div className="profile-panel-heading"><span className="profile-section-icon"><Icon name="lock" /></span><div><h2>Sécurité du compte</h2><p>Modifiez votre mot de passe pour protéger votre accès.</p></div></div>
            <div className="profile-form-grid">
                <Input className="profile-full-width" name="current_password" label="Mot de passe actuel" type={visible ? 'text' : 'password'} autoComplete="current-password" required value={form.current_password} onChange={change} disabled={mutation.isPending} />
                <Input name="new_password" label="Nouveau mot de passe" type={visible ? 'text' : 'password'} autoComplete="new-password" required value={form.new_password} onChange={change} disabled={mutation.isPending} />
                <Input name="new_password_confirmation" label="Confirmer le mot de passe" type={visible ? 'text' : 'password'} autoComplete="new-password" required value={form.new_password_confirmation} onChange={change} error={error} disabled={mutation.isPending} />
                <label className="profile-password-toggle"><input type="checkbox" checked={visible} onChange={event => setVisible(event.target.checked)} disabled={mutation.isPending} />Afficher les mots de passe</label>
            </div>
            <div className="profile-panel-footer"><span><Icon name="shield" size={16} />Choisissez un mot de passe unique.</span><Button type="submit" loading={mutation.isPending}>Mettre à jour le mot de passe</Button></div>
        </form>
    )
}

export default function Profile() {
    const query = useProfile()
    if (query.isPending) return <PageSkeleton />
    if (query.isError) return <ErrorState title="Impossible de charger le profil" description={query.error.message} action={<Button onClick={() => query.refetch()}>Réessayer</Button>} />
    const admin = query.data
    const name = admin.nom_complet || 'Mon compte'
    const initials = name.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join('').toLocaleUpperCase('fr')
    const role = admin.role === 'superadmin' ? 'Super administrateur' : admin.role
    const created = admin.created_at && !Number.isNaN(Date.parse(admin.created_at)) ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'Africa/Abidjan' }).format(new Date(admin.created_at)) : 'Non renseignée'
    return (
        <section className="profile-page" aria-labelledby="profile-title">
            <div className="profile-page-heading"><span className="profile-eyebrow">VOTRE ESPACE PERSONNEL</span><h1 id="profile-title">Mon profil</h1><p>Gérez vos informations personnelles et la sécurité de votre compte.</p></div>
            <div className="profile-layout">
                <aside className="profile-summary">
                    <div className="profile-summary-cover" />
                    <div className="profile-summary-body"><span className="profile-avatar" aria-hidden="true">{initials}</span><h2>{name}</h2><p className="profile-summary-email">{admin.email}</p><span className="profile-role"><Icon name="verified_user" size={16} />{role ?? 'Administrateur'}</span>
                        <dl className="profile-account-details"><div><dt><Icon name="calendar_today" size={16} />Compte créé le</dt><dd>{created}</dd></div><div><dt><Icon name="fingerprint" size={16} />Identifiant du compte</dt><dd className="profile-uuid">{admin.uuid ?? 'Non renseigné'}</dd></div></dl>
                    </div>
                </aside>
                <div className="profile-sections"><ProfileInformation key={JSON.stringify([admin.uuid, admin.nom_complet, admin.email, admin.telephone])} admin={admin} /><PasswordForm /></div>
            </div>
        </section>
    )
}
