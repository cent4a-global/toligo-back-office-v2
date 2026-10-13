const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
    if (totalPages <= 1) {
        return null
    }

    const visible = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1])
    if (currentPage <= 3) [2, 3, 4].forEach(page => visible.add(page))
    if (currentPage >= totalPages - 2) [totalPages - 3, totalPages - 2, totalPages - 1].forEach(page => visible.add(page))
    const pages = [...visible].filter(page => page >= 1 && page <= totalPages).sort((a, b) => a - b)

    return (
        <nav className={`pagination ${className}`} aria-label="Pagination du tableau">
            <button
                type="button"
                className="pagination-button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}>
                Précédent
            </button>

            <div className="pagination-pages">
                {pages.flatMap((page, index) => [
                    ...(index > 0 && page - pages[index - 1] > 1
                        ? [<span key={`gap-${page}`} className="pagination-ellipsis" aria-hidden="true">…</span>] : []),
                    <button
                        key={page}
                        type="button"
                        aria-label={`Page ${page}`}
                        aria-current={page === currentPage ? 'page' : undefined}
                        className={`pagination-page ${
                            page === currentPage ? 'pagination-page-active' : ''
                        }`}
                        onClick={() => onPageChange(page)}>
                        {page}
                    </button>,
                ])}
            </div>

            <button
                type="button"
                className="pagination-button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}>
                Suivant
            </button>
        </nav>
    )
}

export default Pagination
