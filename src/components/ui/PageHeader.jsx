const PageHeader = ({ title, description, actions, className = '' }) => {
    const classes = ['page-header', className].filter(Boolean).join(' ')

    return (
        <div className={classes}>
            <div className="page-header-content">
                <h1 className="page-header-title">{title}</h1>

                {description && <p className="page-header-description">{description}</p>}
            </div>

            {actions && <div className="page-header-actions">{actions}</div>}
        </div>
    )
}

export default PageHeader
