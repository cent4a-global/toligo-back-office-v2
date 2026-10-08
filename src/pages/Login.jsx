import { useState } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'

import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import './login.css'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [notice, setNotice] = useState('')

    const handleSubmit = event => {
        event.preventDefault()
        setNotice(
            'Le service de connexion n’est pas encore configuré. Contactez votre administrateur.',
        )
    }

    return (
        <section className="login-page" aria-labelledby="login-title">
            <div className="login-heading">
                <span className="login-kicker">HEUREUX DE VOUS REVOIR</span>
                <h2 id="login-title">Connectez-vous</h2>
                <p>Accédez à votre espace d’administration Toligo.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
                <div className="login-input-wrap">
                    <Mail size={18} aria-hidden="true" />
                    <Input
                        label="Adresse e-mail"
                        name="email"
                        type="email"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        placeholder="vous@entreprise.com"
                        autoComplete="username"
                        required
                    />
                </div>

                <div className="login-input-wrap">
                    <LockKeyhole size={18} aria-hidden="true" />
                    <Input
                        label="Mot de passe"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        placeholder="Saisissez votre mot de passe"
                        autoComplete="current-password"
                        required
                    />
                    <button
                        className="login-password-toggle"
                        type="button"
                        onClick={() => setShowPassword(value => !value)}
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        aria-pressed={showPassword}
                    >
                        {showPassword ? (
                            <EyeOff size={18} aria-hidden="true" />
                        ) : (
                            <Eye size={18} aria-hidden="true" />
                        )}
                    </button>
                </div>

                <label className="login-remember">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={event => setRememberMe(event.target.checked)}
                    />
                    <span>Se souvenir de moi</span>
                </label>

                <Button className="login-submit" type="submit">
                    Se connecter
                </Button>

                {notice && (
                    <p className="login-notice" role="status">
                        {notice}
                    </p>
                )}
            </form>

            <p className="login-help">
                Besoin d’aide ? <span>Contactez votre administrateur.</span>
            </p>
        </section>
    )
}

export default Login
