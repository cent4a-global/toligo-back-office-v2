import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import PageSkeleton from '../../components/ui/PageSkeleton'
import AuthLayout from '../../layouts/AuthLayout'
import DashboardLayout from '../../layouts/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import RoleRoute from './RoleRoute'

const AuditLog = lazy(() => import('../../features/audit-log/pages/AuditLog'))
const Dashboard = lazy(() => import('../../features/dashboard/pages/Dashboard'))
const Incidents = lazy(() => import('../../features/incidents/pages/Incidents'))
const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage'))
const VerifyCodePage = lazy(() => import('../../features/auth/pages/VerifyCodePage'))
const ForgotPasswordPage = lazy(() => import('../../features/auth/pages/ForgotPasswordPage'))
const VerifyResetOtpPage = lazy(() => import('../../features/auth/pages/VerifyResetOtpPage'))
const ResetPasswordPage = lazy(() => import('../../features/auth/pages/ResetPasswordPage'))
const Missions = lazy(() => import('../../features/missions/pages/Missions'))
const Orders = lazy(() => import('../../features/orders/pages/Orders'))
const Payments = lazy(() => import('../../features/payments/pages/Payments'))
const Settings = lazy(() => import('../../features/settings/pages/SettingsPage'))
const Hubs = lazy(() => import('../../features/hubs/pages/HubsPage'))
const Stations = lazy(() => import('../../features/stations/pages/StationsPage'))
const Supervision = lazy(() => import('../../features/supervision/pages/Supervision'))
const Users = lazy(() => import('../../features/users/pages/UsersRolesPage'))
const Warehouses = lazy(() => import('../../features/warehouses/pages/WarehousesPage'))
const Zones = lazy(() => import('../../features/zones/pages/ZonesPage'))
const WarehouseAdmins = lazy(() => import('../../features/warehouses/pages/WarehouseAdminsPage'))
const WarehouseBoxes = lazy(() => import('../../features/warehouses/pages/WarehouseBoxesPage'))
const WarehouseDetails = lazy(() => import('../../features/warehouses/pages/WarehouseDetailsPage'))
const NotFound = lazy(() => import('../../pages/NotFound'))
const Unauthorized = lazy(() => import('../../pages/Unauthorized'))
const Profile = lazy(() => import('../../features/profile/pages/Profile'))
const Map = lazy(() => import('../../features/map/pages/Map'))
const SubAdmins = lazy(() => import('../../features/sub-admins/pages/SubAdmins'))
const Categories = lazy(() => import('../../features/categories/pages/Categories'))
const Geographie = lazy(() => import('../../features/geographie/pages/Geographie'))
const Clients = lazy(() => import('../../features/clients/pages/Clients'))
const ClientLocations = lazy(() => import('../../features/locations/pages/ClientLocations'))
const PushNotifications = lazy(() => import('../../features/push-notifications/pages/PushNotifications'))
const Locations = lazy(() => import('../../features/locations/pages/Locations'))

function AppRoutes() {
    return (
        <Suspense
            fallback={
                <div className="route-skeleton">
                    <PageSkeleton />
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
                        <Route path="/map" element={<Map />} />

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
                            <Route path="/sub-admins" element={<SubAdmins />} />
                            <Route path="/categories" element={<Categories />} />
                            <Route path="/localites" element={<Geographie />} />
                            <Route path="/clients" element={<Clients />} />
                            <Route path="/clients/:clientId/locations" element={<ClientLocations />} />
                            <Route path="/push-notifications" element={<PushNotifications />} />
                            <Route path="/locations" element={<Locations />} />
                            <Route path="/rentals" element={<Navigate to="/locations" replace />} />
                            <Route path="/stations" element={<Stations />} />
                            <Route path="/stations/:stationId/hubs" element={<Hubs />} />
                            <Route path="/hubs" element={<Hubs />} />
                            <Route path="/zones" element={<Zones />} />
                            <Route path="/warehouses" element={<Warehouses />} />
                            <Route path="/warehouses/:id" element={<WarehouseDetails />} />
                            <Route path="/warehouses/:id/admins" element={<WarehouseAdmins />} />
                            <Route path="/warehouses/:id/boxes" element={<WarehouseBoxes />} />
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
