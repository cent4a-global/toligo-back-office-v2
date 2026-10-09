const cache = new Map()
let lastRequest = 0

export async function searchLocations(query, signal) {
    const key = query.trim().toLocaleLowerCase('fr')
    if (cache.has(key)) return cache.get(key)
    if (Date.now() - lastRequest < 1100) {
        throw new Error('Veuillez patienter une seconde avant de relancer la recherche.')
    }
    lastRequest = Date.now()
    const url = new URL(
        import.meta.env.VITE_GEOCODING_SEARCH_URL || 'https://nominatim.openstreetmap.org/search',
    )
    url.search = new URLSearchParams({
        q: query.trim(),
        format: 'jsonv2',
        countrycodes: 'ci',
        limit: '5',
        'accept-language': 'fr',
    })
    const response = await fetch(url, { signal })
    if (!response.ok)
        throw new Error('La recherche est indisponible. Réessayez dans quelques instants.')
    const data = await response.json()
    if (!Array.isArray(data)) throw new Error('La recherche a renvoyé une réponse invalide.')
    const results = data.filter(
        place =>
            Number.isFinite(Number(place.lat)) &&
            Number.isFinite(Number(place.lon)) &&
            Math.abs(Number(place.lat)) <= 90 &&
            Math.abs(Number(place.lon)) <= 180,
    )
    if (cache.size >= 50) cache.delete(cache.keys().next().value)
    cache.set(key, results)
    return results
}
