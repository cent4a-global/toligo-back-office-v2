import api from '../../../lib/axios/api'

async function request(method, path, data, fallback, config = {}) {
    try {
        const response = await api.request({ method, url: `/api/superadmin/admins${path}`, data, ...config })
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.message || fallback, { cause: error })
    }
}

export const addAdminService = {
    createAdmin: data => request('post', '', data, "Erreur lors de l'ajout de l'admin"),
    getAdmins: ({ signal, page = 1, perPage = 10 } = {}) => request('get', '', undefined, 'Erreur lors de la récupération des admins', { signal, params: { page, per_page: perPage } }),
    getAdminById: (id, { signal } = {}) => request('get', `/${encodeURIComponent(id)}`, undefined, "Erreur lors de la récupération de l'admin", { signal }),
    updateAdminRole: (id, data) => request('put', `/${encodeURIComponent(id)}`, data, 'Erreur lors de la mise à jour du rôle'),
    blockAdmin: id => request('patch', `/${encodeURIComponent(id)}/block`, undefined, "Erreur lors du blocage de l'admin"),
    unblockAdmin: id => request('patch', `/${encodeURIComponent(id)}/unblock`, undefined, "Erreur lors du déblocage de l'admin"),
    resetPassword: id => request('post', `/${encodeURIComponent(id)}/reset-password`, undefined, 'Erreur lors de la réinitialisation du mot de passe'),
    deleteAdmin: id => request('delete', `/${encodeURIComponent(id)}`, undefined, "Erreur lors de la suppression de l'admin"),
}
