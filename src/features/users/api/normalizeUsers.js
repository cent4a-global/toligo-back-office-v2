export function normalizeUsersResponse(response, resource, { page = 1, perPage = 10 } = {}) {
    const payload = response?.data ?? response
    const candidates = [payload, payload?.data, payload?.[resource], payload?.admins, payload?.users]
    const rows = candidates.find(Array.isArray)
    if (!rows) throw new Error('Le serveur a renvoyé un format de liste inattendu.')

    const items = rows.map(item => ({
        ...item,
        name: item.name ?? item.nom_complet ?? item.nom,
        phone: item.phone ?? item.telephone,
        createdAt: item.createdAt ?? item.created_at,
        lastLogin: item.lastLogin ?? item.last_login_at,
        ordersCount: item.ordersCount ?? item.orders_count ?? item.commandes_count,
        rentalsCount: item.rentalsCount ?? item.rentals_count ?? item.locations_count,
        status: item.status ?? (item.is_blocked === true || item.is_blocked === 1 ? 'blocked' : item.is_blocked === false || item.is_blocked === 0 ? 'active' : undefined),
    }))
    const meta = payload?.meta ?? response?.meta ?? payload
    const serverPaginated = meta?.current_page != null || meta?.last_page != null
    const total = Number(meta?.total ?? payload?.total ?? items.length)
    const pageSize = Number(meta?.per_page) || perPage
    const totalPages = Math.max(1, serverPaginated ? Number(meta?.last_page) || Math.ceil(total / pageSize) : Math.ceil(items.length / perPage))
    const currentPage = Math.min(totalPages, Math.max(1, serverPaginated ? Number(meta?.current_page) || page : page))
    return {
        items: serverPaginated ? items : items.slice((currentPage - 1) * perPage, currentPage * perPage),
        total,
        totalPages,
        currentPage,
    }
}
