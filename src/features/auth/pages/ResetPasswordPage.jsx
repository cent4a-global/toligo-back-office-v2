import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { useConfirmResetPassword } from '../hooks/usePasswordReset'
import { getResetEmail } from '../storage/auth.storage'

function ResetPasswordPage() {
    const navigate = useNavigate()
    const email = getResetEmail()
    const { confirmResetPassword, isResetting } = useConfirmResetPassword()
    const [error, setError] = useState('')

    if (!email) return <Navigate to="/forgot-password" replace />

    async function handleReset(event) {
        event.preventDefault()
        setError('')
        const { newPassword, newPasswordConfirmation } = Object.fromEntries(new FormData(event.currentTarget))
        try {
        if (newPassword !== newPasswordConfirmation) throw new Error('Les mots de passe ne correspondent pas.')
        const response = await confirmResetPassword({ email, newPassword, newPasswordConfirmation })
        if (!response.success) throw new Error(response.message || 'Impossible de réinitialiser le mot de passe.')
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
                <Input name="newPassword" label="Nouveau mot de passe" type="password" autoComplete="new-password" required disabled={isResetting} />
                <Input name="newPasswordConfirmation" label="Confirmez le mot de passe" type="password" autoComplete="new-password" required disabled={isResetting} />
                {error && <p className="auth-error" role="alert">{error}</p>}
                <Button type="submit" loading={isResetting}>Réinitialiser le mot de passe</Button>
            </form>
            <Link to="/login">Retour à la connexion</Link>
        </section>
    )
}

export default ResetPasswordPage
