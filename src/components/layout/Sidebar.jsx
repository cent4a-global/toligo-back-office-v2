import Icon from '../ui/Icon'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'

const navigationSections = [
    {
        label: 'Vue d’ensemble',
        items: [
            { label: 'Tableau de bord', to: '/dashboard', icon: 'grid_view' },
            { label: 'Supervision', to: '/supervision', icon: 'visibility' },
        ],
    },
    {
        label: 'Activité',
        items: [
            { label: 'Commandes', to: '/orders', icon: 'shopping_cart' },
            { label: 'Missions et livreurs', to: '/missions', icon: 'two_wheeler' },
            { label: 'Locations', to: '/locations', icon: 'key', superadminOnly: true },
            { label: 'Paiements', to: '/payments', icon: 'credit_card' },
            { label: 'Incidents', to: '/incidents', icon: 'warning' },
        ],
    },
    {
        label: 'Réseau et catalogue',
        items: [
            { label: 'Stations', to: '/stations', icon: 'flight', superadminOnly: true },
            { label: 'Entrepôts', to: '/warehouses', icon: 'warehouse', superadminOnly: true },
            { label: 'Zones', to: '/zones', icon: 'map', superadminOnly: true },
            { label: 'Localités', to: '/localites', icon: 'location_on', superadminOnly: true },
            { label: 'Catégories', to: '/categories', icon: 'dashboard', superadminOnly: true },
        ],
    },
    {
        label: 'Comptes et communication',
        items: [
            { label: 'Clients', to: '/clients', icon: 'group', superadminOnly: true },
            { label: 'Sous-administrateurs', to: '/sub-admins', icon: 'person', superadminOnly: true },
            { label: 'Utilisateurs et rôles', to: '/users', icon: 'group', superadminOnly: true },
            { label: 'Notifications push', to: '/push-notifications', icon: 'notifications', superadminOnly: true },
        ],
    },
    {
        label: 'Administration',
        items: [
            { label: "Journal d'audit", to: '/audit-log', icon: 'description', superadminOnly: true },
            { label: 'Paramètres et formats', to: '/settings', icon: 'settings', superadminOnly: true },
        ],
    },
]
const navigationItems = navigationSections.flatMap(section =>
    section.items.map(item => ({ ...item, section: section.label })),
)

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
                <Icon name="close" />
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
                        <Icon name="chevron_right" size={20} />
                    ) : (
                        <Icon name="chevron_left" size={20} />
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
                                {(index === 0 || item.section !== items[index - 1]?.section) && (
                                    <span className="sidebar-section-label">
                                        {item.section}
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
                                    <Icon name={item.icon} className="sidebar-link-icon" />

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
