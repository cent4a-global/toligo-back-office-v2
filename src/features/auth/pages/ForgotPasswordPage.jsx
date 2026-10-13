import { notifyError } from '../../../lib/notifications'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { useForgotPassword } from '../hooks/usePasswordReset'

function ForgotPasswordPage() {
    const navigate = useNavigate()
    const { forgotPassword, isSending } = useForgotPassword()

    async function handleForgot(event) {
        event.preventDefault()

        const email = new FormData(event.currentTarget).get('email')
        try {
        const response = await forgotPassword(email)
        if (!response.success) throw new Error(response.message || 'Impossible d’envoyer le code.')
        navigate('/verify-reset-otp')
        } catch (failure) {
            notifyError(failure)
        }
    }

    return (
        <section className="forgot-password-page">
            <h1>Mot de passe oublié</h1>
            <p>Recevez un code pour réinitialiser votre mot de passe.</p>
            <form onSubmit={handleForgot}>
                <Input name="email" label="Adresse e-mail" type="email" autoComplete="email" required disabled={isSending} />

                <Button type="submit" loading={isSending}>Envoyer le code</Button>
            </form>
            <Link to="/login">Retour à la connexion</Link>
        </section>
    )
}

export default ForgotPasswordPage
