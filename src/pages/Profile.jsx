import Icon from '../components/ui/Icon'
import { useAuth } from '../features/auth/hooks/useAuth'

function Profile() {
    const { admin, role } = useAuth()
    const userName = admin?.name || admin?.email || 'Mon compte'
    const roleLabel = role === 'superadmin' ? 'Superadmin' : role
    const fields = [
        ['Nom', admin?.name],
        ['Adresse e-mail', admin?.email],
        ['Rôle', roleLabel],
    ]

    return (
        <section className="profile-page" aria-labelledby="profile-title">
            <h1 id="profile-title">Mon profil</h1>
            <p className="profile-description">Retrouvez les informations de votre compte.</p>
            <div className="profile-card">
                <div className="profile-identity">
                    <span className="profile-avatar" aria-hidden="true"><Icon name="user" size={28} /></span>
                    <div>
                        <h2>{userName}</h2>
                        {roleLabel && <span className="profile-role">{roleLabel}</span>}
                    </div>
                </div>
                <dl className="profile-details">
                    {fields.map(([label, value]) => (
                        <div key={label}>
                            <dt>{label}</dt>
                            <dd>{value || 'Non renseigné'}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    )
}

export default Profile
