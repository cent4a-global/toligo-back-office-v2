const Input = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    error,
    disabled = false,
    required = false,
    className = '',
    ...props
}) => {
    return (
        <div className={`form-field ${className}`}>
            {label && (
                <label htmlFor={name} className="form-label">
                    {label}

                    {required && <span className="form-required">*</span>}
                </label>
            )}

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={`form-input ${error ? 'form-input-error' : ''}`}
                {...props}
            />

            {error && <span className="form-error">{error}</span>}
        </div>
    )
}

export default Input
