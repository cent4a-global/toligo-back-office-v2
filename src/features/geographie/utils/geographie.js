export const nameOf = row => row.nom ?? row.libelle ?? row.name ?? 'Non renseigné'
export const idOf = row => row.id ?? row.uuid
