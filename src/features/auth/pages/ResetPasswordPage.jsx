import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { useConfirmResetPassword } from '../hooks/usePasswordReset'
import { getResetEmail } from '../storage/auth.storage'
import { MIN_PASSWORD_LENGTH, validatePassword } from '../../../validator/password'

function ResetPasswordPage() {
    const navigate = useNavigate()
    const [email] = useState(getResetEmail)
    const { confirmResetPassword, isResetting } = useConfirmResetPassword()
    const [error, setError] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')
    const strength = validatePassword(newPassword)
    const confirmationMatches = newPassword === newPasswordConfirmation

    if (!email) return <Navigate to="/forgot-password" replace />

    async function handleReset(event) {
        event.preventDefault()
        setError('')
        try {
            if (!strength.isValid) throw new Error(strength.error)
            if (newPassword !== newPasswordConfirmation)
                throw new Error('Les mots de passe ne correspondent pas.')
            const response = await confirmResetPassword({
                email,
                newPassword,
                newPasswordConfirmation,
            })
            if (!response.success)
                throw new Error(response.message || 'Impossible de réinitialiser le mot de passe.')
            navigate('/login', { replace: true })
        } catch (failure) {
            setError(failure.message || 'Impossible de réinitialiser le mot de passe.')
        }
    }

    return (
        <section className="reset-password-page">
            <h1>Nouveau mot de passe</h1>
            <p>Choisissez votre nouveau mot de passe.</p>
            <form onSubmit={handleReset}>
                <Input
                    name="newPassword"
                    label="Nouveau mot de passe"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={event => setNewPassword(event.target.value)}
                    minLength={MIN_PASSWORD_LENGTH}
                    aria-describedby="password-strength password-advice"
                    required
                    disabled={isResetting}
                />
                <div className={`password-strength password-strength-${strength.level}`}>
                    <div className="password-strength-bars" aria-hidden="true">
                        {[1, 2, 3, 4].map(segment => (
                            <span key={segment} className={segment <= strength.score ? 'is-filled' : ''} />
                        ))}
                    </div>
                    <p id="password-strength" role="status">Robustesse : <strong>{strength.label}</strong></p>
                    <p id="password-advice" className="password-advice">Minimum 8 caractères. Pour un mot de passe plus robuste, privilégiez une phrase longue et évitez les suites prévisibles.</p>
                </div>
                <Input
                    name="newPasswordConfirmation"
                    label="Confirmez le mot de passe"
                    type="password"
                    autoComplete="new-password"
                    value={newPasswordConfirmation}
                    onChange={event => setNewPasswordConfirmation(event.target.value)}
                    aria-describedby={newPasswordConfirmation ? 'password-match' : undefined}
                    aria-invalid={Boolean(newPasswordConfirmation && !confirmationMatches)}
                    required
                    disabled={isResetting}
                />
                {newPasswordConfirmation && (
                    <p id="password-match" role="status" className={`password-match${confirmationMatches ? ' password-match-success' : ''}`}>
                        {confirmationMatches ? 'Les mots de passe correspondent.' : 'Les mots de passe ne correspondent pas.'}
                    </p>
                )}
                {error && (
                    <p className="auth-error" role="alert">
                        {error}
                    </p>
                )}
                <Button type="submit" loading={isResetting}>
                    Réinitialiser le mot de passe
                </Button>
            </form>
            <Link to="/login">Retour à la connexion</Link>
        </section>
    )
}

export default ResetPasswordPage
