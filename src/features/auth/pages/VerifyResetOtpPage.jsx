import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { useVerifyResetOtp, useResendResetOtp } from '../hooks/usePasswordReset'
import { getResetEmail } from '../storage/auth.storage'

function VerifyResetOtpPage() {
    const navigate = useNavigate()
    const email = getResetEmail()
    const { verifyResetOtp, isVerifying } = useVerifyResetOtp()
    const { resendResetOtp, isResending } = useResendResetOtp()
    const [error, setError] = useState('')
    const [notice, setNotice] = useState('')

    if (!email) return <Navigate to="/forgot-password" replace />

    async function handleVerify(event) {
        event.preventDefault()
        setError('')
        setNotice('')
        const code = new FormData(event.currentTarget).get('code')
        try {
            const response = await verifyResetOtp({ email, code })
            if (!response.success)
                throw new Error(response.message || 'Le code est invalide ou expiré.')
            navigate('/reset-password')
        } catch (failure) {
            setError(failure.message || 'Le code est invalide ou expiré.')
        }
    }

    async function handleResend() {
        setError('')
        setNotice('')
        try {
            const response = await resendResetOtp(email)
            if (!response.success)
                throw new Error(response.message || 'Impossible de renvoyer le code.')
            setNotice('Un nouveau code vous a été envoyé.')
        } catch (failure) {
            setError(failure.message || 'Impossible de renvoyer le code.')
        }
    }

    return (
        <section className="verify-reset-otp-page">
            <h1>Vérifiez votre code</h1>
            <p>Saisissez le code envoyé à {email}.</p>
            <form onSubmit={handleVerify}>
                <Input
                    name="code"
                    label="Code de vérification"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    required
                    disabled={isVerifying || isResending}
                />
                {error && (
                    <p className="auth-error" role="alert">
                        {error}
                    </p>
                )}
                {notice && <p role="status">{notice}</p>}
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
