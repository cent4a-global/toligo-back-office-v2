const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
    if (totalPages <= 1) {
        return null
    }

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

    return (
        <div className={`pagination ${className}`}>
            <button
                type="button"
                className="pagination-button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}>
                Précédent
            </button>

            <div className="pagination-pages">
                {pages.map(page => (
                    <button
                        key={page}
                        type="button"
                        className={`pagination-page ${
                            page === currentPage ? 'pagination-page-active' : ''
                        }`}
                        onClick={() => onPageChange(page)}>
                        {page}
                    </button>
                ))}
            </div>

            <button
                type="button"
                className="pagination-button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}>
                Suivant
            </button>
        </div>
    )
}

export default Pagination
