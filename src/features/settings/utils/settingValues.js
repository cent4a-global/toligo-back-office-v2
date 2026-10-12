export function normalizeSettingValue(type, value) {
    if (value == null || value === '') return null
    if (type === 'entier' || type === 'decimal') {
        const number = Number(value)
        if (!Number.isFinite(number) || (type === 'entier' && !Number.isSafeInteger(number))) {
            throw new Error(type === 'entier' ? 'Saisissez un nombre entier valide.' : 'Saisissez un nombre décimal valide.')
        }
        return number
    }
    if (type === 'booleen') {
        if ([true, 1, '1', 'true'].includes(value)) return true
        if ([false, 0, '0', 'false'].includes(value)) return false
        throw new Error('Saisissez une valeur booléenne valide.')
    }
    if (type === 'json') {
        if (typeof value === 'object') return value
        try { return JSON.parse(value) }
        catch { throw new Error('Le contenu JSON est invalide.') }
    }
    return value
}
