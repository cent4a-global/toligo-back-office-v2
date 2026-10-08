import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth, useResendCode, useVerifyCode } from '../hooks/useAuth'

import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'


function VerifyCodePage() {
    const navigate = useNavigate()

    const { tempEmail } = useAuth()

    const { verifyCode, isVerifying, verifyError } = useVerifyCode()

    const { resendCode, isResending } = useResendCode()

    const [code, setCode] = useState('')

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
                navigate('/dashboard')
            }
        } catch {
            // erreur disponible dans verifyError
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
            // gérer plus tard avec toast
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
                {verifyError && <div className="verify-code-error">{verifyError.message}</div>}

                <Input
                    label="Code de vérification"
                    name="code"
                    value={code}
                    onChange={event => setCode(event.target.value)}
                    placeholder="000000"
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
