const Button = ({
    children,
    type = "button",
    variant = "primary",
    size = "sm",
    disabled = false,
    loading = false,
    onClick,
    className = "",
    ...props
}) => {
    const classes = [
        "btn",
        `btn-${variant}`,
        `btn-${size}`,
        loading ? "btn-loading" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? "Chargement..." : children}
        </button>
    );
};

export default Button;
