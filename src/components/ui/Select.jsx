const Select = ({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder = 'Sélectionner',
    error,
    disabled = false,
    required = false,
    className = '',
}) => {
    return (
        <div className={`form-field ${className}`}>
            {label && (
                <label htmlFor={name} className="form-label">
                    {label}

                    {required && <span className="form-required">*</span>}
                </label>
            )}

            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={`form-select ${error ? 'form-select-error' : ''}`}>
                <option value="">{placeholder}</option>

                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && <span className="form-error">{error}</span>}
        </div>
    )
}

export default Select
