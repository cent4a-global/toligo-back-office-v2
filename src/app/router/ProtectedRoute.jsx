import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import Spinner from '../../components/ui/Spinner'

function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return <div className="route-loading"><Spinner size="lg" /></div>
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />

    return <Outlet />
}

export default ProtectedRoute
