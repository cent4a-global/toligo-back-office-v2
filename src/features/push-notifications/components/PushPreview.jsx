function PushPreview({ title, body }) {
    return <aside className="push-preview" aria-label="Aperçu de la notification">
        <span className="push-preview-label">Aperçu</span>
        <div className="push-preview-message"><span className="push-preview-icon" aria-hidden="true"><i className="fi fi-rr-bell" /></span><div><p className="push-preview-brand">Tôligo <span>maintenant</span></p><h2>{title || 'Titre de votre notification'}</h2><p>{body || 'Votre message apparaîtra ici.'}</p></div></div>
        <p className="push-preview-note">L’affichage peut varier selon l’appareil du destinataire.</p>
    </aside>
}
export default PushPreview
