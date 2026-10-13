import { notifyError } from '../../../lib/notifications'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import OtpInput from '../../../components/ui/OtpInput'
import Button from '../../../components/ui/Button'
import { useVerifyResetOtp, useResendResetOtp } from '../hooks/usePasswordReset'
import { getResetEmail } from '../storage/auth.storage'

function VerifyResetOtpPage() {
    const navigate = useNavigate()
    const email = getResetEmail()
    const { verifyResetOtp, isVerifying } = useVerifyResetOtp()
    const { resendResetOtp, isResending } = useResendResetOtp()

    if (!email) return <Navigate to="/forgot-password" replace />

    async function handleVerify(event) {
        event.preventDefault()


        const code = new FormData(event.currentTarget).get('code')
        try {
            const response = await verifyResetOtp({ email, code })
            if (!response.success)
                throw new Error(response.message || 'Le code est invalide ou expiré.')
            navigate('/reset-password')
        } catch (failure) {
            notifyError(failure)
        }
    }

    async function handleResend() {


        try {
            const response = await resendResetOtp(email)
            if (!response.success)
                throw new Error(response.message || 'Impossible de renvoyer le code.')

        } catch (failure) {
            notifyError(failure)
        }
    }

    return (
        <section className="verify-reset-otp-page">
            <h1>Vérifiez votre code</h1>
            <p>Saisissez le code envoyé à {email}.</p>
            <form onSubmit={handleVerify}>
                <OtpInput
                    name="code"
                    label="Code de vérification"
                    required
                    disabled={isVerifying || isResending}
                />


                <Button type="submit" loading={isVerifying} disabled={isResending}>
                    Vérifier le code
                </Button>
                <Button
                    onClick={handleResend}
                    variant="ghost"
                    loading={isResending}
                    disabled={isVerifying}>
                    Renvoyer le code
                </Button>
            </form>
            <Link to="/login">Retour à la connexion</Link>
        </section>
    )
}

export default VerifyResetOtpPage
