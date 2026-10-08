import { Navigate, Route, Routes } from 'react-router-dom'

import AuthLayout from '../../layouts/AuthLayout'
import DashboardLayout from '../../layouts/DashboardLayout'
import AuditLog from '../../pages/AuditLog'
import Dashboard from '../../pages/Dashboard'
import Incidents from '../../pages/Incidents'
import Login from '../../pages/Login'
import Missions from '../../pages/Missions'
import Orders from '../../pages/Orders'
import Payments from '../../pages/Payments'
import Settings from '../../pages/Settings'
import Stations from '../../pages/Stations'
import Supervision from '../../pages/Supervision'
import Users from '../../pages/Users'
import Warehouses from '../../pages/Warehouses'

function AppRoutes() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
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
    )
}

export default AppRoutes
