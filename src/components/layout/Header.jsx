import { LogOut, Settings } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useLogout } from '../../features/auth/hooks/useAuth'
import ConfirmDialog from '../ui/ConfirmDialog'

function Header({
    onMenuClick,
    mobileOpen = false,
    menuButtonRef,
}) {
    const navigate = useNavigate()
    const { role } = useAuth()
    const { logout } = useLogout()
    const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false)

    const handleConfirmLogout = () => {
        setConfirmLogoutOpen(false)
        logout()
        navigate('/login', { replace: true })
    }

    const userActions = [
        {
            label: 'Paramètres',
            superadminOnly: true,
            icon: <Settings size={18} aria-hidden="true" />,
            onClick: () => navigate('/settings'),
        },
        {
            label: 'Déconnexion',
            icon: <LogOut size={18} aria-hidden="true" />,
            danger: true,
            onClick: () => setConfirmLogoutOpen(true),
        },
    ].filter(action => !action.superadminOnly || role === 'superadmin')

    return (
        <header className="header">
            <div className="header-left">

                <button
                    type="button"
                    className="header-menu-button header-menu-mobile"
                    onClick={onMenuClick}
                    ref={menuButtonRef}
                    aria-controls="main-sidebar"
                    aria-expanded={mobileOpen}
                    aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}>
                    <i className="fi fi-rr-menu-burger" aria-hidden="true" />
                </button>
            </div>

            <div className="header-actions">
                <button type="button" className="header-action-button" aria-label="Notifications">
                    <i className="fi fi-rr-bell" aria-hidden="true" />
                </button>

                <div className="header-divider" />

                <div className="header-desktop-actions">
                    {userActions.map(action => (
                        <button
                            key={action.label}
                            type="button"
                            className={`header-text-button${action.danger ? ' header-text-button-danger' : ''}`}
                            aria-label={action.label}
                            title={action.label}
                            onClick={action.onClick}>
                            {action.icon}
                        </button>
                    ))}
                </div>
            </div>
            <ConfirmDialog
                open={confirmLogoutOpen}
                onClose={() => setConfirmLogoutOpen(false)}
                onConfirm={handleConfirmLogout}
                title="Confirmer la déconnexion"
                description="Voulez-vous vous déconnecter de votre compte ?"
                confirmLabel="Se déconnecter"
                cancelLabel="Annuler"
            />
        </header>
    )
}

export default Header
