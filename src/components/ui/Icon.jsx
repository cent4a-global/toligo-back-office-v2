function Icon({ name, size, className = '', style, ...props }) {
    return <span {...props} className={`material-symbols-outlined app-icon ${className}`} style={{ ...(size != null ? { fontSize: size } : {}), ...style }} aria-hidden="true">{name}</span>
}

export default Icon
