const EmptyState = ({ title = 'Aucune donnée', description, action, className = '' }) => {
    const classes = ['empty-state', className].filter(Boolean).join(' ')

    return (
        <div className={classes}>
            <div className="empty-state-icon">—</div>

            <h3 className="empty-state-title">{title}</h3>

            {description && <p className="empty-state-description">{description}</p>}

            {action && <div className="empty-state-action">{action}</div>}
        </div>
    )
}

export default EmptyState
