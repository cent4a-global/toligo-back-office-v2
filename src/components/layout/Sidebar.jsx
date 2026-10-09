import Icon from '../ui/Icon'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'

const navigationItems = [
    // { label: 'Tableau de bord', to: '/dashboard', icon: 'fi-rr-apps' },
    // { label: 'Supervision', to: '/supervision', icon: 'fi-rr-eye' },
    // { label: 'Commandes', to: '/orders', icon: 'fi-rr-shopping-cart' },
    // { label: 'Missions et livreurs', to: '/missions', icon: 'fi-rr-motorcycle' },
    // { label: 'Incidents', to: '/incidents', icon: 'fi-rr-triangle-warning' },
    // { label: 'Paiements', to: '/payments', icon: 'fi-rr-credit-card' },
    { label: 'Stations Hub', to: '/stations', icon: 'fi-rr-drone', superadminOnly: true },
    { label: 'Zones', to: '/zones', icon: 'fi-rr-map-marker', superadminOnly: true },
    {
        label: 'Entrepôts et box',
        to: '/warehouses',
        icon: 'fi-rr-warehouse-alt',
        superadminOnly: true,
    },
    {
        label: 'Paramètres et formats',
        to: '/settings',
        icon: 'fi-rr-settings',
        superadminOnly: true,
    },
    { label: 'Utilisateurs et rôles', to: '/users', icon: 'fi-rr-users', superadminOnly: true },
    { label: "Journal d'audit", to: '/audit-log', icon: 'fi-rr-document', superadminOnly: true },
]

function getInitials(name = '') {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0].toUpperCase())
        .join('')
}

function Sidebar({
    user,

    currentPath = window.location.pathname,
    collapsed = false,
    animating = false,
    mobileOpen = false,
    onClose,
    onToggleCollapse,
}) {
    const { admin } = useAuth()
    const currentUser = user ?? admin ?? {}
    const userName = currentUser.name || currentUser.email || 'Mon compte'
    const items = navigationItems.filter(
        item => !item.superadminOnly || currentUser.role === 'superadmin',
    )

    const roleLabel = currentUser.role === 'superadmin' ? 'Superadmin' : currentUser.role

    return (
        <aside
            id="main-sidebar"
            className={`sidebar${animating ? ' sidebar-animating' : ''}${collapsed ? ' sidebar-collapsed' : ''}${mobileOpen ? ' sidebar-open' : ''}`}>
            {/* BRAND */}
            <button
                type="button"
                className="sidebar-close"
                onClick={onClose}
                aria-label="Fermer le menu">
                <i className="fi fi-rr-cross" aria-hidden="true" />
            </button>
            <div className="sidebar-brand">
                <div className="sidebar-brand-identity">
                    <span className="sidebar-brand-name">Tôligo</span>
                    <span className="sidebar-brand-caption">Espace de gestion</span>
                </div>
                <button
                    type="button"
                    className="sidebar-collapse-button"
                    onClick={onToggleCollapse}
                    aria-controls="main-sidebar"
                    aria-expanded={!collapsed}
                    aria-label={collapsed ? 'Développer la sidebar' : 'Réduire la sidebar'}
                    title={collapsed ? 'Développer la sidebar' : 'Réduire la sidebar'}>
                    {collapsed ? (
                        <Icon name="angle-square-right" size={15} />
                    ) : (
                        <Icon name="angle-square-left" size={15} />
                    )}
                </button>
            </div>
            {/* NAVIGATION */}
            <nav className="sidebar-navigation" aria-label="Navigation principale">
                <div className="sidebar-links">
                    {items.map((item, index) => {
                        const isActive =
                            currentPath === item.to || currentPath.startsWith(`${item.to}/`)

                        return (
                            <Fragment key={item.to}>
                                {(index === 0 ||
                                    (item.superadminOnly && !items[index - 1]?.superadminOnly)) && (
                                    <span className="sidebar-section-label">
                                        {item.superadminOnly ? 'Administration' : 'Opérations'}
                                    </span>
                                )}
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
                            </Fragment>
                        )
                    })}
                </div>
            </nav>

            {/* USER */}
            <div className="sidebar-footer">
                <NavLink
                    to="/profile"
                    className="sidebar-footer-user"
                    onClick={onClose}
                    aria-label="Consulter mon profil"
                    title="Mon profil">
                    <div className="sidebar-user-avatar" title={userName}>
                        {getInitials(userName)}
                    </div>

                    <div className="sidebar-user-info">
                        <span className="sidebar-user-name">{userName}</span>

                        <span className="sidebar-user-role">{roleLabel}</span>
                    </div>
                </NavLink>
            </div>
        </aside>
    )
}

export default Sidebar
