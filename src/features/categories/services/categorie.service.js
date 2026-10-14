import api from '../../../lib/axios/api'

async function request(method, url, data, fallback, config = {}) {
    try {
        return (await api.request({ method, url, data, ...config })).data
    } catch (error) {
        throw new Error(error.response?.data?.message || fallback, { cause: error })
    }
}

// Laisser le navigateur définir le Content-Type avec la boundary du FormData.
const multipart = { headers: { 'Content-Type': undefined } }
const encodedId = id => encodeURIComponent(id)

export const categorieService = {
    getCategories: ({ signal } = {}) => request('get', '/api/types-objets', undefined, 'Erreur lors de la récupération des catégories', { signal }),
    getCategorieById: (id, { signal } = {}) => request('get', `/api/types-objets/${encodedId(id)}`, undefined, 'Erreur lors de la récupération de la catégorie', { signal }),
    createCategorie: formData => request('post', '/api/superadmin/types-objets', formData, 'Erreur lors de la création de la catégorie', multipart),
    updateCategorie: (id, formData) => request('post', `/api/superadmin/types-objets/${encodedId(id)}?_method=PUT`, formData, 'Erreur lors de la mise à jour de la catégorie', multipart),
    deleteCategorie: id => request('delete', `/api/superadmin/types-objets/${encodedId(id)}`, undefined, 'Erreur lors de la suppression de la catégorie'),
}
