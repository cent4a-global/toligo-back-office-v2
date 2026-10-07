const StatCard = ({
    title,
    value,
    description,
    icon,
    trend,
    trendType = 'neutral',
    className = '',
}) => {
    const classes = ['stat-card', className].filter(Boolean).join(' ')

    return (
        <article className={classes}>
            <div className="stat-card-header">
                <span className="stat-card-title">{title}</span>

                {icon && <div className="stat-card-icon">{icon}</div>}
            </div>

            <div className="stat-card-value">{value}</div>

            {(description || trend) && (
                <div className="stat-card-footer">
                    {trend && (
                        <span className={`stat-card-trend stat-card-trend-${trendType}`}>
                            {trend}
                        </span>
                    )}

                    {description && <span className="stat-card-description">{description}</span>}
                </div>
            )}
        </article>
    )
}

export default StatCard
