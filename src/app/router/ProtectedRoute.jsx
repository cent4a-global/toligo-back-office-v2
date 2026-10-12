import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import PageSkeleton from '../../components/ui/PageSkeleton'

function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return <div className="route-skeleton"><PageSkeleton /></div>
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />

    return <Outlet />
}

export default ProtectedRoute
