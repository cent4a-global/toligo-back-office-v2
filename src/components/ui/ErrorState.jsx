const ErrorState = ({
    title = 'Une erreur est survenue',
    description = 'Impossible de charger les données.',
    action,
    className = '',
}) => {
    const classes = ['error-state', className].filter(Boolean).join(' ')

    return (
        <div className={classes}>
            <div className="error-state-icon">!</div>

            <h3 className="error-state-title">{title}</h3>

            <p className="error-state-description">{description}</p>

            {action && <div className="error-state-action">{action}</div>}
        </div>
    )
}

export default ErrorState
