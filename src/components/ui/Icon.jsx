function Icon({ name, size = 18 }) {
    return <i className={`fi fi-rr-${name} flaticon-icon`} style={{ fontSize: size }} aria-hidden="true" />
}

export default Icon
