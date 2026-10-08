function Header({
    user = {
        name: 'Kouamé Diallo',
        role: 'superadmin',
    },
    onMenuClick,
    mobileOpen = false,
    menuButtonRef,
}) {
    const roleLabels = {
        superadmin: 'Superadmin',
        operator: 'Opérateur',
    }

    const roleLabel = roleLabels[user.role] ?? user.role

    return (
        <header className="header">
            <div className="header-left">

                <button
                    type="button"
                    className="header-menu-button header-menu-mobile"
                    onClick={onMenuClick}
                    ref={menuButtonRef}
                    aria-controls="main-sidebar"
                    aria-expanded={mobileOpen}
                    aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}>
                    <i className="fi fi-rr-menu-burger" aria-hidden="true" />
                </button>
            </div>

            <div className="header-actions">
                <button type="button" className="header-action-button" aria-label="Notifications">
                    <i className="fi fi-rr-bell" aria-hidden="true" />
                </button>

                <div className="header-divider" />

                <div className="header-user">
                    <div className="header-user-info">
                        <span className="header-user-name">{user.name}</span>

                        <span className="header-user-role">{roleLabel}</span>
                    </div>

                    <button
                        type="button"
                        className="header-user-button"
                        aria-label="Menu utilisateur">
                        <i className="fi fi-rr-angle-small-down" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header
