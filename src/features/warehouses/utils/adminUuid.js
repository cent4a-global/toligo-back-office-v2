const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isAdminUuid(value) {
    return typeof value === 'string' && uuidPattern.test(value.trim())
}

export function getAdminUuid(admin) {
    const candidates = typeof admin === 'string' ? [admin] : [admin?.uuid]
    return candidates.find(isAdminUuid)?.trim().toLowerCase() ?? null
}

export function getAssignedAdmins(warehouse) {
    return Array.isArray(warehouse.admins) ? warehouse.admins : warehouse.admin ? [warehouse.admin] : []
}

export function getAssignedAdminUuids(warehouse) {
    const ids = getAssignedAdmins(warehouse).map(admin => getAdminUuid(admin)
        ?? (isAdminUuid(admin?.id) ? admin.id.trim().toLowerCase() : null))
    if (Array.isArray(warehouse.admin_ids)) ids.push(...warehouse.admin_ids.map(getAdminUuid))
    return [...new Set(ids.filter(Boolean))]
}
