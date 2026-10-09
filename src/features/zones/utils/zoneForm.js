export function createZonePayload(form) {
    if (!form.nom.trim()) throw new Error('Veuillez renseigner le nom de la zone.')
    if (!form.code.trim()) throw new Error('Veuillez renseigner le code de la zone.')
    const polygone = form.polygone.map(point => {
        if (String(point.lat).trim() === '' || String(point.lng).trim() === '') {
            throw new Error('Renseignez la latitude et la longitude de chaque point.')
        }
        const lat = Number(point.lat)
        const lng = Number(point.lng)
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
            throw new Error('Chaque latitude doit être entre -90 et 90 et chaque longitude entre -180 et 180.')
        }
        return { lat, lng }
    })
    if (new Set(polygone.map(point => `${point.lat},${point.lng}`)).size < 3) {
        throw new Error('Le polygone doit contenir au moins trois points distincts.')
    }
    const area = polygone.reduce((sum, point, index) => {
        const next = polygone[(index + 1) % polygone.length]
        return sum + point.lng * next.lat - next.lng * point.lat
    }, 0)
    if (Math.abs(area) < 1e-12) throw new Error('Les points doivent délimiter une surface.')
    return {
        nom: form.nom.trim(),
        code: form.code.trim(),
        polygone,
        est_active: form.est_active === 'true',
        communes: [...new Set(form.communes ?? [])],
    }
}
