import Skeleton from './Skeleton'
import { useId, useState } from 'react'
import Pagination from './Pagination'

const Table = ({
    columns = [],
    data = [],
    emptyMessage = 'Aucune donnée disponible',
    loading = false,
    className = '',
    paginated = true,
}) => {
    const classes = ['table-container', className].filter(Boolean).join(' ')
    const pageSizeId = useId()
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const totalPages = Math.max(1, Math.ceil(data.length / pageSize))
    const currentPage = Math.min(page, totalPages)
    if (page !== currentPage) setPage(currentPage)
    const start = (currentPage - 1) * pageSize
    const rows = paginated ? data.slice(start, start + pageSize) : data

    return (
        <>
            <div className={classes} aria-busy={loading}>
                <table className="table">
                    <thead>
                        <tr>
                            {columns.map(column => (
                                <th key={column.key}>{column.label}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }, (_, rowIndex) => (
                                <tr key={rowIndex}>
                                    {columns.map(column => (
                                        <td key={column.key}>
                                            <Skeleton height={18} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="table-message">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, rowIndex) => (
                                <tr key={row.id ?? (paginated ? start : 0) + rowIndex}>
                                    {columns.map(column => (
                                        <td key={column.key}>
                                            {column.render ? column.render(row) : row[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {paginated && !loading && data.length > 0 && (
                <div className="table-pagination">
                    <span className="table-pagination-count" role="status">
                        {start + 1}–{Math.min(start + pageSize, data.length)} sur {data.length}
                    </span>
                    <label className="table-pagination-size" htmlFor={pageSizeId}>
                        Lignes par page
                        <select
                            id={pageSizeId}
                            value={pageSize}
                            onChange={event => {
                                setPageSize(Number(event.target.value))
                                setPage(1)
                            }}>
                            {[10, 25, 50, 100].map(size => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </label>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </>
    )
}

export default Table
