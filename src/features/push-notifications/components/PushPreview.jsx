import Icon from '../../../components/ui/Icon'

function PushPreview({ title, body }) {
    return (
        <aside className="push-preview" aria-label="Aperçu de la notification">
            <header className="push-preview-header">
                <div>
                    <span className="push-preview-label">Aperçu du message</span>
                    <p>Rendu estimé sur mobile</p>
                </div>
            </header>
            <div className="push-preview-stage">
                <div className="push-preview-phone">
                    <div className="push-preview-notch" aria-hidden="true" />
                    <div className="push-preview-screen">
                        <div className="push-preview-status">
                            <span>9:41</span>
                            <span className="push-preview-status-icons" aria-hidden="true">
                                <span className="push-preview-signal" />
                                <span className="push-preview-wifi" />
                                <span className="push-preview-battery" />
                            </span>
                        </div>
                        <div className="push-preview-lockscreen">
                            <Icon name="notifications_active" />
                            <span>Notifications</span>
                        </div>
                        <article className="push-preview-message">
                            <div className="push-preview-message-header">
                                <span className="push-preview-icon" aria-hidden="true">
                                    <Icon name="notifications" />
                                </span>
                                <span className="push-preview-brand">Tôligo</span>
                                <span className="push-preview-time">maintenant</span>
                            </div>
                            <h2>{title || 'Titre de votre notification'}</h2>
                            <p>{body || 'Votre message apparaîtra ici.'}</p>
                        </article>
                        <div className="push-preview-home-indicator" aria-hidden="true" />
                    </div>
                </div>
            </div>
            <p className="push-preview-note">
                L’affichage peut varier selon l’appareil du destinataire.
            </p>
        </aside>
    )
}

export default PushPreview
