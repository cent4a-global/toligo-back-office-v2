const Spinner = ({ size = 'md', className = '' }) => {
    const classes = ['spinner', `spinner-${size}`, className].filter(Boolean).join(' ')

    return <span className={classes} role="status" aria-label="Chargement" />
}

export default Spinner
