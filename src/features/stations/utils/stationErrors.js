const labels = {
    nom: 'Nom', code: 'Code', commune_id: 'Commune', localite_id: 'Localité',
    entrepot_id: 'Entrepôt', adresse: 'Adresse', repere: 'Repère', latitude: 'Latitude',
    longitude: 'Longitude', statut: 'Statut', horaires: 'Horaires', description: 'Description',
}

export function stationErrorMessage(error, fallback) {
    const body = error.response?.data
    const errors = body?.errors
    const details = errors && typeof errors === 'object' ? Object.entries(errors)
        .flatMap(([field, messages]) => (Array.isArray(messages) ? messages : [messages])
            .filter(message => typeof message === 'string')
            .map(message => `${labels[field] ?? field} : ${message}`)) : []
    return [body?.message || error.message || fallback, ...details].join('\n')
}
