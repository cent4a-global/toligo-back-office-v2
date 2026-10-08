import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import Spinner from '../../components/ui/Spinner'
import AuthLayout from '../../layouts/AuthLayout'
import DashboardLayout from '../../layouts/DashboardLayout'

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
const Users = lazy(() => import('../../pages/Users'))
const Warehouses = lazy(() => import('../../pages/Warehouses'))

function AppRoutes() {
    return (
        <Suspense
            fallback={
                <div className="route-loading">
                    <Spinner size="lg" />
                </div>
            }>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/verify-code" element={<VerifyCodePage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/verify-reset-otp" element={<VerifyResetOtpPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Route>
                <Route element={<DashboardLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/supervision" element={<Supervision />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/incidents" element={<Incidents />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/stations" element={<Stations />} />
                    <Route path="/warehouses" element={<Warehouses />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/audit-log" element={<AuditLog />} />
                    <Route path="/missions" element={<Missions />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
        </Suspense>
    )
}

export default AppRoutes
