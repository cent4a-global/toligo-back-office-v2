import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navigationByRole = {
    superadmin: [
        {
            label: 'Tableau de bord',
            to: '/dashboard',
            icon: 'fi-rr-apps',
        },
        {
            label: 'Supervision',
            to: '/supervision',
            icon: 'fi-rr-eye',
        },
        {
            label: 'Commandes',
            to: '/orders',
            icon: 'fi-rr-shopping-cart',
        },
        {
            label: 'Incidents',
            to: '/incidents',
            icon: 'fi-rr-triangle-warning',
        },
        {
            label: 'Paiements',
            to: '/payments',
            icon: 'fi-rr-credit-card',
        },
        {
            label: 'Stations et drones',
            to: '/stations',
            icon: 'fi-rr-drone',
        },
        {
            label: 'Entrepôts et box',
            to: '/warehouses',
            icon: 'fi-rr-warehouse-alt',
        },
        {
            label: 'Formats et paramètres',
            to: '/settings',
            icon: 'fi-rr-settings',
        },
        {
            label: 'Utilisateurs et rôles',
            to: '/users',
            icon: 'fi-rr-users',
        },
        {
            label: "Journal d'audit",
            to: '/audit-log',
            icon: 'fi-rr-document',
        },
    ],

    operator: [
        {
            label: 'Supervision',
            to: '/supervision',
            icon: 'fi-rr-eye',
        },
        {
            label: 'Commandes',
            to: '/orders',
            icon: 'fi-rr-shopping-cart',
        },
        {
            label: 'Missions et livreurs',
            to: '/missions',
            icon: 'fi-rr-motorcycle',
        },
        {
            label: 'Incidents',
            to: '/incidents',
            icon: 'fi-rr-triangle-warning',
        },
        {
            label: 'Paiements',
            to: '/payments',
            icon: 'fi-rr-credit-card',
        },
    ],
}

const roleLabels = {
    superadmin: 'Superadmin',
    operator: 'Opérateur',
}

function getInitials(name = '') {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0].toUpperCase())
        .join('')
}

function Sidebar({
    user = {
        name: 'Kouamé Diallo',
        role: 'superadmin',
    },

    currentPath = window.location.pathname,
    collapsed = false,
    animating = false,
    mobileOpen = false,
    onClose,
    onToggleCollapse,
}) {
    const items = navigationByRole[user.role] ?? []

    const roleLabel = roleLabels[user.role] ?? user.role

    return (
        <aside id="main-sidebar" className={`sidebar${animating ? ' sidebar-animating' : ''}${collapsed ? ' sidebar-collapsed' : ''}${mobileOpen ? ' sidebar-open' : ''}`}>
            {/* BRAND */}
            <button type="button" className="sidebar-close" onClick={onClose} aria-label="Fermer le menu">
                <i className="fi fi-rr-cross" aria-hidden="true" />
            </button>
            <div className="sidebar-brand">
                <div className="sidebar-brand-identity">
                    <span className="sidebar-brand-name">Tôligo</span>
                </div>
                <button
                    type="button"
                    className="sidebar-collapse-button"
                    onClick={onToggleCollapse}
                    aria-controls="main-sidebar"
                    aria-expanded={!collapsed}
                    aria-label={collapsed ? 'Développer la sidebar' : 'Réduire la sidebar'}
                    title={collapsed ? 'Développer la sidebar' : 'Réduire la sidebar'}>
                    {collapsed ? <PanelLeftOpen size={18} aria-hidden="true" /> : <PanelLeftClose size={18} aria-hidden="true" />}
                </button>
            </div>

            {/* ROLE */}
            <div className="sidebar-role">
                <span className="sidebar-role-label">Connecté en tant que</span>

                <div className="sidebar-role-value">{roleLabel}</div>
            </div>

            {/* NAVIGATION */}
            <nav className="sidebar-navigation" aria-label="Navigation principale">
                <div className="sidebar-links">
                    {items.map(item => {
                        const isActive =
                            currentPath === item.to || currentPath.startsWith(`${item.to}/`)

                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={onClose}
                                aria-label={item.label}
                                title={item.label}
                                className={`sidebar-link${isActive ? ' sidebar-link-active' : ''}`}
                                aria-current={isActive ? 'page' : undefined}>
                                <i
                                    className={`fi ${item.icon} sidebar-link-icon`}
                                    aria-hidden="true"
                                />

                                <span className="sidebar-link-label">{item.label}</span>
                            </NavLink>
                        )
                    })}
                </div>
            </nav>

            {/* USER */}
            <div className="sidebar-footer">
                <div className="sidebar-footer-user">
                    <div className="sidebar-user-avatar">{getInitials(user.name)}</div>

                    <div className="sidebar-user-info">
                        <span className="sidebar-user-name">{user.name}</span>

                        <span className="sidebar-user-role">{roleLabel}</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
