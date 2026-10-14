import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { useAuth, useResendCode, useVerifyCode } from '../hooks/useAuth'

import OtpInput from '../../../components/ui/OtpInput'
import Button from '../../../components/ui/Button'


function VerifyCodePage() {
    const navigate = useNavigate()

    const { tempEmail, isAuthenticated } = useAuth()

    const { verifyCode, isVerifying } = useVerifyCode()

    const { resendCode, isResending } = useResendCode()

    const [code, setCode] = useState('')

    if (isAuthenticated) return <Navigate to="/dashboard" replace />
    if (!tempEmail) return <Navigate to="/login" replace />

    const handleSubmit = async event => {
        event.preventDefault()

        if (!tempEmail) {
            navigate('/login')
            return
        }

        try {
            const response = await verifyCode({
                email: tempEmail,
                code,
            })

            if (response.success) {
                navigate('/dashboard', { replace: true })
            }
        } catch {
            // The mutation cache displays the error toast.
        }
    }

    const handleResend = async () => {
        if (!tempEmail) {
            navigate('/login')
            return
        }

        try {
            await resendCode(tempEmail)

        } catch {
            // The mutation cache displays the error toast.
        }
    }

    return (
        <div className="verify-code-page">
            <div className="verify-code-header">
                <h1>Vérification</h1>

                <p>Entrez le code reçu par email.</p>

                {tempEmail && <span className="verify-code-email">{tempEmail}</span>}
            </div>

            <form className="verify-code-form" onSubmit={handleSubmit}>




                <OtpInput
                    label="Code de vérification"
                    name="code"
                    onChange={setCode}
                    disabled={isVerifying || isResending}
                    required
                />

                <Button type="submit" loading={isVerifying} disabled={isVerifying}>
                    Vérifier
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    loading={isResending}
                    disabled={isResending}
                    onClick={handleResend}>
                    Renvoyer le code
                </Button>
            </form>
        </div>
    )
}

export default VerifyCodePage
