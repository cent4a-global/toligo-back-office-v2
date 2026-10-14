export const money = (value, currency = 'XOF') => {
    if (value == null || value === '' || !Number.isFinite(Number(value))) return '—'
    try { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(Number(value)) }
    catch { return `${Number(value).toLocaleString('fr-FR')} ${currency}` }
}
export const dateTime = value => value && !Number.isNaN(Date.parse(value)) ? new Date(value).toLocaleString('fr-FR') : '—'
export const statusLabel = value => ({ active: 'Active', terminee: 'Terminée', termine: 'Terminée', completed: 'Terminée', annulee: 'Annulée', en_attente: 'En attente' })[value] ?? value ?? 'Non renseigné'
export const isCompleted = row => ['terminee', 'termine', 'completed'].includes(row.statut)
export function filterLocations(rows, search, status, sort) {
    const fold = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    const needle = fold(search).trim()
    return rows.filter(row => (!status || row.statut === status) && [row.client?.nom_complet, row.client?.telephone, row.box?.numero, row.objet?.nom, row.box?.entrepot?.nom].some(value => fold(value).includes(needle))).sort((a, b) => ((Date.parse(a.created_at ?? a.date_debut) || 0) - (Date.parse(b.created_at ?? b.date_debut) || 0)) * (sort === 'oldest' ? 1 : -1))
}
