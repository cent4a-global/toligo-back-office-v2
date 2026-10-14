import { communePolygon, containsPoint } from './communeGeometry.js'

const EPSILON = 1e-12

function cross(a, b, c) {
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
}

function onSegment(a, b, point) {
    return Math.abs(cross(a, b, point)) <= EPSILON &&
        point[0] >= Math.min(a[0], b[0]) - EPSILON && point[0] <= Math.max(a[0], b[0]) + EPSILON &&
        point[1] >= Math.min(a[1], b[1]) - EPSILON && point[1] <= Math.max(a[1], b[1]) + EPSILON
}

function intersects(a, b, c, d) {
    const abC = cross(a, b, c)
    const abD = cross(a, b, d)
    const cdA = cross(c, d, a)
    const cdB = cross(c, d, b)
    return ((abC > EPSILON && abD < -EPSILON || abC < -EPSILON && abD > EPSILON) &&
        (cdA > EPSILON && cdB < -EPSILON || cdA < -EPSILON && cdB > EPSILON)) ||
        onSegment(a, b, c) || onSegment(a, b, d) || onSegment(c, d, a) || onSegment(c, d, b)
}

// Also checks the closing edge, since the map closes a contour from its third point.
export function findConflictingZone(points, zones, currentZoneId) {
    const path = points.map(point => [Number(point.lat), Number(point.lng)])
    if (!path.length) return undefined
    return zones.find(zone => {
        if (currentZoneId != null && String(zone.id) === String(currentZoneId)) return false
        const polygon = communePolygon(zone)
        if (!polygon.length) return false
        if (path.some(([lat, lng]) => containsPoint(polygon, { lat, lng }))) return true
        const edgeCount = path.length >= 3 ? path.length : path.length - 1
        for (let i = 0; i < edgeCount; i++) {
            for (let j = 0; j < polygon.length; j++) {
                if (intersects(path[i], path[(i + 1) % path.length], polygon[j], polygon[(j + 1) % polygon.length])) return true
            }
        }
        return path.length >= 3 && polygon.some(([lat, lng]) => containsPoint(path, { lat, lng }))
    })
}
