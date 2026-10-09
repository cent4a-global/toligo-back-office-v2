export function createStationPayload(form) {
    if (!['operationnelle', 'maintenance', 'indisponible'].includes(form.statut)) {
        throw new Error('Sélectionnez un statut valide pour la station.')
    }
    for (const key of ['nom', 'code', 'adresse', 'commune_id', 'statut']) {
        if (!form[key]?.trim()) throw new Error('Renseignez le nom, le code, la commune, l’adresse et le statut.')
    }
    const latitude = Number(form.latitude)
    const longitude = Number(form.longitude)
    if (String(form.latitude).trim() === '' || String(form.longitude).trim() === '' ||
        !Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
        throw new Error('Saisissez une latitude entre -90 et 90 et une longitude entre -180 et 180.')
    }
    const horaires = {}
    for (const hour of form.horaires) {
        const periode = hour.periode.trim()
        const plage = hour.plage.trim()
        if (!periode || !plage) throw new Error('Renseignez chaque période et sa plage horaire.')
        if (Object.hasOwn(horaires, periode)) throw new Error('Une période ne peut apparaître qu’une fois.')
        Object.defineProperty(horaires, periode, { value: plage, enumerable: true })
    }
    return {
        nom: form.nom.trim(), code: form.code.trim(), commune_id: form.commune_id,
        entrepot_id: form.entrepot_id || null, adresse: form.adresse.trim(), repere: form.repere.trim(),
        latitude, longitude, statut: form.statut.trim(), horaires, description: form.description.trim(),
    }
}
