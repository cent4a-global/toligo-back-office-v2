import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import Spinner from '../../components/ui/Spinner'
import AuthLayout from '../../layouts/AuthLayout'
import DashboardLayout from '../../layouts/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import RoleRoute from './RoleRoute'

const AuditLog = lazy(() => import('../../pages/AuditLog'))
const Dashboard = lazy(() => import('../../pages/Dashboard'))
const Incidents = lazy(() => import('../../pages/Incidents'))
const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage'))
const VerifyCodePage = lazy(() => import('../../features/auth/pages/VerifyCodePage'))
const ForgotPasswordPage = lazy(() => import('../../features/auth/pages/ForgotPasswordPage'))
const VerifyResetOtpPage = lazy(() => import('../../features/auth/pages/VerifyResetOtpPage'))
const ResetPasswordPage = lazy(() => import('../../features/auth/pages/ResetPasswordPage'))
const Missions = lazy(() => import('../../pages/Missions'))
const Orders = lazy(() => import('../../pages/Orders'))
const Payments = lazy(() => import('../../pages/Payments'))
const Settings = lazy(() => import('../../pages/Settings'))
const Stations = lazy(() => import('../../pages/Stations'))
const Supervision = lazy(() => import('../../pages/Supervision'))
const Users = lazy(() => import('../../features/users/pages/UsersRolesPage'))
const Warehouses = lazy(() => import('../../pages/Warehouses'))
const NotFound = lazy(() => import('../../pages/NotFound'))
const Unauthorized = lazy(() => import('../../pages/Unauthorized'))
const Profile = lazy(() => import('../../pages/Profile'))

function AppRoutes() {
    return (
        <Suspense
            fallback={
                <div className="route-loading">
                    <Spinner size="lg" />
                </div>
            }>
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/verify-code" element={<VerifyCodePage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/verify-reset-otp" element={<VerifyResetOtpPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                    </Route>
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/supervision" element={<Supervision />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/incidents" element={<Incidents />} />
                        <Route path="/payments" element={<Payments />} />
                        <Route path="/missions" element={<Missions />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />

                        <Route element={<RoleRoute allowedRoles={['superadmin']} />}>
                            <Route path="/stations" element={<Stations />} />
                            <Route path="/warehouses" element={<Warehouses />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/audit-log" element={<AuditLog />} />
                        </Route>

                    </Route>
                </Route>
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    )
}

export default AppRoutes
