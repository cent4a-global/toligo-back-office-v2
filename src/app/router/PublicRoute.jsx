import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import PageSkeleton from '../../components/ui/PageSkeleton'

function PublicRoute() {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return <div className="route-skeleton"><PageSkeleton /></div>
    }

    if (isAuthenticated) return <Navigate to="/dashboard" replace />

    return <Outlet />
}

export default PublicRoute
