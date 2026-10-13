const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isAdminUuid(value) {
    return typeof value === 'string' && uuidPattern.test(value.trim())
}

export function getAdminUuid(admin) {
    const candidates = typeof admin === 'string' ? [admin] : [admin?.uuid]
    return candidates.find(isAdminUuid)?.trim() ?? null
}
