import { useId, useRef, useState } from 'react'

function OtpInput({ name = 'code', label = 'Code de vérification', length = 6, onChange, disabled = false, required = false }) {
    const id = useId()
    const inputs = useRef([])
    const [digits, setDigits] = useState(() => Array(length).fill(''))

    function update(next) {
        setDigits(next)
        onChange?.(next.join(''))
    }

    function focus(index) {
        inputs.current[index]?.focus()
        inputs.current[index]?.select()
    }

    function insert(value, index) {
        const numbers = value.replace(/\D/g, '')
        if (!numbers) return
        const start = numbers.length >= length ? 0 : index
        const next = [...digits]
        const chunk = numbers.slice(0, length - start)
        for (let offset = 0; offset < chunk.length; offset++) next[start + offset] = chunk[offset]
        update(next)
        focus(Math.min(start + chunk.length, length - 1))
    }

    return (
        <div className="form-field">
            <span id={`${id}-label`} className="form-label">
                {label}{required && <span className="form-required">*</span>}
            </span>
            <div className="otp-input" role="group" aria-labelledby={`${id}-label`}>
                {digits.map((digit, index) => (
                    <input
                        key={index}
                        ref={element => { inputs.current[index] = element }}
                        className="form-input otp-input-digit"
                        type="text"
                        inputMode="numeric"
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                        aria-label={`Chiffre ${index + 1} sur ${length}`}
                        value={digit}
                        pattern="[0-9]"
                        required={required}
                        disabled={disabled}
                        onFocus={event => event.target.select()}
                        onChange={event => {
                            if (!event.target.value) {
                                const next = [...digits]
                                next[index] = ''
                                update(next)
                            } else insert(event.target.value, index)
                        }}
                        onPaste={event => {
                            event.preventDefault()
                            insert(event.clipboardData.getData('text'), index)
                        }}
                        onKeyDown={event => {
                            if (event.key === 'Backspace') {
                                event.preventDefault()
                                const target = digits[index] || index === 0 ? index : index - 1
                                const next = [...digits]
                                next[target] = ''
                                update(next)
                                focus(target)
                            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                                event.preventDefault()
                                focus(Math.max(0, Math.min(length - 1, index + (event.key === 'ArrowLeft' ? -1 : 1))))
                            }
                        }}
                    />
                ))}
            </div>
            <input type="hidden" name={name} value={digits.join('')} disabled={disabled} />
        </div>
    )
}

export default OtpInput
