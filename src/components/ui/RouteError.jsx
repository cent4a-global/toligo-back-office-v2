import Icon from './Icon'
import { Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'

function RouteError({ code, title, description, icon, standalone = false }) {
    const { isAuthenticated } = useAuth()

    return (
        <section className={`route-error${standalone ? ' route-error-standalone' : ''}`} aria-labelledby="route-error-title">
            <div className="route-error-card">
                <div className="route-error-brand">
                    <span>Tôligo</span>
                    <span className="route-error-brand-badge">BACK-OFFICE</span>
                </div>
                <div className="route-error-illustration" aria-hidden="true">
                    <span className="route-error-code">{code}</span>
                    <span className="route-error-icon">{icon}</span>
                </div>
                <span className="route-error-label">{code === '404' ? 'PAGE INTROUVABLE' : 'ACCÈS RESTREINT'}</span>
                <h1 id="route-error-title">{title}</h1>
                <p className="route-error-description">{description}</p>
                <Link className="btn btn-primary btn-md route-error-link" to={isAuthenticated ? '/dashboard' : '/login'} replace>
                    {isAuthenticated ? <Icon name="apps" size={18} /> : <Icon name="sign-in-alt" size={18} />}
                    {isAuthenticated ? 'Retour au tableau de bord' : 'Retour à la connexion'}
                    <Icon name="arrow-right" size={18} />
                </Link>
                <p className="route-error-footnote">{code === '404' ? 'Vérifiez l’adresse ou retrouvez votre espace de travail.' : 'Si vous avez besoin de cet accès, contactez votre administrateur.'}</p>
            </div>
        </section>
    )
}

export default RouteError
