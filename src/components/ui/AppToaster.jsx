import toast, { Toaster, ToastBar } from 'react-hot-toast'
import { Check, CircleAlert, Info, X } from 'lucide-react'

const appearances = {
    success: { title: 'Opération réussie', Icon: Check },
    error: { title: 'Une erreur est survenue', Icon: CircleAlert },
    loading: { title: 'En cours', Icon: Info },
    blank: { title: 'Information', Icon: Info },
}

export default function AppToaster() {
    return (
        <Toaster
            position="top-right"
            gutter={12}
            containerClassName="app-toaster"
            containerStyle={{ zIndex: 10000 }}
            toastOptions={{ duration: 4500, error: { duration: 6000 } }}>
            {notification => {
                const { title, Icon } = appearances[notification.type] || appearances.blank
                return (
                    <ToastBar toast={notification} style={{
                        padding: 0,
                        background: 'transparent',
                        boxShadow: 'none',
                        maxWidth: 'min(400px, calc(100vw - 32px))',
                    }}>
                        {({ message, icon }) => (
                            <div
                                className={`app-toast app-toast--${notification.type}`}
                                role="button"
                                tabIndex={0}
                                aria-label="Fermer la notification"
                                onClick={() => toast.dismiss(notification.id)}
                                onKeyDown={event => {
                                    if (event.target !== event.currentTarget) return
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault()
                                        toast.dismiss(notification.id)
                                    }
                                }}>
                                <span className="app-toast-icon" aria-hidden="true">
                                    {notification.type === 'loading' || notification.icon
                                        ? icon
                                        : <Icon size={20} strokeWidth={2} />}
                                </span>
                                <div className="app-toast-content">
                                    <p className="app-toast-title">{title}</p>
                                    <div className="app-toast-message">{message}</div>
                                </div>
                                <span className="app-toast-close" aria-hidden="true">
                                    <X size={16} aria-hidden="true" />
                                </span>
                                <span className="app-toast-progress" aria-hidden="true" />
                            </div>
                        )}
                    </ToastBar>
                )
            }}
        </Toaster>
    )
}
