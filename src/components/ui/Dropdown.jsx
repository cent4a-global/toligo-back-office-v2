import { useEffect, useRef, useState } from 'react'

const Dropdown = ({ trigger, items = [], position = 'right', className = '' }) => {
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = event => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleItemClick = item => {
        if (item.disabled) {
            return
        }

        item.onClick?.()
        setOpen(false)
    }

    return (
        <div ref={dropdownRef} className={`dropdown ${className}`}>
            <div className="dropdown-trigger" onClick={() => setOpen(!open)}>
                {trigger}
            </div>

            {open && (
                <div className={`dropdown-menu dropdown-${position}`}>
                    {items.map(item => (
                        <button
                            key={item.label}
                            type="button"
                            className={`dropdown-item ${item.danger ? 'dropdown-item-danger' : ''}`}
                            disabled={item.disabled}
                            onClick={() => handleItemClick(item)}>
                            {item.icon && <span className="dropdown-item-icon">{item.icon}</span>}

                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Dropdown
