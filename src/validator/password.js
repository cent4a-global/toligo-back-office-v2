export const MIN_PASSWORD_LENGTH = 8

export function validatePassword(password = '') {
    const length = Array.from(password).length
    const categories = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9\s]/]
        .filter(pattern => pattern.test(password)).length
    const predictable = /^(.)\1+$/.test(password) ||
        /^(password|motdepasse|azerty|qwerty|123456|abcdef)/i.test(password)
    const isValid = length >= MIN_PASSWORD_LENGTH
    let score = 0

    if (password) {
        score = 1
        if (isValid && !predictable) score = 2
        if (length >= 12 && !predictable && categories >= 2) score = 3
        if (length >= 16 && !predictable && categories >= 3) score = 4
    }

    return {
        isValid,
        score,
        level: ['empty', 'weak', 'medium', 'good', 'strong'][score],
        label: ['Non renseigné', 'Faible', 'Moyen', 'Bon', 'Fort'][score],
        error: isValid ? '' : `Utilisez au moins ${MIN_PASSWORD_LENGTH} caractères.`,
    }
}
