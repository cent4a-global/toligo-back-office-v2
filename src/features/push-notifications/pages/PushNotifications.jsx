import { useState } from 'react'
import PageHeader from '../../../components/ui/PageHeader'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import { useAuth } from '../../auth/hooks/useAuth'
import { useSendPushNotification } from '../hooks/useNotification'
import PushPreview from '../components/PushPreview'
import ClientPicker from '../components/ClientPicker'

function PushNotifications() {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [target, setTarget] = useState('all')
    const [selected, setSelected] = useState([])
    const [confirmation, setConfirmation] = useState(false)
    const [error, setError] = useState('')
    const [receipt, setReceipt] = useState(null)
    const { admin, role } = useAuth()
    const mutation = useSendPushNotification()
    const submit = event => {
        event.preventDefault()
        setError('')
        if (!title.trim() || !body.trim()) {
            setError('Renseignez le titre et le message.')
            return
        }
        if (title.length > 65 || body.length > 178) {
            setError('Respectez les limites de caractères.')
            return
        }
        if (target === 'specific' && !selected.length) {
            setError('Sélectionnez au moins un client.')
            return
        }
        setConfirmation(true)
    }
    const send = async () => {
        if (role !== 'superadmin') return
        try {
            const response = await mutation.sendNotificationAsync({
                title: title.trim(),
                body: body.trim(),
                target,
                client_ids: selected,
            })
            const result = response?.data
            setReceipt({
                message: response?.message || 'Notification envoyée avec succès.',
                target:
                    (result?.target ?? target) === 'all'
                        ? 'Tous les clients'
                        : 'Clients sélectionnés',
                count: result?.recipients_count ?? 'Non communiqué',
                sender:
                    result?.sent_by?.nom_complet ??
                    admin?.nom_complet ??
                    admin?.name ??
                    admin?.email ??
                    'Superadministrateur',
                date:
                    result?.created_at && !Number.isNaN(Date.parse(result.created_at))
                        ? new Date(result.created_at).toLocaleString('fr-FR')
                        : 'Non communiquée',
            })
            setTitle('')
            setBody('')
            setTarget('all')
            setSelected([])
            setError('')
            setConfirmation(false)
        } catch (error) {
            setError(error.message)
            setConfirmation(false)
        }
    }
    return (
        <section className="page-scaffold">
            <PageHeader
                title="Notifications Push"
                description="Envoyez un message aux clients de votre réseau."
            />
            {receipt && (
                <div className="push-receipt" role="status">
                    <strong>{receipt.message}</strong>
                    <dl>
                        <dt>Cible</dt>
                        <dd>{receipt.target}</dd>
                        <dt>Expéditeur</dt>
                        <dd>{receipt.sender}</dd>
                        <dt>Envoyée le</dt>
                        <dd>{receipt.date}</dd>
                        <dt>Appareils atteints</dt>
                        <dd>{receipt.count}</dd>
                    </dl>
                </div>
            )}
            <div className="push-layout">
                <form className="push-form" onSubmit={submit}>
                    <fieldset disabled={mutation.isSending}>
                        <legend>Destinataires</legend>
                        <div className="push-targets">
                            {[
                                ['all', 'Tous les clients'],
                                ['specific', 'Clients sélectionnés'],
                            ].map(([value, label]) => (
                                <label key={value} className={target === value ? 'is-active' : ''}>
                                    <input
                                        type="radio"
                                        name="push-target"
                                        value={value}
                                        checked={target === value}
                                        onChange={() => {
                                            setTarget(value)
                                            setError('')
                                        }}
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
                    </fieldset>
                    {target === 'specific' && (
                        <ClientPicker
                            selected={selected}
                            onChange={setSelected}
                            disabled={mutation.isSending}
                        />
                    )}
                    <div>
                        <Input
                            name="push-title"
                            label="Titre"
                            value={title}
                            maxLength={65}
                            required
                            disabled={mutation.isSending}
                            onChange={event => setTitle(event.target.value)}
                            placeholder="Titre de la notification"
                        />
                        <p className="push-counter">{title.length}/65</p>
                    </div>
                    <div className="push-message-field">
                        <label htmlFor="push-body" className="form-label">
                            Message <span className="form-required">*</span>
                        </label>
                        <textarea
                            id="push-body"
                            className="form-input"
                            rows={5}
                            maxLength={178}
                            required
                            disabled={mutation.isSending}
                            value={body}
                            onChange={event => setBody(event.target.value)}
                            placeholder="Saisissez votre message…"
                        />
                        <p className="push-counter">{body.length}/178</p>
                    </div>
                    {error && (
                        <p role="alert" className="form-error">
                            {error}
                        </p>
                    )}
                    <div className="push-form-footer">
                        <Button
                            type="submit"
                            loading={mutation.isSending}
                            disabled={role !== 'superadmin'}>
                            Envoyer la notification
                        </Button>
                    </div>
                </form>
                <PushPreview title={title} body={body} />
            </div>
            <ConfirmDialog
                open={confirmation}
                title="Envoyer la notification"
                description={
                    target === 'all'
                        ? 'Confirmer l’envoi à tous les clients ?'
                        : `Confirmer l’envoi à ${selected.length} client(s) sélectionné(s) ?`
                }
                confirmLabel="Envoyer"
                loading={mutation.isSending}
                onConfirm={send}
                onClose={() => {
                    if (!mutation.isSending) setConfirmation(false)
                }}
            />
        </section>
    )
}

export default PushNotifications
