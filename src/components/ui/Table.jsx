const Table = ({
    columns = [],
    data = [],
    emptyMessage = 'Aucune donnée disponible',
    loading = false,
    className = '',
}) => {
    const classes = ['table-container', className].filter(Boolean).join(' ')

    return (
        <div className={classes}>
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
                        <tr>
                            <td colSpan={columns.length} className="table-message">
                                Chargement...
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="table-message">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr key={row.id ?? rowIndex}>
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
    )
}

export default Table
