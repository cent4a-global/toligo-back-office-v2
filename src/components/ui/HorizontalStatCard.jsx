const HorizontalStatCard = ({ title, value, description, icon, className = '' }) => (
    <article className={['horizontal-stat-card', className].filter(Boolean).join(' ')}>
        {icon && <div className="horizontal-stat-card-icon" aria-hidden="true">{icon}</div>}
        <div className="horizontal-stat-card-content">
            <div className="horizontal-stat-card-title">{title}</div>
            <div className="horizontal-stat-card-value">{value ?? '—'}</div>
            {description != null && <div className="horizontal-stat-card-description">{description}</div>}
        </div>
    </article>
)

export default HorizontalStatCard
