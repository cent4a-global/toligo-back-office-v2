import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useLogin } from '../hooks/useAuth'

import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

function LoginPage() {
    const navigate = useNavigate()

    const { login, isLoggingIn, loginError } = useLogin()

    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    const handleChange = event => {
        const { name, value } = event.target

        setForm(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async event => {
        event.preventDefault()

        try {
            const response = await login(form)

            if (response.success) {
                navigate('/verify-code')
            }
        } catch {
            // erreur disponible via loginError
        }
    }

    return (
        <div className="login-page">
            <div className="login-header">
                <span className="login-brand">Tôligo</span>

                <h1 className="login-title">Connexion</h1>

                <p className="login-description">Connectez-vous à votre compte administrateur.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
                {loginError && <div className="login-error">{loginError.message}</div>}

                <Input
                    label="Adresse email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@toligo.ci"
                    required
                />

                <Input
                    label="Mot de passe"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Votre mot de passe"
                    required
                />

                <div className="login-options">
                    <Link to="/forgot-password" className="login-forgot-link">
                        Mot de passe oublié ?
                    </Link>
                </div>

                <Button
                    type="submit"
                    loading={isLoggingIn}
                    disabled={isLoggingIn}
                    className="login-submit">
                    Se connecter
                </Button>
            </form>
        </div>
    )
}

export default LoginPage
