export default function Skeleton({ width, height, className = '' }) {
    return <span aria-hidden="true" className={`skeleton ${className}`} style={{ width, height }} />
}
