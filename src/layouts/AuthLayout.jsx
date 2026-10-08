import { Outlet } from 'react-router-dom'

function AuthLayout() {
    return (
        <div className="auth-layout">
            <aside className="auth-aside">
                <a className="auth-brand" href="/" aria-label="Toligo, accueil">
                    <span className="auth-brand-mark" aria-hidden="true">
                        T
                    </span>
                    <span className="auth-brand-name">toligo</span>
                    <span className="auth-brand-divider" aria-hidden="true" />
                    <span className="auth-brand-label">BACK OFFICE</span>
                </a>

                <div className="auth-aside-content">
                    <span className="auth-eyebrow">VOTRE ESPACE DE PILOTAGE</span>
                    <h1>
                        Tout votre réseau,
                        <br />
                        <span>en un seul endroit.</span>
                    </h1>
                    <p>
                        Suivez vos opérations et pilotez votre activité depuis un espace
                        conçu pour vous.
                    </p>

                    <div className="auth-preview" aria-hidden="true">
                        <div className="auth-preview-top">
                            <span className="auth-preview-dot" />
                            <span className="auth-preview-dot" />
                            <span className="auth-preview-dot" />
                            <span className="auth-preview-title">Vue d’ensemble</span>
                        </div>
                        <div className="auth-preview-body">
                            <div className="auth-preview-stat">
                                <span>Opérations du jour</span>
                                <strong>1 284</strong>
                                <i />
                            </div>
                            <div className="auth-preview-chart">
                                <span />
                                <span />
                                <span />
                                <span />
                                <span />
                                <span />
                                <span />
                            </div>
                        </div>
                    </div>
                </div>

                <p className="auth-aside-footer">La simplicité au service de votre réseau.</p>
            </aside>

            <main className="auth-main">
                <div className="auth-main-content">
                    <Outlet />
                </div>
                <footer className="auth-footer">
                    <span>© {new Date().getFullYear()} Toligo</span>
                    <span>Un espace sécurisé pour votre activité</span>
                </footer>
            </main>
        </div>
    )
}

export default AuthLayout
