import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import PageSkeleton from '../../components/ui/PageSkeleton'

function RoleRoute({ allowedRoles = [] }) {
    const { isAuthenticated, isLoading, role } = useAuth()

    if (isLoading) {
        return <div className="route-skeleton"><PageSkeleton /></div>
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return <Outlet />
}

export default RoleRoute
