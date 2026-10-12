import Skeleton from './Skeleton'

export default function PageSkeleton({ variant = 'page' }) {
    return (
        <div className={`page-skeleton page-skeleton--${variant}`} role="status" aria-label="Chargement de la page">
            <div className="page-skeleton-heading">
                <Skeleton width="45%" height={30} />
                <Skeleton width="65%" height={16} />
            </div>
            {variant === 'auth' ? (
                <div className="page-skeleton-panel">
                    {Array.from({ length: 3 }, (_, index) => <Skeleton key={index} height={52} />)}
                    <Skeleton height={48} />
                </div>
            ) : (
                <>
                    <div className="page-skeleton-stats">
                        {Array.from({ length: 4 }, (_, index) => (
                            <div className="page-skeleton-panel" key={index}>
                                <Skeleton width="65%" height={14} />
                                <Skeleton width="40%" height={32} />
                            </div>
                        ))}
                    </div>
                    <div className="page-skeleton-panel">
                        <Skeleton width="35%" height={24} />
                        {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} height={40} />)}
                    </div>
                </>
            )}
        </div>
    )
}
