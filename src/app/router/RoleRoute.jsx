import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import Spinner from '../../components/ui/Spinner'

function RoleRoute({ allowedRoles = [] }) {
    const { isAuthenticated, isLoading, role } = useAuth()

    if (isLoading) {
        return <div className="route-loading"><Spinner size="lg" /></div>
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}

export default RoleRoute
