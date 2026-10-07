const Card = ({ children, className = '', padding = 'md' }) => {
    const classes = ['card', `card-padding-${padding}`, className].filter(Boolean).join(' ')

    return <section className={classes}>{children}</section>
}

export default Card
