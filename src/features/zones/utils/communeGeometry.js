function position(lat, lng) {
    if (lat == null || lng == null || String(lat).trim() === '' || String(lng).trim() === '') return null
    lat = Number(lat)
    lng = Number(lng)
    return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? [lat, lng] : null
}

export function communePolygon(commune) {
    if (!Array.isArray(commune.polygone)) return []
    const points = commune.polygone.map(point => position(point.lat, point.lng))
    return points.length >= 3 && points.every(Boolean) ? points : []
}

export function communePosition(commune) {
    return position(commune.lat ?? commune.latitude, commune.lng ?? commune.longitude)
}

export function containsPoint(polygon, point) {
    let inside = false
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [yi, xi] = polygon[i]
        const [yj, xj] = polygon[j]
        const cross = (point.lng - xi) * (yj - yi) - (point.lat - yi) * (xj - xi)
        if (Math.abs(cross) < 1e-10 && point.lng >= Math.min(xi, xj) && point.lng <= Math.max(xi, xj) &&
            point.lat >= Math.min(yi, yj) && point.lat <= Math.max(yi, yj)) return true
        if ((yi > point.lat) !== (yj > point.lat) && point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi) inside = !inside
    }
    return inside
}
