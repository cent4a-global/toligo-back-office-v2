export default function Flaticon({ name, size = 20, className = '' }) {
    return <i className={`fi fi-rr-${name} flaticon ${className}`} style={{ fontSize: size }} aria-hidden="true" />
}
